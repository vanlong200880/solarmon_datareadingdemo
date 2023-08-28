'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var logger = FLLogger.getLogger("SQLMapperLog");
var dir_xml = '',
    separador = ':::';

var __extends = undefined.__extends || function (d, b) {
    for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
    }function __() {
        this.constructor = d;
    }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var fs = require('fs');
var path = require('path');

var vm = require('vm');
var util = require('util');
var moment = require('moment');
var DOMParser = require('xmldom').DOMParser;
var S = require('string');
var Contexto = require('./Contexto');

function ComandoSql() {
    this.sql = '';
    this.parametros = [];
}

ComandoSql.prototype.adicioneParametro = function (valor) {
    this.parametros.push(valor);
};

var No = function () {
    function No(id, mapeamento) {
        this.id = id;
        this.mapeamento = mapeamento;
        this.filhos = [];
    }

    No.prototype.adicione = function (no) {
        this.filhos.push(no);
    };

    No.prototype.imprima = function () {
        if (this.id) console.log(this.id);

        for (var i in this.filhos) {
            var noFilho = this.filhos[i];

            noFilho.imprima();
        }
    };

    No.prototype.obtenhaSql = function (comandoSql, dados) {
        for (var i in this.filhos) {
            var noFilho = this.filhos[i];

            noFilho.obtenhaSql(comandoSql, dados);
        }

        return comandoSql;
    };

    No.prototype.getValue = function (data, path) {
        var i,
            len = path.length;

        for (i = 0; (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && i < len; ++i) {
            if (data) data = data[path[i]];
        }
        return data;
    };

    No.prototype.obtenhaNomeCompleto = function () {
        return this.mapeamento.nome + "." + this.id;
    };

    No.prototype.processeExpressao = function (texto, comandoSql, dados) {
        var myArray;
        var regex = new RegExp('#\{([a-z.A-Z0-9_]+)}', 'ig');
        var expressao = texto;

        while ((myArray = regex.exec(texto)) !== null) {
            var trecho = myArray[0];
            var valorPropriedade = this.getValue(dados, myArray[1].split('.'));

            // console.log(trecho + " -> " + valorPropriedade);
            if (valorPropriedade == null) {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(null);
            } else if (typeof valorPropriedade == "number") {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(valorPropriedade);
            } else if (typeof valorPropriedade == 'string') {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(valorPropriedade);
            } else if (typeof valorPropriedade == 'boolean') {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(valorPropriedade);
            } else if (util.isDate(valorPropriedade)) {
                var valor = moment(valorPropriedade).format('YYYY-MM-DD HH:mm:ss');

                // console.log(valor);
                expressao = expressao.replace(trecho, '?');

                comandoSql.adicioneParametro(valor);
            } else if (util.isArray(valorPropriedade)) {
                logger.error("Não pode traduzir trecho " + trecho + " pela coleção: " + valorPropriedade);
                throw new Error("Não pode traduzir trecho " + trecho + " pela coleção: " + valorPropriedade);
            }
        }

        return expressao;
    };
    return No;
}();
exports.No = No;

var NoSelect = function (_super) {
    __extends(NoSelect, _super);
    function NoSelect(id, resultMap, javaType, mapeamento) {
        _super.call(this, id, mapeamento);

        this.resultMap = resultMap;
        this.javaType = javaType;
    }
    return NoSelect;
}(No);
exports.NoSelect = NoSelect;

var NoString = function (_super) {
    __extends(NoString, _super);
    function NoString(texto, mapeamento) {
        _super.call(this, '', mapeamento);
        this.texto = texto.trim();
    }
    NoString.prototype.imprima = function () {
        console.log(this.texto);
    };

    NoString.prototype.obtenhaSql = function (comandoSql, dados) {
        comandoSql.sql += _super.prototype.processeExpressao.call(this, this.texto, comandoSql, dados) + " ";
    };
    return NoString;
}(No);
exports.NoString = NoString;

var NoChoose = function (_super) {
    __extends(NoChoose, _super);
    function NoChoose(mapeamento) {
        _super.call(this, '', mapeamento);
    }
    NoChoose.prototype.adicione = function (no) {
        _super.prototype.adicione.call(this, no);

        if (no instanceof NoOtherwise) {
            this.noOtherwise = no;
        }
    };

    NoChoose.prototype.obtenhaSql = function (comandoSql, dados) {
        for (var i in this.filhos) {
            var no = this.filhos[i];

            if (no instanceof NoWhen) {
                var noWhen = no;

                var expressao = noWhen.expressaoTeste.replace('#{', "dados.").replace("}", "");

                try {
                    eval('if( ' + expressao + ' ) dados.valorExpressao = true; else dados.valorExpressao = false;');
                } catch (err) {
                    dados.valorExpressao = false;
                }

                if (dados.valorExpressao) {
                    return noWhen.obtenhaSql(comandoSql, dados);
                }
            }
        }

        if (this.noOtherwise) {
            return this.noOtherwise.obtenhaSql(comandoSql, dados);
        }

        return '';
    };
    return NoChoose;
}(No);
exports.NoChoose = NoChoose;

var NoWhen = function (_super) {
    __extends(NoWhen, _super);
    function NoWhen(expressaoTeste, texto, mapeamento) {
        _super.call(this, '', mapeamento);
        this.expressaoTeste = expressaoTeste;
        this.texto = texto;

        var regex = new RegExp('[_a-zA-Z][_a-zA-Z0-9]{0,30}', 'ig');
        var identificadores = [];
        while ((myArray = regex.exec(expressaoTeste)) !== null) {
            var identificador = myArray[0];

            if (identificador == 'null' || identificador == 'true' || identificador == 'false' || identificador == 'and') continue;

            identificadores.push(identificador);
        }

        for (var i = 0; i < identificadores.length; i++) {
            var identificador = identificadores[i];

            this.expressaoTeste = this.expressaoTeste.replace(identificador, "dados." + identificador);
        }

        this.expressaoTeste = S(this.expressaoTeste).replaceAll('and', '&&').toString();
    }

    NoWhen.prototype.imprima = function () {
        logger.error('when(' + this.expressaoTeste + '): ' + this.texto);
        console.log('when(' + this.expressaoTeste + '): ' + this.texto);
    };

    return NoWhen;
}(No);
exports.NoWhen = NoWhen;

var NoForEach = function (_super) {
    __extends(NoForEach, _super);
    function NoForEach(item, index, separador, abertura, fechamento, texto, collection, mapeamento) {
        _super.call(this, '', mapeamento);

        this.item = item;
        this.index = index;
        this.separador = separador;
        this.abertura = abertura;
        this.fechamento = fechamento;
        this.collection = collection;
        this.texto = texto.trim();
    }
    NoForEach.prototype.obtenhaSql = function (comandoSql, dados) {
        var texto = [];

        var colecao = dados[this.collection];

        if (colecao == null) {
            if (util.isArray(dados)) {
                colecao = dados;
            } else {
                return this.abertura + this.fechamento;
            }
        }

        for (var i = 0; i < colecao.length; i++) {
            var item = colecao[i];

            var myArray;
            var regex = new RegExp('#\{([_a-z.A-Z]+)}', 'ig');

            var expressao = this.texto;

            var novaExpressao = expressao;
            while ((myArray = regex.exec(expressao)) !== null) {
                var trecho = myArray[0];
                var propriedade = myArray[1].replace(this.item + ".", '');
                var valorPropriedade = this.getValue(item, propriedade.split("."));

                if (typeof valorPropriedade == "number") {
                    novaExpressao = novaExpressao.replace(trecho, '?');
                    comandoSql.adicioneParametro(valorPropriedade);
                } else if (typeof valorPropriedade == 'string') {
                    novaExpressao = novaExpressao.replace(trecho, '?');
                    comandoSql.adicioneParametro(valorPropriedade);
                }
            }

            texto.push(novaExpressao);
        }

        var sql = this.abertura + texto.join(this.separador) + this.fechamento;

        comandoSql.sql += sql;

        return comandoSql;
    };
    return NoForEach;
}(No);
exports.NoForEach = NoForEach;

var NoIf = function (_super) {
    __extends(NoIf, _super);
    function NoIf(expressaoTeste, texto, mapeamento) {
        _super.call(this, '', mapeamento);
        this.expressaoTeste = expressaoTeste;
        this.texto = texto;

        var regex = new RegExp('[_a-zA-Z][_a-zA-Z0-9]{0,30}', 'ig');
        var identificadores = [];
        while ((myArray = regex.exec(expressaoTeste)) !== null) {
            var identificador = myArray[0];

            if (identificador == 'null') continue;

            identificadores.push(identificador);
        }

        for (var i = 0; i < identificadores.length; i++) {
            var identificador = identificadores[i];

            this.expressaoTeste = this.expressaoTeste.replace(identificador, "dados." + identificador);
        }
    }
    NoIf.prototype.imprima = function () {
        console.log('if(' + this.expressaoTeste + '): ' + this.texto);
    };

    NoIf.prototype.obtenhaSql = function (comandoSql, dados) {
        var expressao = this.expressaoTeste.replace('#{', "dados.").replace("}", "");

        try {
            eval('if( ' + expressao + ' ) dados.valorExpressao = true; else dados.valorExpressao = false;');
        } catch (err) {
            dados.valorExpressao = false;
        }

        if (dados.valorExpressao == false) {
            return '';
        }

        //console.log(this.texto);
        //comandoSql.sql += _super.prototype.processeExpressao.call(this, this.texto, comandoSql, dados) + " ";
        _super.prototype.obtenhaSql.call(this, comandoSql, dados) + " ";
    };
    return NoIf;
}(No);
exports.NoIf = NoIf;

var NoOtherwise = function (_super) {
    __extends(NoOtherwise, _super);
    function NoOtherwise(texto, mapeamento) {
        _super.call(this, '', mapeamento);

        this.texto = texto;
    }
    NoOtherwise.prototype.imprima = function () {
        console.log('otherwise(' + this.texto + ')');
    };

    NoOtherwise.prototype.obtenhaSql = function (comandoSql, dados) {
        var myArray;
        var regex = new RegExp('#\{([a-z.A-Z]+)}', 'ig');

        var expressao = this.texto;

        while ((myArray = regex.exec(this.texto)) !== null) {
            var trecho = myArray[0];
            var valorPropriedade = this.getValue(dados, myArray[1].split('.'));

            if (typeof valorPropriedade == "number") {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(valorPropriedade);
            } else if (typeof valorPropriedade == 'string') {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(valorPropriedade);
            } else if (typeof valorPropriedade == 'boolean') {
                expressao = expressao.replace(trecho, '?');
                comandoSql.adicioneParametro(valorPropriedade);
            }
        }

        comandoSql.sql += expressao + " ";
    };

    return NoOtherwise;
}(No);
exports.NoOtherwise = NoOtherwise;

var NoPropriedade = function () {
    function NoPropriedade(nome, coluna, prefixo) {
        this.nome = nome;
        this.coluna = coluna;
        this.prefixo = prefixo;
    }
    NoPropriedade.prototype.imprima = function () {
        console.log(this.nome + " -> " + this.obtenhaColuna());
    };

    NoPropriedade.prototype.obtenhaColuna = function (prefixo) {
        return prefixo ? prefixo + this.coluna : this.coluna;
    };
    NoPropriedade.prototype.crieObjeto = function (gerenciadorDeMapeamentos, cacheDeObjetos, objeto, registro, chavePai) {
        return null;
    };
    return NoPropriedade;
}();
exports.NoPropriedade = NoPropriedade;

var NoPropriedadeId = function (_super) {
    __extends(NoPropriedadeId, _super);
    function NoPropriedadeId(nome, coluna) {
        _super.call(this, nome, coluna);
    }

    return NoPropriedadeId;
}(NoPropriedade);
exports.NoPropriedadeId = NoPropriedadeId;

var NoAssociacao = function (_super) {
    __extends(NoAssociacao, _super);
    function NoAssociacao(nome, coluna, columnPrefix, resultMap) {
        _super.call(this, nome, coluna, columnPrefix);

        this.resultMap = resultMap;
    }
    NoAssociacao.prototype.imprima = function () {
        console.log('associacao(' + this.nome + separador + this.obtenhaColuna(this.prefixo) + " -> " + this.resultMap);
    };

    NoAssociacao.prototype.obtenhaNomeCompleto = function () {
        if (this.resultMap.indexOf(".") == -1) {
            return this.nome + "." + this.resultMap;
        }

        return this.resultMap;
    };

    NoAssociacao.prototype.crieObjeto = function (gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, objeto, registro, chavePai) {
        var no = gerenciadorDeMapeamentos.obtenhaResultMap(this.resultMap);

        if (!no) throw new Error('Nenhum nó com nome foi encontrado: ' + this.resultMap);

        var chaveObjeto = no.obtenhaChave(registro, chavePai, this.prefixo);
        var chaveCombinada = no.obtenhaChaveCombinada(chavePai, chaveObjeto);

        var objetoConhecido = cacheDeObjetos[chaveCombinada] != null;

        var objetoColecao = no.crieObjeto(gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, registro, chavePai, this.prefixo);

        if (objetoColecao == null || objetoConhecido == true) return;

        objeto[this.nome] = objetoColecao;
    };
    return NoAssociacao;
}(NoPropriedade);
exports.NoAssociacao = NoAssociacao;

var NoPropriedadeColecao = function (_super) {
    __extends(NoPropriedadeColecao, _super);

    function NoPropriedadeColecao(nome, coluna, prefixo, resultMap, ofType, tipoJava) {
        _super.call(this, nome, coluna, prefixo);

        this.resultMap = resultMap;

        this.ofType = ofType;
        this.tipoJava = tipoJava;
    }

    NoPropriedadeColecao.prototype.imprima = function () {
        console.log('colecao(' + this.nome + separador + this.coluna + " -> " + this.resultMap);
    };

    NoPropriedadeColecao.prototype.crieObjeto = function (gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, objeto, registro, chavePai) {
        var no = gerenciadorDeMapeamentos.obtenhaResultMap(this.resultMap);

        var chaveObjeto = no.obtenhaChave(registro, chavePai, this.prefixo);
        var chaveCombinada = chavePai + separador + chaveObjeto;

        var objetoConhecido = cacheDeObjetos[chaveCombinada] != null;

        var objetoColecao = no.crieObjeto(gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, registro, chavePai, this.prefixo);

        if (objeto[this.nome] == null) {
            objeto[this.nome] = [];
        }

        if (objetoColecao == null || objetoConhecido == true) return;

        objeto[this.nome].push(objetoColecao);
    };

    return NoPropriedadeColecao;
}(NoPropriedade);
exports.NoPropriedadeColecao = NoPropriedadeColecao;

var NoResultMap = function (_super) {
    __extends(NoResultMap, _super);
    function NoResultMap(id, tipo, mapeamento) {
        _super.call(this, id, mapeamento);
        this.tipo = tipo;
        this.propriedades = [];
        this.propriedadesId = [];
    }
    NoResultMap.prototype.definaPropriedadeId = function (propriedadeId) {
        this.propriedadesId.push(propriedadeId);
    };

    NoResultMap.prototype.encontrePropriedadeId = function () {
        var propriedade = null;
        var i;
        var encontrou = false;
        for (i = 0; i < this.propriedades.length; i++) {
            propriedade = this.propriedades[i];

            if (propriedade.nome == 'id') {
                encontrou = true;
                break;
            }
        }

        if (!encontrou) return;

        this.definaPropriedadeId(new NoPropriedadeId(propriedade.nome, propriedade.obtenhaColuna()));
        this.propriedades.splice(i, 1);
    };

    NoResultMap.prototype.definaDiscriminator = function (noDiscriminador) {
        this.noDiscriminador = noDiscriminador;
    };

    NoResultMap.prototype.adicione = function (propriedade) {
        this.propriedades.push(propriedade);
    };

    NoResultMap.prototype.imprima = function () {
        for (var i in this.propriedadesId) {
            var propId = this.propriedadesId[i];

            propId.imprima();
        }

        for (var i in this.propriedades) {
            var propriedade = this.propriedades[i];

            propriedade.imprima();
        }

        if (this.noDiscriminador) this.noDiscriminador.imprima();
    };

    NoResultMap.prototype.obtenhaChaveCombinada = function (chavePai, chave) {
        var chaveCombinada = chave;

        if (chavePai) {
            chaveCombinada = chavePai + separador + chave;
        }

        return chaveCombinada;
    };

    NoResultMap.prototype.obtenhaChave = function (registro, chavePai, prefixo) {
        var chave = this.obtenhaNomeCompleto() + separador;

        var pedacoObjeto = '';

        for (var i in this.propriedadesId) {
            var propriedade = this.propriedadesId[i];

            var valor = registro[propriedade.obtenhaColuna(prefixo)];

            if (valor != null) {
                pedacoObjeto += valor;
            } else {
                //throw new Error("Chave do objeto não pode ser calculada. \nColuna '" + propriedade.coluna + "' não encontrada para o resultMap '" + this.id + "'");
            }
        }

        if (pedacoObjeto == '') {
            return null;
        }

        chave += pedacoObjeto;

        return chave;
    };

    NoResultMap.prototype.crieObjetos = function (gerenciadorDeMapeamentos, registros) {
        var objetos = [];
        var cacheDeObjetos = {};
        var ancestorCache = {};

        for (var i in registros) {
            var registro = registros[i];

            var chaveObjeto = this.obtenhaChave(registro, '');

            var objetoConhecido = cacheDeObjetos[chaveObjeto] != null;

            var objeto = this.crieObjeto(gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, registro, '');

            if (!objetoConhecido && objeto) {
                objetos.push(objeto);
            } else {}
        }

        return objetos;
    };

    NoResultMap.prototype.crieObjeto = function (gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, registro, chavePai, prefixo) {
        var chaveObjeto = this.obtenhaChave(registro, chavePai, prefixo);
        var chaveCombinada = this.obtenhaChaveCombinada(chavePai, chaveObjeto);

        if (ancestorCache[chaveObjeto] != null) {
            return ancestorCache[chaveObjeto];
        }
        if (cacheDeObjetos[chaveCombinada] != null) {
            var instance = cacheDeObjetos[chaveCombinada];

            ancestorCache[chaveObjeto] = instance;

            this.processeColecoes(gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, instance, registro, chaveCombinada);

            delete ancestorCache[chaveObjeto];
        } else {
            var nomeModel = this.obtenhaNomeModel(registro, prefixo),
                idChave = chaveObjeto && chaveObjeto.split(separador)[1];

            var model = gerenciadorDeMapeamentos.obtenhaModel(nomeModel);

            model = model[nomeModel];

            if (model == null) {
                logger.error("Class " + nomeModel + "." + nomeModel + " can't be found.");
                throw new Error("Classe " + nomeModel + "." + nomeModel + " não encontrada");
            }

            var instance = Object.create(model.prototype);
            instance.constructor.apply(instance, []);

            var encontrouValores = false;

            if (chaveObjeto) ancestorCache[chaveObjeto] = instance;

            encontrouValores = this.atribuaPropriedadesSimples(instance, registro, prefixo);
            if (chaveObjeto != null) {
                encontrouValores = this.processeColecoes(gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, instance, registro, chaveCombinada) || encontrouValores;
            }

            delete ancestorCache[chaveObjeto];

            if (!encontrouValores || idChave && instance.id && idChave != instance.id.toString()) return null;

            if (chaveCombinada && encontrouValores && instance.id != null && chaveCombinada.indexOf('null') < 0) cacheDeObjetos[chaveCombinada] = instance;
        }

        return instance;
    };

    NoResultMap.prototype.obtenhaNomeModel = function (registro, prefixo) {
        var tipoNo;
        if (!this.noDiscriminador) {
            tipoNo = this.tipo;
        } else {

            var valorTipo = registro[this.noDiscriminador.obtenhaColuna(prefixo)];

            for (var i in this.noDiscriminador.cases) {
                if (this.noDiscriminador.cases[i].valor == valorTipo) tipoNo = this.noDiscriminador.cases[i].tipo;
            }

            if (!tipoNo) tipoNo = this.tipo;
        }

        return tipoNo.substring(tipoNo.lastIndexOf(".") + 1);
    };
    NoResultMap.prototype.processeColecoes = function (gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, instance, registro, chaveObjeto) {
        var encontrouValor = false;

        for (var i = 0; i < this.propriedades.length; i++) {
            var propriedade = this.propriedades[i];

            if (propriedade instanceof NoPropriedadeColecao == false && propriedade instanceof NoAssociacao == false) {
                continue;
            }

            var objeto = propriedade.crieObjeto(gerenciadorDeMapeamentos, cacheDeObjetos, ancestorCache, instance, registro, chaveObjeto);

            encontrouValor = encontrouValor || objeto != null;
        }

        return encontrouValor;
    };

    NoResultMap.prototype.atribuaPropriedadesSimples = function (instance, registro, prefixo) {
        var encontrouValores = false;
        for (var j in this.propriedadesId) {
            var propId = this.propriedadesId[j];

            var valor = registro[propId.obtenhaColuna(prefixo)];

            if (valor instanceof Buffer) {
                if (valor.length == 1) {
                    if (valor[0] == 0) {
                        valor = false;
                    } else {
                        valor = true;
                    }
                }
            }

            instance[propId.nome] = valor;

            if (valor) encontrouValores = true;
        }

        for (var j in this.propriedades) {
            var propriedade = this.propriedades[j];

            if (propriedade instanceof NoPropriedadeColecao) {
                continue;
            } else if (propriedade instanceof NoAssociacao) {
                continue;
            }

            var valor = registro[propriedade.obtenhaColuna(prefixo)];

            if (valor instanceof Buffer) {
                if (valor.length == 1) {
                    if (valor[0] == 0) {
                        valor = false;
                    } else {
                        valor = true;
                    }
                }
            }

            instance[propriedade.nome] = valor;

            if (valor) encontrouValores = true;
        }

        return encontrouValores;
    };
    return NoResultMap;
}(No);
exports.NoResultMap = NoResultMap;

var NoDiscriminator = function () {
    function NoDiscriminator(tipoJava, coluna) {
        this.tipoJava = tipoJava;
        this.coluna = coluna;

        this.cases = [];
    }
    NoDiscriminator.prototype.adicione = function (noCaseDiscriminator) {
        this.cases.push(noCaseDiscriminator);
    };

    NoDiscriminator.prototype.imprima = function () {
        logger.info('discriminator(' + this.tipoJava + " " + this.coluna + ")");
        console.log('discriminator(' + this.tipoJava + " " + this.coluna + ")");

        for (var i in this.cases) {
            var noCase = this.cases[i];

            noCase.imprima();
        }
    };

    NoDiscriminator.prototype.obtenhaColuna = function (prefixo) {
        return prefixo ? prefixo + this.coluna : this.coluna;
    };

    return NoDiscriminator;
}();
exports.NoDiscriminator = NoDiscriminator;

var NoCaseDiscriminator = function () {
    function NoCaseDiscriminator(valor, tipo) {
        this.valor = valor;
        this.tipo = tipo;
    }
    NoCaseDiscriminator.prototype.imprima = function () {
        logger.info('\tcase(' + this.valor + " " + this.tipo + ")");
        console.log('\tcase(' + this.valor + " " + this.tipo + ")");
    };
    return NoCaseDiscriminator;
}();
exports.NoCaseDiscriminator = NoCaseDiscriminator;

var Principal = function () {
    function Principal() {}
    Principal.prototype.leiaNoDiscriminator = function (noXml, noResultMap) {
        var noDiscriminator = new NoDiscriminator(noXml.getAttributeNode('javaType').value, noXml.getAttributeNode('column').value);

        for (var i = 0; i < noXml.childNodes.length; i++) {
            var no = noXml.childNodes[i];

            if (no.nodeName == 'case') {
                var valor = no.getAttributeNode('value').value;
                var tipo = no.getAttributeNode('resultType').value;

                var noCase = new NoCaseDiscriminator(valor, tipo);

                noDiscriminator.adicione(noCase);
            }
        }

        return noDiscriminator;
    };

    Principal.prototype.leiaAssociationProperty = function (no, noResultMap) {
        var atributoColuna = no.getAttributeNode('column');
        var valorColuna = '';

        if (atributoColuna) valorColuna = atributoColuna.value;

        var resultMap = no.getAttributeNode('resultMap').value;

        if (resultMap.indexOf(".") == -1) {
            resultMap = noResultMap.mapeamento.nome + "." + resultMap;
        }

        var columnPrefix = null;

        if (no.getAttributeNode('columnPrefix')) columnPrefix = no.getAttributeNode('columnPrefix').value;

        noResultMap.adicione(new NoAssociacao(no.getAttributeNode('property').value, valorColuna, columnPrefix, resultMap));
    };

    Principal.prototype.leiaCollectionProperty = function (no, noResultMap) {
        var valorResultMap = '';

        if (no.getAttributeNode('resultMap')) {
            valorResultMap = no.getAttributeNode('resultMap').value;
        }

        var valorOfType = '';

        if (no.getAttributeNode('ofType')) {
            valorOfType = no.getAttributeNode('ofType').value;
        }

        var valorColuna = '';
        if (no.getAttributeNode('column')) valorColuna = no.getAttributeNode('column').value;

        var valorTipoJava = '';
        if (no.getAttributeNode('javaType')) valorTipoJava = no.getAttributeNode('javaType').value;

        var columnPrefix = null;

        if (no.getAttributeNode('columnPrefix')) columnPrefix = no.getAttributeNode('columnPrefix').value;

        noResultMap.adicione(new NoPropriedadeColecao(no.getAttributeNode('property').value, valorColuna, columnPrefix, valorResultMap, valorOfType, valorTipoJava));
    };

    Principal.prototype.leiaResultProperty = function (no, noResultMap) {
        var tipo = '';

        noResultMap.adicione(new NoPropriedade(no.getAttributeNode('property').value, no.getAttributeNode('column').value));
    };

    Principal.prototype.leiaResultMap = function (nome, noXmlResultMap, mapeamento) {
        var nomeId = noXmlResultMap.getAttributeNode('id').value;
        var tipo = noXmlResultMap.getAttributeNode('type').value;

        var noResultMap = new NoResultMap(nomeId, tipo, mapeamento);

        var possuiPropriedadeId = false;
        for (var i = 0; i < noXmlResultMap.childNodes.length; i++) {
            var no = noXmlResultMap.childNodes[i];

            if (no.nodeName == 'id') {
                var propriedadeId = new NoPropriedadeId(no.getAttributeNode('property').value, no.getAttributeNode('column').value);

                noResultMap.definaPropriedadeId(propriedadeId);
                possuiPropriedadeId = true;
            } else if (no.nodeName == 'result') {
                this.leiaResultProperty(no, noResultMap);
            } else if (no.nodeName == 'association') {
                this.leiaAssociationProperty(no, noResultMap);
            } else if (no.nodeName == 'collection') {
                this.leiaCollectionProperty(no, noResultMap);
            } else if (no.nodeName == 'discriminator') {
                var noDiscriminator = this.leiaNoDiscriminator(no, noResultMap);

                noResultMap.definaDiscriminator(noDiscriminator);
            }
        }

        if (!possuiPropriedadeId) {
            noResultMap.encontrePropriedadeId();
        }

        return noResultMap;
    };

    Principal.prototype.leia = function (nome, gchild, mapeamento) {
        if (gchild.nodeName == 'resultMap') {
            return this.leiaResultMap(nome, gchild, mapeamento);
        }

        var nomeId = gchild.getAttributeNode('id').value;

        var noComando;
        if (gchild.nodeName == 'select') {
            var noResultMap = gchild.getAttributeNode('resultMap');
            var valorResultMap = '';
            if (noResultMap) valorResultMap = noResultMap.value;

            var noJavaType = gchild.getAttributeNode('resultType');
            var valorJavaType = '';
            if (noJavaType) valorJavaType = noJavaType.value;

            noComando = new NoSelect(nomeId, valorResultMap, valorJavaType, mapeamento);
        } else {
            noComando = new No(nomeId, mapeamento);
        }

        for (var i = 0; i < gchild.childNodes.length; i++) {
            var no = gchild.childNodes[i];

            if (no.nodeName == 'choose') {
                this.leiaChoose('choose', no, noComando, mapeamento);
            } else if (no.nodeName == 'if') {
                this.leiaIf('choose', no, noComando, mapeamento);
            } else if (no.nodeName == 'foreach') {
                this.leiaForEach('foreach', no, noComando, mapeamento);
            } else {
                if (no.hasChildNodes() == false) {
                    var noString = new NoString(no.textContent, mapeamento);

                    noComando.adicione(noString);
                }
            }
        }

        return noComando;
    };

    Principal.prototype.leiaForEach = function (nome, no, noPrincipal, mapeamento) {
        var valorSeparador = '';
        if (no.getAttributeNode('separator')) {
            valorSeparador = no.getAttributeNode('separator').value;
        }

        var valorAbertura = '';
        if (no.getAttributeNode('open')) {
            valorAbertura = no.getAttributeNode('open').value;
        }

        var valorFechamento = '';
        if (no.getAttributeNode('close')) {
            valorFechamento = no.getAttributeNode('close').value;
        }

        var valorIndex = '';
        if (no.getAttributeNode('index')) {
            valorIndex = no.getAttributeNode('index').value;
        }

        var valorCollection = '';
        if (no.getAttributeNode('collection')) {
            valorCollection = no.getAttributeNode('collection').value;
        }

        var noForEach = new NoForEach(no.getAttributeNode('item').value, valorIndex, valorSeparador, valorAbertura, valorFechamento, no.textContent, valorCollection, mapeamento);

        noPrincipal.adicione(noForEach);
    };

    Principal.prototype.leiaIf = function (nome, no, noPrincipal, mapeamento) {
        var noIf = new NoIf(no.getAttributeNode('test').value, no.childNodes[0].toString(), mapeamento);

        for (var i = 0; i < no.childNodes.length; i++) {
            var noFilho = no.childNodes[i];

            if (noFilho.nodeName == 'choose') {
                this.leiaChoose('choose', noFilho, noIf, mapeamento);
            } else if (noFilho.nodeName == 'if') {
                this.leiaIf('choose', noFilho, noIf, mapeamento);
            } else if (noFilho.nodeName == 'foreach') {
                this.leiaForEach('foreach', noFilho, noIf, mapeamento);
            } else {
                if (noFilho.hasChildNodes() == false) {
                    var noString = new NoString(noFilho.textContent, mapeamento);

                    noIf.adicione(noString);
                }
            }
        }

        noPrincipal.adicione(noIf);
    };

    Principal.prototype.leiaChoose = function (nome, no, noPrincipal, mapeamento) {
        var noChoose = new NoChoose(mapeamento);

        for (var i = 0; i < no.childNodes.length; i++) {
            var filhos = no.childNodes;

            var noFilho = filhos[i];

            if (noFilho.nodeName == 'when') {
                noChoose.adicione(this.leiaNoWhen("when", noFilho, no, mapeamento));
            } else if (noFilho.nodeName == 'otherwise') {
                noChoose.adicione(new NoOtherwise(noFilho.childNodes[0].toString(), mapeamento));
            }
        }

        noPrincipal.adicione(noChoose);
    };

    Principal.prototype.leiaNoWhen = function (nome, no, noPricipal, mapeamento) {
        var expressaoTeste = no.getAttributeNode('test').value;

        var noWhen = new NoWhen(expressaoTeste, '', mapeamento);

        for (var i = 0; i < no.childNodes.length; i++) {
            var noFilho = no.childNodes[i];

            if (noFilho.nodeName == 'choose') {
                this.leiaChoose('choose', noFilho, noWhen, mapeamento);
            } else if (noFilho.nodeName == 'if') {
                this.leiaIf('choose', noFilho, noWhen, mapeamento);
            } else if (noFilho.nodeName == 'foreach') {
                this.leiaForEach('foreach', noFilho, noWhen, mapeamento);
            } else {
                if (noFilho.hasChildNodes() == false) {
                    var noString = new NoString(noFilho.textContent, mapeamento);

                    noWhen.adicione(noString);
                }
            }
        }

        return noWhen;
    };

    Principal.prototype.processe = function (dir_xml) {
        var mapaNos = {};

        var gerenciadorDeMapeamentos = new GerenciadorDeMapeamentos();

        var models = {};

        var walk = function walk(dir, done) {
            var results = [];
            var list = fs.readdirSync(dir);
            var pending = list.length;
            if (!pending) return done(null, results);
            list.forEach(function (file) {
                var file = dir + '/' + file;

                var stat = fs.statSync(file);

                if (stat && stat.isDirectory() && file.indexOf('.svn') == -1) {
                    walk(file, function (err, res) {
                        results = results.concat(res);
                        if (! --pending) done(null, results);
                    });
                } else {
                    results.push(file);
                    if (! --pending) done(null, results);
                }
            });
        };

        var ext = '.js';

        //        walk("./domain",function(err, arquivos) {
        //            for (var i in arquivos) {
        //                var arquivo = arquivos[i];
        //                if( arquivo.indexOf(ext) == -1 ) continue;
        //
        //                var nomeArquivo = path.basename(arquivo);
        //                var nomeClasseDominio =  nomeArquivo.replace(ext,'');
        //                var arquivoPath = path.join(path.resolve('.'),arquivo);
        //
        //                if(!fs.existsSync(arquivoPath)) throw new Error('Arquivo não encontrado:' + arquivoPath);
        //
        //                var model = require(path.join(path.resolve('.'),arquivo));
        //
        //                gerenciadorDeMapeamentos.adicioneModel(nomeClasseDominio,model);
        //            }
        //        });

        var arquivos = fs.readdirSync(dir_xml);
        for (var i in arquivos) {
            var arquivo = arquivos[i];

            var mapeamento = this.processeArquivo(dir_xml + arquivo);

            gerenciadorDeMapeamentos.adicione(mapeamento);
        }

        return gerenciadorDeMapeamentos;
    };

    Principal.prototype.processeArquivo = function (nomeArquivo) {
        if (fs.lstatSync(nomeArquivo).isDirectory()) return null;

        var xml = fs.readFileSync(nomeArquivo).toString();
        var xmlDoc = new DOMParser().parseFromString(xml);

        if (xmlDoc.documentElement.nodeName != 'mapper') {
            return null;
        }

        var nos = xmlDoc.documentElement.childNodes;

        var mapeamento = new Mapeamento(xmlDoc.documentElement.getAttributeNode('namespace').value);
        for (var i = 0; i < nos.length; i++) {
            var noXml = nos[i];

            if (noXml.nodeName != '#text' && noXml.nodeName != '#comment') {
                var no = this.leia(noXml.nodeName, noXml, mapeamento);

                //no.imprima();
                mapeamento.adicione(no);
            }
        }

        return mapeamento;
    };
    return Principal;
}();
exports.Principal = Principal;

var GerenciadorDeMapeamentos = function () {
    function GerenciadorDeMapeamentos() {
        this.mapeamentos = [];
        this.mapaMapeamentos = {};
        this.models = {};
    }
    GerenciadorDeMapeamentos.prototype.obtenhaModel = function (nome) {
        return this.models[nome];
    };

    GerenciadorDeMapeamentos.prototype.adicioneModel = function (nomeClasseDominio, classe) {
        if (this.models[nomeClasseDominio] != null) return;

        this.models[nomeClasseDominio] = classe;
    };

    GerenciadorDeMapeamentos.prototype.adicione = function (mapeamento) {
        if (mapeamento == null) return;

        this.mapaMapeamentos[mapeamento.nome] = mapeamento;

        this.mapeamentos.push(mapeamento);
    };

    GerenciadorDeMapeamentos.prototype.obtenhaResultMap = function (nomeCompletoResultMap) {
        var nomeNamespace = nomeCompletoResultMap.split(".")[0];
        var nomeResultMap = nomeCompletoResultMap.split(".")[1];

        var mapeamento = this.mapaMapeamentos[nomeNamespace];

        if (mapeamento == null) {
            logger.error("result map " + nomeNamespace + " can't be found.");
            throw new Error("Mapeamento " + nomeNamespace + " não encontrado");
        }

        var resultMap = mapeamento.obtenhaResultMap(nomeResultMap);

        return resultMap;
    };

    GerenciadorDeMapeamentos.prototype.obtenhaNo = function (nomeCompletoResultMap) {
        var nomeNamespace = nomeCompletoResultMap.split(".")[0];

        var idNo = nomeCompletoResultMap.split(".")[1];

        var mapeamento = this.mapaMapeamentos[nomeNamespace];

        return mapeamento.obtenhaNo(idNo);
    };

    GerenciadorDeMapeamentos.prototype.insira = function (nomeCompleto, objeto, callback) {
        var me = this;
        var no = this.obtenhaNo(nomeCompleto);

        var comandoSql = new ComandoSql();

        no.obtenhaSql(comandoSql, objeto);

        //console.log(comandoSql.sql);
        // console.log(comandoSql.parametros);

        logger.info("[sqlId:" + nomeCompleto + "]", comandoSql.sql);
        logger.info("Parameters: ", comandoSql.parametros);
        var dominio = require('domain').active;

        this.conexao(function (connection) {
            //connection.query(comandoSql.sql,comandoSql.parametros,dominio.intercept(function (rows, fields,err) {
            connection.query(comandoSql.sql, comandoSql.parametros, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    console.log(err.message);
                    logger.error(err.message);
                    callback(err, 0);
                    return;
                }
                if (rows.insertId) {
                    objeto.id = rows.insertId;
                }

                if (callback) {
                    //console.log('callback insert...')
                    callback(err, rows.affectedRows);
                }
            });
            // }));
        });
    };

    GerenciadorDeMapeamentos.prototype.atualize = function (nomeCompleto, objeto, callback) {
        var me = this;
        var no = this.obtenhaNo(nomeCompleto);

        var comandoSql = new ComandoSql();
        var sql = no.obtenhaSql(comandoSql, objeto);

        //console.log(sql);

        logger.info("[sqlId:" + nomeCompleto + "]", comandoSql.sql);
        logger.info("Parameters: ", comandoSql.parametros);
        var dominio = require('domain').active;

        this.conexao(function (connection) {
            //connection.query(comandoSql.sql, comandoSql.parametros,dominio.intercept(function (rows, fields,err)  {
            connection.query(comandoSql.sql, comandoSql.parametros, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    console.log(err.message);
                    logger.error(err.message);
                    callback(err, 0);
                    return;
                }
                if (callback) {
                    callback(err, rows.affectedRows);
                }
            });
            //}));
        });
    };

    GerenciadorDeMapeamentos.prototype.remova = function (nomeCompleto, objeto, callback) {
        var me = this;
        var no = this.obtenhaNo(nomeCompleto);

        var comandoSql = new ComandoSql();
        var sql = no.obtenhaSql(comandoSql, objeto);

        var dominio = require('domain').active;

        logger.info("[sqlId:" + nomeCompleto + "]", comandoSql.sql);
        logger.info("Parameters: ", comandoSql.parametros);
        this.conexao(function (connection) {
            //connection.query(comandoSql.sql, comandoSql.parametros, dominio.intercept(function (rows, fields,err) {
            connection.query(comandoSql.sql, comandoSql.parametros, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    console.log(err.message);
                    logger.error(err.message);
                    callback(err, 0);
                    return;
                }
                if (callback) {
                    callback(err, rows.affectedRows);
                }
            });
            //}));
        });
    };

    GerenciadorDeMapeamentos.prototype.selecioneUm = function (nomeCompleto, dados, callback) {
        // console.log('buscando ' + nomeCompleto);
        this.selecioneVarios(nomeCompleto, dados, function (err, objetos) {
            if (objetos.length == 0) return callback(err, []);

            if (objetos.length > 1) {
                return callback(err, objetos[0]);
            }

            callback(err, objetos[0]);
        });
    };

    GerenciadorDeMapeamentos.prototype.selecioneVarios = function (nomeCompleto, dados, callback) {
        var me = this;
        var no = this.obtenhaNo(nomeCompleto);

        var comandoSql = new ComandoSql();

        no.obtenhaSql(comandoSql, dados);

        var nomeResultMap = no.resultMap;

        if (no.resultMap.indexOf(".") == -1) {
            nomeResultMap = no.mapeamento.nome + "." + no.resultMap;
        }

        var noResultMap = this.obtenhaResultMap(nomeResultMap);

        if (no.resultMap && noResultMap == null) {
            //throw new Error("Result map '" + no.resultMap + "' não encontrado");
            logger.error("Result map '" + no.resultMap + "' can't be found.");
            callback("Result map '" + no.resultMap + "' can't be found.", []);
            return;
        }

        var dominio = require('domain').active;
        this.conexao(function (connection) {
            //console.log(comandoSql.sql);
            //console.log(comandoSql.parametros);
            logger.info("[sqlId:" + nomeCompleto + "]", comandoSql.sql);
            logger.info("Parameters: ", comandoSql.parametros);
            //connection.query(comandoSql.sql, comandoSql.parametros, dominio.intercept(function (rows, fields,err) {
            connection.query(comandoSql.sql, comandoSql.parametros, function (err, rows, fields) {
                if (err) {
                    console.log(err);
                    console.log(err.message);
                    logger.error(err.message);
                    callback(err, []);
                    return;
                }
                if (callback && !noResultMap) {
                    //tich modify khong su dung result map an type
                    var objetos = [];
                    objetos.push(rows);
                    callback(null, objetos);
                } else if (callback && noResultMap) {
                    callback(null, noResultMap.crieObjetos(me, rows));
                } else {
                    if (no.javaType == 'String' || no.javaType == 'int' || no.javaType == 'long' || no.javaType == 'java.lang.Long') {
                        var objetos = [];
                        for (var i in rows) {
                            var row = rows[i];

                            for (var j in row) {
                                objetos.push(row[j]);
                                break;
                            }
                        }

                        callback(null, objetos);
                    }
                }
                //}));
            });
        });
    };

    GerenciadorDeMapeamentos.prototype.crie = function () {
        var instance = Object.create(GerenciadorDeMapeamentos);
        instance.constructor.apply(instance, []);

        return instance;
    };

    GerenciadorDeMapeamentos.prototype.contexto = function () {
        var dominio = require('domain').active;
        return dominio.contexto;
    };

    GerenciadorDeMapeamentos.prototype.conexao = function (callback) {
        try {
            this.contexto();
            return this.contexto().obtenhaConexao(callback);
        } catch (err) {
            console.log(err);
        }
    };

    GerenciadorDeMapeamentos.prototype.transacao = function (callback) {
        return this.contexto().inicieTransacao(callback);
    };

    return GerenciadorDeMapeamentos;
}();
exports.GerenciadorDeMapeamentos = GerenciadorDeMapeamentos;

var Mapeamento = function () {
    function Mapeamento(nome) {
        this.nome = nome;
        this.filhos = [];
        this.resultMaps = [];
        this.resultsMapsPorId = {};
        this.nosPorId = {};
    }
    Mapeamento.prototype.adicione = function (noFilho) {
        noFilho.mapeamento = this;

        this.filhos.push(noFilho);

        if (noFilho instanceof NoResultMap) {
            this.resultMaps.push(noFilho);

            this.resultsMapsPorId[noFilho.id] = noFilho;
        }

        this.nosPorId[noFilho.id] = noFilho;
    };

    Mapeamento.prototype.obtenhaResultMap = function (nomeResultMap) {
        return this.resultsMapsPorId[nomeResultMap];
    };

    Mapeamento.prototype.obtenhaNo = function (idNo) {
        return this.nosPorId[idNo];
    };
    return Mapeamento;
}();

exports.dir_xml = dir_xml;
exports.Mapeamento = Mapeamento;
exports.Contexto = Contexto;

//# sourceMappingURL=No.js.map
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9EQk1hbmFnZXJzL015QmF0aXMvbXliYXRpc25vZGVqcy9zcmMvTm8uanMiXSwibmFtZXMiOlsibG9nZ2VyIiwiRkxMb2dnZXIiLCJnZXRMb2dnZXIiLCJkaXJfeG1sIiwic2VwYXJhZG9yIiwiX19leHRlbmRzIiwiZCIsImIiLCJwIiwiaGFzT3duUHJvcGVydHkiLCJfXyIsImNvbnN0cnVjdG9yIiwicHJvdG90eXBlIiwiZnMiLCJyZXF1aXJlIiwicGF0aCIsInZtIiwidXRpbCIsIm1vbWVudCIsIkRPTVBhcnNlciIsIlMiLCJDb250ZXh0byIsIkNvbWFuZG9TcWwiLCJzcWwiLCJwYXJhbWV0cm9zIiwiYWRpY2lvbmVQYXJhbWV0cm8iLCJ2YWxvciIsInB1c2giLCJObyIsImlkIiwibWFwZWFtZW50byIsImZpbGhvcyIsImFkaWNpb25lIiwibm8iLCJpbXByaW1hIiwiY29uc29sZSIsImxvZyIsImkiLCJub0ZpbGhvIiwib2J0ZW5oYVNxbCIsImNvbWFuZG9TcWwiLCJkYWRvcyIsImdldFZhbHVlIiwiZGF0YSIsImxlbiIsImxlbmd0aCIsIm9idGVuaGFOb21lQ29tcGxldG8iLCJub21lIiwicHJvY2Vzc2VFeHByZXNzYW8iLCJ0ZXh0byIsIm15QXJyYXkiLCJyZWdleCIsIlJlZ0V4cCIsImV4cHJlc3NhbyIsImV4ZWMiLCJ0cmVjaG8iLCJ2YWxvclByb3ByaWVkYWRlIiwic3BsaXQiLCJyZXBsYWNlIiwiaXNEYXRlIiwiZm9ybWF0IiwiaXNBcnJheSIsImVycm9yIiwiRXJyb3IiLCJleHBvcnRzIiwiTm9TZWxlY3QiLCJfc3VwZXIiLCJyZXN1bHRNYXAiLCJqYXZhVHlwZSIsImNhbGwiLCJOb1N0cmluZyIsInRyaW0iLCJOb0Nob29zZSIsIk5vT3RoZXJ3aXNlIiwibm9PdGhlcndpc2UiLCJOb1doZW4iLCJub1doZW4iLCJleHByZXNzYW9UZXN0ZSIsImV2YWwiLCJlcnIiLCJ2YWxvckV4cHJlc3NhbyIsImlkZW50aWZpY2Fkb3JlcyIsImlkZW50aWZpY2Fkb3IiLCJyZXBsYWNlQWxsIiwidG9TdHJpbmciLCJOb0ZvckVhY2giLCJpdGVtIiwiaW5kZXgiLCJhYmVydHVyYSIsImZlY2hhbWVudG8iLCJjb2xsZWN0aW9uIiwiY29sZWNhbyIsIm5vdmFFeHByZXNzYW8iLCJwcm9wcmllZGFkZSIsImpvaW4iLCJOb0lmIiwiTm9Qcm9wcmllZGFkZSIsImNvbHVuYSIsInByZWZpeG8iLCJvYnRlbmhhQ29sdW5hIiwiY3JpZU9iamV0byIsImdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcyIsImNhY2hlRGVPYmpldG9zIiwib2JqZXRvIiwicmVnaXN0cm8iLCJjaGF2ZVBhaSIsIk5vUHJvcHJpZWRhZGVJZCIsIk5vQXNzb2NpYWNhbyIsImNvbHVtblByZWZpeCIsImluZGV4T2YiLCJhbmNlc3RvckNhY2hlIiwib2J0ZW5oYVJlc3VsdE1hcCIsImNoYXZlT2JqZXRvIiwib2J0ZW5oYUNoYXZlIiwiY2hhdmVDb21iaW5hZGEiLCJvYnRlbmhhQ2hhdmVDb21iaW5hZGEiLCJvYmpldG9Db25oZWNpZG8iLCJvYmpldG9Db2xlY2FvIiwiTm9Qcm9wcmllZGFkZUNvbGVjYW8iLCJvZlR5cGUiLCJ0aXBvSmF2YSIsIk5vUmVzdWx0TWFwIiwidGlwbyIsInByb3ByaWVkYWRlcyIsInByb3ByaWVkYWRlc0lkIiwiZGVmaW5hUHJvcHJpZWRhZGVJZCIsInByb3ByaWVkYWRlSWQiLCJlbmNvbnRyZVByb3ByaWVkYWRlSWQiLCJlbmNvbnRyb3UiLCJzcGxpY2UiLCJkZWZpbmFEaXNjcmltaW5hdG9yIiwibm9EaXNjcmltaW5hZG9yIiwicHJvcElkIiwiY2hhdmUiLCJwZWRhY29PYmpldG8iLCJjcmllT2JqZXRvcyIsInJlZ2lzdHJvcyIsIm9iamV0b3MiLCJpbnN0YW5jZSIsInByb2Nlc3NlQ29sZWNvZXMiLCJub21lTW9kZWwiLCJvYnRlbmhhTm9tZU1vZGVsIiwiaWRDaGF2ZSIsIm1vZGVsIiwib2J0ZW5oYU1vZGVsIiwiT2JqZWN0IiwiY3JlYXRlIiwiYXBwbHkiLCJlbmNvbnRyb3VWYWxvcmVzIiwiYXRyaWJ1YVByb3ByaWVkYWRlc1NpbXBsZXMiLCJ0aXBvTm8iLCJ2YWxvclRpcG8iLCJjYXNlcyIsInN1YnN0cmluZyIsImxhc3RJbmRleE9mIiwiZW5jb250cm91VmFsb3IiLCJqIiwiQnVmZmVyIiwiTm9EaXNjcmltaW5hdG9yIiwibm9DYXNlRGlzY3JpbWluYXRvciIsImluZm8iLCJub0Nhc2UiLCJOb0Nhc2VEaXNjcmltaW5hdG9yIiwiUHJpbmNpcGFsIiwibGVpYU5vRGlzY3JpbWluYXRvciIsIm5vWG1sIiwibm9SZXN1bHRNYXAiLCJub0Rpc2NyaW1pbmF0b3IiLCJnZXRBdHRyaWJ1dGVOb2RlIiwidmFsdWUiLCJjaGlsZE5vZGVzIiwibm9kZU5hbWUiLCJsZWlhQXNzb2NpYXRpb25Qcm9wZXJ0eSIsImF0cmlidXRvQ29sdW5hIiwidmFsb3JDb2x1bmEiLCJsZWlhQ29sbGVjdGlvblByb3BlcnR5IiwidmFsb3JSZXN1bHRNYXAiLCJ2YWxvck9mVHlwZSIsInZhbG9yVGlwb0phdmEiLCJsZWlhUmVzdWx0UHJvcGVydHkiLCJsZWlhUmVzdWx0TWFwIiwibm9YbWxSZXN1bHRNYXAiLCJub21lSWQiLCJwb3NzdWlQcm9wcmllZGFkZUlkIiwibGVpYSIsImdjaGlsZCIsIm5vQ29tYW5kbyIsIm5vSmF2YVR5cGUiLCJ2YWxvckphdmFUeXBlIiwibGVpYUNob29zZSIsImxlaWFJZiIsImxlaWFGb3JFYWNoIiwiaGFzQ2hpbGROb2RlcyIsIm5vU3RyaW5nIiwidGV4dENvbnRlbnQiLCJub1ByaW5jaXBhbCIsInZhbG9yU2VwYXJhZG9yIiwidmFsb3JBYmVydHVyYSIsInZhbG9yRmVjaGFtZW50byIsInZhbG9ySW5kZXgiLCJ2YWxvckNvbGxlY3Rpb24iLCJub0ZvckVhY2giLCJub0lmIiwibm9DaG9vc2UiLCJsZWlhTm9XaGVuIiwibm9QcmljaXBhbCIsInByb2Nlc3NlIiwibWFwYU5vcyIsIkdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcyIsIm1vZGVscyIsIndhbGsiLCJkaXIiLCJkb25lIiwicmVzdWx0cyIsImxpc3QiLCJyZWFkZGlyU3luYyIsInBlbmRpbmciLCJmb3JFYWNoIiwiZmlsZSIsInN0YXQiLCJzdGF0U3luYyIsImlzRGlyZWN0b3J5IiwicmVzIiwiY29uY2F0IiwiZXh0IiwiYXJxdWl2b3MiLCJhcnF1aXZvIiwicHJvY2Vzc2VBcnF1aXZvIiwibm9tZUFycXVpdm8iLCJsc3RhdFN5bmMiLCJ4bWwiLCJyZWFkRmlsZVN5bmMiLCJ4bWxEb2MiLCJwYXJzZUZyb21TdHJpbmciLCJkb2N1bWVudEVsZW1lbnQiLCJub3MiLCJNYXBlYW1lbnRvIiwibWFwZWFtZW50b3MiLCJtYXBhTWFwZWFtZW50b3MiLCJhZGljaW9uZU1vZGVsIiwibm9tZUNsYXNzZURvbWluaW8iLCJjbGFzc2UiLCJub21lQ29tcGxldG9SZXN1bHRNYXAiLCJub21lTmFtZXNwYWNlIiwibm9tZVJlc3VsdE1hcCIsIm9idGVuaGFObyIsImlkTm8iLCJpbnNpcmEiLCJub21lQ29tcGxldG8iLCJjYWxsYmFjayIsIm1lIiwiZG9taW5pbyIsImFjdGl2ZSIsImNvbmV4YW8iLCJjb25uZWN0aW9uIiwicXVlcnkiLCJyb3dzIiwiZmllbGRzIiwibWVzc2FnZSIsImluc2VydElkIiwiYWZmZWN0ZWRSb3dzIiwiYXR1YWxpemUiLCJyZW1vdmEiLCJzZWxlY2lvbmVVbSIsInNlbGVjaW9uZVZhcmlvcyIsInJvdyIsImNyaWUiLCJjb250ZXh0byIsIm9idGVuaGFDb25leGFvIiwidHJhbnNhY2FvIiwiaW5pY2llVHJhbnNhY2FvIiwicmVzdWx0TWFwcyIsInJlc3VsdHNNYXBzUG9ySWQiLCJub3NQb3JJZCJdLCJtYXBwaW5ncyI6Ijs7OztBQUFBLElBQUlBLFNBQU9DLFNBQVNDLFNBQVQsQ0FBbUIsY0FBbkIsQ0FBWDtBQUNBLElBQUlDLFVBQVUsRUFBZDtBQUFBLElBQ0lDLFlBQVksS0FEaEI7O0FBR0EsSUFBSUMsWUFBWSxVQUFLQSxTQUFMLElBQWtCLFVBQVVDLENBQVYsRUFBYUMsQ0FBYixFQUFnQjtBQUM5QyxTQUFLLElBQUlDLENBQVQsSUFBY0QsQ0FBZDtBQUFpQixZQUFJQSxFQUFFRSxjQUFGLENBQWlCRCxDQUFqQixDQUFKLEVBQXlCRixFQUFFRSxDQUFGLElBQU9ELEVBQUVDLENBQUYsQ0FBUDtBQUExQyxLQUNBLFNBQVNFLEVBQVQsR0FBYztBQUFFLGFBQUtDLFdBQUwsR0FBbUJMLENBQW5CO0FBQXVCO0FBQ3ZDSSxPQUFHRSxTQUFILEdBQWVMLEVBQUVLLFNBQWpCO0FBQ0FOLE1BQUVNLFNBQUYsR0FBYyxJQUFJRixFQUFKLEVBQWQ7QUFDSCxDQUxEO0FBTUEsSUFBSUcsS0FBS0MsUUFBUSxJQUFSLENBQVQ7QUFDQSxJQUFJQyxPQUFRRCxRQUFRLE1BQVIsQ0FBWjs7QUFFQSxJQUFJRSxLQUFLRixRQUFRLElBQVIsQ0FBVDtBQUNBLElBQUlHLE9BQU9ILFFBQVEsTUFBUixDQUFYO0FBQ0EsSUFBSUksU0FBU0osUUFBUSxRQUFSLENBQWI7QUFDQSxJQUFJSyxZQUFZTCxRQUFRLFFBQVIsRUFBa0JLLFNBQWxDO0FBQ0EsSUFBSUMsSUFBSU4sUUFBUSxRQUFSLENBQVI7QUFDQSxJQUFJTyxXQUFXUCxRQUFRLFlBQVIsQ0FBZjs7QUFFQSxTQUFTUSxVQUFULEdBQXNCO0FBQ2xCLFNBQUtDLEdBQUwsR0FBVyxFQUFYO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNIOztBQUVERixXQUFXVixTQUFYLENBQXFCYSxpQkFBckIsR0FBeUMsVUFBU0MsS0FBVCxFQUFnQjtBQUNyRCxTQUFLRixVQUFMLENBQWdCRyxJQUFoQixDQUFxQkQsS0FBckI7QUFDSCxDQUZEOztBQUlBLElBQUlFLEtBQU0sWUFBWTtBQUNsQixhQUFTQSxFQUFULENBQVlDLEVBQVosRUFBZ0JDLFVBQWhCLEVBQTRCO0FBQ3hCLGFBQUtELEVBQUwsR0FBVUEsRUFBVjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsYUFBS0MsTUFBTCxHQUFjLEVBQWQ7QUFDSDs7QUFFREgsT0FBR2hCLFNBQUgsQ0FBYW9CLFFBQWIsR0FBd0IsVUFBVUMsRUFBVixFQUFjO0FBQ2xDLGFBQUtGLE1BQUwsQ0FBWUosSUFBWixDQUFpQk0sRUFBakI7QUFDSCxLQUZEOztBQUlBTCxPQUFHaEIsU0FBSCxDQUFhc0IsT0FBYixHQUF1QixZQUFZO0FBQy9CLFlBQUksS0FBS0wsRUFBVCxFQUNJTSxRQUFRQyxHQUFSLENBQVksS0FBS1AsRUFBakI7O0FBRUosYUFBSyxJQUFJUSxDQUFULElBQWMsS0FBS04sTUFBbkIsRUFBMkI7QUFDdkIsZ0JBQUlPLFVBQVUsS0FBS1AsTUFBTCxDQUFZTSxDQUFaLENBQWQ7O0FBRUFDLG9CQUFRSixPQUFSO0FBQ0g7QUFDSixLQVREOztBQVdBTixPQUFHaEIsU0FBSCxDQUFhMkIsVUFBYixHQUEwQixVQUFVQyxVQUFWLEVBQXNCQyxLQUF0QixFQUE2QjtBQUNuRCxhQUFLLElBQUlKLENBQVQsSUFBYyxLQUFLTixNQUFuQixFQUEyQjtBQUN2QixnQkFBSU8sVUFBVSxLQUFLUCxNQUFMLENBQVlNLENBQVosQ0FBZDs7QUFFQUMsb0JBQVFDLFVBQVIsQ0FBbUJDLFVBQW5CLEVBQStCQyxLQUEvQjtBQUNIOztBQUVELGVBQU9ELFVBQVA7QUFDSCxLQVJEOztBQVVBWixPQUFHaEIsU0FBSCxDQUFhOEIsUUFBYixHQUF3QixVQUFVQyxJQUFWLEVBQWdCNUIsSUFBaEIsRUFBc0I7QUFDMUMsWUFBSXNCLENBQUo7QUFBQSxZQUFPTyxNQUFNN0IsS0FBSzhCLE1BQWxCOztBQUVBLGFBQUtSLElBQUksQ0FBVCxFQUFZLFFBQU9NLElBQVAseUNBQU9BLElBQVAsT0FBZ0IsUUFBaEIsSUFBNEJOLElBQUlPLEdBQTVDLEVBQWlELEVBQUVQLENBQW5ELEVBQXNEO0FBQ2xELGdCQUFJTSxJQUFKLEVBQ0lBLE9BQU9BLEtBQUs1QixLQUFLc0IsQ0FBTCxDQUFMLENBQVA7QUFDUDtBQUNELGVBQU9NLElBQVA7QUFDSCxLQVJEOztBQVVBZixPQUFHaEIsU0FBSCxDQUFha0MsbUJBQWIsR0FBbUMsWUFBWTtBQUMzQyxlQUFPLEtBQUtoQixVQUFMLENBQWdCaUIsSUFBaEIsR0FBdUIsR0FBdkIsR0FBNkIsS0FBS2xCLEVBQXpDO0FBQ0gsS0FGRDs7QUFJQUQsT0FBR2hCLFNBQUgsQ0FBYW9DLGlCQUFiLEdBQWlDLFVBQVVDLEtBQVYsRUFBaUJULFVBQWpCLEVBQTZCQyxLQUE3QixFQUFvQztBQUNqRSxZQUFJUyxPQUFKO0FBQ0EsWUFBSUMsUUFBUSxJQUFJQyxNQUFKLENBQVcsc0JBQVgsRUFBbUMsSUFBbkMsQ0FBWjtBQUNBLFlBQUlDLFlBQVlKLEtBQWhCOztBQUVBLGVBQU8sQ0FBQ0MsVUFBVUMsTUFBTUcsSUFBTixDQUFXTCxLQUFYLENBQVgsTUFBa0MsSUFBekMsRUFBK0M7QUFDM0MsZ0JBQUlNLFNBQVNMLFFBQVEsQ0FBUixDQUFiO0FBQ0EsZ0JBQUlNLG1CQUFtQixLQUFLZCxRQUFMLENBQWNELEtBQWQsRUFBcUJTLFFBQVEsQ0FBUixFQUFXTyxLQUFYLENBQWlCLEdBQWpCLENBQXJCLENBQXZCOztBQUVBO0FBQ0EsZ0JBQUlELG9CQUFvQixJQUF4QixFQUE4QjtBQUMxQkgsNEJBQVlBLFVBQVVLLE9BQVYsQ0FBa0JILE1BQWxCLEVBQTBCLEdBQTFCLENBQVo7QUFDQWYsMkJBQVdmLGlCQUFYLENBQTZCLElBQTdCO0FBQ0gsYUFIRCxNQUdPLElBQUksT0FBTytCLGdCQUFQLElBQTJCLFFBQS9CLEVBQXlDO0FBQzVDSCw0QkFBWUEsVUFBVUssT0FBVixDQUFrQkgsTUFBbEIsRUFBMEIsR0FBMUIsQ0FBWjtBQUNBZiwyQkFBV2YsaUJBQVgsQ0FBNkIrQixnQkFBN0I7QUFDSCxhQUhNLE1BR0EsSUFBSSxPQUFPQSxnQkFBUCxJQUEyQixRQUEvQixFQUF5QztBQUM1Q0gsNEJBQVlBLFVBQVVLLE9BQVYsQ0FBa0JILE1BQWxCLEVBQTBCLEdBQTFCLENBQVo7QUFDQWYsMkJBQVdmLGlCQUFYLENBQTZCK0IsZ0JBQTdCO0FBQ0gsYUFITSxNQUdBLElBQUksT0FBT0EsZ0JBQVAsSUFBMkIsU0FBL0IsRUFBMEM7QUFDN0NILDRCQUFZQSxVQUFVSyxPQUFWLENBQWtCSCxNQUFsQixFQUEwQixHQUExQixDQUFaO0FBQ0FmLDJCQUFXZixpQkFBWCxDQUE2QitCLGdCQUE3QjtBQUNILGFBSE0sTUFHQSxJQUFJdkMsS0FBSzBDLE1BQUwsQ0FBWUgsZ0JBQVosQ0FBSixFQUFtQztBQUN0QyxvQkFBSTlCLFFBQVFSLE9BQU9zQyxnQkFBUCxFQUF5QkksTUFBekIsQ0FBZ0MscUJBQWhDLENBQVo7O0FBRUE7QUFDQVAsNEJBQVlBLFVBQVVLLE9BQVYsQ0FBa0JILE1BQWxCLEVBQTBCLEdBQTFCLENBQVo7O0FBRUFmLDJCQUFXZixpQkFBWCxDQUE2QkMsS0FBN0I7QUFDSCxhQVBNLE1BT0EsSUFBSVQsS0FBSzRDLE9BQUwsQ0FBYUwsZ0JBQWIsQ0FBSixFQUFvQztBQUMxQ3hELHVCQUFPOEQsS0FBUCxDQUFhLDhCQUE4QlAsTUFBOUIsR0FBdUMsaUJBQXZDLEdBQTJEQyxnQkFBeEU7QUFDRyxzQkFBTSxJQUFJTyxLQUFKLENBQVUsOEJBQThCUixNQUE5QixHQUF1QyxpQkFBdkMsR0FBMkRDLGdCQUFyRSxDQUFOO0FBQ0g7QUFDSjs7QUFFRCxlQUFPSCxTQUFQO0FBQ0gsS0FwQ0Q7QUFxQ0EsV0FBT3pCLEVBQVA7QUFDSCxDQXBGUSxFQUFUO0FBcUZBb0MsUUFBUXBDLEVBQVIsR0FBYUEsRUFBYjs7QUFFQSxJQUFJcUMsV0FBWSxVQUFVQyxNQUFWLEVBQWtCO0FBQzlCN0QsY0FBVTRELFFBQVYsRUFBb0JDLE1BQXBCO0FBQ0EsYUFBU0QsUUFBVCxDQUFrQnBDLEVBQWxCLEVBQXNCc0MsU0FBdEIsRUFBaUNDLFFBQWpDLEVBQTJDdEMsVUFBM0MsRUFBdUQ7QUFDbkRvQyxlQUFPRyxJQUFQLENBQVksSUFBWixFQUFrQnhDLEVBQWxCLEVBQXNCQyxVQUF0Qjs7QUFFQSxhQUFLcUMsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNIO0FBQ0QsV0FBT0gsUUFBUDtBQUNILENBVGMsQ0FTWnJDLEVBVFksQ0FBZjtBQVVBb0MsUUFBUUMsUUFBUixHQUFtQkEsUUFBbkI7O0FBRUEsSUFBSUssV0FBWSxVQUFVSixNQUFWLEVBQWtCO0FBQzlCN0QsY0FBVWlFLFFBQVYsRUFBb0JKLE1BQXBCO0FBQ0EsYUFBU0ksUUFBVCxDQUFrQnJCLEtBQWxCLEVBQXlCbkIsVUFBekIsRUFBcUM7QUFDakNvQyxlQUFPRyxJQUFQLENBQVksSUFBWixFQUFrQixFQUFsQixFQUFzQnZDLFVBQXRCO0FBQ0EsYUFBS21CLEtBQUwsR0FBYUEsTUFBTXNCLElBQU4sRUFBYjtBQUNIO0FBQ0RELGFBQVMxRCxTQUFULENBQW1Cc0IsT0FBbkIsR0FBNkIsWUFBWTtBQUNyQ0MsZ0JBQVFDLEdBQVIsQ0FBWSxLQUFLYSxLQUFqQjtBQUNILEtBRkQ7O0FBSUFxQixhQUFTMUQsU0FBVCxDQUFtQjJCLFVBQW5CLEdBQWdDLFVBQVVDLFVBQVYsRUFBc0JDLEtBQXRCLEVBQTZCO0FBQ3pERCxtQkFBV2pCLEdBQVgsSUFBa0IyQyxPQUFPdEQsU0FBUCxDQUFpQm9DLGlCQUFqQixDQUFtQ3FCLElBQW5DLENBQXdDLElBQXhDLEVBQThDLEtBQUtwQixLQUFuRCxFQUEwRFQsVUFBMUQsRUFBc0VDLEtBQXRFLElBQStFLEdBQWpHO0FBQ0gsS0FGRDtBQUdBLFdBQU82QixRQUFQO0FBQ0gsQ0FkYyxDQWNaMUMsRUFkWSxDQUFmO0FBZUFvQyxRQUFRTSxRQUFSLEdBQW1CQSxRQUFuQjs7QUFFQSxJQUFJRSxXQUFZLFVBQVVOLE1BQVYsRUFBa0I7QUFDOUI3RCxjQUFVbUUsUUFBVixFQUFvQk4sTUFBcEI7QUFDQSxhQUFTTSxRQUFULENBQWtCMUMsVUFBbEIsRUFBOEI7QUFDMUJvQyxlQUFPRyxJQUFQLENBQVksSUFBWixFQUFrQixFQUFsQixFQUFzQnZDLFVBQXRCO0FBQ0g7QUFDRDBDLGFBQVM1RCxTQUFULENBQW1Cb0IsUUFBbkIsR0FBOEIsVUFBVUMsRUFBVixFQUFjO0FBQ3hDaUMsZUFBT3RELFNBQVAsQ0FBaUJvQixRQUFqQixDQUEwQnFDLElBQTFCLENBQStCLElBQS9CLEVBQXFDcEMsRUFBckM7O0FBRUEsWUFBSUEsY0FBY3dDLFdBQWxCLEVBQStCO0FBQzNCLGlCQUFLQyxXQUFMLEdBQW1CekMsRUFBbkI7QUFDSDtBQUNKLEtBTkQ7O0FBUUF1QyxhQUFTNUQsU0FBVCxDQUFtQjJCLFVBQW5CLEdBQWdDLFVBQVVDLFVBQVYsRUFBc0JDLEtBQXRCLEVBQTZCO0FBQ3pELGFBQUssSUFBSUosQ0FBVCxJQUFjLEtBQUtOLE1BQW5CLEVBQTJCO0FBQ3ZCLGdCQUFJRSxLQUFLLEtBQUtGLE1BQUwsQ0FBWU0sQ0FBWixDQUFUOztBQUVBLGdCQUFJSixjQUFjMEMsTUFBbEIsRUFBMEI7QUFDdEIsb0JBQUlDLFNBQVMzQyxFQUFiOztBQUVBLG9CQUFJb0IsWUFBWXVCLE9BQU9DLGNBQVAsQ0FBc0JuQixPQUF0QixDQUE4QixJQUE5QixFQUFvQyxRQUFwQyxFQUE4Q0EsT0FBOUMsQ0FBc0QsR0FBdEQsRUFBMkQsRUFBM0QsQ0FBaEI7O0FBRUEsb0JBQUs7QUFDRG9CLHlCQUFLLFNBQVN6QixTQUFULEdBQXFCLG9FQUExQjtBQUNILGlCQUZELENBRUUsT0FBTzBCLEdBQVAsRUFBWTtBQUNWdEMsMEJBQU11QyxjQUFOLEdBQXVCLEtBQXZCO0FBQ0g7O0FBRUQsb0JBQUl2QyxNQUFNdUMsY0FBVixFQUEwQjtBQUN0QiwyQkFBT0osT0FBT3JDLFVBQVAsQ0FBa0JDLFVBQWxCLEVBQThCQyxLQUE5QixDQUFQO0FBQ0g7QUFDSjtBQUNKOztBQUVELFlBQUksS0FBS2lDLFdBQVQsRUFBc0I7QUFDbEIsbUJBQU8sS0FBS0EsV0FBTCxDQUFpQm5DLFVBQWpCLENBQTRCQyxVQUE1QixFQUF3Q0MsS0FBeEMsQ0FBUDtBQUNIOztBQUVELGVBQU8sRUFBUDtBQUNILEtBMUJEO0FBMkJBLFdBQU8rQixRQUFQO0FBQ0gsQ0F6Q2MsQ0F5Q1o1QyxFQXpDWSxDQUFmO0FBMENBb0MsUUFBUVEsUUFBUixHQUFtQkEsUUFBbkI7O0FBRUEsSUFBSUcsU0FBVSxVQUFVVCxNQUFWLEVBQWtCO0FBQzVCN0QsY0FBVXNFLE1BQVYsRUFBa0JULE1BQWxCO0FBQ0EsYUFBU1MsTUFBVCxDQUFnQkUsY0FBaEIsRUFBZ0M1QixLQUFoQyxFQUF1Q25CLFVBQXZDLEVBQW1EO0FBQy9Db0MsZUFBT0csSUFBUCxDQUFZLElBQVosRUFBa0IsRUFBbEIsRUFBc0J2QyxVQUF0QjtBQUNBLGFBQUsrQyxjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLGFBQUs1QixLQUFMLEdBQWFBLEtBQWI7O0FBRUEsWUFBSUUsUUFBUSxJQUFJQyxNQUFKLENBQVcsNkJBQVgsRUFBMEMsSUFBMUMsQ0FBWjtBQUNBLFlBQUk2QixrQkFBa0IsRUFBdEI7QUFDQSxlQUFPLENBQUMvQixVQUFVQyxNQUFNRyxJQUFOLENBQVd1QixjQUFYLENBQVgsTUFBMkMsSUFBbEQsRUFBd0Q7QUFDcEQsZ0JBQUlLLGdCQUFnQmhDLFFBQVEsQ0FBUixDQUFwQjs7QUFFQSxnQkFBSWdDLGlCQUFpQixNQUFqQixJQUEyQkEsaUJBQWlCLE1BQTVDLElBQXNEQSxpQkFBaUIsT0FBdkUsSUFBa0ZBLGlCQUFpQixLQUF2RyxFQUErRzs7QUFFL0dELDRCQUFnQnRELElBQWhCLENBQXFCdUQsYUFBckI7QUFDSDs7QUFFRCxhQUFLLElBQUk3QyxJQUFJLENBQWIsRUFBZ0JBLElBQUk0QyxnQkFBZ0JwQyxNQUFwQyxFQUE0Q1IsR0FBNUMsRUFBa0Q7QUFDOUMsZ0JBQUk2QyxnQkFBZ0JELGdCQUFnQjVDLENBQWhCLENBQXBCOztBQUVBLGlCQUFLd0MsY0FBTCxHQUFzQixLQUFLQSxjQUFMLENBQW9CbkIsT0FBcEIsQ0FBNEJ3QixhQUE1QixFQUEyQyxXQUFXQSxhQUF0RCxDQUF0QjtBQUNIOztBQUVELGFBQUtMLGNBQUwsR0FBc0J6RCxFQUFFLEtBQUt5RCxjQUFQLEVBQXVCTSxVQUF2QixDQUFrQyxLQUFsQyxFQUF5QyxJQUF6QyxFQUErQ0MsUUFBL0MsRUFBdEI7QUFDSDs7QUFFRFQsV0FBTy9ELFNBQVAsQ0FBaUJzQixPQUFqQixHQUEyQixZQUFZO0FBQ3RDbEMsZUFBTzhELEtBQVAsQ0FBYSxVQUFVLEtBQUtlLGNBQWYsR0FBZ0MsS0FBaEMsR0FBd0MsS0FBSzVCLEtBQTFEO0FBQ0dkLGdCQUFRQyxHQUFSLENBQVksVUFBVSxLQUFLeUMsY0FBZixHQUFnQyxLQUFoQyxHQUF3QyxLQUFLNUIsS0FBekQ7QUFDSCxLQUhEOztBQUtBLFdBQU8wQixNQUFQO0FBQ0gsQ0FoQ1ksQ0FnQ1YvQyxFQWhDVSxDQUFiO0FBaUNBb0MsUUFBUVcsTUFBUixHQUFpQkEsTUFBakI7O0FBRUEsSUFBSVUsWUFBYSxVQUFVbkIsTUFBVixFQUFrQjtBQUMvQjdELGNBQVVnRixTQUFWLEVBQXFCbkIsTUFBckI7QUFDQSxhQUFTbUIsU0FBVCxDQUFtQkMsSUFBbkIsRUFBeUJDLEtBQXpCLEVBQWdDbkYsU0FBaEMsRUFBMkNvRixRQUEzQyxFQUFxREMsVUFBckQsRUFBaUV4QyxLQUFqRSxFQUF3RXlDLFVBQXhFLEVBQW9GNUQsVUFBcEYsRUFBZ0c7QUFDNUZvQyxlQUFPRyxJQUFQLENBQVksSUFBWixFQUFrQixFQUFsQixFQUFzQnZDLFVBQXRCOztBQUVBLGFBQUt3RCxJQUFMLEdBQVlBLElBQVo7QUFDQSxhQUFLQyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLbkYsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxhQUFLb0YsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxhQUFLQyxVQUFMLEdBQWtCQSxVQUFsQjtBQUNBLGFBQUtDLFVBQUwsR0FBa0JBLFVBQWxCO0FBQ0EsYUFBS3pDLEtBQUwsR0FBYUEsTUFBTXNCLElBQU4sRUFBYjtBQUNIO0FBQ0RjLGNBQVV6RSxTQUFWLENBQW9CMkIsVUFBcEIsR0FBaUMsVUFBVUMsVUFBVixFQUFzQkMsS0FBdEIsRUFBNkI7QUFDMUQsWUFBSVEsUUFBUSxFQUFaOztBQUVBLFlBQUkwQyxVQUFVbEQsTUFBTSxLQUFLaUQsVUFBWCxDQUFkOztBQUVBLFlBQUlDLFdBQVcsSUFBZixFQUFxQjtBQUNqQixnQkFBSTFFLEtBQUs0QyxPQUFMLENBQWFwQixLQUFiLENBQUosRUFBeUI7QUFDckJrRCwwQkFBVWxELEtBQVY7QUFDSCxhQUZELE1BRU87QUFDSCx1QkFBTyxLQUFLK0MsUUFBTCxHQUFnQixLQUFLQyxVQUE1QjtBQUNIO0FBQ0o7O0FBRUQsYUFBSyxJQUFJcEQsSUFBSSxDQUFiLEVBQWdCQSxJQUFJc0QsUUFBUTlDLE1BQTVCLEVBQW9DUixHQUFwQyxFQUF5QztBQUNyQyxnQkFBSWlELE9BQU9LLFFBQVF0RCxDQUFSLENBQVg7O0FBRUEsZ0JBQUlhLE9BQUo7QUFDQSxnQkFBSUMsUUFBUSxJQUFJQyxNQUFKLENBQVcsbUJBQVgsRUFBZ0MsSUFBaEMsQ0FBWjs7QUFFQSxnQkFBSUMsWUFBWSxLQUFLSixLQUFyQjs7QUFFQSxnQkFBSTJDLGdCQUFnQnZDLFNBQXBCO0FBQ0EsbUJBQU8sQ0FBQ0gsVUFBVUMsTUFBTUcsSUFBTixDQUFXRCxTQUFYLENBQVgsTUFBc0MsSUFBN0MsRUFBbUQ7QUFDL0Msb0JBQUlFLFNBQVNMLFFBQVEsQ0FBUixDQUFiO0FBQ0Esb0JBQUkyQyxjQUFjM0MsUUFBUSxDQUFSLEVBQVdRLE9BQVgsQ0FBbUIsS0FBSzRCLElBQUwsR0FBWSxHQUEvQixFQUFvQyxFQUFwQyxDQUFsQjtBQUNBLG9CQUFJOUIsbUJBQW1CLEtBQUtkLFFBQUwsQ0FBYzRDLElBQWQsRUFBb0JPLFlBQVlwQyxLQUFaLENBQWtCLEdBQWxCLENBQXBCLENBQXZCOztBQUVBLG9CQUFJLE9BQU9ELGdCQUFQLElBQTJCLFFBQS9CLEVBQXlDO0FBQ3JDb0Msb0NBQWdCQSxjQUFjbEMsT0FBZCxDQUFzQkgsTUFBdEIsRUFBOEIsR0FBOUIsQ0FBaEI7QUFDQWYsK0JBQVdmLGlCQUFYLENBQTZCK0IsZ0JBQTdCO0FBQ0gsaUJBSEQsTUFHTyxJQUFJLE9BQU9BLGdCQUFQLElBQTJCLFFBQS9CLEVBQXlDO0FBQzVDb0Msb0NBQWdCQSxjQUFjbEMsT0FBZCxDQUFzQkgsTUFBdEIsRUFBOEIsR0FBOUIsQ0FBaEI7QUFDQWYsK0JBQVdmLGlCQUFYLENBQTZCK0IsZ0JBQTdCO0FBQ0g7QUFDSjs7QUFFRFAsa0JBQU10QixJQUFOLENBQVdpRSxhQUFYO0FBQ0g7O0FBRUQsWUFBSXJFLE1BQU0sS0FBS2lFLFFBQUwsR0FBZ0J2QyxNQUFNNkMsSUFBTixDQUFXLEtBQUsxRixTQUFoQixDQUFoQixHQUE2QyxLQUFLcUYsVUFBNUQ7O0FBRUFqRCxtQkFBV2pCLEdBQVgsSUFBa0JBLEdBQWxCOztBQUVBLGVBQU9pQixVQUFQO0FBQ0gsS0E1Q0Q7QUE2Q0EsV0FBTzZDLFNBQVA7QUFDSCxDQTNEZSxDQTJEYnpELEVBM0RhLENBQWhCO0FBNERBb0MsUUFBUXFCLFNBQVIsR0FBb0JBLFNBQXBCOztBQUVBLElBQUlVLE9BQVEsVUFBVTdCLE1BQVYsRUFBa0I7QUFDMUI3RCxjQUFVMEYsSUFBVixFQUFnQjdCLE1BQWhCO0FBQ0EsYUFBUzZCLElBQVQsQ0FBY2xCLGNBQWQsRUFBOEI1QixLQUE5QixFQUFxQ25CLFVBQXJDLEVBQWlEO0FBQzdDb0MsZUFBT0csSUFBUCxDQUFZLElBQVosRUFBa0IsRUFBbEIsRUFBc0J2QyxVQUF0QjtBQUNBLGFBQUsrQyxjQUFMLEdBQXNCQSxjQUF0QjtBQUNBLGFBQUs1QixLQUFMLEdBQWFBLEtBQWI7O0FBRUEsWUFBSUUsUUFBUSxJQUFJQyxNQUFKLENBQVcsNkJBQVgsRUFBMEMsSUFBMUMsQ0FBWjtBQUNBLFlBQUk2QixrQkFBa0IsRUFBdEI7QUFDQSxlQUFPLENBQUMvQixVQUFVQyxNQUFNRyxJQUFOLENBQVd1QixjQUFYLENBQVgsTUFBMkMsSUFBbEQsRUFBd0Q7QUFDcEQsZ0JBQUlLLGdCQUFnQmhDLFFBQVEsQ0FBUixDQUFwQjs7QUFFQSxnQkFBSWdDLGlCQUFpQixNQUFyQixFQUE4Qjs7QUFFOUJELDRCQUFnQnRELElBQWhCLENBQXFCdUQsYUFBckI7QUFDSDs7QUFFRCxhQUFLLElBQUk3QyxJQUFJLENBQWIsRUFBZ0JBLElBQUk0QyxnQkFBZ0JwQyxNQUFwQyxFQUE0Q1IsR0FBNUMsRUFBa0Q7QUFDOUMsZ0JBQUk2QyxnQkFBZ0JELGdCQUFnQjVDLENBQWhCLENBQXBCOztBQUVBLGlCQUFLd0MsY0FBTCxHQUFzQixLQUFLQSxjQUFMLENBQW9CbkIsT0FBcEIsQ0FBNEJ3QixhQUE1QixFQUEyQyxXQUFXQSxhQUF0RCxDQUF0QjtBQUNIO0FBQ0o7QUFDRGEsU0FBS25GLFNBQUwsQ0FBZXNCLE9BQWYsR0FBeUIsWUFBWTtBQUNqQ0MsZ0JBQVFDLEdBQVIsQ0FBWSxRQUFRLEtBQUt5QyxjQUFiLEdBQThCLEtBQTlCLEdBQXNDLEtBQUs1QixLQUF2RDtBQUNILEtBRkQ7O0FBSUE4QyxTQUFLbkYsU0FBTCxDQUFlMkIsVUFBZixHQUE0QixVQUFTQyxVQUFULEVBQXFCQyxLQUFyQixFQUE0QjtBQUNwRCxZQUFJWSxZQUFZLEtBQUt3QixjQUFMLENBQW9CbkIsT0FBcEIsQ0FBNEIsSUFBNUIsRUFBa0MsUUFBbEMsRUFBNENBLE9BQTVDLENBQW9ELEdBQXBELEVBQXlELEVBQXpELENBQWhCOztBQUVBLFlBQUs7QUFDRG9CLGlCQUFLLFNBQVN6QixTQUFULEdBQXFCLG9FQUExQjtBQUNILFNBRkQsQ0FFRSxPQUFPMEIsR0FBUCxFQUFZO0FBQ1Z0QyxrQkFBTXVDLGNBQU4sR0FBdUIsS0FBdkI7QUFDSDs7QUFFRCxZQUFJdkMsTUFBTXVDLGNBQU4sSUFBd0IsS0FBNUIsRUFBbUM7QUFDL0IsbUJBQU8sRUFBUDtBQUNIOztBQUVEO0FBQ0E7QUFDQWQsZUFBT3RELFNBQVAsQ0FBaUIyQixVQUFqQixDQUE0QjhCLElBQTVCLENBQWlDLElBQWpDLEVBQXVDN0IsVUFBdkMsRUFBbURDLEtBQW5ELElBQTRELEdBQTVEO0FBQ0gsS0FoQkQ7QUFpQkEsV0FBT3NELElBQVA7QUFDSCxDQTdDVSxDQTZDUm5FLEVBN0NRLENBQVg7QUE4Q0FvQyxRQUFRK0IsSUFBUixHQUFlQSxJQUFmOztBQUVBLElBQUl0QixjQUFlLFVBQVVQLE1BQVYsRUFBa0I7QUFDakM3RCxjQUFVb0UsV0FBVixFQUF1QlAsTUFBdkI7QUFDQSxhQUFTTyxXQUFULENBQXFCeEIsS0FBckIsRUFBNEJuQixVQUE1QixFQUF3QztBQUNwQ29DLGVBQU9HLElBQVAsQ0FBWSxJQUFaLEVBQWtCLEVBQWxCLEVBQXNCdkMsVUFBdEI7O0FBRUEsYUFBS21CLEtBQUwsR0FBYUEsS0FBYjtBQUNIO0FBQ0R3QixnQkFBWTdELFNBQVosQ0FBc0JzQixPQUF0QixHQUFnQyxZQUFZO0FBQ3hDQyxnQkFBUUMsR0FBUixDQUFZLGVBQWUsS0FBS2EsS0FBcEIsR0FBNEIsR0FBeEM7QUFDSCxLQUZEOztBQUlBd0IsZ0JBQVk3RCxTQUFaLENBQXNCMkIsVUFBdEIsR0FBbUMsVUFBVUMsVUFBVixFQUFzQkMsS0FBdEIsRUFBNkI7QUFDNUQsWUFBSVMsT0FBSjtBQUNBLFlBQUlDLFFBQVEsSUFBSUMsTUFBSixDQUFXLGtCQUFYLEVBQStCLElBQS9CLENBQVo7O0FBRUEsWUFBSUMsWUFBWSxLQUFLSixLQUFyQjs7QUFFQSxlQUFPLENBQUNDLFVBQVVDLE1BQU1HLElBQU4sQ0FBVyxLQUFLTCxLQUFoQixDQUFYLE1BQXVDLElBQTlDLEVBQW9EO0FBQ2hELGdCQUFJTSxTQUFTTCxRQUFRLENBQVIsQ0FBYjtBQUNBLGdCQUFJTSxtQkFBbUIsS0FBS2QsUUFBTCxDQUFjRCxLQUFkLEVBQXFCUyxRQUFRLENBQVIsRUFBV08sS0FBWCxDQUFpQixHQUFqQixDQUFyQixDQUF2Qjs7QUFFQSxnQkFBSSxPQUFPRCxnQkFBUCxJQUEyQixRQUEvQixFQUF5QztBQUNyQ0gsNEJBQVlBLFVBQVVLLE9BQVYsQ0FBa0JILE1BQWxCLEVBQTBCLEdBQTFCLENBQVo7QUFDQWYsMkJBQVdmLGlCQUFYLENBQTZCK0IsZ0JBQTdCO0FBQ0gsYUFIRCxNQUdPLElBQUksT0FBT0EsZ0JBQVAsSUFBMkIsUUFBL0IsRUFBeUM7QUFDNUNILDRCQUFZQSxVQUFVSyxPQUFWLENBQWtCSCxNQUFsQixFQUEwQixHQUExQixDQUFaO0FBQ0FmLDJCQUFXZixpQkFBWCxDQUE2QitCLGdCQUE3QjtBQUNILGFBSE0sTUFHQSxJQUFJLE9BQU9BLGdCQUFQLElBQTJCLFNBQS9CLEVBQTBDO0FBQzdDSCw0QkFBWUEsVUFBVUssT0FBVixDQUFrQkgsTUFBbEIsRUFBMEIsR0FBMUIsQ0FBWjtBQUNBZiwyQkFBV2YsaUJBQVgsQ0FBNkIrQixnQkFBN0I7QUFDSDtBQUNKOztBQUVEaEIsbUJBQVdqQixHQUFYLElBQWtCOEIsWUFBWSxHQUE5QjtBQUNILEtBdkJEOztBQXlCQSxXQUFPb0IsV0FBUDtBQUNILENBckNpQixDQXFDZjdDLEVBckNlLENBQWxCO0FBc0NBb0MsUUFBUVMsV0FBUixHQUFzQkEsV0FBdEI7O0FBRUEsSUFBSXVCLGdCQUFpQixZQUFZO0FBQzdCLGFBQVNBLGFBQVQsQ0FBdUJqRCxJQUF2QixFQUE2QmtELE1BQTdCLEVBQW9DQyxPQUFwQyxFQUE2QztBQUN6QyxhQUFLbkQsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS2tELE1BQUwsR0FBY0EsTUFBZDtBQUNBLGFBQUtDLE9BQUwsR0FBZUEsT0FBZjtBQUNIO0FBQ0RGLGtCQUFjcEYsU0FBZCxDQUF3QnNCLE9BQXhCLEdBQWtDLFlBQVk7QUFDMUNDLGdCQUFRQyxHQUFSLENBQVksS0FBS1csSUFBTCxHQUFZLE1BQVosR0FBcUIsS0FBS29ELGFBQUwsRUFBakM7QUFDSCxLQUZEOztBQUlBSCxrQkFBY3BGLFNBQWQsQ0FBd0J1RixhQUF4QixHQUF3QyxVQUFTRCxPQUFULEVBQWlCO0FBQ3JELGVBQU9BLFVBQVVBLFVBQVUsS0FBS0QsTUFBekIsR0FBa0MsS0FBS0EsTUFBOUM7QUFDSCxLQUZEO0FBR0FELGtCQUFjcEYsU0FBZCxDQUF3QndGLFVBQXhCLEdBQXFDLFVBQVVDLHdCQUFWLEVBQW9DQyxjQUFwQyxFQUFvREMsTUFBcEQsRUFBNERDLFFBQTVELEVBQXNFQyxRQUF0RSxFQUFnRjtBQUNqSCxlQUFPLElBQVA7QUFDSCxLQUZEO0FBR0EsV0FBT1QsYUFBUDtBQUNILENBakJtQixFQUFwQjtBQWtCQWhDLFFBQVFnQyxhQUFSLEdBQXdCQSxhQUF4Qjs7QUFHQSxJQUFJVSxrQkFBbUIsVUFBVXhDLE1BQVYsRUFBa0I7QUFDckM3RCxjQUFVcUcsZUFBVixFQUEyQnhDLE1BQTNCO0FBQ0EsYUFBU3dDLGVBQVQsQ0FBeUIzRCxJQUF6QixFQUErQmtELE1BQS9CLEVBQXVDO0FBQ25DL0IsZUFBT0csSUFBUCxDQUFZLElBQVosRUFBa0J0QixJQUFsQixFQUF3QmtELE1BQXhCO0FBQ0g7O0FBRUQsV0FBT1MsZUFBUDtBQUNILENBUHFCLENBT25CVixhQVBtQixDQUF0QjtBQVFBaEMsUUFBUTBDLGVBQVIsR0FBMEJBLGVBQTFCOztBQUVBLElBQUlDLGVBQWdCLFVBQVV6QyxNQUFWLEVBQWtCO0FBQ2xDN0QsY0FBVXNHLFlBQVYsRUFBd0J6QyxNQUF4QjtBQUNBLGFBQVN5QyxZQUFULENBQXNCNUQsSUFBdEIsRUFBNEJrRCxNQUE1QixFQUFvQ1csWUFBcEMsRUFBaUR6QyxTQUFqRCxFQUE0RDtBQUN4REQsZUFBT0csSUFBUCxDQUFZLElBQVosRUFBa0J0QixJQUFsQixFQUF3QmtELE1BQXhCLEVBQStCVyxZQUEvQjs7QUFFQSxhQUFLekMsU0FBTCxHQUFpQkEsU0FBakI7QUFDSDtBQUNEd0MsaUJBQWEvRixTQUFiLENBQXVCc0IsT0FBdkIsR0FBaUMsWUFBWTtBQUN6Q0MsZ0JBQVFDLEdBQVIsQ0FBWSxnQkFBZ0IsS0FBS1csSUFBckIsR0FBNEIzQyxTQUE1QixHQUF3QyxLQUFLK0YsYUFBTCxDQUFtQixLQUFLRCxPQUF4QixDQUF4QyxHQUEyRSxNQUEzRSxHQUFvRixLQUFLL0IsU0FBckc7QUFDSCxLQUZEOztBQUlBd0MsaUJBQWEvRixTQUFiLENBQXVCa0MsbUJBQXZCLEdBQTZDLFlBQVc7QUFDcEQsWUFBSSxLQUFLcUIsU0FBTCxDQUFlMEMsT0FBZixDQUF1QixHQUF2QixLQUErQixDQUFDLENBQXBDLEVBQXdDO0FBQ3BDLG1CQUFPLEtBQUs5RCxJQUFMLEdBQVksR0FBWixHQUFrQixLQUFLb0IsU0FBOUI7QUFDSDs7QUFFRCxlQUFPLEtBQUtBLFNBQVo7QUFDSCxLQU5EOztBQVFBd0MsaUJBQWEvRixTQUFiLENBQXVCd0YsVUFBdkIsR0FBb0MsVUFBVUMsd0JBQVYsRUFBb0NDLGNBQXBDLEVBQW9EUSxhQUFwRCxFQUFtRVAsTUFBbkUsRUFBMkVDLFFBQTNFLEVBQXFGQyxRQUFyRixFQUErRjtBQUMvSCxZQUFJeEUsS0FBS29FLHlCQUF5QlUsZ0JBQXpCLENBQTBDLEtBQUs1QyxTQUEvQyxDQUFUOztBQUVBLFlBQUcsQ0FBQ2xDLEVBQUosRUFBUSxNQUFPLElBQUk4QixLQUFKLENBQVUsd0NBQXdDLEtBQUtJLFNBQXZELENBQVA7O0FBRVIsWUFBSTZDLGNBQWMvRSxHQUFHZ0YsWUFBSCxDQUFnQlQsUUFBaEIsRUFBMEJDLFFBQTFCLEVBQW1DLEtBQUtQLE9BQXhDLENBQWxCO0FBQ0EsWUFBSWdCLGlCQUFpQmpGLEdBQUdrRixxQkFBSCxDQUF5QlYsUUFBekIsRUFBbUNPLFdBQW5DLENBQXJCOztBQUVBLFlBQUlJLGtCQUFrQmQsZUFBZVksY0FBZixLQUFrQyxJQUF4RDs7QUFFQSxZQUFJRyxnQkFBZ0JwRixHQUFHbUUsVUFBSCxDQUFjQyx3QkFBZCxFQUF3Q0MsY0FBeEMsRUFBd0RRLGFBQXhELEVBQXVFTixRQUF2RSxFQUFpRkMsUUFBakYsRUFBMEYsS0FBS1AsT0FBL0YsQ0FBcEI7O0FBRUEsWUFBSW1CLGlCQUFpQixJQUFqQixJQUF5QkQsbUJBQW1CLElBQWhELEVBQ0k7O0FBRUpiLGVBQU8sS0FBS3hELElBQVosSUFBb0JzRSxhQUFwQjtBQUdILEtBbEJEO0FBbUJBLFdBQU9WLFlBQVA7QUFDSCxDQXZDa0IsQ0F1Q2hCWCxhQXZDZ0IsQ0FBbkI7QUF3Q0FoQyxRQUFRMkMsWUFBUixHQUF1QkEsWUFBdkI7O0FBRUEsSUFBSVcsdUJBQXdCLFVBQVVwRCxNQUFWLEVBQWtCO0FBQzFDN0QsY0FBVWlILG9CQUFWLEVBQWdDcEQsTUFBaEM7O0FBRUEsYUFBU29ELG9CQUFULENBQThCdkUsSUFBOUIsRUFBb0NrRCxNQUFwQyxFQUEyQ0MsT0FBM0MsRUFBb0QvQixTQUFwRCxFQUErRG9ELE1BQS9ELEVBQXVFQyxRQUF2RSxFQUFpRjtBQUM3RXRELGVBQU9HLElBQVAsQ0FBWSxJQUFaLEVBQWtCdEIsSUFBbEIsRUFBd0JrRCxNQUF4QixFQUErQkMsT0FBL0I7O0FBRUEsYUFBSy9CLFNBQUwsR0FBaUJBLFNBQWpCOztBQUVBLGFBQUtvRCxNQUFMLEdBQWNBLE1BQWQ7QUFDQSxhQUFLQyxRQUFMLEdBQWdCQSxRQUFoQjtBQUNIOztBQUVERix5QkFBcUIxRyxTQUFyQixDQUErQnNCLE9BQS9CLEdBQXlDLFlBQVk7QUFDakRDLGdCQUFRQyxHQUFSLENBQVksYUFBYSxLQUFLVyxJQUFsQixHQUF5QjNDLFNBQXpCLEdBQXFDLEtBQUs2RixNQUExQyxHQUFtRCxNQUFuRCxHQUE0RCxLQUFLOUIsU0FBN0U7QUFDSCxLQUZEOztBQUlBbUQseUJBQXFCMUcsU0FBckIsQ0FBK0J3RixVQUEvQixHQUE0QyxVQUFVQyx3QkFBVixFQUFvQ0MsY0FBcEMsRUFBb0RRLGFBQXBELEVBQW1FUCxNQUFuRSxFQUEyRUMsUUFBM0UsRUFBcUZDLFFBQXJGLEVBQStGO0FBQ3ZJLFlBQUl4RSxLQUFLb0UseUJBQXlCVSxnQkFBekIsQ0FBMEMsS0FBSzVDLFNBQS9DLENBQVQ7O0FBRUEsWUFBSTZDLGNBQWMvRSxHQUFHZ0YsWUFBSCxDQUFnQlQsUUFBaEIsRUFBMEJDLFFBQTFCLEVBQW1DLEtBQUtQLE9BQXhDLENBQWxCO0FBQ0EsWUFBSWdCLGlCQUFpQlQsV0FBV3JHLFNBQVgsR0FBdUI0RyxXQUE1Qzs7QUFFQSxZQUFJSSxrQkFBa0JkLGVBQWVZLGNBQWYsS0FBa0MsSUFBeEQ7O0FBRUEsWUFBSUcsZ0JBQWdCcEYsR0FBR21FLFVBQUgsQ0FBY0Msd0JBQWQsRUFBd0NDLGNBQXhDLEVBQXdEUSxhQUF4RCxFQUF1RU4sUUFBdkUsRUFBaUZDLFFBQWpGLEVBQTBGLEtBQUtQLE9BQS9GLENBQXBCOztBQUVBLFlBQUlLLE9BQU8sS0FBS3hELElBQVosS0FBcUIsSUFBekIsRUFBK0I7QUFDM0J3RCxtQkFBTyxLQUFLeEQsSUFBWixJQUFvQixFQUFwQjtBQUNIOztBQUVELFlBQUlzRSxpQkFBaUIsSUFBakIsSUFBeUJELG1CQUFtQixJQUFoRCxFQUNJOztBQUVKYixlQUFPLEtBQUt4RCxJQUFaLEVBQWtCcEIsSUFBbEIsQ0FBdUIwRixhQUF2QjtBQUNILEtBbEJEOztBQW9CQSxXQUFPQyxvQkFBUDtBQUVILENBdEMwQixDQXNDeEJ0QixhQXRDd0IsQ0FBM0I7QUF1Q0FoQyxRQUFRc0Qsb0JBQVIsR0FBK0JBLG9CQUEvQjs7QUFFQSxJQUFJRyxjQUFlLFVBQVV2RCxNQUFWLEVBQWtCO0FBQ2pDN0QsY0FBVW9ILFdBQVYsRUFBdUJ2RCxNQUF2QjtBQUNBLGFBQVN1RCxXQUFULENBQXFCNUYsRUFBckIsRUFBeUI2RixJQUF6QixFQUErQjVGLFVBQS9CLEVBQTJDO0FBQ3ZDb0MsZUFBT0csSUFBUCxDQUFZLElBQVosRUFBa0J4QyxFQUFsQixFQUFzQkMsVUFBdEI7QUFDQSxhQUFLNEYsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsYUFBS0MsWUFBTCxHQUFvQixFQUFwQjtBQUNBLGFBQUtDLGNBQUwsR0FBc0IsRUFBdEI7QUFDSDtBQUNESCxnQkFBWTdHLFNBQVosQ0FBc0JpSCxtQkFBdEIsR0FBNEMsVUFBVUMsYUFBVixFQUF5QjtBQUNqRSxhQUFLRixjQUFMLENBQW9CakcsSUFBcEIsQ0FBeUJtRyxhQUF6QjtBQUNILEtBRkQ7O0FBSUFMLGdCQUFZN0csU0FBWixDQUFzQm1ILHFCQUF0QixHQUE4QyxZQUFZO0FBQ3RELFlBQUlsQyxjQUFjLElBQWxCO0FBQ0EsWUFBSXhELENBQUo7QUFDQSxZQUFJMkYsWUFBWSxLQUFoQjtBQUNBLGFBQUszRixJQUFJLENBQVQsRUFBWUEsSUFBSSxLQUFLc0YsWUFBTCxDQUFrQjlFLE1BQWxDLEVBQTBDUixHQUExQyxFQUErQztBQUMzQ3dELDBCQUFjLEtBQUs4QixZQUFMLENBQWtCdEYsQ0FBbEIsQ0FBZDs7QUFFQSxnQkFBSXdELFlBQVk5QyxJQUFaLElBQW9CLElBQXhCLEVBQThCO0FBQzFCaUYsNEJBQVksSUFBWjtBQUNBO0FBQ0g7QUFDSjs7QUFFRCxZQUFHLENBQUNBLFNBQUosRUFBZTs7QUFFZixhQUFLSCxtQkFBTCxDQUF5QixJQUFJbkIsZUFBSixDQUFvQmIsWUFBWTlDLElBQWhDLEVBQXNDOEMsWUFBWU0sYUFBWixFQUF0QyxDQUF6QjtBQUNBLGFBQUt3QixZQUFMLENBQWtCTSxNQUFsQixDQUF5QjVGLENBQXpCLEVBQTRCLENBQTVCO0FBQ0gsS0FqQkQ7O0FBbUJBb0YsZ0JBQVk3RyxTQUFaLENBQXNCc0gsbUJBQXRCLEdBQTRDLFVBQVVDLGVBQVYsRUFBMkI7QUFDbkUsYUFBS0EsZUFBTCxHQUF1QkEsZUFBdkI7QUFDSCxLQUZEOztBQUlBVixnQkFBWTdHLFNBQVosQ0FBc0JvQixRQUF0QixHQUFpQyxVQUFVNkQsV0FBVixFQUF1QjtBQUNwRCxhQUFLOEIsWUFBTCxDQUFrQmhHLElBQWxCLENBQXVCa0UsV0FBdkI7QUFDSCxLQUZEOztBQUlBNEIsZ0JBQVk3RyxTQUFaLENBQXNCc0IsT0FBdEIsR0FBZ0MsWUFBWTtBQUN4QyxhQUFLLElBQUlHLENBQVQsSUFBYyxLQUFLdUYsY0FBbkIsRUFBbUM7QUFDL0IsZ0JBQUlRLFNBQVMsS0FBS1IsY0FBTCxDQUFvQnZGLENBQXBCLENBQWI7O0FBRUErRixtQkFBT2xHLE9BQVA7QUFDSDs7QUFFRCxhQUFLLElBQUlHLENBQVQsSUFBYyxLQUFLc0YsWUFBbkIsRUFBaUM7QUFDN0IsZ0JBQUk5QixjQUFjLEtBQUs4QixZQUFMLENBQWtCdEYsQ0FBbEIsQ0FBbEI7O0FBRUF3RCx3QkFBWTNELE9BQVo7QUFDSDs7QUFFRCxZQUFJLEtBQUtpRyxlQUFULEVBQ0ksS0FBS0EsZUFBTCxDQUFxQmpHLE9BQXJCO0FBQ1AsS0FmRDs7QUFpQkF1RixnQkFBWTdHLFNBQVosQ0FBc0J1RyxxQkFBdEIsR0FBOEMsVUFBU1YsUUFBVCxFQUFtQjRCLEtBQW5CLEVBQTBCO0FBQ3BFLFlBQUluQixpQkFBaUJtQixLQUFyQjs7QUFFQSxZQUFJNUIsUUFBSixFQUFlO0FBQ1hTLDZCQUFpQlQsV0FBV3JHLFNBQVgsR0FBdUJpSSxLQUF4QztBQUNIOztBQUVELGVBQU9uQixjQUFQO0FBQ0gsS0FSRDs7QUFVQU8sZ0JBQVk3RyxTQUFaLENBQXNCcUcsWUFBdEIsR0FBcUMsVUFBVVQsUUFBVixFQUFvQkMsUUFBcEIsRUFBNkJQLE9BQTdCLEVBQXNDO0FBQ3ZFLFlBQUltQyxRQUFRLEtBQUt2RixtQkFBTCxLQUE2QjFDLFNBQXpDOztBQUVBLFlBQUlrSSxlQUFlLEVBQW5COztBQUVBLGFBQUssSUFBSWpHLENBQVQsSUFBYyxLQUFLdUYsY0FBbkIsRUFBbUM7QUFDL0IsZ0JBQUkvQixjQUFjLEtBQUsrQixjQUFMLENBQW9CdkYsQ0FBcEIsQ0FBbEI7O0FBRUEsZ0JBQUlYLFFBQVE4RSxTQUFTWCxZQUFZTSxhQUFaLENBQTBCRCxPQUExQixDQUFULENBQVo7O0FBRUEsZ0JBQUl4RSxTQUFTLElBQWIsRUFBbUI7QUFDZjRHLGdDQUFnQjVHLEtBQWhCO0FBQ0gsYUFGRCxNQUVPO0FBQ0g7QUFDSDtBQUNKOztBQUVELFlBQUk0RyxnQkFBZ0IsRUFBcEIsRUFBd0I7QUFDcEIsbUJBQU8sSUFBUDtBQUNIOztBQUVERCxpQkFBU0MsWUFBVDs7QUFFQSxlQUFPRCxLQUFQO0FBQ0gsS0F4QkQ7O0FBMEJBWixnQkFBWTdHLFNBQVosQ0FBc0IySCxXQUF0QixHQUFvQyxVQUFVbEMsd0JBQVYsRUFBb0NtQyxTQUFwQyxFQUErQztBQUMvRSxZQUFJQyxVQUFVLEVBQWQ7QUFDQSxZQUFJbkMsaUJBQWlCLEVBQXJCO0FBQ0EsWUFBSVEsZ0JBQWdCLEVBQXBCOztBQUVBLGFBQUssSUFBSXpFLENBQVQsSUFBY21HLFNBQWQsRUFBeUI7QUFDckIsZ0JBQUloQyxXQUFXZ0MsVUFBVW5HLENBQVYsQ0FBZjs7QUFFQSxnQkFBSTJFLGNBQWMsS0FBS0MsWUFBTCxDQUFrQlQsUUFBbEIsRUFBNEIsRUFBNUIsQ0FBbEI7O0FBRUEsZ0JBQUlZLGtCQUFrQmQsZUFBZVUsV0FBZixLQUErQixJQUFyRDs7QUFFQSxnQkFBSVQsU0FBUyxLQUFLSCxVQUFMLENBQWdCQyx3QkFBaEIsRUFBMENDLGNBQTFDLEVBQTBEUSxhQUExRCxFQUF5RU4sUUFBekUsRUFBbUYsRUFBbkYsQ0FBYjs7QUFFQSxnQkFBSSxDQUFDWSxlQUFELElBQW9CYixNQUF4QixFQUFnQztBQUM1QmtDLHdCQUFROUcsSUFBUixDQUFhNEUsTUFBYjtBQUNILGFBRkQsTUFFTyxDQUNOO0FBQ0o7O0FBRUQsZUFBT2tDLE9BQVA7QUFDSCxLQXJCRDs7QUF1QkFoQixnQkFBWTdHLFNBQVosQ0FBc0J3RixVQUF0QixHQUFtQyxVQUFVQyx3QkFBVixFQUFvQ0MsY0FBcEMsRUFBb0RRLGFBQXBELEVBQW1FTixRQUFuRSxFQUE2RUMsUUFBN0UsRUFBc0ZQLE9BQXRGLEVBQStGO0FBQzlILFlBQUljLGNBQWMsS0FBS0MsWUFBTCxDQUFrQlQsUUFBbEIsRUFBNEJDLFFBQTVCLEVBQXFDUCxPQUFyQyxDQUFsQjtBQUNBLFlBQUlnQixpQkFBaUIsS0FBS0MscUJBQUwsQ0FBMkJWLFFBQTNCLEVBQXFDTyxXQUFyQyxDQUFyQjs7QUFFQSxZQUFJRixjQUFjRSxXQUFkLEtBQThCLElBQWxDLEVBQXlDO0FBQ3JDLG1CQUFPRixjQUFjRSxXQUFkLENBQVA7QUFDSDtBQUNELFlBQUlWLGVBQWVZLGNBQWYsS0FBa0MsSUFBdEMsRUFBNEM7QUFDeEMsZ0JBQUl3QixXQUFXcEMsZUFBZVksY0FBZixDQUFmOztBQUVBSiwwQkFBY0UsV0FBZCxJQUE2QjBCLFFBQTdCOztBQUVBLGlCQUFLQyxnQkFBTCxDQUFzQnRDLHdCQUF0QixFQUFnREMsY0FBaEQsRUFBZ0VRLGFBQWhFLEVBQStFNEIsUUFBL0UsRUFBeUZsQyxRQUF6RixFQUFtR1UsY0FBbkc7O0FBRUEsbUJBQU9KLGNBQWNFLFdBQWQsQ0FBUDtBQUNILFNBUkQsTUFRTztBQUNILGdCQUFJNEIsWUFBWSxLQUFLQyxnQkFBTCxDQUFzQnJDLFFBQXRCLEVBQStCTixPQUEvQixDQUFoQjtBQUFBLGdCQUNJNEMsVUFBVTlCLGVBQWVBLFlBQVl2RCxLQUFaLENBQWtCckQsU0FBbEIsRUFBNkIsQ0FBN0IsQ0FEN0I7O0FBR0EsZ0JBQUkySSxRQUFRMUMseUJBQXlCMkMsWUFBekIsQ0FBc0NKLFNBQXRDLENBQVo7O0FBRUFHLG9CQUFRQSxNQUFNSCxTQUFOLENBQVI7O0FBRUEsZ0JBQUlHLFNBQVMsSUFBYixFQUFtQjtBQUNsQi9JLHVCQUFPOEQsS0FBUCxDQUFhLFdBQVc4RSxTQUFYLEdBQXVCLEdBQXZCLEdBQTZCQSxTQUE3QixHQUF5QyxrQkFBdEQ7QUFDRyxzQkFBTSxJQUFJN0UsS0FBSixDQUFVLFlBQVk2RSxTQUFaLEdBQXdCLEdBQXhCLEdBQThCQSxTQUE5QixHQUEwQyxpQkFBcEQsQ0FBTjtBQUNIOztBQUVELGdCQUFJRixXQUFXTyxPQUFPQyxNQUFQLENBQWNILE1BQU1uSSxTQUFwQixDQUFmO0FBQ0E4SCxxQkFBUy9ILFdBQVQsQ0FBcUJ3SSxLQUFyQixDQUEyQlQsUUFBM0IsRUFBcUMsRUFBckM7O0FBRUEsZ0JBQUlVLG1CQUFtQixLQUF2Qjs7QUFFQSxnQkFBR3BDLFdBQUgsRUFDSUYsY0FBY0UsV0FBZCxJQUE2QjBCLFFBQTdCOztBQUVKVSwrQkFBbUIsS0FBS0MsMEJBQUwsQ0FBZ0NYLFFBQWhDLEVBQTBDbEMsUUFBMUMsRUFBbUROLE9BQW5ELENBQW5CO0FBQ0EsZ0JBQUljLGVBQWUsSUFBbkIsRUFBMEI7QUFDdEJvQyxtQ0FBbUIsS0FBS1QsZ0JBQUwsQ0FBc0J0Qyx3QkFBdEIsRUFBZ0RDLGNBQWhELEVBQWdFUSxhQUFoRSxFQUErRTRCLFFBQS9FLEVBQXlGbEMsUUFBekYsRUFBbUdVLGNBQW5HLEtBQXNIa0MsZ0JBQXpJO0FBQ0g7O0FBRUQsbUJBQU90QyxjQUFjRSxXQUFkLENBQVA7O0FBRUEsZ0JBQUksQ0FBQ29DLGdCQUFELElBQXNCTixXQUFZSixTQUFTN0csRUFBckIsSUFBMkJpSCxXQUFXSixTQUFTN0csRUFBVCxDQUFZdUQsUUFBWixFQUFoRSxFQUNJLE9BQU8sSUFBUDs7QUFFSixnQkFBSThCLGtCQUFrQmtDLGdCQUFsQixJQUFzQ1YsU0FBUzdHLEVBQVQsSUFBZSxJQUFyRCxJQUE2RHFGLGVBQWVMLE9BQWYsQ0FBdUIsTUFBdkIsSUFBaUMsQ0FBbEcsRUFDSVAsZUFBZVksY0FBZixJQUFpQ3dCLFFBQWpDO0FBRVA7O0FBRUQsZUFBT0EsUUFBUDtBQUNILEtBcEREOztBQXNEQWpCLGdCQUFZN0csU0FBWixDQUFzQmlJLGdCQUF0QixHQUF5QyxVQUFTckMsUUFBVCxFQUFrQk4sT0FBbEIsRUFBMEI7QUFDL0QsWUFBSW9ELE1BQUo7QUFDQSxZQUFHLENBQUMsS0FBS25CLGVBQVQsRUFBeUI7QUFDckJtQixxQkFBUyxLQUFLNUIsSUFBZDtBQUNILFNBRkQsTUFFTzs7QUFFSCxnQkFBSTZCLFlBQVkvQyxTQUFTLEtBQUsyQixlQUFMLENBQXFCaEMsYUFBckIsQ0FBbUNELE9BQW5DLENBQVQsQ0FBaEI7O0FBRUEsaUJBQUksSUFBSTdELENBQVIsSUFBYSxLQUFLOEYsZUFBTCxDQUFxQnFCLEtBQWxDLEVBQXdDO0FBQ3BDLG9CQUFHLEtBQUtyQixlQUFMLENBQXFCcUIsS0FBckIsQ0FBMkJuSCxDQUEzQixFQUE4QlgsS0FBOUIsSUFBcUM2SCxTQUF4QyxFQUNJRCxTQUFTLEtBQUtuQixlQUFMLENBQXFCcUIsS0FBckIsQ0FBMkJuSCxDQUEzQixFQUE4QnFGLElBQXZDO0FBQ1A7O0FBRUQsZ0JBQUcsQ0FBQzRCLE1BQUosRUFBWUEsU0FBUyxLQUFLNUIsSUFBZDtBQUNmOztBQUVELGVBQVM0QixPQUFPRyxTQUFQLENBQWlCSCxPQUFPSSxXQUFQLENBQW1CLEdBQW5CLElBQTBCLENBQTNDLENBQVQ7QUFDSCxLQWpCRDtBQWtCQWpDLGdCQUFZN0csU0FBWixDQUFzQitILGdCQUF0QixHQUF5QyxVQUFVdEMsd0JBQVYsRUFBb0NDLGNBQXBDLEVBQW9EUSxhQUFwRCxFQUFtRTRCLFFBQW5FLEVBQTZFbEMsUUFBN0UsRUFBdUZRLFdBQXZGLEVBQW9HO0FBQ3pJLFlBQUkyQyxpQkFBaUIsS0FBckI7O0FBRUEsYUFBSyxJQUFJdEgsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUtzRixZQUFMLENBQWtCOUUsTUFBdEMsRUFBOENSLEdBQTlDLEVBQW1EO0FBQy9DLGdCQUFJd0QsY0FBYyxLQUFLOEIsWUFBTCxDQUFrQnRGLENBQWxCLENBQWxCOztBQUVBLGdCQUFLd0QsdUJBQXVCeUIsb0JBQXhCLElBQWlELEtBQWpELElBQTJEekIsdUJBQXVCYyxZQUF4QixJQUF5QyxLQUF2RyxFQUE4RztBQUMxRztBQUNIOztBQUVELGdCQUFJSixTQUFTVixZQUFZTyxVQUFaLENBQXVCQyx3QkFBdkIsRUFBaURDLGNBQWpELEVBQWlFUSxhQUFqRSxFQUFnRjRCLFFBQWhGLEVBQTBGbEMsUUFBMUYsRUFBb0dRLFdBQXBHLENBQWI7O0FBRUEyQyw2QkFBaUJBLGtCQUFtQnBELFVBQVUsSUFBOUM7QUFDSDs7QUFFRCxlQUFPb0QsY0FBUDtBQUNILEtBaEJEOztBQWtCQWxDLGdCQUFZN0csU0FBWixDQUFzQnlJLDBCQUF0QixHQUFtRCxVQUFVWCxRQUFWLEVBQW1CbEMsUUFBbkIsRUFBNEJOLE9BQTVCLEVBQXFDO0FBQ3BGLFlBQUlrRCxtQkFBbUIsS0FBdkI7QUFDQSxhQUFLLElBQUlRLENBQVQsSUFBYyxLQUFLaEMsY0FBbkIsRUFBbUM7QUFDL0IsZ0JBQUlRLFNBQVMsS0FBS1IsY0FBTCxDQUFvQmdDLENBQXBCLENBQWI7O0FBRUEsZ0JBQUlsSSxRQUFROEUsU0FBUzRCLE9BQU9qQyxhQUFQLENBQXFCRCxPQUFyQixDQUFULENBQVo7O0FBRUEsZ0JBQUl4RSxpQkFBaUJtSSxNQUFyQixFQUE2QjtBQUN6QixvQkFBSW5JLE1BQU1tQixNQUFOLElBQWdCLENBQXBCLEVBQXVCO0FBQ25CLHdCQUFJbkIsTUFBTSxDQUFOLEtBQVksQ0FBaEIsRUFBbUI7QUFDZkEsZ0NBQVEsS0FBUjtBQUNILHFCQUZELE1BRU87QUFDSEEsZ0NBQVEsSUFBUjtBQUNIO0FBQ0o7QUFDSjs7QUFFRGdILHFCQUFTTixPQUFPckYsSUFBaEIsSUFBd0JyQixLQUF4Qjs7QUFFQSxnQkFBSUEsS0FBSixFQUNJMEgsbUJBQW1CLElBQW5CO0FBQ1A7O0FBRUQsYUFBSyxJQUFJUSxDQUFULElBQWMsS0FBS2pDLFlBQW5CLEVBQWlDO0FBQzdCLGdCQUFJOUIsY0FBYyxLQUFLOEIsWUFBTCxDQUFrQmlDLENBQWxCLENBQWxCOztBQUVBLGdCQUFJL0QsdUJBQXVCeUIsb0JBQTNCLEVBQWlEO0FBQzdDO0FBQ0gsYUFGRCxNQUVPLElBQUl6Qix1QkFBdUJjLFlBQTNCLEVBQXlDO0FBQzVDO0FBQ0g7O0FBRUQsZ0JBQUlqRixRQUFROEUsU0FBU1gsWUFBWU0sYUFBWixDQUEwQkQsT0FBMUIsQ0FBVCxDQUFaOztBQUVBLGdCQUFJeEUsaUJBQWlCbUksTUFBckIsRUFBNkI7QUFDekIsb0JBQUluSSxNQUFNbUIsTUFBTixJQUFnQixDQUFwQixFQUF1QjtBQUNuQix3QkFBSW5CLE1BQU0sQ0FBTixLQUFZLENBQWhCLEVBQW1CO0FBQ2ZBLGdDQUFRLEtBQVI7QUFDSCxxQkFGRCxNQUVPO0FBQ0hBLGdDQUFRLElBQVI7QUFDSDtBQUNKO0FBQ0o7O0FBRURnSCxxQkFBUzdDLFlBQVk5QyxJQUFyQixJQUE2QnJCLEtBQTdCOztBQUVBLGdCQUFJQSxLQUFKLEVBQ0kwSCxtQkFBbUIsSUFBbkI7QUFDUDs7QUFFRCxlQUFPQSxnQkFBUDtBQUNILEtBbkREO0FBb0RBLFdBQU8zQixXQUFQO0FBQ0gsQ0FsUWlCLENBa1FmN0YsRUFsUWUsQ0FBbEI7QUFtUUFvQyxRQUFReUQsV0FBUixHQUFzQkEsV0FBdEI7O0FBRUEsSUFBSXFDLGtCQUFtQixZQUFZO0FBQy9CLGFBQVNBLGVBQVQsQ0FBeUJ0QyxRQUF6QixFQUFtQ3ZCLE1BQW5DLEVBQTJDO0FBQ3ZDLGFBQUt1QixRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLGFBQUt2QixNQUFMLEdBQWNBLE1BQWQ7O0FBRUEsYUFBS3VELEtBQUwsR0FBYSxFQUFiO0FBQ0g7QUFDRE0sb0JBQWdCbEosU0FBaEIsQ0FBMEJvQixRQUExQixHQUFxQyxVQUFVK0gsbUJBQVYsRUFBK0I7QUFDaEUsYUFBS1AsS0FBTCxDQUFXN0gsSUFBWCxDQUFnQm9JLG1CQUFoQjtBQUNILEtBRkQ7O0FBSUFELG9CQUFnQmxKLFNBQWhCLENBQTBCc0IsT0FBMUIsR0FBb0MsWUFBWTtBQUMvQ2xDLGVBQU9nSyxJQUFQLENBQVksbUJBQW1CLEtBQUt4QyxRQUF4QixHQUFtQyxHQUFuQyxHQUF5QyxLQUFLdkIsTUFBOUMsR0FBdUQsR0FBbkU7QUFDRzlELGdCQUFRQyxHQUFSLENBQVksbUJBQW1CLEtBQUtvRixRQUF4QixHQUFtQyxHQUFuQyxHQUF5QyxLQUFLdkIsTUFBOUMsR0FBdUQsR0FBbkU7O0FBRUEsYUFBSyxJQUFJNUQsQ0FBVCxJQUFjLEtBQUttSCxLQUFuQixFQUEwQjtBQUN0QixnQkFBSVMsU0FBUyxLQUFLVCxLQUFMLENBQVduSCxDQUFYLENBQWI7O0FBRUE0SCxtQkFBTy9ILE9BQVA7QUFDSDtBQUNKLEtBVEQ7O0FBV0E0SCxvQkFBZ0JsSixTQUFoQixDQUEwQnVGLGFBQTFCLEdBQTBDLFVBQVNELE9BQVQsRUFBaUI7QUFDdkQsZUFBT0EsVUFBVUEsVUFBVSxLQUFLRCxNQUF6QixHQUFrQyxLQUFLQSxNQUE5QztBQUNILEtBRkQ7O0FBSUEsV0FBTzZELGVBQVA7QUFDSCxDQTNCcUIsRUFBdEI7QUE0QkE5RixRQUFROEYsZUFBUixHQUEwQkEsZUFBMUI7O0FBRUEsSUFBSUksc0JBQXVCLFlBQVk7QUFDbkMsYUFBU0EsbUJBQVQsQ0FBNkJ4SSxLQUE3QixFQUFvQ2dHLElBQXBDLEVBQTBDO0FBQ3RDLGFBQUtoRyxLQUFMLEdBQWFBLEtBQWI7QUFDQSxhQUFLZ0csSUFBTCxHQUFZQSxJQUFaO0FBQ0g7QUFDRHdDLHdCQUFvQnRKLFNBQXBCLENBQThCc0IsT0FBOUIsR0FBd0MsWUFBWTtBQUNuRGxDLGVBQU9nSyxJQUFQLENBQVksWUFBWSxLQUFLdEksS0FBakIsR0FBeUIsR0FBekIsR0FBK0IsS0FBS2dHLElBQXBDLEdBQTJDLEdBQXZEO0FBQ0d2RixnQkFBUUMsR0FBUixDQUFZLFlBQVksS0FBS1YsS0FBakIsR0FBeUIsR0FBekIsR0FBK0IsS0FBS2dHLElBQXBDLEdBQTJDLEdBQXZEO0FBQ0gsS0FIRDtBQUlBLFdBQU93QyxtQkFBUDtBQUNILENBVnlCLEVBQTFCO0FBV0FsRyxRQUFRa0csbUJBQVIsR0FBOEJBLG1CQUE5Qjs7QUFFQSxJQUFJQyxZQUFhLFlBQVk7QUFDekIsYUFBU0EsU0FBVCxHQUFxQixDQUNwQjtBQUNEQSxjQUFVdkosU0FBVixDQUFvQndKLG1CQUFwQixHQUEwQyxVQUFVQyxLQUFWLEVBQWlCQyxXQUFqQixFQUE4QjtBQUNwRSxZQUFJQyxrQkFBa0IsSUFBSVQsZUFBSixDQUFvQk8sTUFBTUcsZ0JBQU4sQ0FBdUIsVUFBdkIsRUFBbUNDLEtBQXZELEVBQThESixNQUFNRyxnQkFBTixDQUF1QixRQUF2QixFQUFpQ0MsS0FBL0YsQ0FBdEI7O0FBRUEsYUFBSyxJQUFJcEksSUFBSSxDQUFiLEVBQWdCQSxJQUFJZ0ksTUFBTUssVUFBTixDQUFpQjdILE1BQXJDLEVBQTZDUixHQUE3QyxFQUFrRDtBQUM5QyxnQkFBSUosS0FBS29JLE1BQU1LLFVBQU4sQ0FBaUJySSxDQUFqQixDQUFUOztBQUVBLGdCQUFJSixHQUFHMEksUUFBSCxJQUFlLE1BQW5CLEVBQTJCO0FBQ3ZCLG9CQUFJakosUUFBUU8sR0FBR3VJLGdCQUFILENBQW9CLE9BQXBCLEVBQTZCQyxLQUF6QztBQUNBLG9CQUFJL0MsT0FBT3pGLEdBQUd1SSxnQkFBSCxDQUFvQixZQUFwQixFQUFrQ0MsS0FBN0M7O0FBRUEsb0JBQUlSLFNBQVMsSUFBSUMsbUJBQUosQ0FBd0J4SSxLQUF4QixFQUErQmdHLElBQS9CLENBQWI7O0FBRUE2QyxnQ0FBZ0J2SSxRQUFoQixDQUF5QmlJLE1BQXpCO0FBQ0g7QUFDSjs7QUFFRCxlQUFPTSxlQUFQO0FBQ0gsS0FqQkQ7O0FBbUJBSixjQUFVdkosU0FBVixDQUFvQmdLLHVCQUFwQixHQUE4QyxVQUFVM0ksRUFBVixFQUFjcUksV0FBZCxFQUEyQjtBQUNyRSxZQUFJTyxpQkFBaUI1SSxHQUFHdUksZ0JBQUgsQ0FBb0IsUUFBcEIsQ0FBckI7QUFDQSxZQUFJTSxjQUFjLEVBQWxCOztBQUVBLFlBQUlELGNBQUosRUFDSUMsY0FBY0QsZUFBZUosS0FBN0I7O0FBRUosWUFBSXRHLFlBQVlsQyxHQUFHdUksZ0JBQUgsQ0FBb0IsV0FBcEIsRUFBaUNDLEtBQWpEOztBQUVBLFlBQUl0RyxVQUFVMEMsT0FBVixDQUFrQixHQUFsQixLQUEwQixDQUFDLENBQS9CLEVBQW1DO0FBQy9CMUMsd0JBQVltRyxZQUFZeEksVUFBWixDQUF1QmlCLElBQXZCLEdBQThCLEdBQTlCLEdBQW9Db0IsU0FBaEQ7QUFDSDs7QUFFRCxZQUFJeUMsZUFBZSxJQUFuQjs7QUFFQSxZQUFHM0UsR0FBR3VJLGdCQUFILENBQW9CLGNBQXBCLENBQUgsRUFDSTVELGVBQWUzRSxHQUFHdUksZ0JBQUgsQ0FBb0IsY0FBcEIsRUFBb0NDLEtBQW5EOztBQUVKSCxvQkFBWXRJLFFBQVosQ0FBcUIsSUFBSTJFLFlBQUosQ0FBaUIxRSxHQUFHdUksZ0JBQUgsQ0FBb0IsVUFBcEIsRUFBZ0NDLEtBQWpELEVBQXdESyxXQUF4RCxFQUFvRWxFLFlBQXBFLEVBQWtGekMsU0FBbEYsQ0FBckI7QUFDSCxLQW5CRDs7QUFxQkFnRyxjQUFVdkosU0FBVixDQUFvQm1LLHNCQUFwQixHQUE2QyxVQUFVOUksRUFBVixFQUFjcUksV0FBZCxFQUEyQjtBQUNwRSxZQUFJVSxpQkFBaUIsRUFBckI7O0FBRUEsWUFBSS9JLEdBQUd1SSxnQkFBSCxDQUFvQixXQUFwQixDQUFKLEVBQXNDO0FBQ2xDUSw2QkFBaUIvSSxHQUFHdUksZ0JBQUgsQ0FBb0IsV0FBcEIsRUFBaUNDLEtBQWxEO0FBQ0g7O0FBRUQsWUFBSVEsY0FBYyxFQUFsQjs7QUFFQSxZQUFJaEosR0FBR3VJLGdCQUFILENBQW9CLFFBQXBCLENBQUosRUFBbUM7QUFDL0JTLDBCQUFjaEosR0FBR3VJLGdCQUFILENBQW9CLFFBQXBCLEVBQThCQyxLQUE1QztBQUNIOztBQUVELFlBQUlLLGNBQWMsRUFBbEI7QUFDQSxZQUFJN0ksR0FBR3VJLGdCQUFILENBQW9CLFFBQXBCLENBQUosRUFDSU0sY0FBYzdJLEdBQUd1SSxnQkFBSCxDQUFvQixRQUFwQixFQUE4QkMsS0FBNUM7O0FBRUosWUFBSVMsZ0JBQWdCLEVBQXBCO0FBQ0EsWUFBSWpKLEdBQUd1SSxnQkFBSCxDQUFvQixVQUFwQixDQUFKLEVBQ0lVLGdCQUFnQmpKLEdBQUd1SSxnQkFBSCxDQUFvQixVQUFwQixFQUFnQ0MsS0FBaEQ7O0FBRUosWUFBSTdELGVBQWUsSUFBbkI7O0FBRUEsWUFBRzNFLEdBQUd1SSxnQkFBSCxDQUFvQixjQUFwQixDQUFILEVBQ0k1RCxlQUFlM0UsR0FBR3VJLGdCQUFILENBQW9CLGNBQXBCLEVBQW9DQyxLQUFuRDs7QUFFSkgsb0JBQVl0SSxRQUFaLENBQXFCLElBQUlzRixvQkFBSixDQUF5QnJGLEdBQUd1SSxnQkFBSCxDQUFvQixVQUFwQixFQUFnQ0MsS0FBekQsRUFBZ0VLLFdBQWhFLEVBQTZFbEUsWUFBN0UsRUFBMEZvRSxjQUExRixFQUEwR0MsV0FBMUcsRUFBdUhDLGFBQXZILENBQXJCO0FBQ0gsS0EzQkQ7O0FBNkJBZixjQUFVdkosU0FBVixDQUFvQnVLLGtCQUFwQixHQUF5QyxVQUFVbEosRUFBVixFQUFjcUksV0FBZCxFQUEyQjtBQUNoRSxZQUFJNUMsT0FBTyxFQUFYOztBQUVBNEMsb0JBQVl0SSxRQUFaLENBQXFCLElBQUlnRSxhQUFKLENBQWtCL0QsR0FBR3VJLGdCQUFILENBQW9CLFVBQXBCLEVBQWdDQyxLQUFsRCxFQUF5RHhJLEdBQUd1SSxnQkFBSCxDQUFvQixRQUFwQixFQUE4QkMsS0FBdkYsQ0FBckI7QUFDSCxLQUpEOztBQU1BTixjQUFVdkosU0FBVixDQUFvQndLLGFBQXBCLEdBQW9DLFVBQVVySSxJQUFWLEVBQWdCc0ksY0FBaEIsRUFBZ0N2SixVQUFoQyxFQUE0QztBQUM1RSxZQUFJd0osU0FBU0QsZUFBZWIsZ0JBQWYsQ0FBZ0MsSUFBaEMsRUFBc0NDLEtBQW5EO0FBQ0EsWUFBSS9DLE9BQU8yRCxlQUFlYixnQkFBZixDQUFnQyxNQUFoQyxFQUF3Q0MsS0FBbkQ7O0FBRUEsWUFBSUgsY0FBYyxJQUFJN0MsV0FBSixDQUFnQjZELE1BQWhCLEVBQXdCNUQsSUFBeEIsRUFBOEI1RixVQUE5QixDQUFsQjs7QUFFQSxZQUFJeUosc0JBQXNCLEtBQTFCO0FBQ0EsYUFBSyxJQUFJbEosSUFBSSxDQUFiLEVBQWdCQSxJQUFJZ0osZUFBZVgsVUFBZixDQUEwQjdILE1BQTlDLEVBQXNEUixHQUF0RCxFQUEyRDtBQUN2RCxnQkFBSUosS0FBS29KLGVBQWVYLFVBQWYsQ0FBMEJySSxDQUExQixDQUFUOztBQUVBLGdCQUFJSixHQUFHMEksUUFBSCxJQUFlLElBQW5CLEVBQXlCO0FBQ3JCLG9CQUFJN0MsZ0JBQWdCLElBQUlwQixlQUFKLENBQW9CekUsR0FBR3VJLGdCQUFILENBQW9CLFVBQXBCLEVBQWdDQyxLQUFwRCxFQUEyRHhJLEdBQUd1SSxnQkFBSCxDQUFvQixRQUFwQixFQUE4QkMsS0FBekYsQ0FBcEI7O0FBRUFILDRCQUFZekMsbUJBQVosQ0FBZ0NDLGFBQWhDO0FBQ0F5RCxzQ0FBc0IsSUFBdEI7QUFDSCxhQUxELE1BS08sSUFBSXRKLEdBQUcwSSxRQUFILElBQWUsUUFBbkIsRUFBNkI7QUFDaEMscUJBQUtRLGtCQUFMLENBQXdCbEosRUFBeEIsRUFBNEJxSSxXQUE1QjtBQUNILGFBRk0sTUFFQSxJQUFJckksR0FBRzBJLFFBQUgsSUFBZSxhQUFuQixFQUFrQztBQUNyQyxxQkFBS0MsdUJBQUwsQ0FBNkIzSSxFQUE3QixFQUFpQ3FJLFdBQWpDO0FBQ0gsYUFGTSxNQUVBLElBQUlySSxHQUFHMEksUUFBSCxJQUFlLFlBQW5CLEVBQWlDO0FBQ3BDLHFCQUFLSSxzQkFBTCxDQUE0QjlJLEVBQTVCLEVBQWdDcUksV0FBaEM7QUFDSCxhQUZNLE1BRUEsSUFBSXJJLEdBQUcwSSxRQUFILElBQWUsZUFBbkIsRUFBb0M7QUFDdkMsb0JBQUlKLGtCQUFrQixLQUFLSCxtQkFBTCxDQUF5Qm5JLEVBQXpCLEVBQTZCcUksV0FBN0IsQ0FBdEI7O0FBRUFBLDRCQUFZcEMsbUJBQVosQ0FBZ0NxQyxlQUFoQztBQUNIO0FBQ0o7O0FBRUQsWUFBSSxDQUFDZ0IsbUJBQUwsRUFBMEI7QUFDdEJqQix3QkFBWXZDLHFCQUFaO0FBQ0g7O0FBRUQsZUFBT3VDLFdBQVA7QUFDSCxLQWpDRDs7QUFtQ0FILGNBQVV2SixTQUFWLENBQW9CNEssSUFBcEIsR0FBMkIsVUFBVXpJLElBQVYsRUFBZ0IwSSxNQUFoQixFQUF3QjNKLFVBQXhCLEVBQW9DO0FBQzNELFlBQUkySixPQUFPZCxRQUFQLElBQW1CLFdBQXZCLEVBQW9DO0FBQ2hDLG1CQUFPLEtBQUtTLGFBQUwsQ0FBbUJySSxJQUFuQixFQUF5QjBJLE1BQXpCLEVBQWlDM0osVUFBakMsQ0FBUDtBQUNIOztBQUVELFlBQUl3SixTQUFTRyxPQUFPakIsZ0JBQVAsQ0FBd0IsSUFBeEIsRUFBOEJDLEtBQTNDOztBQUVBLFlBQUlpQixTQUFKO0FBQ0EsWUFBSUQsT0FBT2QsUUFBUCxJQUFtQixRQUF2QixFQUFpQztBQUM3QixnQkFBSUwsY0FBY21CLE9BQU9qQixnQkFBUCxDQUF3QixXQUF4QixDQUFsQjtBQUNBLGdCQUFJUSxpQkFBaUIsRUFBckI7QUFDQSxnQkFBSVYsV0FBSixFQUNJVSxpQkFBaUJWLFlBQVlHLEtBQTdCOztBQUVKLGdCQUFJa0IsYUFBYUYsT0FBT2pCLGdCQUFQLENBQXdCLFlBQXhCLENBQWpCO0FBQ0EsZ0JBQUlvQixnQkFBZ0IsRUFBcEI7QUFDQSxnQkFBSUQsVUFBSixFQUNJQyxnQkFBZ0JELFdBQVdsQixLQUEzQjs7QUFFSmlCLHdCQUFZLElBQUl6SCxRQUFKLENBQWFxSCxNQUFiLEVBQXFCTixjQUFyQixFQUFxQ1ksYUFBckMsRUFBb0Q5SixVQUFwRCxDQUFaO0FBQ0gsU0FaRCxNQVlPO0FBQ0g0Six3QkFBWSxJQUFJOUosRUFBSixDQUFPMEosTUFBUCxFQUFleEosVUFBZixDQUFaO0FBQ0g7O0FBRUQsYUFBSyxJQUFJTyxJQUFJLENBQWIsRUFBZ0JBLElBQUlvSixPQUFPZixVQUFQLENBQWtCN0gsTUFBdEMsRUFBOENSLEdBQTlDLEVBQW1EO0FBQy9DLGdCQUFJSixLQUFLd0osT0FBT2YsVUFBUCxDQUFrQnJJLENBQWxCLENBQVQ7O0FBRUEsZ0JBQUlKLEdBQUcwSSxRQUFILElBQWUsUUFBbkIsRUFBNkI7QUFDekIscUJBQUtrQixVQUFMLENBQWdCLFFBQWhCLEVBQTBCNUosRUFBMUIsRUFBOEJ5SixTQUE5QixFQUF5QzVKLFVBQXpDO0FBQ0gsYUFGRCxNQUVPLElBQUlHLEdBQUcwSSxRQUFILElBQWUsSUFBbkIsRUFBeUI7QUFDNUIscUJBQUttQixNQUFMLENBQVksUUFBWixFQUFzQjdKLEVBQXRCLEVBQTBCeUosU0FBMUIsRUFBcUM1SixVQUFyQztBQUNILGFBRk0sTUFFQSxJQUFJRyxHQUFHMEksUUFBSCxJQUFlLFNBQW5CLEVBQThCO0FBQ2pDLHFCQUFLb0IsV0FBTCxDQUFpQixTQUFqQixFQUE0QjlKLEVBQTVCLEVBQWdDeUosU0FBaEMsRUFBMkM1SixVQUEzQztBQUNILGFBRk0sTUFFQTtBQUNILG9CQUFJRyxHQUFHK0osYUFBSCxNQUFzQixLQUExQixFQUFpQztBQUM3Qix3QkFBSUMsV0FBVyxJQUFJM0gsUUFBSixDQUFhckMsR0FBR2lLLFdBQWhCLEVBQTZCcEssVUFBN0IsQ0FBZjs7QUFFQTRKLDhCQUFVMUosUUFBVixDQUFtQmlLLFFBQW5CO0FBQ0g7QUFDSjtBQUNKOztBQUVELGVBQU9QLFNBQVA7QUFDSCxLQTNDRDs7QUE2Q0F2QixjQUFVdkosU0FBVixDQUFvQm1MLFdBQXBCLEdBQWtDLFVBQVVoSixJQUFWLEVBQWdCZCxFQUFoQixFQUFvQmtLLFdBQXBCLEVBQWlDckssVUFBakMsRUFBNkM7QUFDM0UsWUFBSXNLLGlCQUFpQixFQUFyQjtBQUNBLFlBQUluSyxHQUFHdUksZ0JBQUgsQ0FBb0IsV0FBcEIsQ0FBSixFQUFzQztBQUNsQzRCLDZCQUFpQm5LLEdBQUd1SSxnQkFBSCxDQUFvQixXQUFwQixFQUFpQ0MsS0FBbEQ7QUFDSDs7QUFFRCxZQUFJNEIsZ0JBQWdCLEVBQXBCO0FBQ0EsWUFBSXBLLEdBQUd1SSxnQkFBSCxDQUFvQixNQUFwQixDQUFKLEVBQWlDO0FBQzdCNkIsNEJBQWdCcEssR0FBR3VJLGdCQUFILENBQW9CLE1BQXBCLEVBQTRCQyxLQUE1QztBQUNIOztBQUVELFlBQUk2QixrQkFBa0IsRUFBdEI7QUFDQSxZQUFJckssR0FBR3VJLGdCQUFILENBQW9CLE9BQXBCLENBQUosRUFBa0M7QUFDOUI4Qiw4QkFBa0JySyxHQUFHdUksZ0JBQUgsQ0FBb0IsT0FBcEIsRUFBNkJDLEtBQS9DO0FBQ0g7O0FBRUQsWUFBSThCLGFBQWEsRUFBakI7QUFDQSxZQUFJdEssR0FBR3VJLGdCQUFILENBQW9CLE9BQXBCLENBQUosRUFBa0M7QUFDOUIrQix5QkFBYXRLLEdBQUd1SSxnQkFBSCxDQUFvQixPQUFwQixFQUE2QkMsS0FBMUM7QUFDSDs7QUFFRCxZQUFJK0Isa0JBQWtCLEVBQXRCO0FBQ0EsWUFBSXZLLEdBQUd1SSxnQkFBSCxDQUFvQixZQUFwQixDQUFKLEVBQXVDO0FBQ25DZ0MsOEJBQWtCdkssR0FBR3VJLGdCQUFILENBQW9CLFlBQXBCLEVBQWtDQyxLQUFwRDtBQUNIOztBQUVELFlBQUlnQyxZQUFZLElBQUlwSCxTQUFKLENBQWNwRCxHQUFHdUksZ0JBQUgsQ0FBb0IsTUFBcEIsRUFBNEJDLEtBQTFDLEVBQWlEOEIsVUFBakQsRUFBNkRILGNBQTdELEVBQTZFQyxhQUE3RSxFQUNaQyxlQURZLEVBQ0tySyxHQUFHaUssV0FEUixFQUNxQk0sZUFEckIsRUFDc0MxSyxVQUR0QyxDQUFoQjs7QUFHQXFLLG9CQUFZbkssUUFBWixDQUFxQnlLLFNBQXJCO0FBQ0gsS0E5QkQ7O0FBZ0NBdEMsY0FBVXZKLFNBQVYsQ0FBb0JrTCxNQUFwQixHQUE2QixVQUFVL0ksSUFBVixFQUFnQmQsRUFBaEIsRUFBb0JrSyxXQUFwQixFQUFpQ3JLLFVBQWpDLEVBQTZDO0FBQ3RFLFlBQUk0SyxPQUFPLElBQUkzRyxJQUFKLENBQVM5RCxHQUFHdUksZ0JBQUgsQ0FBb0IsTUFBcEIsRUFBNEJDLEtBQXJDLEVBQTRDeEksR0FBR3lJLFVBQUgsQ0FBYyxDQUFkLEVBQWlCdEYsUUFBakIsRUFBNUMsRUFBeUV0RCxVQUF6RSxDQUFYOztBQUVBLGFBQUssSUFBSU8sSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixHQUFHeUksVUFBSCxDQUFjN0gsTUFBbEMsRUFBMENSLEdBQTFDLEVBQStDO0FBQzNDLGdCQUFJQyxVQUFVTCxHQUFHeUksVUFBSCxDQUFjckksQ0FBZCxDQUFkOztBQUVBLGdCQUFJQyxRQUFRcUksUUFBUixJQUFvQixRQUF4QixFQUFrQztBQUM5QixxQkFBS2tCLFVBQUwsQ0FBZ0IsUUFBaEIsRUFBMEJ2SixPQUExQixFQUFtQ29LLElBQW5DLEVBQXlDNUssVUFBekM7QUFDSCxhQUZELE1BRU8sSUFBSVEsUUFBUXFJLFFBQVIsSUFBb0IsSUFBeEIsRUFBOEI7QUFDakMscUJBQUttQixNQUFMLENBQVksUUFBWixFQUFzQnhKLE9BQXRCLEVBQStCb0ssSUFBL0IsRUFBcUM1SyxVQUFyQztBQUNILGFBRk0sTUFFQSxJQUFJUSxRQUFRcUksUUFBUixJQUFvQixTQUF4QixFQUFtQztBQUN0QyxxQkFBS29CLFdBQUwsQ0FBaUIsU0FBakIsRUFBNEJ6SixPQUE1QixFQUFxQ29LLElBQXJDLEVBQTJDNUssVUFBM0M7QUFDSCxhQUZNLE1BRUE7QUFDSCxvQkFBSVEsUUFBUTBKLGFBQVIsTUFBMkIsS0FBL0IsRUFBc0M7QUFDbEMsd0JBQUlDLFdBQVcsSUFBSTNILFFBQUosQ0FBYWhDLFFBQVE0SixXQUFyQixFQUFrQ3BLLFVBQWxDLENBQWY7O0FBRUE0Syx5QkFBSzFLLFFBQUwsQ0FBY2lLLFFBQWQ7QUFDSDtBQUNKO0FBQ0o7O0FBRURFLG9CQUFZbkssUUFBWixDQUFxQjBLLElBQXJCO0FBQ0gsS0F0QkQ7O0FBd0JBdkMsY0FBVXZKLFNBQVYsQ0FBb0JpTCxVQUFwQixHQUFpQyxVQUFVOUksSUFBVixFQUFnQmQsRUFBaEIsRUFBb0JrSyxXQUFwQixFQUFpQ3JLLFVBQWpDLEVBQTZDO0FBQzFFLFlBQUk2SyxXQUFXLElBQUluSSxRQUFKLENBQWExQyxVQUFiLENBQWY7O0FBRUEsYUFBSyxJQUFJTyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLEdBQUd5SSxVQUFILENBQWM3SCxNQUFsQyxFQUEwQ1IsR0FBMUMsRUFBK0M7QUFDM0MsZ0JBQUlOLFNBQVNFLEdBQUd5SSxVQUFoQjs7QUFFQSxnQkFBSXBJLFVBQVVQLE9BQU9NLENBQVAsQ0FBZDs7QUFFQSxnQkFBSUMsUUFBUXFJLFFBQVIsSUFBb0IsTUFBeEIsRUFBZ0M7QUFDNUJnQyx5QkFBUzNLLFFBQVQsQ0FBa0IsS0FBSzRLLFVBQUwsQ0FBZ0IsTUFBaEIsRUFBd0J0SyxPQUF4QixFQUFpQ0wsRUFBakMsRUFBcUNILFVBQXJDLENBQWxCO0FBQ0gsYUFGRCxNQUVPLElBQUlRLFFBQVFxSSxRQUFSLElBQW9CLFdBQXhCLEVBQXFDO0FBQ3hDZ0MseUJBQVMzSyxRQUFULENBQWtCLElBQUl5QyxXQUFKLENBQWdCbkMsUUFBUW9JLFVBQVIsQ0FBbUIsQ0FBbkIsRUFBc0J0RixRQUF0QixFQUFoQixFQUFrRHRELFVBQWxELENBQWxCO0FBQ0g7QUFDSjs7QUFFRHFLLG9CQUFZbkssUUFBWixDQUFxQjJLLFFBQXJCO0FBQ0gsS0FoQkQ7O0FBa0JBeEMsY0FBVXZKLFNBQVYsQ0FBb0JnTSxVQUFwQixHQUFpQyxVQUFTN0osSUFBVCxFQUFlZCxFQUFmLEVBQW1CNEssVUFBbkIsRUFBK0IvSyxVQUEvQixFQUEyQztBQUN4RSxZQUFJK0MsaUJBQWlCNUMsR0FBR3VJLGdCQUFILENBQW9CLE1BQXBCLEVBQTRCQyxLQUFqRDs7QUFFQSxZQUFJN0YsU0FBUyxJQUFJRCxNQUFKLENBQVdFLGNBQVgsRUFBMkIsRUFBM0IsRUFBK0IvQyxVQUEvQixDQUFiOztBQUVBLGFBQUssSUFBSU8sSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixHQUFHeUksVUFBSCxDQUFjN0gsTUFBbEMsRUFBMENSLEdBQTFDLEVBQStDO0FBQzNDLGdCQUFJQyxVQUFVTCxHQUFHeUksVUFBSCxDQUFjckksQ0FBZCxDQUFkOztBQUVBLGdCQUFJQyxRQUFRcUksUUFBUixJQUFvQixRQUF4QixFQUFrQztBQUM5QixxQkFBS2tCLFVBQUwsQ0FBZ0IsUUFBaEIsRUFBMEJ2SixPQUExQixFQUFtQ3NDLE1BQW5DLEVBQTJDOUMsVUFBM0M7QUFDSCxhQUZELE1BRU8sSUFBSVEsUUFBUXFJLFFBQVIsSUFBb0IsSUFBeEIsRUFBOEI7QUFDakMscUJBQUttQixNQUFMLENBQVksUUFBWixFQUFzQnhKLE9BQXRCLEVBQStCc0MsTUFBL0IsRUFBdUM5QyxVQUF2QztBQUNILGFBRk0sTUFFQSxJQUFJUSxRQUFRcUksUUFBUixJQUFvQixTQUF4QixFQUFtQztBQUN0QyxxQkFBS29CLFdBQUwsQ0FBaUIsU0FBakIsRUFBNEJ6SixPQUE1QixFQUFxQ3NDLE1BQXJDLEVBQTZDOUMsVUFBN0M7QUFDSCxhQUZNLE1BRUE7QUFDSCxvQkFBSVEsUUFBUTBKLGFBQVIsTUFBMkIsS0FBL0IsRUFBc0M7QUFDbEMsd0JBQUlDLFdBQVcsSUFBSTNILFFBQUosQ0FBYWhDLFFBQVE0SixXQUFyQixFQUFrQ3BLLFVBQWxDLENBQWY7O0FBRUE4QywyQkFBTzVDLFFBQVAsQ0FBZ0JpSyxRQUFoQjtBQUNIO0FBQ0o7QUFDSjs7QUFFRCxlQUFPckgsTUFBUDtBQUNILEtBeEJEOztBQTBCQXVGLGNBQVV2SixTQUFWLENBQW9Ca00sUUFBcEIsR0FBK0IsVUFBVTNNLE9BQVYsRUFBbUI7QUFDOUMsWUFBSTRNLFVBQVUsRUFBZDs7QUFFQSxZQUFJMUcsMkJBQTJCLElBQUkyRyx3QkFBSixFQUEvQjs7QUFHQSxZQUFJQyxTQUFTLEVBQWI7O0FBRUEsWUFBSUMsT0FBTyxTQUFQQSxJQUFPLENBQVNDLEdBQVQsRUFBY0MsSUFBZCxFQUFvQjtBQUMzQixnQkFBSUMsVUFBVSxFQUFkO0FBQ0EsZ0JBQUlDLE9BQU96TSxHQUFHME0sV0FBSCxDQUFlSixHQUFmLENBQVg7QUFDQSxnQkFBSUssVUFBVUYsS0FBS3pLLE1BQW5CO0FBQ0EsZ0JBQUksQ0FBQzJLLE9BQUwsRUFBYyxPQUFPSixLQUFLLElBQUwsRUFBV0MsT0FBWCxDQUFQO0FBQ2RDLGlCQUFLRyxPQUFMLENBQWEsVUFBU0MsSUFBVCxFQUFlO0FBQ3hCLG9CQUFJQSxPQUFPUCxNQUFNLEdBQU4sR0FBWU8sSUFBdkI7O0FBRUEsb0JBQUlDLE9BQU85TSxHQUFHK00sUUFBSCxDQUFZRixJQUFaLENBQVg7O0FBRUEsb0JBQUlDLFFBQVFBLEtBQUtFLFdBQUwsRUFBUixJQUE4QkgsS0FBSzdHLE9BQUwsQ0FBYSxNQUFiLEtBQXVCLENBQUMsQ0FBMUQsRUFBNkQ7QUFDekRxRyx5QkFBS1EsSUFBTCxFQUFXLFVBQVMzSSxHQUFULEVBQWMrSSxHQUFkLEVBQW1CO0FBQzFCVCxrQ0FBVUEsUUFBUVUsTUFBUixDQUFlRCxHQUFmLENBQVY7QUFDQSw0QkFBSSxDQUFDLEdBQUVOLE9BQVAsRUFBZ0JKLEtBQUssSUFBTCxFQUFXQyxPQUFYO0FBQ25CLHFCQUhEO0FBSUgsaUJBTEQsTUFLTztBQUNIQSw0QkFBUTFMLElBQVIsQ0FBYStMLElBQWI7QUFDQSx3QkFBSSxDQUFDLEdBQUVGLE9BQVAsRUFBZ0JKLEtBQUssSUFBTCxFQUFXQyxPQUFYO0FBQ25CO0FBR0osYUFoQkQ7QUFpQkgsU0F0QkQ7O0FBeUJBLFlBQUlXLE1BQU0sS0FBVjs7QUFFUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFUSxZQUFJQyxXQUFXcE4sR0FBRzBNLFdBQUgsQ0FBZXBOLE9BQWYsQ0FBZjtBQUNBLGFBQUssSUFBSWtDLENBQVQsSUFBYzRMLFFBQWQsRUFBd0I7QUFDcEIsZ0JBQUlDLFVBQVVELFNBQVM1TCxDQUFULENBQWQ7O0FBRUEsZ0JBQUlQLGFBQWEsS0FBS3FNLGVBQUwsQ0FBcUJoTyxVQUFVK04sT0FBL0IsQ0FBakI7O0FBRUE3SCxxQ0FBeUJyRSxRQUF6QixDQUFrQ0YsVUFBbEM7QUFDSDs7QUFFRCxlQUFPdUUsd0JBQVA7QUFDSCxLQTlERDs7QUFpRUE4RCxjQUFVdkosU0FBVixDQUFvQnVOLGVBQXBCLEdBQXNDLFVBQVVDLFdBQVYsRUFBdUI7QUFDekQsWUFBSXZOLEdBQUd3TixTQUFILENBQWFELFdBQWIsRUFBMEJQLFdBQTFCLEVBQUosRUFDSSxPQUFPLElBQVA7O0FBRUosWUFBSVMsTUFBTXpOLEdBQUcwTixZQUFILENBQWdCSCxXQUFoQixFQUE2QmhKLFFBQTdCLEVBQVY7QUFDQSxZQUFJb0osU0FBUyxJQUFJck4sU0FBSixHQUFnQnNOLGVBQWhCLENBQWdDSCxHQUFoQyxDQUFiOztBQUVBLFlBQUlFLE9BQU9FLGVBQVAsQ0FBdUIvRCxRQUF2QixJQUFtQyxRQUF2QyxFQUFpRDtBQUM3QyxtQkFBTyxJQUFQO0FBQ0g7O0FBRUQsWUFBSWdFLE1BQU1ILE9BQU9FLGVBQVAsQ0FBdUJoRSxVQUFqQzs7QUFFQSxZQUFJNUksYUFBYSxJQUFJOE0sVUFBSixDQUFlSixPQUFPRSxlQUFQLENBQXVCbEUsZ0JBQXZCLENBQXdDLFdBQXhDLEVBQXFEQyxLQUFwRSxDQUFqQjtBQUNBLGFBQUssSUFBSXBJLElBQUksQ0FBYixFQUFnQkEsSUFBSXNNLElBQUk5TCxNQUF4QixFQUFnQ1IsR0FBaEMsRUFBcUM7QUFDakMsZ0JBQUlnSSxRQUFRc0UsSUFBSXRNLENBQUosQ0FBWjs7QUFFQSxnQkFBR2dJLE1BQU1NLFFBQU4sSUFBa0IsT0FBbEIsSUFBNkJOLE1BQU1NLFFBQU4sSUFBa0IsVUFBbEQsRUFBOEQ7QUFDMUQsb0JBQUkxSSxLQUFLLEtBQUt1SixJQUFMLENBQVVuQixNQUFNTSxRQUFoQixFQUEwQk4sS0FBMUIsRUFBaUN2SSxVQUFqQyxDQUFUOztBQUVBO0FBQ0FBLDJCQUFXRSxRQUFYLENBQW9CQyxFQUFwQjtBQUNIO0FBQ0o7O0FBRUQsZUFBT0gsVUFBUDtBQUNILEtBMUJEO0FBMkJBLFdBQU9xSSxTQUFQO0FBQ0gsQ0EvVmUsRUFBaEI7QUFnV0FuRyxRQUFRbUcsU0FBUixHQUFvQkEsU0FBcEI7O0FBRUEsSUFBSTZDLDJCQUE0QixZQUFZO0FBQ3hDLGFBQVNBLHdCQUFULEdBQW9DO0FBQ2hDLGFBQUs2QixXQUFMLEdBQW1CLEVBQW5CO0FBQ0EsYUFBS0MsZUFBTCxHQUF1QixFQUF2QjtBQUNBLGFBQUs3QixNQUFMLEdBQWMsRUFBZDtBQUNIO0FBQ0RELDZCQUF5QnBNLFNBQXpCLENBQW1Db0ksWUFBbkMsR0FBa0QsVUFBVWpHLElBQVYsRUFBZ0I7QUFDOUQsZUFBTyxLQUFLa0ssTUFBTCxDQUFZbEssSUFBWixDQUFQO0FBQ0gsS0FGRDs7QUFJQWlLLDZCQUF5QnBNLFNBQXpCLENBQW1DbU8sYUFBbkMsR0FBbUQsVUFBVUMsaUJBQVYsRUFBNkJDLE1BQTdCLEVBQXFDO0FBQ3BGLFlBQUksS0FBS2hDLE1BQUwsQ0FBWStCLGlCQUFaLEtBQWtDLElBQXRDLEVBQ0k7O0FBRUosYUFBSy9CLE1BQUwsQ0FBWStCLGlCQUFaLElBQWlDQyxNQUFqQztBQUNILEtBTEQ7O0FBT0FqQyw2QkFBeUJwTSxTQUF6QixDQUFtQ29CLFFBQW5DLEdBQThDLFVBQVVGLFVBQVYsRUFBc0I7QUFDaEUsWUFBSUEsY0FBYyxJQUFsQixFQUNJOztBQUVKLGFBQUtnTixlQUFMLENBQXFCaE4sV0FBV2lCLElBQWhDLElBQXdDakIsVUFBeEM7O0FBRUEsYUFBSytNLFdBQUwsQ0FBaUJsTixJQUFqQixDQUFzQkcsVUFBdEI7QUFDSCxLQVBEOztBQVNBa0wsNkJBQXlCcE0sU0FBekIsQ0FBbUNtRyxnQkFBbkMsR0FBc0QsVUFBVW1JLHFCQUFWLEVBQWlDO0FBQ25GLFlBQUlDLGdCQUFnQkQsc0JBQXNCekwsS0FBdEIsQ0FBNEIsR0FBNUIsRUFBaUMsQ0FBakMsQ0FBcEI7QUFDQSxZQUFJMkwsZ0JBQWdCRixzQkFBc0J6TCxLQUF0QixDQUE0QixHQUE1QixFQUFpQyxDQUFqQyxDQUFwQjs7QUFFQSxZQUFJM0IsYUFBYSxLQUFLZ04sZUFBTCxDQUFxQkssYUFBckIsQ0FBakI7O0FBRUEsWUFBSXJOLGNBQWMsSUFBbEIsRUFBd0I7QUFDdkI5QixtQkFBTzhELEtBQVAsQ0FBYSxnQkFBZ0JxTCxhQUFoQixHQUFnQyxrQkFBN0M7QUFDRyxrQkFBTSxJQUFJcEwsS0FBSixDQUFVLGdCQUFnQm9MLGFBQWhCLEdBQWdDLGlCQUExQyxDQUFOO0FBQ0g7O0FBRUQsWUFBSWhMLFlBQVlyQyxXQUFXaUYsZ0JBQVgsQ0FBNEJxSSxhQUE1QixDQUFoQjs7QUFFQSxlQUFPakwsU0FBUDtBQUVILEtBZkQ7O0FBaUJBNkksNkJBQXlCcE0sU0FBekIsQ0FBbUN5TyxTQUFuQyxHQUErQyxVQUFVSCxxQkFBVixFQUFpQztBQUM1RSxZQUFJQyxnQkFBZ0JELHNCQUFzQnpMLEtBQXRCLENBQTRCLEdBQTVCLEVBQWlDLENBQWpDLENBQXBCOztBQUVBLFlBQUk2TCxPQUFPSixzQkFBc0J6TCxLQUF0QixDQUE0QixHQUE1QixFQUFpQyxDQUFqQyxDQUFYOztBQUVBLFlBQUkzQixhQUFhLEtBQUtnTixlQUFMLENBQXFCSyxhQUFyQixDQUFqQjs7QUFFQSxlQUFPck4sV0FBV3VOLFNBQVgsQ0FBcUJDLElBQXJCLENBQVA7QUFDSCxLQVJEOztBQVVBdEMsNkJBQXlCcE0sU0FBekIsQ0FBbUMyTyxNQUFuQyxHQUE0QyxVQUFVQyxZQUFWLEVBQXdCakosTUFBeEIsRUFBZ0NrSixRQUFoQyxFQUEwQztBQUNsRixZQUFJQyxLQUFLLElBQVQ7QUFDQSxZQUFJek4sS0FBSyxLQUFLb04sU0FBTCxDQUFlRyxZQUFmLENBQVQ7O0FBRUEsWUFBSWhOLGFBQWEsSUFBSWxCLFVBQUosRUFBakI7O0FBRUFXLFdBQUdNLFVBQUgsQ0FBY0MsVUFBZCxFQUEwQitELE1BQTFCOztBQUVBO0FBQ0E7O0FBRUF2RyxlQUFPZ0ssSUFBUCxDQUFZLFlBQVl3RixZQUFaLEdBQTJCLEdBQXZDLEVBQTRDaE4sV0FBV2pCLEdBQXZEO0FBQ0h2QixlQUFPZ0ssSUFBUCxDQUFZLGNBQVosRUFBMkJ4SCxXQUFXaEIsVUFBdEM7QUFDRyxZQUFJbU8sVUFBVTdPLFFBQVEsUUFBUixFQUFrQjhPLE1BQWhDOztBQUVBLGFBQUtDLE9BQUwsQ0FBYSxVQUFTQyxVQUFULEVBQW9CO0FBQzdCO0FBQ0hBLHVCQUFXQyxLQUFYLENBQWlCdk4sV0FBV2pCLEdBQTVCLEVBQWdDaUIsV0FBV2hCLFVBQTNDLEVBQXNELFVBQVV1RCxHQUFWLEVBQWNpTCxJQUFkLEVBQW9CQyxNQUFwQixFQUE0QjtBQUM5RSxvQkFBSWxMLEdBQUosRUFBUztBQUNGNUMsNEJBQVFDLEdBQVIsQ0FBWTJDLEdBQVo7QUFDQTVDLDRCQUFRQyxHQUFSLENBQVkyQyxJQUFJbUwsT0FBaEI7QUFDQWxRLDJCQUFPOEQsS0FBUCxDQUFhaUIsSUFBSW1MLE9BQWpCO0FBQ0FULDZCQUFTMUssR0FBVCxFQUFhLENBQWI7QUFDQTtBQUNIO0FBQ0Qsb0JBQUlpTCxLQUFLRyxRQUFULEVBQW9CO0FBQ2hCNUosMkJBQU8xRSxFQUFQLEdBQVltTyxLQUFLRyxRQUFqQjtBQUNIOztBQUVELG9CQUFJVixRQUFKLEVBQWM7QUFDVjtBQUNBQSw2QkFBUzFLLEdBQVQsRUFBYWlMLEtBQUtJLFlBQWxCO0FBQ0g7QUFDTixhQWhCRjtBQWlCRTtBQUNGLFNBcEJEO0FBc0JILEtBckNEOztBQXVDQXBELDZCQUF5QnBNLFNBQXpCLENBQW1DeVAsUUFBbkMsR0FBOEMsVUFBVWIsWUFBVixFQUF3QmpKLE1BQXhCLEVBQWdDa0osUUFBaEMsRUFBMEM7QUFDcEYsWUFBSUMsS0FBSyxJQUFUO0FBQ0EsWUFBSXpOLEtBQUssS0FBS29OLFNBQUwsQ0FBZUcsWUFBZixDQUFUOztBQUVBLFlBQUloTixhQUFhLElBQUlsQixVQUFKLEVBQWpCO0FBQ0EsWUFBSUMsTUFBTVUsR0FBR00sVUFBSCxDQUFjQyxVQUFkLEVBQTBCK0QsTUFBMUIsQ0FBVjs7QUFFQTs7QUFFQXZHLGVBQU9nSyxJQUFQLENBQVksWUFBWXdGLFlBQVosR0FBMkIsR0FBdkMsRUFBNENoTixXQUFXakIsR0FBdkQ7QUFDSHZCLGVBQU9nSyxJQUFQLENBQVksY0FBWixFQUEyQnhILFdBQVdoQixVQUF0QztBQUNHLFlBQUltTyxVQUFVN08sUUFBUSxRQUFSLEVBQWtCOE8sTUFBaEM7O0FBRUEsYUFBS0MsT0FBTCxDQUFhLFVBQVNDLFVBQVQsRUFBcUI7QUFDOUI7QUFDSEEsdUJBQVdDLEtBQVgsQ0FBaUJ2TixXQUFXakIsR0FBNUIsRUFBaUNpQixXQUFXaEIsVUFBNUMsRUFBdUQsVUFBVXVELEdBQVYsRUFBY2lMLElBQWQsRUFBb0JDLE1BQXBCLEVBQTZCO0FBQ2hGLG9CQUFJbEwsR0FBSixFQUFTO0FBQ0Y1Qyw0QkFBUUMsR0FBUixDQUFZMkMsR0FBWjtBQUNBNUMsNEJBQVFDLEdBQVIsQ0FBWTJDLElBQUltTCxPQUFoQjtBQUNBbFEsMkJBQU84RCxLQUFQLENBQWFpQixJQUFJbUwsT0FBakI7QUFDQVQsNkJBQVMxSyxHQUFULEVBQWEsQ0FBYjtBQUNBO0FBQ0g7QUFDRCxvQkFBSTBLLFFBQUosRUFBYztBQUNWQSw2QkFBUzFLLEdBQVQsRUFBYWlMLEtBQUtJLFlBQWxCO0FBQ0g7QUFDUCxhQVhEO0FBWUc7QUFDSCxTQWZEO0FBa0JILEtBL0JEOztBQWlDQXBELDZCQUF5QnBNLFNBQXpCLENBQW1DMFAsTUFBbkMsR0FBNEMsVUFBVWQsWUFBVixFQUF3QmpKLE1BQXhCLEVBQWdDa0osUUFBaEMsRUFBMEM7QUFDbEYsWUFBSUMsS0FBSyxJQUFUO0FBQ0EsWUFBSXpOLEtBQUssS0FBS29OLFNBQUwsQ0FBZUcsWUFBZixDQUFUOztBQUVBLFlBQUloTixhQUFhLElBQUlsQixVQUFKLEVBQWpCO0FBQ0EsWUFBSUMsTUFBTVUsR0FBR00sVUFBSCxDQUFjQyxVQUFkLEVBQTBCK0QsTUFBMUIsQ0FBVjs7QUFFQSxZQUFJb0osVUFBVTdPLFFBQVEsUUFBUixFQUFrQjhPLE1BQWhDOztBQUdBNVAsZUFBT2dLLElBQVAsQ0FBWSxZQUFZd0YsWUFBWixHQUEyQixHQUF2QyxFQUE0Q2hOLFdBQVdqQixHQUF2RDtBQUNIdkIsZUFBT2dLLElBQVAsQ0FBWSxjQUFaLEVBQTJCeEgsV0FBV2hCLFVBQXRDO0FBQ0csYUFBS3FPLE9BQUwsQ0FBYSxVQUFTQyxVQUFULEVBQXFCO0FBQzlCO0FBQ0hBLHVCQUFXQyxLQUFYLENBQWlCdk4sV0FBV2pCLEdBQTVCLEVBQWlDaUIsV0FBV2hCLFVBQTVDLEVBQXdELFVBQVV1RCxHQUFWLEVBQWNpTCxJQUFkLEVBQW9CQyxNQUFwQixFQUE0QjtBQUNoRixvQkFBSWxMLEdBQUosRUFBUztBQUNGNUMsNEJBQVFDLEdBQVIsQ0FBWTJDLEdBQVo7QUFDQTVDLDRCQUFRQyxHQUFSLENBQVkyQyxJQUFJbUwsT0FBaEI7QUFDQWxRLDJCQUFPOEQsS0FBUCxDQUFhaUIsSUFBSW1MLE9BQWpCO0FBQ0FULDZCQUFTMUssR0FBVCxFQUFhLENBQWI7QUFDQTtBQUNIO0FBQ0Qsb0JBQUkwSyxRQUFKLEVBQWM7QUFDVkEsNkJBQVMxSyxHQUFULEVBQWFpTCxLQUFLSSxZQUFsQjtBQUNIO0FBQ1AsYUFYRDtBQVlHO0FBQ0gsU0FmRDtBQWtCSCxLQTlCRDs7QUFnQ0FwRCw2QkFBeUJwTSxTQUF6QixDQUFtQzJQLFdBQW5DLEdBQWlELFVBQVVmLFlBQVYsRUFBd0IvTSxLQUF4QixFQUErQmdOLFFBQS9CLEVBQXlDO0FBQ3RGO0FBQ0EsYUFBS2UsZUFBTCxDQUFxQmhCLFlBQXJCLEVBQW1DL00sS0FBbkMsRUFBMEMsVUFBVXNDLEdBQVYsRUFBYzBELE9BQWQsRUFBdUI7QUFDN0QsZ0JBQUlBLFFBQVE1RixNQUFSLElBQWtCLENBQXRCLEVBQ0ksT0FBTzRNLFNBQVMxSyxHQUFULEVBQWEsRUFBYixDQUFQOztBQUVKLGdCQUFJMEQsUUFBUTVGLE1BQVIsR0FBaUIsQ0FBckIsRUFBd0I7QUFDcEIsdUJBQU80TSxTQUFTMUssR0FBVCxFQUFhMEQsUUFBUSxDQUFSLENBQWIsQ0FBUDtBQUNIOztBQUVEZ0gscUJBQVMxSyxHQUFULEVBQWEwRCxRQUFRLENBQVIsQ0FBYjtBQUNILFNBVEQ7QUFVSCxLQVpEOztBQWNBdUUsNkJBQXlCcE0sU0FBekIsQ0FBbUM0UCxlQUFuQyxHQUFxRCxVQUFVaEIsWUFBVixFQUF3Qi9NLEtBQXhCLEVBQStCZ04sUUFBL0IsRUFBeUM7QUFDMUYsWUFBSUMsS0FBSyxJQUFUO0FBQ0EsWUFBSXpOLEtBQUssS0FBS29OLFNBQUwsQ0FBZUcsWUFBZixDQUFUOztBQUVBLFlBQUloTixhQUFhLElBQUlsQixVQUFKLEVBQWpCOztBQUVBVyxXQUFHTSxVQUFILENBQWNDLFVBQWQsRUFBMEJDLEtBQTFCOztBQUVBLFlBQUkyTSxnQkFBZ0JuTixHQUFHa0MsU0FBdkI7O0FBRUEsWUFBSWxDLEdBQUdrQyxTQUFILENBQWEwQyxPQUFiLENBQXFCLEdBQXJCLEtBQTZCLENBQUMsQ0FBbEMsRUFBcUM7QUFDakN1SSw0QkFBZ0JuTixHQUFHSCxVQUFILENBQWNpQixJQUFkLEdBQXFCLEdBQXJCLEdBQTJCZCxHQUFHa0MsU0FBOUM7QUFDSDs7QUFFRCxZQUFJbUcsY0FBYyxLQUFLdkQsZ0JBQUwsQ0FBc0JxSSxhQUF0QixDQUFsQjs7QUFFQSxZQUFJbk4sR0FBR2tDLFNBQUgsSUFBZ0JtRyxlQUFlLElBQW5DLEVBQXlDO0FBQ3JDO0FBQ0h0SyxtQkFBTzhELEtBQVAsQ0FBYSxpQkFBaUI3QixHQUFHa0MsU0FBcEIsR0FBZ0MsbUJBQTdDO0FBQ0FzTCxxQkFBUyxpQkFBaUJ4TixHQUFHa0MsU0FBcEIsR0FBZ0MsbUJBQXpDLEVBQTZELEVBQTdEO0FBQ0E7QUFDQTs7QUFHRCxZQUFJd0wsVUFBVTdPLFFBQVEsUUFBUixFQUFrQjhPLE1BQWhDO0FBQ0EsYUFBS0MsT0FBTCxDQUFhLFVBQVNDLFVBQVQsRUFBb0I7QUFDN0I7QUFDQTtBQUNIOVAsbUJBQU9nSyxJQUFQLENBQVksWUFBWXdGLFlBQVosR0FBMkIsR0FBdkMsRUFBNENoTixXQUFXakIsR0FBdkQ7QUFDQXZCLG1CQUFPZ0ssSUFBUCxDQUFZLGNBQVosRUFBMkJ4SCxXQUFXaEIsVUFBdEM7QUFDRztBQUNIc08sdUJBQVdDLEtBQVgsQ0FBaUJ2TixXQUFXakIsR0FBNUIsRUFBaUNpQixXQUFXaEIsVUFBNUMsRUFBd0QsVUFBVXVELEdBQVYsRUFBY2lMLElBQWQsRUFBb0JDLE1BQXBCLEVBQTRCO0FBQzdFLG9CQUFJbEwsR0FBSixFQUFTO0FBQ0w1Qyw0QkFBUUMsR0FBUixDQUFZMkMsR0FBWjtBQUNBNUMsNEJBQVFDLEdBQVIsQ0FBWTJDLElBQUltTCxPQUFoQjtBQUNBbFEsMkJBQU84RCxLQUFQLENBQWFpQixJQUFJbUwsT0FBakI7QUFDQVQsNkJBQVMxSyxHQUFULEVBQWEsRUFBYjtBQUNBO0FBQ0g7QUFDRCxvQkFBRzBLLFlBQVksQ0FBQ25GLFdBQWhCLEVBQTRCO0FBQzNCO0FBQ0Esd0JBQUk3QixVQUFVLEVBQWQ7QUFDQ0EsNEJBQVE5RyxJQUFSLENBQWFxTyxJQUFiO0FBQ0FQLDZCQUFTLElBQVQsRUFBY2hILE9BQWQ7QUFDRCxpQkFMRCxNQU1BLElBQUlnSCxZQUFZbkYsV0FBaEIsRUFBNkI7QUFDekJtRiw2QkFBUyxJQUFULEVBQWNuRixZQUFZL0IsV0FBWixDQUF3Qm1ILEVBQXhCLEVBQTRCTSxJQUE1QixDQUFkO0FBQ0gsaUJBRkQsTUFFTztBQUNILHdCQUFJL04sR0FBR21DLFFBQUgsSUFBZSxRQUFmLElBQTJCbkMsR0FBR21DLFFBQUgsSUFBZSxLQUExQyxJQUFtRG5DLEdBQUdtQyxRQUFILElBQWUsTUFBbEUsSUFBNEVuQyxHQUFHbUMsUUFBSCxJQUFlLGdCQUEvRixFQUFpSDtBQUM3Ryw0QkFBSXFFLFVBQVUsRUFBZDtBQUNBLDZCQUFLLElBQUlwRyxDQUFULElBQWMyTixJQUFkLEVBQW9CO0FBQ2hCLGdDQUFJUyxNQUFNVCxLQUFLM04sQ0FBTCxDQUFWOztBQUVBLGlDQUFLLElBQUl1SCxDQUFULElBQWM2RyxHQUFkLEVBQW1CO0FBQ2ZoSSx3Q0FBUTlHLElBQVIsQ0FBYThPLElBQUk3RyxDQUFKLENBQWI7QUFDQTtBQUNIO0FBQ0o7O0FBRUQ2RixpQ0FBUyxJQUFULEVBQWNoSCxPQUFkO0FBQ0g7QUFDSjtBQUNMO0FBQ0YsYUFoQ0Q7QUFrQ0EsU0F4Q0Q7QUEyQ0gsS0FwRUQ7O0FBc0VBdUUsNkJBQXlCcE0sU0FBekIsQ0FBbUM4UCxJQUFuQyxHQUEwQyxZQUFZO0FBQ2xELFlBQUloSSxXQUFXTyxPQUFPQyxNQUFQLENBQWM4RCx3QkFBZCxDQUFmO0FBQ0F0RSxpQkFBUy9ILFdBQVQsQ0FBcUJ3SSxLQUFyQixDQUEyQlQsUUFBM0IsRUFBcUMsRUFBckM7O0FBRUEsZUFBT0EsUUFBUDtBQUNILEtBTEQ7O0FBT0FzRSw2QkFBeUJwTSxTQUF6QixDQUFtQytQLFFBQW5DLEdBQTRDLFlBQVU7QUFDbEQsWUFBSWhCLFVBQVU3TyxRQUFRLFFBQVIsRUFBa0I4TyxNQUFoQztBQUNBLGVBQU9ELFFBQVFnQixRQUFmO0FBQ0gsS0FIRDs7QUFLQTNELDZCQUF5QnBNLFNBQXpCLENBQW1DaVAsT0FBbkMsR0FBMkMsVUFBU0osUUFBVCxFQUFrQjtBQUM1RCxZQUFHO0FBQ0EsaUJBQUtrQixRQUFMO0FBQ0EsbUJBQU8sS0FBS0EsUUFBTCxHQUFnQkMsY0FBaEIsQ0FBK0JuQixRQUEvQixDQUFQO0FBQ0YsU0FIRCxDQUdDLE9BQU0xSyxHQUFOLEVBQVU7QUFDVjVDLG9CQUFRQyxHQUFSLENBQVkyQyxHQUFaO0FBQ0E7QUFDRCxLQVBEOztBQVNBaUksNkJBQXlCcE0sU0FBekIsQ0FBbUNpUSxTQUFuQyxHQUE2QyxVQUFTcEIsUUFBVCxFQUFrQjtBQUMzRCxlQUFPLEtBQUtrQixRQUFMLEdBQWdCRyxlQUFoQixDQUFnQ3JCLFFBQWhDLENBQVA7QUFDSCxLQUZEOztBQUlBLFdBQU96Qyx3QkFBUDtBQUNILENBM1E4QixFQUEvQjtBQTRRQWhKLFFBQVFnSix3QkFBUixHQUFtQ0Esd0JBQW5DOztBQUVBLElBQUk0QixhQUFjLFlBQVk7QUFDMUIsYUFBU0EsVUFBVCxDQUFvQjdMLElBQXBCLEVBQTBCO0FBQ3RCLGFBQUtBLElBQUwsR0FBWUEsSUFBWjtBQUNBLGFBQUtoQixNQUFMLEdBQWMsRUFBZDtBQUNBLGFBQUtnUCxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsYUFBS0MsZ0JBQUwsR0FBd0IsRUFBeEI7QUFDQSxhQUFLQyxRQUFMLEdBQWdCLEVBQWhCO0FBQ0g7QUFDRHJDLGVBQVdoTyxTQUFYLENBQXFCb0IsUUFBckIsR0FBZ0MsVUFBVU0sT0FBVixFQUFtQjtBQUMvQ0EsZ0JBQVFSLFVBQVIsR0FBcUIsSUFBckI7O0FBRUEsYUFBS0MsTUFBTCxDQUFZSixJQUFaLENBQWlCVyxPQUFqQjs7QUFFQSxZQUFJQSxtQkFBbUJtRixXQUF2QixFQUFvQztBQUNoQyxpQkFBS3NKLFVBQUwsQ0FBZ0JwUCxJQUFoQixDQUFxQlcsT0FBckI7O0FBRUEsaUJBQUswTyxnQkFBTCxDQUFzQjFPLFFBQVFULEVBQTlCLElBQW9DUyxPQUFwQztBQUNIOztBQUVELGFBQUsyTyxRQUFMLENBQWMzTyxRQUFRVCxFQUF0QixJQUE0QlMsT0FBNUI7QUFDSCxLQVpEOztBQWNBc00sZUFBV2hPLFNBQVgsQ0FBcUJtRyxnQkFBckIsR0FBd0MsVUFBVXFJLGFBQVYsRUFBeUI7QUFDN0QsZUFBTyxLQUFLNEIsZ0JBQUwsQ0FBc0I1QixhQUF0QixDQUFQO0FBQ0gsS0FGRDs7QUFJQVIsZUFBV2hPLFNBQVgsQ0FBcUJ5TyxTQUFyQixHQUFpQyxVQUFVQyxJQUFWLEVBQWdCO0FBQzdDLGVBQU8sS0FBSzJCLFFBQUwsQ0FBYzNCLElBQWQsQ0FBUDtBQUNILEtBRkQ7QUFHQSxXQUFPVixVQUFQO0FBQ0gsQ0E5QmdCLEVBQWpCOztBQWdDQTVLLFFBQVE3RCxPQUFSLEdBQWtCQSxPQUFsQjtBQUNBNkQsUUFBUTRLLFVBQVIsR0FBcUJBLFVBQXJCO0FBQ0E1SyxRQUFRM0MsUUFBUixHQUFtQkEsUUFBbkI7O0FBRUEiLCJmaWxlIjoiTm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgbG9nZ2VyPUZMTG9nZ2VyLmdldExvZ2dlcihcIlNRTE1hcHBlckxvZ1wiKTtcclxudmFyIGRpcl94bWwgPSAnJyxcclxuICAgIHNlcGFyYWRvciA9ICc6OjonO1xyXG5cclxudmFyIF9fZXh0ZW5kcyA9IHRoaXMuX19leHRlbmRzIHx8IGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcclxuICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxyXG4gICAgX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGU7XHJcbiAgICBkLnByb3RvdHlwZSA9IG5ldyBfXygpO1xyXG59O1xyXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xyXG52YXIgcGF0aCA9ICByZXF1aXJlKCdwYXRoJyk7XHJcblxyXG52YXIgdm0gPSByZXF1aXJlKCd2bScpO1xyXG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcclxudmFyIG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xyXG52YXIgRE9NUGFyc2VyID0gcmVxdWlyZSgneG1sZG9tJykuRE9NUGFyc2VyO1xyXG52YXIgUyA9IHJlcXVpcmUoJ3N0cmluZycpO1xyXG52YXIgQ29udGV4dG8gPSByZXF1aXJlKCcuL0NvbnRleHRvJyk7XHJcblxyXG5mdW5jdGlvbiBDb21hbmRvU3FsKCkge1xyXG4gICAgdGhpcy5zcWwgPSAnJztcclxuICAgIHRoaXMucGFyYW1ldHJvcyA9IFtdO1xyXG59XHJcblxyXG5Db21hbmRvU3FsLnByb3RvdHlwZS5hZGljaW9uZVBhcmFtZXRybyA9IGZ1bmN0aW9uKHZhbG9yKSB7XHJcbiAgICB0aGlzLnBhcmFtZXRyb3MucHVzaCh2YWxvcik7XHJcbn1cclxuXHJcbnZhciBObyA9IChmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBObyhpZCwgbWFwZWFtZW50bykge1xyXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcclxuICAgICAgICB0aGlzLm1hcGVhbWVudG8gPSBtYXBlYW1lbnRvO1xyXG4gICAgICAgIHRoaXMuZmlsaG9zID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgTm8ucHJvdG90eXBlLmFkaWNpb25lID0gZnVuY3Rpb24gKG5vKSB7XHJcbiAgICAgICAgdGhpcy5maWxob3MucHVzaChubyk7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vLnByb3RvdHlwZS5pbXByaW1hID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmlkKVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmlkKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLmZpbGhvcykge1xyXG4gICAgICAgICAgICB2YXIgbm9GaWxobyA9IHRoaXMuZmlsaG9zW2ldO1xyXG5cclxuICAgICAgICAgICAgbm9GaWxoby5pbXByaW1hKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBOby5wcm90b3R5cGUub2J0ZW5oYVNxbCA9IGZ1bmN0aW9uIChjb21hbmRvU3FsLCBkYWRvcykge1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5maWxob3MpIHtcclxuICAgICAgICAgICAgdmFyIG5vRmlsaG8gPSB0aGlzLmZpbGhvc1tpXTtcclxuXHJcbiAgICAgICAgICAgIG5vRmlsaG8ub2J0ZW5oYVNxbChjb21hbmRvU3FsLCBkYWRvcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY29tYW5kb1NxbDtcclxuICAgIH07XHJcblxyXG4gICAgTm8ucHJvdG90eXBlLmdldFZhbHVlID0gZnVuY3Rpb24gKGRhdGEsIHBhdGgpIHtcclxuICAgICAgICB2YXIgaSwgbGVuID0gcGF0aC5sZW5ndGg7XHJcblxyXG4gICAgICAgIGZvciAoaSA9IDA7IHR5cGVvZiBkYXRhID09PSAnb2JqZWN0JyAmJiBpIDwgbGVuOyArK2kpIHtcclxuICAgICAgICAgICAgaWYoIGRhdGEgKVxyXG4gICAgICAgICAgICAgICAgZGF0YSA9IGRhdGFbcGF0aFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhO1xyXG4gICAgfTtcclxuXHJcbiAgICBOby5wcm90b3R5cGUub2J0ZW5oYU5vbWVDb21wbGV0byA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5tYXBlYW1lbnRvLm5vbWUgKyBcIi5cIiArIHRoaXMuaWQ7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vLnByb3RvdHlwZS5wcm9jZXNzZUV4cHJlc3NhbyA9IGZ1bmN0aW9uICh0ZXh0bywgY29tYW5kb1NxbCwgZGFkb3MpIHtcclxuICAgICAgICB2YXIgbXlBcnJheTtcclxuICAgICAgICB2YXIgcmVnZXggPSBuZXcgUmVnRXhwKCcjXFx7KFthLXouQS1aMC05X10rKX0nLCAnaWcnKTtcclxuICAgICAgICB2YXIgZXhwcmVzc2FvID0gdGV4dG87XHJcblxyXG4gICAgICAgIHdoaWxlICgobXlBcnJheSA9IHJlZ2V4LmV4ZWModGV4dG8pKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgdHJlY2hvID0gbXlBcnJheVswXTtcclxuICAgICAgICAgICAgdmFyIHZhbG9yUHJvcHJpZWRhZGUgPSB0aGlzLmdldFZhbHVlKGRhZG9zLCBteUFycmF5WzFdLnNwbGl0KCcuJykpO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2codHJlY2hvICsgXCIgLT4gXCIgKyB2YWxvclByb3ByaWVkYWRlKTtcclxuICAgICAgICAgICAgaWYgKHZhbG9yUHJvcHJpZWRhZGUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2FvID0gZXhwcmVzc2FvLnJlcGxhY2UodHJlY2hvLCAnPycpO1xyXG4gICAgICAgICAgICAgICAgY29tYW5kb1NxbC5hZGljaW9uZVBhcmFtZXRybyhudWxsKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsb3JQcm9wcmllZGFkZSA9PSBcIm51bWJlclwiKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzYW8gPSBleHByZXNzYW8ucmVwbGFjZSh0cmVjaG8sICc/Jyk7XHJcbiAgICAgICAgICAgICAgICBjb21hbmRvU3FsLmFkaWNpb25lUGFyYW1ldHJvKHZhbG9yUHJvcHJpZWRhZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWxvclByb3ByaWVkYWRlID09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICBleHByZXNzYW8gPSBleHByZXNzYW8ucmVwbGFjZSh0cmVjaG8sICc/Jyk7XHJcbiAgICAgICAgICAgICAgICBjb21hbmRvU3FsLmFkaWNpb25lUGFyYW1ldHJvKHZhbG9yUHJvcHJpZWRhZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiB2YWxvclByb3ByaWVkYWRlID09ICdib29sZWFuJykge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2FvID0gZXhwcmVzc2FvLnJlcGxhY2UodHJlY2hvLCAnPycpO1xyXG4gICAgICAgICAgICAgICAgY29tYW5kb1NxbC5hZGljaW9uZVBhcmFtZXRybyh2YWxvclByb3ByaWVkYWRlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzRGF0ZSh2YWxvclByb3ByaWVkYWRlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbG9yID0gbW9tZW50KHZhbG9yUHJvcHJpZWRhZGUpLmZvcm1hdCgnWVlZWS1NTS1ERCBISDptbTpzcycpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHZhbG9yKTtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3NhbyA9IGV4cHJlc3Nhby5yZXBsYWNlKHRyZWNobywgJz8nKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb21hbmRvU3FsLmFkaWNpb25lUGFyYW1ldHJvKHZhbG9yKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh1dGlsLmlzQXJyYXkodmFsb3JQcm9wcmllZGFkZSkpIHtcclxuICAgICAgICAgICAgXHRsb2dnZXIuZXJyb3IoXCJOw6NvIHBvZGUgdHJhZHV6aXIgdHJlY2hvIFwiICsgdHJlY2hvICsgXCIgcGVsYSBjb2xlw6fDo286IFwiICsgdmFsb3JQcm9wcmllZGFkZSk7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJOw6NvIHBvZGUgdHJhZHV6aXIgdHJlY2hvIFwiICsgdHJlY2hvICsgXCIgcGVsYSBjb2xlw6fDo286IFwiICsgdmFsb3JQcm9wcmllZGFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBleHByZXNzYW87XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vO1xyXG59KSgpO1xyXG5leHBvcnRzLk5vID0gTm87XHJcblxyXG52YXIgTm9TZWxlY3QgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE5vU2VsZWN0LCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTm9TZWxlY3QoaWQsIHJlc3VsdE1hcCwgamF2YVR5cGUsIG1hcGVhbWVudG8pIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBpZCwgbWFwZWFtZW50byk7XHJcblxyXG4gICAgICAgIHRoaXMucmVzdWx0TWFwID0gcmVzdWx0TWFwO1xyXG4gICAgICAgIHRoaXMuamF2YVR5cGUgPSBqYXZhVHlwZTtcclxuICAgIH1cclxuICAgIHJldHVybiBOb1NlbGVjdDtcclxufSkoTm8pO1xyXG5leHBvcnRzLk5vU2VsZWN0ID0gTm9TZWxlY3Q7XHJcblxyXG52YXIgTm9TdHJpbmcgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE5vU3RyaW5nLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTm9TdHJpbmcodGV4dG8sIG1hcGVhbWVudG8pIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCAnJywgbWFwZWFtZW50byk7XHJcbiAgICAgICAgdGhpcy50ZXh0byA9IHRleHRvLnRyaW0oKTtcclxuICAgIH1cclxuICAgIE5vU3RyaW5nLnByb3RvdHlwZS5pbXByaW1hID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMudGV4dG8pO1xyXG4gICAgfTtcclxuXHJcbiAgICBOb1N0cmluZy5wcm90b3R5cGUub2J0ZW5oYVNxbCA9IGZ1bmN0aW9uIChjb21hbmRvU3FsLCBkYWRvcykge1xyXG4gICAgICAgIGNvbWFuZG9TcWwuc3FsICs9IF9zdXBlci5wcm90b3R5cGUucHJvY2Vzc2VFeHByZXNzYW8uY2FsbCh0aGlzLCB0aGlzLnRleHRvLCBjb21hbmRvU3FsLCBkYWRvcykgKyBcIiBcIjtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTm9TdHJpbmc7XHJcbn0pKE5vKTtcclxuZXhwb3J0cy5Ob1N0cmluZyA9IE5vU3RyaW5nO1xyXG5cclxudmFyIE5vQ2hvb3NlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhOb0Nob29zZSwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vQ2hvb3NlKG1hcGVhbWVudG8pIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCAnJywgbWFwZWFtZW50byk7XHJcbiAgICB9XHJcbiAgICBOb0Nob29zZS5wcm90b3R5cGUuYWRpY2lvbmUgPSBmdW5jdGlvbiAobm8pIHtcclxuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmFkaWNpb25lLmNhbGwodGhpcywgbm8pO1xyXG5cclxuICAgICAgICBpZiAobm8gaW5zdGFuY2VvZiBOb090aGVyd2lzZSkge1xyXG4gICAgICAgICAgICB0aGlzLm5vT3RoZXJ3aXNlID0gbm87XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBOb0Nob29zZS5wcm90b3R5cGUub2J0ZW5oYVNxbCA9IGZ1bmN0aW9uIChjb21hbmRvU3FsLCBkYWRvcykge1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gdGhpcy5maWxob3MpIHtcclxuICAgICAgICAgICAgdmFyIG5vID0gdGhpcy5maWxob3NbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAobm8gaW5zdGFuY2VvZiBOb1doZW4pIHtcclxuICAgICAgICAgICAgICAgIHZhciBub1doZW4gPSBubztcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgZXhwcmVzc2FvID0gbm9XaGVuLmV4cHJlc3Nhb1Rlc3RlLnJlcGxhY2UoJyN7JywgXCJkYWRvcy5cIikucmVwbGFjZShcIn1cIiwgXCJcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgdHJ5ICB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZhbCgnaWYoICcgKyBleHByZXNzYW8gKyAnICkgZGFkb3MudmFsb3JFeHByZXNzYW8gPSB0cnVlOyBlbHNlIGRhZG9zLnZhbG9yRXhwcmVzc2FvID0gZmFsc2U7Jyk7XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBkYWRvcy52YWxvckV4cHJlc3NhbyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChkYWRvcy52YWxvckV4cHJlc3Nhbykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBub1doZW4ub2J0ZW5oYVNxbChjb21hbmRvU3FsLCBkYWRvcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vT3RoZXJ3aXNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm5vT3RoZXJ3aXNlLm9idGVuaGFTcWwoY29tYW5kb1NxbCwgZGFkb3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICcnO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOb0Nob29zZTtcclxufSkoTm8pO1xyXG5leHBvcnRzLk5vQ2hvb3NlID0gTm9DaG9vc2U7XHJcblxyXG52YXIgTm9XaGVuID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhOb1doZW4sIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBOb1doZW4oZXhwcmVzc2FvVGVzdGUsIHRleHRvLCBtYXBlYW1lbnRvKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgJycsIG1hcGVhbWVudG8pO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2FvVGVzdGUgPSBleHByZXNzYW9UZXN0ZTtcclxuICAgICAgICB0aGlzLnRleHRvID0gdGV4dG87XHJcblxyXG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1tfYS16QS1aXVtfYS16QS1aMC05XXswLDMwfScsICdpZycpO1xyXG4gICAgICAgIHZhciBpZGVudGlmaWNhZG9yZXMgPSBbXTtcclxuICAgICAgICB3aGlsZSAoKG15QXJyYXkgPSByZWdleC5leGVjKGV4cHJlc3Nhb1Rlc3RlKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGlkZW50aWZpY2Fkb3IgPSBteUFycmF5WzBdO1xyXG5cclxuICAgICAgICAgICAgaWYoIGlkZW50aWZpY2Fkb3IgPT0gJ251bGwnIHx8IGlkZW50aWZpY2Fkb3IgPT0gJ3RydWUnIHx8IGlkZW50aWZpY2Fkb3IgPT0gJ2ZhbHNlJyB8fCBpZGVudGlmaWNhZG9yID09ICdhbmQnICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBpZGVudGlmaWNhZG9yZXMucHVzaChpZGVudGlmaWNhZG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgaWRlbnRpZmljYWRvcmVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB2YXIgaWRlbnRpZmljYWRvciA9IGlkZW50aWZpY2Fkb3Jlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2FvVGVzdGUgPSB0aGlzLmV4cHJlc3Nhb1Rlc3RlLnJlcGxhY2UoaWRlbnRpZmljYWRvciwgXCJkYWRvcy5cIiArIGlkZW50aWZpY2Fkb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5leHByZXNzYW9UZXN0ZSA9IFModGhpcy5leHByZXNzYW9UZXN0ZSkucmVwbGFjZUFsbCgnYW5kJywgJyYmJykudG9TdHJpbmcoKTtcclxuICAgIH1cclxuXHJcbiAgICBOb1doZW4ucHJvdG90eXBlLmltcHJpbWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdGxvZ2dlci5lcnJvcignd2hlbignICsgdGhpcy5leHByZXNzYW9UZXN0ZSArICcpOiAnICsgdGhpcy50ZXh0byk7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3doZW4oJyArIHRoaXMuZXhwcmVzc2FvVGVzdGUgKyAnKTogJyArIHRoaXMudGV4dG8pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTm9XaGVuO1xyXG59KShObyk7XHJcbmV4cG9ydHMuTm9XaGVuID0gTm9XaGVuO1xyXG5cclxudmFyIE5vRm9yRWFjaCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTm9Gb3JFYWNoLCBfc3VwZXIpO1xyXG4gICAgZnVuY3Rpb24gTm9Gb3JFYWNoKGl0ZW0sIGluZGV4LCBzZXBhcmFkb3IsIGFiZXJ0dXJhLCBmZWNoYW1lbnRvLCB0ZXh0bywgY29sbGVjdGlvbiwgbWFwZWFtZW50bykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsICcnLCBtYXBlYW1lbnRvKTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtID0gaXRlbTtcclxuICAgICAgICB0aGlzLmluZGV4ID0gaW5kZXg7XHJcbiAgICAgICAgdGhpcy5zZXBhcmFkb3IgPSBzZXBhcmFkb3I7XHJcbiAgICAgICAgdGhpcy5hYmVydHVyYSA9IGFiZXJ0dXJhO1xyXG4gICAgICAgIHRoaXMuZmVjaGFtZW50byA9IGZlY2hhbWVudG87XHJcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uID0gY29sbGVjdGlvbjtcclxuICAgICAgICB0aGlzLnRleHRvID0gdGV4dG8udHJpbSgpO1xyXG4gICAgfVxyXG4gICAgTm9Gb3JFYWNoLnByb3RvdHlwZS5vYnRlbmhhU3FsID0gZnVuY3Rpb24gKGNvbWFuZG9TcWwsIGRhZG9zKSB7XHJcbiAgICAgICAgdmFyIHRleHRvID0gW107XHJcblxyXG4gICAgICAgIHZhciBjb2xlY2FvID0gZGFkb3NbdGhpcy5jb2xsZWN0aW9uXTtcclxuXHJcbiAgICAgICAgaWYgKGNvbGVjYW8gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAodXRpbC5pc0FycmF5KGRhZG9zKSkge1xyXG4gICAgICAgICAgICAgICAgY29sZWNhbyA9IGRhZG9zO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYWJlcnR1cmEgKyB0aGlzLmZlY2hhbWVudG87XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sZWNhby5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IGNvbGVjYW9baV07XHJcblxyXG4gICAgICAgICAgICB2YXIgbXlBcnJheTtcclxuICAgICAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnI1xceyhbX2Etei5BLVpdKyl9JywgJ2lnJyk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZXhwcmVzc2FvID0gdGhpcy50ZXh0bztcclxuXHJcbiAgICAgICAgICAgIHZhciBub3ZhRXhwcmVzc2FvID0gZXhwcmVzc2FvO1xyXG4gICAgICAgICAgICB3aGlsZSAoKG15QXJyYXkgPSByZWdleC5leGVjKGV4cHJlc3NhbykpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHJlY2hvID0gbXlBcnJheVswXTtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wcmllZGFkZSA9IG15QXJyYXlbMV0ucmVwbGFjZSh0aGlzLml0ZW0gKyBcIi5cIiwgJycpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbG9yUHJvcHJpZWRhZGUgPSB0aGlzLmdldFZhbHVlKGl0ZW0sIHByb3ByaWVkYWRlLnNwbGl0KFwiLlwiKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWxvclByb3ByaWVkYWRlID09IFwibnVtYmVyXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBub3ZhRXhwcmVzc2FvID0gbm92YUV4cHJlc3Nhby5yZXBsYWNlKHRyZWNobywgJz8nKTtcclxuICAgICAgICAgICAgICAgICAgICBjb21hbmRvU3FsLmFkaWNpb25lUGFyYW1ldHJvKHZhbG9yUHJvcHJpZWRhZGUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsb3JQcm9wcmllZGFkZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgIG5vdmFFeHByZXNzYW8gPSBub3ZhRXhwcmVzc2FvLnJlcGxhY2UodHJlY2hvLCAnPycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbWFuZG9TcWwuYWRpY2lvbmVQYXJhbWV0cm8odmFsb3JQcm9wcmllZGFkZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRleHRvLnB1c2gobm92YUV4cHJlc3Nhbyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgc3FsID0gdGhpcy5hYmVydHVyYSArIHRleHRvLmpvaW4odGhpcy5zZXBhcmFkb3IpICsgdGhpcy5mZWNoYW1lbnRvO1xyXG5cclxuICAgICAgICBjb21hbmRvU3FsLnNxbCArPSBzcWw7XHJcblxyXG4gICAgICAgIHJldHVybiBjb21hbmRvU3FsO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOb0ZvckVhY2g7XHJcbn0pKE5vKTtcclxuZXhwb3J0cy5Ob0ZvckVhY2ggPSBOb0ZvckVhY2g7XHJcblxyXG52YXIgTm9JZiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTm9JZiwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vSWYoZXhwcmVzc2FvVGVzdGUsIHRleHRvLCBtYXBlYW1lbnRvKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgJycsIG1hcGVhbWVudG8pO1xyXG4gICAgICAgIHRoaXMuZXhwcmVzc2FvVGVzdGUgPSBleHByZXNzYW9UZXN0ZTtcclxuICAgICAgICB0aGlzLnRleHRvID0gdGV4dG87XHJcblxyXG4gICAgICAgIHZhciByZWdleCA9IG5ldyBSZWdFeHAoJ1tfYS16QS1aXVtfYS16QS1aMC05XXswLDMwfScsICdpZycpO1xyXG4gICAgICAgIHZhciBpZGVudGlmaWNhZG9yZXMgPSBbXTtcclxuICAgICAgICB3aGlsZSAoKG15QXJyYXkgPSByZWdleC5leGVjKGV4cHJlc3Nhb1Rlc3RlKSkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIGlkZW50aWZpY2Fkb3IgPSBteUFycmF5WzBdO1xyXG5cclxuICAgICAgICAgICAgaWYoIGlkZW50aWZpY2Fkb3IgPT0gJ251bGwnICkgY29udGludWU7XHJcblxyXG4gICAgICAgICAgICBpZGVudGlmaWNhZG9yZXMucHVzaChpZGVudGlmaWNhZG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciggdmFyIGkgPSAwOyBpIDwgaWRlbnRpZmljYWRvcmVzLmxlbmd0aDsgaSsrICkge1xyXG4gICAgICAgICAgICB2YXIgaWRlbnRpZmljYWRvciA9IGlkZW50aWZpY2Fkb3Jlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXhwcmVzc2FvVGVzdGUgPSB0aGlzLmV4cHJlc3Nhb1Rlc3RlLnJlcGxhY2UoaWRlbnRpZmljYWRvciwgXCJkYWRvcy5cIiArIGlkZW50aWZpY2Fkb3IpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIE5vSWYucHJvdG90eXBlLmltcHJpbWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2lmKCcgKyB0aGlzLmV4cHJlc3Nhb1Rlc3RlICsgJyk6ICcgKyB0aGlzLnRleHRvKTtcclxuICAgIH07XHJcblxyXG4gICAgTm9JZi5wcm90b3R5cGUub2J0ZW5oYVNxbCA9IGZ1bmN0aW9uKGNvbWFuZG9TcWwsIGRhZG9zKSB7XHJcbiAgICAgICAgdmFyIGV4cHJlc3NhbyA9IHRoaXMuZXhwcmVzc2FvVGVzdGUucmVwbGFjZSgnI3snLCBcImRhZG9zLlwiKS5yZXBsYWNlKFwifVwiLCBcIlwiKTtcclxuXHJcbiAgICAgICAgdHJ5ICB7XHJcbiAgICAgICAgICAgIGV2YWwoJ2lmKCAnICsgZXhwcmVzc2FvICsgJyApIGRhZG9zLnZhbG9yRXhwcmVzc2FvID0gdHJ1ZTsgZWxzZSBkYWRvcy52YWxvckV4cHJlc3NhbyA9IGZhbHNlOycpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBkYWRvcy52YWxvckV4cHJlc3NhbyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGRhZG9zLnZhbG9yRXhwcmVzc2FvID09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy50ZXh0byk7XHJcbiAgICAgICAgLy9jb21hbmRvU3FsLnNxbCArPSBfc3VwZXIucHJvdG90eXBlLnByb2Nlc3NlRXhwcmVzc2FvLmNhbGwodGhpcywgdGhpcy50ZXh0bywgY29tYW5kb1NxbCwgZGFkb3MpICsgXCIgXCI7XHJcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5vYnRlbmhhU3FsLmNhbGwodGhpcywgY29tYW5kb1NxbCwgZGFkb3MpICsgXCIgXCI7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vSWY7XHJcbn0pKE5vKTtcclxuZXhwb3J0cy5Ob0lmID0gTm9JZjtcclxuXHJcbnZhciBOb090aGVyd2lzZSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XHJcbiAgICBfX2V4dGVuZHMoTm9PdGhlcndpc2UsIF9zdXBlcik7XHJcbiAgICBmdW5jdGlvbiBOb090aGVyd2lzZSh0ZXh0bywgbWFwZWFtZW50bykge1xyXG4gICAgICAgIF9zdXBlci5jYWxsKHRoaXMsICcnLCBtYXBlYW1lbnRvKTtcclxuXHJcbiAgICAgICAgdGhpcy50ZXh0byA9IHRleHRvO1xyXG4gICAgfVxyXG4gICAgTm9PdGhlcndpc2UucHJvdG90eXBlLmltcHJpbWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ290aGVyd2lzZSgnICsgdGhpcy50ZXh0byArICcpJyk7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vT3RoZXJ3aXNlLnByb3RvdHlwZS5vYnRlbmhhU3FsID0gZnVuY3Rpb24gKGNvbWFuZG9TcWwsIGRhZG9zKSB7XHJcbiAgICAgICAgdmFyIG15QXJyYXk7XHJcbiAgICAgICAgdmFyIHJlZ2V4ID0gbmV3IFJlZ0V4cCgnI1xceyhbYS16LkEtWl0rKX0nLCAnaWcnKTtcclxuXHJcbiAgICAgICAgdmFyIGV4cHJlc3NhbyA9IHRoaXMudGV4dG87XHJcblxyXG4gICAgICAgIHdoaWxlICgobXlBcnJheSA9IHJlZ2V4LmV4ZWModGhpcy50ZXh0bykpICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciB0cmVjaG8gPSBteUFycmF5WzBdO1xyXG4gICAgICAgICAgICB2YXIgdmFsb3JQcm9wcmllZGFkZSA9IHRoaXMuZ2V0VmFsdWUoZGFkb3MsIG15QXJyYXlbMV0uc3BsaXQoJy4nKSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbG9yUHJvcHJpZWRhZGUgPT0gXCJudW1iZXJcIikge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2FvID0gZXhwcmVzc2FvLnJlcGxhY2UodHJlY2hvLCAnPycpO1xyXG4gICAgICAgICAgICAgICAgY29tYW5kb1NxbC5hZGljaW9uZVBhcmFtZXRybyh2YWxvclByb3ByaWVkYWRlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsb3JQcm9wcmllZGFkZSA9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgZXhwcmVzc2FvID0gZXhwcmVzc2FvLnJlcGxhY2UodHJlY2hvLCAnPycpO1xyXG4gICAgICAgICAgICAgICAgY29tYW5kb1NxbC5hZGljaW9uZVBhcmFtZXRybyh2YWxvclByb3ByaWVkYWRlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsb3JQcm9wcmllZGFkZSA9PSAnYm9vbGVhbicpIHtcclxuICAgICAgICAgICAgICAgIGV4cHJlc3NhbyA9IGV4cHJlc3Nhby5yZXBsYWNlKHRyZWNobywgJz8nKTtcclxuICAgICAgICAgICAgICAgIGNvbWFuZG9TcWwuYWRpY2lvbmVQYXJhbWV0cm8odmFsb3JQcm9wcmllZGFkZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbWFuZG9TcWwuc3FsICs9IGV4cHJlc3NhbyArIFwiIFwiO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTm9PdGhlcndpc2U7XHJcbn0pKE5vKTtcclxuZXhwb3J0cy5Ob090aGVyd2lzZSA9IE5vT3RoZXJ3aXNlO1xyXG5cclxudmFyIE5vUHJvcHJpZWRhZGUgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTm9Qcm9wcmllZGFkZShub21lLCBjb2x1bmEscHJlZml4bykge1xyXG4gICAgICAgIHRoaXMubm9tZSA9IG5vbWU7XHJcbiAgICAgICAgdGhpcy5jb2x1bmEgPSBjb2x1bmE7XHJcbiAgICAgICAgdGhpcy5wcmVmaXhvID0gcHJlZml4bztcclxuICAgIH1cclxuICAgIE5vUHJvcHJpZWRhZGUucHJvdG90eXBlLmltcHJpbWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5ub21lICsgXCIgLT4gXCIgKyB0aGlzLm9idGVuaGFDb2x1bmEoKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vUHJvcHJpZWRhZGUucHJvdG90eXBlLm9idGVuaGFDb2x1bmEgPSBmdW5jdGlvbihwcmVmaXhvKXtcclxuICAgICAgICByZXR1cm4gcHJlZml4byA/IHByZWZpeG8gKyB0aGlzLmNvbHVuYSA6IHRoaXMuY29sdW5hO1xyXG4gICAgfVxyXG4gICAgTm9Qcm9wcmllZGFkZS5wcm90b3R5cGUuY3JpZU9iamV0byA9IGZ1bmN0aW9uIChnZXJlbmNpYWRvckRlTWFwZWFtZW50b3MsIGNhY2hlRGVPYmpldG9zLCBvYmpldG8sIHJlZ2lzdHJvLCBjaGF2ZVBhaSkge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfTtcclxuICAgIHJldHVybiBOb1Byb3ByaWVkYWRlO1xyXG59KSgpO1xyXG5leHBvcnRzLk5vUHJvcHJpZWRhZGUgPSBOb1Byb3ByaWVkYWRlO1xyXG5cclxuXHJcbnZhciBOb1Byb3ByaWVkYWRlSWQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE5vUHJvcHJpZWRhZGVJZCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vUHJvcHJpZWRhZGVJZChub21lLCBjb2x1bmEpIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBub21lLCBjb2x1bmEpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBOb1Byb3ByaWVkYWRlSWQ7XHJcbn0pKE5vUHJvcHJpZWRhZGUpO1xyXG5leHBvcnRzLk5vUHJvcHJpZWRhZGVJZCA9IE5vUHJvcHJpZWRhZGVJZDtcclxuXHJcbnZhciBOb0Fzc29jaWFjYW8gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xyXG4gICAgX19leHRlbmRzKE5vQXNzb2NpYWNhbywgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vQXNzb2NpYWNhbyhub21lLCBjb2x1bmEsIGNvbHVtblByZWZpeCxyZXN1bHRNYXApIHtcclxuICAgICAgICBfc3VwZXIuY2FsbCh0aGlzLCBub21lLCBjb2x1bmEsY29sdW1uUHJlZml4KTtcclxuXHJcbiAgICAgICAgdGhpcy5yZXN1bHRNYXAgPSByZXN1bHRNYXA7XHJcbiAgICB9XHJcbiAgICBOb0Fzc29jaWFjYW8ucHJvdG90eXBlLmltcHJpbWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Fzc29jaWFjYW8oJyArIHRoaXMubm9tZSArIHNlcGFyYWRvciArIHRoaXMub2J0ZW5oYUNvbHVuYSh0aGlzLnByZWZpeG8pICsgXCIgLT4gXCIgKyB0aGlzLnJlc3VsdE1hcCk7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vQXNzb2NpYWNhby5wcm90b3R5cGUub2J0ZW5oYU5vbWVDb21wbGV0byA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmKCB0aGlzLnJlc3VsdE1hcC5pbmRleE9mKFwiLlwiKSA9PSAtMSApIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubm9tZSArIFwiLlwiICsgdGhpcy5yZXN1bHRNYXA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5yZXN1bHRNYXA7XHJcbiAgICB9XHJcblxyXG4gICAgTm9Bc3NvY2lhY2FvLnByb3RvdHlwZS5jcmllT2JqZXRvID0gZnVuY3Rpb24gKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgY2FjaGVEZU9iamV0b3MsIGFuY2VzdG9yQ2FjaGUsIG9iamV0bywgcmVnaXN0cm8sIGNoYXZlUGFpKSB7XHJcbiAgICAgICAgdmFyIG5vID0gZ2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLm9idGVuaGFSZXN1bHRNYXAodGhpcy5yZXN1bHRNYXApO1xyXG5cclxuICAgICAgICBpZighbm8pIHRocm93ICBuZXcgRXJyb3IoJ05lbmh1bSBuw7MgY29tIG5vbWUgZm9pIGVuY29udHJhZG86ICcgKyB0aGlzLnJlc3VsdE1hcCk7XHJcblxyXG4gICAgICAgIHZhciBjaGF2ZU9iamV0byA9IG5vLm9idGVuaGFDaGF2ZShyZWdpc3RybywgY2hhdmVQYWksdGhpcy5wcmVmaXhvKTtcclxuICAgICAgICB2YXIgY2hhdmVDb21iaW5hZGEgPSBuby5vYnRlbmhhQ2hhdmVDb21iaW5hZGEoY2hhdmVQYWksIGNoYXZlT2JqZXRvKTtcclxuXHJcbiAgICAgICAgdmFyIG9iamV0b0NvbmhlY2lkbyA9IGNhY2hlRGVPYmpldG9zW2NoYXZlQ29tYmluYWRhXSAhPSBudWxsO1xyXG5cclxuICAgICAgICB2YXIgb2JqZXRvQ29sZWNhbyA9IG5vLmNyaWVPYmpldG8oZ2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLCBjYWNoZURlT2JqZXRvcywgYW5jZXN0b3JDYWNoZSwgcmVnaXN0cm8sIGNoYXZlUGFpLHRoaXMucHJlZml4byk7XHJcblxyXG4gICAgICAgIGlmIChvYmpldG9Db2xlY2FvID09IG51bGwgfHwgb2JqZXRvQ29uaGVjaWRvID09IHRydWUpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgb2JqZXRvW3RoaXMubm9tZV0gPSBvYmpldG9Db2xlY2FvO1xyXG5cclxuXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vQXNzb2NpYWNhbztcclxufSkoTm9Qcm9wcmllZGFkZSk7XHJcbmV4cG9ydHMuTm9Bc3NvY2lhY2FvID0gTm9Bc3NvY2lhY2FvO1xyXG5cclxudmFyIE5vUHJvcHJpZWRhZGVDb2xlY2FvID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhOb1Byb3ByaWVkYWRlQ29sZWNhbywgX3N1cGVyKTtcclxuXHJcbiAgICBmdW5jdGlvbiBOb1Byb3ByaWVkYWRlQ29sZWNhbyhub21lLCBjb2x1bmEscHJlZml4bywgcmVzdWx0TWFwLCBvZlR5cGUsIHRpcG9KYXZhKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgbm9tZSwgY29sdW5hLHByZWZpeG8pO1xyXG5cclxuICAgICAgICB0aGlzLnJlc3VsdE1hcCA9IHJlc3VsdE1hcDtcclxuXHJcbiAgICAgICAgdGhpcy5vZlR5cGUgPSBvZlR5cGU7XHJcbiAgICAgICAgdGhpcy50aXBvSmF2YSA9IHRpcG9KYXZhO1xyXG4gICAgfVxyXG5cclxuICAgIE5vUHJvcHJpZWRhZGVDb2xlY2FvLnByb3RvdHlwZS5pbXByaW1hID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjb2xlY2FvKCcgKyB0aGlzLm5vbWUgKyBzZXBhcmFkb3IgKyB0aGlzLmNvbHVuYSArIFwiIC0+IFwiICsgdGhpcy5yZXN1bHRNYXApO1xyXG4gICAgfTtcclxuXHJcbiAgICBOb1Byb3ByaWVkYWRlQ29sZWNhby5wcm90b3R5cGUuY3JpZU9iamV0byA9IGZ1bmN0aW9uIChnZXJlbmNpYWRvckRlTWFwZWFtZW50b3MsIGNhY2hlRGVPYmpldG9zLCBhbmNlc3RvckNhY2hlLCBvYmpldG8sIHJlZ2lzdHJvLCBjaGF2ZVBhaSkge1xyXG4gICAgICAgIHZhciBubyA9IGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcy5vYnRlbmhhUmVzdWx0TWFwKHRoaXMucmVzdWx0TWFwKTtcclxuXHJcbiAgICAgICAgdmFyIGNoYXZlT2JqZXRvID0gbm8ub2J0ZW5oYUNoYXZlKHJlZ2lzdHJvLCBjaGF2ZVBhaSx0aGlzLnByZWZpeG8pO1xyXG4gICAgICAgIHZhciBjaGF2ZUNvbWJpbmFkYSA9IGNoYXZlUGFpICsgc2VwYXJhZG9yICsgY2hhdmVPYmpldG87XHJcblxyXG4gICAgICAgIHZhciBvYmpldG9Db25oZWNpZG8gPSBjYWNoZURlT2JqZXRvc1tjaGF2ZUNvbWJpbmFkYV0gIT0gbnVsbDtcclxuXHJcbiAgICAgICAgdmFyIG9iamV0b0NvbGVjYW8gPSBuby5jcmllT2JqZXRvKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgY2FjaGVEZU9iamV0b3MsIGFuY2VzdG9yQ2FjaGUsIHJlZ2lzdHJvLCBjaGF2ZVBhaSx0aGlzLnByZWZpeG8pO1xyXG5cclxuICAgICAgICBpZiAob2JqZXRvW3RoaXMubm9tZV0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICBvYmpldG9bdGhpcy5ub21lXSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKG9iamV0b0NvbGVjYW8gPT0gbnVsbCB8fCBvYmpldG9Db25oZWNpZG8gPT0gdHJ1ZSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBvYmpldG9bdGhpcy5ub21lXS5wdXNoKG9iamV0b0NvbGVjYW8pO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTm9Qcm9wcmllZGFkZUNvbGVjYW87XHJcblxyXG59KShOb1Byb3ByaWVkYWRlKTtcclxuZXhwb3J0cy5Ob1Byb3ByaWVkYWRlQ29sZWNhbyA9IE5vUHJvcHJpZWRhZGVDb2xlY2FvO1xyXG5cclxudmFyIE5vUmVzdWx0TWFwID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcclxuICAgIF9fZXh0ZW5kcyhOb1Jlc3VsdE1hcCwgX3N1cGVyKTtcclxuICAgIGZ1bmN0aW9uIE5vUmVzdWx0TWFwKGlkLCB0aXBvLCBtYXBlYW1lbnRvKSB7XHJcbiAgICAgICAgX3N1cGVyLmNhbGwodGhpcywgaWQsIG1hcGVhbWVudG8pO1xyXG4gICAgICAgIHRoaXMudGlwbyA9IHRpcG87XHJcbiAgICAgICAgdGhpcy5wcm9wcmllZGFkZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnByb3ByaWVkYWRlc0lkID0gW107XHJcbiAgICB9XHJcbiAgICBOb1Jlc3VsdE1hcC5wcm90b3R5cGUuZGVmaW5hUHJvcHJpZWRhZGVJZCA9IGZ1bmN0aW9uIChwcm9wcmllZGFkZUlkKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcmllZGFkZXNJZC5wdXNoKHByb3ByaWVkYWRlSWQpO1xyXG4gICAgfTtcclxuXHJcbiAgICBOb1Jlc3VsdE1hcC5wcm90b3R5cGUuZW5jb250cmVQcm9wcmllZGFkZUlkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBwcm9wcmllZGFkZSA9IG51bGw7XHJcbiAgICAgICAgdmFyIGk7XHJcbiAgICAgICAgdmFyIGVuY29udHJvdSA9IGZhbHNlO1xyXG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLnByb3ByaWVkYWRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBwcm9wcmllZGFkZSA9IHRoaXMucHJvcHJpZWRhZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3ByaWVkYWRlLm5vbWUgPT0gJ2lkJykge1xyXG4gICAgICAgICAgICAgICAgZW5jb250cm91ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZighZW5jb250cm91KSByZXR1cm47XHJcblxyXG4gICAgICAgIHRoaXMuZGVmaW5hUHJvcHJpZWRhZGVJZChuZXcgTm9Qcm9wcmllZGFkZUlkKHByb3ByaWVkYWRlLm5vbWUsIHByb3ByaWVkYWRlLm9idGVuaGFDb2x1bmEoKSkpO1xyXG4gICAgICAgIHRoaXMucHJvcHJpZWRhZGVzLnNwbGljZShpLCAxKTtcclxuICAgIH07XHJcblxyXG4gICAgTm9SZXN1bHRNYXAucHJvdG90eXBlLmRlZmluYURpc2NyaW1pbmF0b3IgPSBmdW5jdGlvbiAobm9EaXNjcmltaW5hZG9yKSB7XHJcbiAgICAgICAgdGhpcy5ub0Rpc2NyaW1pbmFkb3IgPSBub0Rpc2NyaW1pbmFkb3I7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vUmVzdWx0TWFwLnByb3RvdHlwZS5hZGljaW9uZSA9IGZ1bmN0aW9uIChwcm9wcmllZGFkZSkge1xyXG4gICAgICAgIHRoaXMucHJvcHJpZWRhZGVzLnB1c2gocHJvcHJpZWRhZGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICBOb1Jlc3VsdE1hcC5wcm90b3R5cGUuaW1wcmltYSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMucHJvcHJpZWRhZGVzSWQpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BJZCA9IHRoaXMucHJvcHJpZWRhZGVzSWRbaV07XHJcblxyXG4gICAgICAgICAgICBwcm9wSWQuaW1wcmltYSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSBpbiB0aGlzLnByb3ByaWVkYWRlcykge1xyXG4gICAgICAgICAgICB2YXIgcHJvcHJpZWRhZGUgPSB0aGlzLnByb3ByaWVkYWRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIHByb3ByaWVkYWRlLmltcHJpbWEoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm5vRGlzY3JpbWluYWRvcilcclxuICAgICAgICAgICAgdGhpcy5ub0Rpc2NyaW1pbmFkb3IuaW1wcmltYSgpO1xyXG4gICAgfTtcclxuXHJcbiAgICBOb1Jlc3VsdE1hcC5wcm90b3R5cGUub2J0ZW5oYUNoYXZlQ29tYmluYWRhID0gZnVuY3Rpb24oY2hhdmVQYWksIGNoYXZlKSB7XHJcbiAgICAgICAgdmFyIGNoYXZlQ29tYmluYWRhID0gY2hhdmU7XHJcblxyXG4gICAgICAgIGlmKCBjaGF2ZVBhaSApIHtcclxuICAgICAgICAgICAgY2hhdmVDb21iaW5hZGEgPSBjaGF2ZVBhaSArIHNlcGFyYWRvciArIGNoYXZlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGNoYXZlQ29tYmluYWRhO1xyXG4gICAgfVxyXG5cclxuICAgIE5vUmVzdWx0TWFwLnByb3RvdHlwZS5vYnRlbmhhQ2hhdmUgPSBmdW5jdGlvbiAocmVnaXN0cm8sIGNoYXZlUGFpLHByZWZpeG8pIHtcclxuICAgICAgICB2YXIgY2hhdmUgPSB0aGlzLm9idGVuaGFOb21lQ29tcGxldG8oKSArIHNlcGFyYWRvcjtcclxuXHJcbiAgICAgICAgdmFyIHBlZGFjb09iamV0byA9ICcnO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMucHJvcHJpZWRhZGVzSWQpIHtcclxuICAgICAgICAgICAgdmFyIHByb3ByaWVkYWRlID0gdGhpcy5wcm9wcmllZGFkZXNJZFtpXTtcclxuXHJcbiAgICAgICAgICAgIHZhciB2YWxvciA9IHJlZ2lzdHJvW3Byb3ByaWVkYWRlLm9idGVuaGFDb2x1bmEocHJlZml4byldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbG9yICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHBlZGFjb09iamV0byArPSB2YWxvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vdGhyb3cgbmV3IEVycm9yKFwiQ2hhdmUgZG8gb2JqZXRvIG7Do28gcG9kZSBzZXIgY2FsY3VsYWRhLiBcXG5Db2x1bmEgJ1wiICsgcHJvcHJpZWRhZGUuY29sdW5hICsgXCInIG7Do28gZW5jb250cmFkYSBwYXJhIG8gcmVzdWx0TWFwICdcIiArIHRoaXMuaWQgKyBcIidcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChwZWRhY29PYmpldG8gPT0gJycpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjaGF2ZSArPSBwZWRhY29PYmpldG87XHJcblxyXG4gICAgICAgIHJldHVybiBjaGF2ZTtcclxuICAgIH07XHJcblxyXG4gICAgTm9SZXN1bHRNYXAucHJvdG90eXBlLmNyaWVPYmpldG9zID0gZnVuY3Rpb24gKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgcmVnaXN0cm9zKSB7XHJcbiAgICAgICAgdmFyIG9iamV0b3MgPSBbXTtcclxuICAgICAgICB2YXIgY2FjaGVEZU9iamV0b3MgPSB7fTtcclxuICAgICAgICB2YXIgYW5jZXN0b3JDYWNoZSA9IHt9O1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpIGluIHJlZ2lzdHJvcykge1xyXG4gICAgICAgICAgICB2YXIgcmVnaXN0cm8gPSByZWdpc3Ryb3NbaV07XHJcblxyXG4gICAgICAgICAgICB2YXIgY2hhdmVPYmpldG8gPSB0aGlzLm9idGVuaGFDaGF2ZShyZWdpc3RybywgJycpO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamV0b0NvbmhlY2lkbyA9IGNhY2hlRGVPYmpldG9zW2NoYXZlT2JqZXRvXSAhPSBudWxsO1xyXG5cclxuICAgICAgICAgICAgdmFyIG9iamV0byA9IHRoaXMuY3JpZU9iamV0byhnZXJlbmNpYWRvckRlTWFwZWFtZW50b3MsIGNhY2hlRGVPYmpldG9zLCBhbmNlc3RvckNhY2hlLCByZWdpc3RybywgJycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKCFvYmpldG9Db25oZWNpZG8gJiYgb2JqZXRvKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpldG9zLnB1c2gob2JqZXRvKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG9iamV0b3M7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vUmVzdWx0TWFwLnByb3RvdHlwZS5jcmllT2JqZXRvID0gZnVuY3Rpb24gKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgY2FjaGVEZU9iamV0b3MsIGFuY2VzdG9yQ2FjaGUsIHJlZ2lzdHJvLCBjaGF2ZVBhaSxwcmVmaXhvKSB7XHJcbiAgICAgICAgdmFyIGNoYXZlT2JqZXRvID0gdGhpcy5vYnRlbmhhQ2hhdmUocmVnaXN0cm8sIGNoYXZlUGFpLHByZWZpeG8pO1xyXG4gICAgICAgIHZhciBjaGF2ZUNvbWJpbmFkYSA9IHRoaXMub2J0ZW5oYUNoYXZlQ29tYmluYWRhKGNoYXZlUGFpLCBjaGF2ZU9iamV0byk7XHJcblxyXG4gICAgICAgIGlmKCBhbmNlc3RvckNhY2hlW2NoYXZlT2JqZXRvXSAhPSBudWxsICkge1xyXG4gICAgICAgICAgICByZXR1cm4gYW5jZXN0b3JDYWNoZVtjaGF2ZU9iamV0b107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjYWNoZURlT2JqZXRvc1tjaGF2ZUNvbWJpbmFkYV0gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBjYWNoZURlT2JqZXRvc1tjaGF2ZUNvbWJpbmFkYV07XHJcblxyXG4gICAgICAgICAgICBhbmNlc3RvckNhY2hlW2NoYXZlT2JqZXRvXSA9IGluc3RhbmNlO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzZUNvbGVjb2VzKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgY2FjaGVEZU9iamV0b3MsIGFuY2VzdG9yQ2FjaGUsIGluc3RhbmNlLCByZWdpc3RybywgY2hhdmVDb21iaW5hZGEpO1xyXG5cclxuICAgICAgICAgICAgZGVsZXRlIGFuY2VzdG9yQ2FjaGVbY2hhdmVPYmpldG9dO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciBub21lTW9kZWwgPSB0aGlzLm9idGVuaGFOb21lTW9kZWwocmVnaXN0cm8scHJlZml4byksXHJcbiAgICAgICAgICAgICAgICBpZENoYXZlID0gY2hhdmVPYmpldG8gJiYgY2hhdmVPYmpldG8uc3BsaXQoc2VwYXJhZG9yKVsxXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtb2RlbCA9IGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcy5vYnRlbmhhTW9kZWwobm9tZU1vZGVsKTtcclxuXHJcbiAgICAgICAgICAgIG1vZGVsID0gbW9kZWxbbm9tZU1vZGVsXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChtb2RlbCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgIFx0bG9nZ2VyLmVycm9yKFwiQ2xhc3MgXCIgKyBub21lTW9kZWwgKyBcIi5cIiArIG5vbWVNb2RlbCArIFwiIGNhbid0IGJlIGZvdW5kLlwiKTtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNsYXNzZSBcIiArIG5vbWVNb2RlbCArIFwiLlwiICsgbm9tZU1vZGVsICsgXCIgbsOjbyBlbmNvbnRyYWRhXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKG1vZGVsLnByb3RvdHlwZSk7XHJcbiAgICAgICAgICAgIGluc3RhbmNlLmNvbnN0cnVjdG9yLmFwcGx5KGluc3RhbmNlLCBbXSk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZW5jb250cm91VmFsb3JlcyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYoY2hhdmVPYmpldG8pXHJcbiAgICAgICAgICAgICAgICBhbmNlc3RvckNhY2hlW2NoYXZlT2JqZXRvXSA9IGluc3RhbmNlO1xyXG5cclxuICAgICAgICAgICAgZW5jb250cm91VmFsb3JlcyA9IHRoaXMuYXRyaWJ1YVByb3ByaWVkYWRlc1NpbXBsZXMoaW5zdGFuY2UsIHJlZ2lzdHJvLHByZWZpeG8pO1xyXG4gICAgICAgICAgICBpZiggY2hhdmVPYmpldG8gIT0gbnVsbCApIHtcclxuICAgICAgICAgICAgICAgIGVuY29udHJvdVZhbG9yZXMgPSB0aGlzLnByb2Nlc3NlQ29sZWNvZXMoZ2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLCBjYWNoZURlT2JqZXRvcywgYW5jZXN0b3JDYWNoZSwgaW5zdGFuY2UsIHJlZ2lzdHJvLCBjaGF2ZUNvbWJpbmFkYSkgfHwgZW5jb250cm91VmFsb3JlcztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZGVsZXRlIGFuY2VzdG9yQ2FjaGVbY2hhdmVPYmpldG9dO1xyXG5cclxuICAgICAgICAgICAgaWYoICFlbmNvbnRyb3VWYWxvcmVzIHx8IChpZENoYXZlICYmICBpbnN0YW5jZS5pZCAmJiBpZENoYXZlICE9IGluc3RhbmNlLmlkLnRvU3RyaW5nKCkpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2hhdmVDb21iaW5hZGEgJiYgZW5jb250cm91VmFsb3JlcyAmJiBpbnN0YW5jZS5pZCAhPSBudWxsICYmIGNoYXZlQ29tYmluYWRhLmluZGV4T2YoJ251bGwnKSA8IDApXHJcbiAgICAgICAgICAgICAgICBjYWNoZURlT2JqZXRvc1tjaGF2ZUNvbWJpbmFkYV0gPSBpbnN0YW5jZTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9O1xyXG5cclxuICAgIE5vUmVzdWx0TWFwLnByb3RvdHlwZS5vYnRlbmhhTm9tZU1vZGVsID0gZnVuY3Rpb24ocmVnaXN0cm8scHJlZml4byl7XHJcbiAgICAgICAgdmFyIHRpcG9ObztcclxuICAgICAgICBpZighdGhpcy5ub0Rpc2NyaW1pbmFkb3Ipe1xyXG4gICAgICAgICAgICB0aXBvTm8gPSB0aGlzLnRpcG87XHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgIHZhciB2YWxvclRpcG8gPSByZWdpc3Ryb1t0aGlzLm5vRGlzY3JpbWluYWRvci5vYnRlbmhhQ29sdW5hKHByZWZpeG8pXTtcclxuXHJcbiAgICAgICAgICAgIGZvcih2YXIgaSBpbiB0aGlzLm5vRGlzY3JpbWluYWRvci5jYXNlcyl7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLm5vRGlzY3JpbWluYWRvci5jYXNlc1tpXS52YWxvcj09dmFsb3JUaXBvKVxyXG4gICAgICAgICAgICAgICAgICAgIHRpcG9ObyA9IHRoaXMubm9EaXNjcmltaW5hZG9yLmNhc2VzW2ldLnRpcG87XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCF0aXBvTm8pIHRpcG9ObyA9IHRoaXMudGlwbztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAgIHRpcG9Oby5zdWJzdHJpbmcodGlwb05vLmxhc3RJbmRleE9mKFwiLlwiKSArIDEpO1xyXG4gICAgfTtcclxuICAgIE5vUmVzdWx0TWFwLnByb3RvdHlwZS5wcm9jZXNzZUNvbGVjb2VzID0gZnVuY3Rpb24gKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgY2FjaGVEZU9iamV0b3MsIGFuY2VzdG9yQ2FjaGUsIGluc3RhbmNlLCByZWdpc3RybywgY2hhdmVPYmpldG8pIHtcclxuICAgICAgICB2YXIgZW5jb250cm91VmFsb3IgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3ByaWVkYWRlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICB2YXIgcHJvcHJpZWRhZGUgPSB0aGlzLnByb3ByaWVkYWRlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmICgocHJvcHJpZWRhZGUgaW5zdGFuY2VvZiBOb1Byb3ByaWVkYWRlQ29sZWNhbykgPT0gZmFsc2UgJiYgKHByb3ByaWVkYWRlIGluc3RhbmNlb2YgTm9Bc3NvY2lhY2FvKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBvYmpldG8gPSBwcm9wcmllZGFkZS5jcmllT2JqZXRvKGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcywgY2FjaGVEZU9iamV0b3MsIGFuY2VzdG9yQ2FjaGUsIGluc3RhbmNlLCByZWdpc3RybywgY2hhdmVPYmpldG8pO1xyXG5cclxuICAgICAgICAgICAgZW5jb250cm91VmFsb3IgPSBlbmNvbnRyb3VWYWxvciB8fCAob2JqZXRvICE9IG51bGwpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVuY29udHJvdVZhbG9yO1xyXG4gICAgfTtcclxuXHJcbiAgICBOb1Jlc3VsdE1hcC5wcm90b3R5cGUuYXRyaWJ1YVByb3ByaWVkYWRlc1NpbXBsZXMgPSBmdW5jdGlvbiAoaW5zdGFuY2UscmVnaXN0cm8scHJlZml4bykge1xyXG4gICAgICAgIHZhciBlbmNvbnRyb3VWYWxvcmVzID0gZmFsc2U7XHJcbiAgICAgICAgZm9yICh2YXIgaiBpbiB0aGlzLnByb3ByaWVkYWRlc0lkKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wSWQgPSB0aGlzLnByb3ByaWVkYWRlc0lkW2pdO1xyXG5cclxuICAgICAgICAgICAgdmFyIHZhbG9yID0gcmVnaXN0cm9bcHJvcElkLm9idGVuaGFDb2x1bmEocHJlZml4byldO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbG9yIGluc3RhbmNlb2YgQnVmZmVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsb3IubGVuZ3RoID09IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsb3JbMF0gPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWxvciA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbG9yID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGluc3RhbmNlW3Byb3BJZC5ub21lXSA9IHZhbG9yO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZhbG9yKVxyXG4gICAgICAgICAgICAgICAgZW5jb250cm91VmFsb3JlcyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmb3IgKHZhciBqIGluIHRoaXMucHJvcHJpZWRhZGVzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wcmllZGFkZSA9IHRoaXMucHJvcHJpZWRhZGVzW2pdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHByb3ByaWVkYWRlIGluc3RhbmNlb2YgTm9Qcm9wcmllZGFkZUNvbGVjYW8pIHtcclxuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHByb3ByaWVkYWRlIGluc3RhbmNlb2YgTm9Bc3NvY2lhY2FvKSB7XHJcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIHZhbG9yID0gcmVnaXN0cm9bcHJvcHJpZWRhZGUub2J0ZW5oYUNvbHVuYShwcmVmaXhvKV07XHJcblxyXG4gICAgICAgICAgICBpZiAodmFsb3IgaW5zdGFuY2VvZiBCdWZmZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxvci5sZW5ndGggPT0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxvclswXSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbG9yID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsb3IgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaW5zdGFuY2VbcHJvcHJpZWRhZGUubm9tZV0gPSB2YWxvcjtcclxuXHJcbiAgICAgICAgICAgIGlmICh2YWxvcilcclxuICAgICAgICAgICAgICAgIGVuY29udHJvdVZhbG9yZXMgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGVuY29udHJvdVZhbG9yZXM7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIE5vUmVzdWx0TWFwO1xyXG59KShObyk7XHJcbmV4cG9ydHMuTm9SZXN1bHRNYXAgPSBOb1Jlc3VsdE1hcDtcclxuXHJcbnZhciBOb0Rpc2NyaW1pbmF0b3IgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gTm9EaXNjcmltaW5hdG9yKHRpcG9KYXZhLCBjb2x1bmEpIHtcclxuICAgICAgICB0aGlzLnRpcG9KYXZhID0gdGlwb0phdmE7XHJcbiAgICAgICAgdGhpcy5jb2x1bmEgPSBjb2x1bmE7XHJcblxyXG4gICAgICAgIHRoaXMuY2FzZXMgPSBbXTtcclxuICAgIH1cclxuICAgIE5vRGlzY3JpbWluYXRvci5wcm90b3R5cGUuYWRpY2lvbmUgPSBmdW5jdGlvbiAobm9DYXNlRGlzY3JpbWluYXRvcikge1xyXG4gICAgICAgIHRoaXMuY2FzZXMucHVzaChub0Nhc2VEaXNjcmltaW5hdG9yKTtcclxuICAgIH07XHJcblxyXG4gICAgTm9EaXNjcmltaW5hdG9yLnByb3RvdHlwZS5pbXByaW1hID0gZnVuY3Rpb24gKCkge1xyXG4gICAgXHRsb2dnZXIuaW5mbygnZGlzY3JpbWluYXRvcignICsgdGhpcy50aXBvSmF2YSArIFwiIFwiICsgdGhpcy5jb2x1bmEgKyBcIilcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ2Rpc2NyaW1pbmF0b3IoJyArIHRoaXMudGlwb0phdmEgKyBcIiBcIiArIHRoaXMuY29sdW5hICsgXCIpXCIpO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpIGluIHRoaXMuY2FzZXMpIHtcclxuICAgICAgICAgICAgdmFyIG5vQ2FzZSA9IHRoaXMuY2FzZXNbaV07XHJcblxyXG4gICAgICAgICAgICBub0Nhc2UuaW1wcmltYSgpO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgTm9EaXNjcmltaW5hdG9yLnByb3RvdHlwZS5vYnRlbmhhQ29sdW5hID0gZnVuY3Rpb24ocHJlZml4byl7XHJcbiAgICAgICAgcmV0dXJuIHByZWZpeG8gPyBwcmVmaXhvICsgdGhpcy5jb2x1bmEgOiB0aGlzLmNvbHVuYTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gTm9EaXNjcmltaW5hdG9yO1xyXG59KSgpO1xyXG5leHBvcnRzLk5vRGlzY3JpbWluYXRvciA9IE5vRGlzY3JpbWluYXRvcjtcclxuXHJcbnZhciBOb0Nhc2VEaXNjcmltaW5hdG9yID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE5vQ2FzZURpc2NyaW1pbmF0b3IodmFsb3IsIHRpcG8pIHtcclxuICAgICAgICB0aGlzLnZhbG9yID0gdmFsb3I7XHJcbiAgICAgICAgdGhpcy50aXBvID0gdGlwbztcclxuICAgIH1cclxuICAgIE5vQ2FzZURpc2NyaW1pbmF0b3IucHJvdG90eXBlLmltcHJpbWEgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICBcdGxvZ2dlci5pbmZvKCdcXHRjYXNlKCcgKyB0aGlzLnZhbG9yICsgXCIgXCIgKyB0aGlzLnRpcG8gKyBcIilcIik7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1xcdGNhc2UoJyArIHRoaXMudmFsb3IgKyBcIiBcIiArIHRoaXMudGlwbyArIFwiKVwiKTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTm9DYXNlRGlzY3JpbWluYXRvcjtcclxufSkoKTtcclxuZXhwb3J0cy5Ob0Nhc2VEaXNjcmltaW5hdG9yID0gTm9DYXNlRGlzY3JpbWluYXRvcjtcclxuXHJcbnZhciBQcmluY2lwYWwgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gUHJpbmNpcGFsKCkge1xyXG4gICAgfVxyXG4gICAgUHJpbmNpcGFsLnByb3RvdHlwZS5sZWlhTm9EaXNjcmltaW5hdG9yID0gZnVuY3Rpb24gKG5vWG1sLCBub1Jlc3VsdE1hcCkge1xyXG4gICAgICAgIHZhciBub0Rpc2NyaW1pbmF0b3IgPSBuZXcgTm9EaXNjcmltaW5hdG9yKG5vWG1sLmdldEF0dHJpYnV0ZU5vZGUoJ2phdmFUeXBlJykudmFsdWUsIG5vWG1sLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbHVtbicpLnZhbHVlKTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub1htbC5jaGlsZE5vZGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBubyA9IG5vWG1sLmNoaWxkTm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAobm8ubm9kZU5hbWUgPT0gJ2Nhc2UnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsb3IgPSBuby5nZXRBdHRyaWJ1dGVOb2RlKCd2YWx1ZScpLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpcG8gPSBuby5nZXRBdHRyaWJ1dGVOb2RlKCdyZXN1bHRUeXBlJykudmFsdWU7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIG5vQ2FzZSA9IG5ldyBOb0Nhc2VEaXNjcmltaW5hdG9yKHZhbG9yLCB0aXBvKTtcclxuXHJcbiAgICAgICAgICAgICAgICBub0Rpc2NyaW1pbmF0b3IuYWRpY2lvbmUobm9DYXNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vRGlzY3JpbWluYXRvcjtcclxuICAgIH07XHJcblxyXG4gICAgUHJpbmNpcGFsLnByb3RvdHlwZS5sZWlhQXNzb2NpYXRpb25Qcm9wZXJ0eSA9IGZ1bmN0aW9uIChubywgbm9SZXN1bHRNYXApIHtcclxuICAgICAgICB2YXIgYXRyaWJ1dG9Db2x1bmEgPSBuby5nZXRBdHRyaWJ1dGVOb2RlKCdjb2x1bW4nKTtcclxuICAgICAgICB2YXIgdmFsb3JDb2x1bmEgPSAnJztcclxuXHJcbiAgICAgICAgaWYgKGF0cmlidXRvQ29sdW5hKVxyXG4gICAgICAgICAgICB2YWxvckNvbHVuYSA9IGF0cmlidXRvQ29sdW5hLnZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgcmVzdWx0TWFwID0gbm8uZ2V0QXR0cmlidXRlTm9kZSgncmVzdWx0TWFwJykudmFsdWU7XHJcblxyXG4gICAgICAgIGlmKCByZXN1bHRNYXAuaW5kZXhPZihcIi5cIikgPT0gLTEgKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdE1hcCA9IG5vUmVzdWx0TWFwLm1hcGVhbWVudG8ubm9tZSArIFwiLlwiICsgcmVzdWx0TWFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGNvbHVtblByZWZpeCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbHVtblByZWZpeCcpKVxyXG4gICAgICAgICAgICBjb2x1bW5QcmVmaXggPSBuby5nZXRBdHRyaWJ1dGVOb2RlKCdjb2x1bW5QcmVmaXgnKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbm9SZXN1bHRNYXAuYWRpY2lvbmUobmV3IE5vQXNzb2NpYWNhbyhuby5nZXRBdHRyaWJ1dGVOb2RlKCdwcm9wZXJ0eScpLnZhbHVlLCB2YWxvckNvbHVuYSxjb2x1bW5QcmVmaXgsIHJlc3VsdE1hcCkpO1xyXG4gICAgfTtcclxuXHJcbiAgICBQcmluY2lwYWwucHJvdG90eXBlLmxlaWFDb2xsZWN0aW9uUHJvcGVydHkgPSBmdW5jdGlvbiAobm8sIG5vUmVzdWx0TWFwKSB7XHJcbiAgICAgICAgdmFyIHZhbG9yUmVzdWx0TWFwID0gJyc7XHJcblxyXG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKCdyZXN1bHRNYXAnKSkge1xyXG4gICAgICAgICAgICB2YWxvclJlc3VsdE1hcCA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoJ3Jlc3VsdE1hcCcpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHZhbG9yT2ZUeXBlID0gJyc7XHJcblxyXG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKCdvZlR5cGUnKSkge1xyXG4gICAgICAgICAgICB2YWxvck9mVHlwZSA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoJ29mVHlwZScpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHZhbG9yQ29sdW5hID0gJyc7XHJcbiAgICAgICAgaWYgKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbHVtbicpKVxyXG4gICAgICAgICAgICB2YWxvckNvbHVuYSA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbHVtbicpLnZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgdmFsb3JUaXBvSmF2YSA9ICcnO1xyXG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKCdqYXZhVHlwZScpKVxyXG4gICAgICAgICAgICB2YWxvclRpcG9KYXZhID0gbm8uZ2V0QXR0cmlidXRlTm9kZSgnamF2YVR5cGUnKS52YWx1ZTtcclxuXHJcbiAgICAgICAgdmFyIGNvbHVtblByZWZpeCA9IG51bGw7XHJcblxyXG4gICAgICAgIGlmKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbHVtblByZWZpeCcpKVxyXG4gICAgICAgICAgICBjb2x1bW5QcmVmaXggPSBuby5nZXRBdHRyaWJ1dGVOb2RlKCdjb2x1bW5QcmVmaXgnKS52YWx1ZTtcclxuXHJcbiAgICAgICAgbm9SZXN1bHRNYXAuYWRpY2lvbmUobmV3IE5vUHJvcHJpZWRhZGVDb2xlY2FvKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ3Byb3BlcnR5JykudmFsdWUsIHZhbG9yQ29sdW5hLCBjb2x1bW5QcmVmaXgsdmFsb3JSZXN1bHRNYXAsIHZhbG9yT2ZUeXBlLCB2YWxvclRpcG9KYXZhKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFByaW5jaXBhbC5wcm90b3R5cGUubGVpYVJlc3VsdFByb3BlcnR5ID0gZnVuY3Rpb24gKG5vLCBub1Jlc3VsdE1hcCkge1xyXG4gICAgICAgIHZhciB0aXBvID0gJyc7XHJcblxyXG4gICAgICAgIG5vUmVzdWx0TWFwLmFkaWNpb25lKG5ldyBOb1Byb3ByaWVkYWRlKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ3Byb3BlcnR5JykudmFsdWUsIG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbHVtbicpLnZhbHVlKSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFByaW5jaXBhbC5wcm90b3R5cGUubGVpYVJlc3VsdE1hcCA9IGZ1bmN0aW9uIChub21lLCBub1htbFJlc3VsdE1hcCwgbWFwZWFtZW50bykge1xyXG4gICAgICAgIHZhciBub21lSWQgPSBub1htbFJlc3VsdE1hcC5nZXRBdHRyaWJ1dGVOb2RlKCdpZCcpLnZhbHVlO1xyXG4gICAgICAgIHZhciB0aXBvID0gbm9YbWxSZXN1bHRNYXAuZ2V0QXR0cmlidXRlTm9kZSgndHlwZScpLnZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgbm9SZXN1bHRNYXAgPSBuZXcgTm9SZXN1bHRNYXAobm9tZUlkLCB0aXBvLCBtYXBlYW1lbnRvKTtcclxuXHJcbiAgICAgICAgdmFyIHBvc3N1aVByb3ByaWVkYWRlSWQgPSBmYWxzZTtcclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vWG1sUmVzdWx0TWFwLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vID0gbm9YbWxSZXN1bHRNYXAuY2hpbGROb2Rlc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChuby5ub2RlTmFtZSA9PSAnaWQnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcHJpZWRhZGVJZCA9IG5ldyBOb1Byb3ByaWVkYWRlSWQobm8uZ2V0QXR0cmlidXRlTm9kZSgncHJvcGVydHknKS52YWx1ZSwgbm8uZ2V0QXR0cmlidXRlTm9kZSgnY29sdW1uJykudmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIG5vUmVzdWx0TWFwLmRlZmluYVByb3ByaWVkYWRlSWQocHJvcHJpZWRhZGVJZCk7XHJcbiAgICAgICAgICAgICAgICBwb3NzdWlQcm9wcmllZGFkZUlkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChuby5ub2RlTmFtZSA9PSAncmVzdWx0Jykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWlhUmVzdWx0UHJvcGVydHkobm8sIG5vUmVzdWx0TWFwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChuby5ub2RlTmFtZSA9PSAnYXNzb2NpYXRpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlaWFBc3NvY2lhdGlvblByb3BlcnR5KG5vLCBub1Jlc3VsdE1hcCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm8ubm9kZU5hbWUgPT0gJ2NvbGxlY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlaWFDb2xsZWN0aW9uUHJvcGVydHkobm8sIG5vUmVzdWx0TWFwKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChuby5ub2RlTmFtZSA9PSAnZGlzY3JpbWluYXRvcicpIHtcclxuICAgICAgICAgICAgICAgIHZhciBub0Rpc2NyaW1pbmF0b3IgPSB0aGlzLmxlaWFOb0Rpc2NyaW1pbmF0b3Iobm8sIG5vUmVzdWx0TWFwKTtcclxuXHJcbiAgICAgICAgICAgICAgICBub1Jlc3VsdE1hcC5kZWZpbmFEaXNjcmltaW5hdG9yKG5vRGlzY3JpbWluYXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICghcG9zc3VpUHJvcHJpZWRhZGVJZCkge1xyXG4gICAgICAgICAgICBub1Jlc3VsdE1hcC5lbmNvbnRyZVByb3ByaWVkYWRlSWQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub1Jlc3VsdE1hcDtcclxuICAgIH07XHJcblxyXG4gICAgUHJpbmNpcGFsLnByb3RvdHlwZS5sZWlhID0gZnVuY3Rpb24gKG5vbWUsIGdjaGlsZCwgbWFwZWFtZW50bykge1xyXG4gICAgICAgIGlmIChnY2hpbGQubm9kZU5hbWUgPT0gJ3Jlc3VsdE1hcCcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGVpYVJlc3VsdE1hcChub21lLCBnY2hpbGQsIG1hcGVhbWVudG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vbWVJZCA9IGdjaGlsZC5nZXRBdHRyaWJ1dGVOb2RlKCdpZCcpLnZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgbm9Db21hbmRvO1xyXG4gICAgICAgIGlmIChnY2hpbGQubm9kZU5hbWUgPT0gJ3NlbGVjdCcpIHtcclxuICAgICAgICAgICAgdmFyIG5vUmVzdWx0TWFwID0gZ2NoaWxkLmdldEF0dHJpYnV0ZU5vZGUoJ3Jlc3VsdE1hcCcpO1xyXG4gICAgICAgICAgICB2YXIgdmFsb3JSZXN1bHRNYXAgPSAnJztcclxuICAgICAgICAgICAgaWYgKG5vUmVzdWx0TWFwKVxyXG4gICAgICAgICAgICAgICAgdmFsb3JSZXN1bHRNYXAgPSBub1Jlc3VsdE1hcC52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIHZhciBub0phdmFUeXBlID0gZ2NoaWxkLmdldEF0dHJpYnV0ZU5vZGUoJ3Jlc3VsdFR5cGUnKTtcclxuICAgICAgICAgICAgdmFyIHZhbG9ySmF2YVR5cGUgPSAnJztcclxuICAgICAgICAgICAgaWYgKG5vSmF2YVR5cGUpXHJcbiAgICAgICAgICAgICAgICB2YWxvckphdmFUeXBlID0gbm9KYXZhVHlwZS52YWx1ZTtcclxuXHJcbiAgICAgICAgICAgIG5vQ29tYW5kbyA9IG5ldyBOb1NlbGVjdChub21lSWQsIHZhbG9yUmVzdWx0TWFwLCB2YWxvckphdmFUeXBlLCBtYXBlYW1lbnRvKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBub0NvbWFuZG8gPSBuZXcgTm8obm9tZUlkLCBtYXBlYW1lbnRvKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZ2NoaWxkLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vID0gZ2NoaWxkLmNoaWxkTm9kZXNbaV07XHJcblxyXG4gICAgICAgICAgICBpZiAobm8ubm9kZU5hbWUgPT0gJ2Nob29zZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVpYUNob29zZSgnY2hvb3NlJywgbm8sIG5vQ29tYW5kbywgbWFwZWFtZW50byk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm8ubm9kZU5hbWUgPT0gJ2lmJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWlhSWYoJ2Nob29zZScsIG5vLCBub0NvbWFuZG8sIG1hcGVhbWVudG8pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vLm5vZGVOYW1lID09ICdmb3JlYWNoJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5sZWlhRm9yRWFjaCgnZm9yZWFjaCcsIG5vLCBub0NvbWFuZG8sIG1hcGVhbWVudG8pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5vLmhhc0NoaWxkTm9kZXMoKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhuby50ZXh0Q29udGVudCwgbWFwZWFtZW50byk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG5vQ29tYW5kby5hZGljaW9uZShub1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBub0NvbWFuZG87XHJcbiAgICB9O1xyXG5cclxuICAgIFByaW5jaXBhbC5wcm90b3R5cGUubGVpYUZvckVhY2ggPSBmdW5jdGlvbiAobm9tZSwgbm8sIG5vUHJpbmNpcGFsLCBtYXBlYW1lbnRvKSB7XHJcbiAgICAgICAgdmFyIHZhbG9yU2VwYXJhZG9yID0gJyc7XHJcbiAgICAgICAgaWYgKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ3NlcGFyYXRvcicpKSB7XHJcbiAgICAgICAgICAgIHZhbG9yU2VwYXJhZG9yID0gbm8uZ2V0QXR0cmlidXRlTm9kZSgnc2VwYXJhdG9yJykudmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgdmFsb3JBYmVydHVyYSA9ICcnO1xyXG4gICAgICAgIGlmIChuby5nZXRBdHRyaWJ1dGVOb2RlKCdvcGVuJykpIHtcclxuICAgICAgICAgICAgdmFsb3JBYmVydHVyYSA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoJ29wZW4nKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB2YWxvckZlY2hhbWVudG8gPSAnJztcclxuICAgICAgICBpZiAobm8uZ2V0QXR0cmlidXRlTm9kZSgnY2xvc2UnKSkge1xyXG4gICAgICAgICAgICB2YWxvckZlY2hhbWVudG8gPSBuby5nZXRBdHRyaWJ1dGVOb2RlKCdjbG9zZScpLnZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHZhbG9ySW5kZXggPSAnJztcclxuICAgICAgICBpZiAobm8uZ2V0QXR0cmlidXRlTm9kZSgnaW5kZXgnKSkge1xyXG4gICAgICAgICAgICB2YWxvckluZGV4ID0gbm8uZ2V0QXR0cmlidXRlTm9kZSgnaW5kZXgnKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB2YWxvckNvbGxlY3Rpb24gPSAnJztcclxuICAgICAgICBpZiAobm8uZ2V0QXR0cmlidXRlTm9kZSgnY29sbGVjdGlvbicpKSB7XHJcbiAgICAgICAgICAgIHZhbG9yQ29sbGVjdGlvbiA9IG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2NvbGxlY3Rpb24nKS52YWx1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBub0ZvckVhY2ggPSBuZXcgTm9Gb3JFYWNoKG5vLmdldEF0dHJpYnV0ZU5vZGUoJ2l0ZW0nKS52YWx1ZSwgdmFsb3JJbmRleCwgdmFsb3JTZXBhcmFkb3IsIHZhbG9yQWJlcnR1cmEsXHJcbiAgICAgICAgICAgIHZhbG9yRmVjaGFtZW50bywgbm8udGV4dENvbnRlbnQsIHZhbG9yQ29sbGVjdGlvbiwgbWFwZWFtZW50byk7XHJcblxyXG4gICAgICAgIG5vUHJpbmNpcGFsLmFkaWNpb25lKG5vRm9yRWFjaCk7XHJcbiAgICB9O1xyXG5cclxuICAgIFByaW5jaXBhbC5wcm90b3R5cGUubGVpYUlmID0gZnVuY3Rpb24gKG5vbWUsIG5vLCBub1ByaW5jaXBhbCwgbWFwZWFtZW50bykge1xyXG4gICAgICAgIHZhciBub0lmID0gbmV3IE5vSWYobm8uZ2V0QXR0cmlidXRlTm9kZSgndGVzdCcpLnZhbHVlLCBuby5jaGlsZE5vZGVzWzBdLnRvU3RyaW5nKCksIG1hcGVhbWVudG8pO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vRmlsaG8gPSBuby5jaGlsZE5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vRmlsaG8ubm9kZU5hbWUgPT0gJ2Nob29zZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVpYUNob29zZSgnY2hvb3NlJywgbm9GaWxobywgbm9JZiwgbWFwZWFtZW50byk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9GaWxoby5ub2RlTmFtZSA9PSAnaWYnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlaWFJZignY2hvb3NlJywgbm9GaWxobywgbm9JZiwgbWFwZWFtZW50byk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAobm9GaWxoby5ub2RlTmFtZSA9PSAnZm9yZWFjaCcpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVpYUZvckVhY2goJ2ZvcmVhY2gnLCBub0ZpbGhvLCBub0lmLCBtYXBlYW1lbnRvKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChub0ZpbGhvLmhhc0NoaWxkTm9kZXMoKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhub0ZpbGhvLnRleHRDb250ZW50LCBtYXBlYW1lbnRvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbm9JZi5hZGljaW9uZShub1N0cmluZyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG5vUHJpbmNpcGFsLmFkaWNpb25lKG5vSWYpO1xyXG4gICAgfTtcclxuXHJcbiAgICBQcmluY2lwYWwucHJvdG90eXBlLmxlaWFDaG9vc2UgPSBmdW5jdGlvbiAobm9tZSwgbm8sIG5vUHJpbmNpcGFsLCBtYXBlYW1lbnRvKSB7XHJcbiAgICAgICAgdmFyIG5vQ2hvb3NlID0gbmV3IE5vQ2hvb3NlKG1hcGVhbWVudG8pO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIGZpbGhvcyA9IG5vLmNoaWxkTm9kZXM7XHJcblxyXG4gICAgICAgICAgICB2YXIgbm9GaWxobyA9IGZpbGhvc1tpXTtcclxuXHJcbiAgICAgICAgICAgIGlmIChub0ZpbGhvLm5vZGVOYW1lID09ICd3aGVuJykge1xyXG4gICAgICAgICAgICAgICAgbm9DaG9vc2UuYWRpY2lvbmUodGhpcy5sZWlhTm9XaGVuKFwid2hlblwiLCBub0ZpbGhvLCBubywgbWFwZWFtZW50bykpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vRmlsaG8ubm9kZU5hbWUgPT0gJ290aGVyd2lzZScpIHtcclxuICAgICAgICAgICAgICAgIG5vQ2hvb3NlLmFkaWNpb25lKG5ldyBOb090aGVyd2lzZShub0ZpbGhvLmNoaWxkTm9kZXNbMF0udG9TdHJpbmcoKSwgbWFwZWFtZW50bykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBub1ByaW5jaXBhbC5hZGljaW9uZShub0Nob29zZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIFByaW5jaXBhbC5wcm90b3R5cGUubGVpYU5vV2hlbiA9IGZ1bmN0aW9uKG5vbWUsIG5vLCBub1ByaWNpcGFsLCBtYXBlYW1lbnRvKSB7XHJcbiAgICAgICAgdmFyIGV4cHJlc3Nhb1Rlc3RlID0gbm8uZ2V0QXR0cmlidXRlTm9kZSgndGVzdCcpLnZhbHVlO1xyXG5cclxuICAgICAgICB2YXIgbm9XaGVuID0gbmV3IE5vV2hlbihleHByZXNzYW9UZXN0ZSwgJycsIG1hcGVhbWVudG8pO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vLmNoaWxkTm9kZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vRmlsaG8gPSBuby5jaGlsZE5vZGVzW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYgKG5vRmlsaG8ubm9kZU5hbWUgPT0gJ2Nob29zZScpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVpYUNob29zZSgnY2hvb3NlJywgbm9GaWxobywgbm9XaGVuLCBtYXBlYW1lbnRvKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChub0ZpbGhvLm5vZGVOYW1lID09ICdpZicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubGVpYUlmKCdjaG9vc2UnLCBub0ZpbGhvLCBub1doZW4sIG1hcGVhbWVudG8pO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKG5vRmlsaG8ubm9kZU5hbWUgPT0gJ2ZvcmVhY2gnKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxlaWFGb3JFYWNoKCdmb3JlYWNoJywgbm9GaWxobywgbm9XaGVuLCBtYXBlYW1lbnRvKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChub0ZpbGhvLmhhc0NoaWxkTm9kZXMoKSA9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBub1N0cmluZyA9IG5ldyBOb1N0cmluZyhub0ZpbGhvLnRleHRDb250ZW50LCBtYXBlYW1lbnRvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgbm9XaGVuLmFkaWNpb25lKG5vU3RyaW5nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIG5vV2hlbjtcclxuICAgIH1cclxuXHJcbiAgICBQcmluY2lwYWwucHJvdG90eXBlLnByb2Nlc3NlID0gZnVuY3Rpb24gKGRpcl94bWwpIHtcclxuICAgICAgICB2YXIgbWFwYU5vcyA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgZ2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zID0gbmV3IEdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcygpO1xyXG5cclxuXHJcbiAgICAgICAgdmFyIG1vZGVscyA9IHt9O1xyXG5cclxuICAgICAgICB2YXIgd2FsayA9IGZ1bmN0aW9uKGRpciwgZG9uZSkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0cyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IGZzLnJlYWRkaXJTeW5jKGRpcikgO1xyXG4gICAgICAgICAgICB2YXIgcGVuZGluZyA9IGxpc3QubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAoIXBlbmRpbmcpIHJldHVybiBkb25lKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgICBsaXN0LmZvckVhY2goZnVuY3Rpb24oZmlsZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGZpbGUgPSBkaXIgKyAnLycgKyBmaWxlO1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBzdGF0ID0gZnMuc3RhdFN5bmMoZmlsZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHN0YXQgJiYgc3RhdC5pc0RpcmVjdG9yeSgpICYmIGZpbGUuaW5kZXhPZignLnN2bicpID09LTEpIHtcclxuICAgICAgICAgICAgICAgICAgICB3YWxrKGZpbGUsIGZ1bmN0aW9uKGVyciwgcmVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdHMgPSByZXN1bHRzLmNvbmNhdChyZXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIS0tcGVuZGluZykgZG9uZShudWxsLCByZXN1bHRzKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0cy5wdXNoKGZpbGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghLS1wZW5kaW5nKSBkb25lKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICB2YXIgZXh0ID0gJy5qcydcclxuXHJcbi8vICAgICAgICB3YWxrKFwiLi9kb21haW5cIixmdW5jdGlvbihlcnIsIGFycXVpdm9zKSB7XHJcbi8vICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBhcnF1aXZvcykge1xyXG4vLyAgICAgICAgICAgICAgICB2YXIgYXJxdWl2byA9IGFycXVpdm9zW2ldO1xyXG4vLyAgICAgICAgICAgICAgICBpZiggYXJxdWl2by5pbmRleE9mKGV4dCkgPT0gLTEgKSBjb250aW51ZTtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgdmFyIG5vbWVBcnF1aXZvID0gcGF0aC5iYXNlbmFtZShhcnF1aXZvKTtcclxuLy8gICAgICAgICAgICAgICAgdmFyIG5vbWVDbGFzc2VEb21pbmlvID0gIG5vbWVBcnF1aXZvLnJlcGxhY2UoZXh0LCcnKTtcclxuLy8gICAgICAgICAgICAgICAgdmFyIGFycXVpdm9QYXRoID0gcGF0aC5qb2luKHBhdGgucmVzb2x2ZSgnLicpLGFycXVpdm8pO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICBpZighZnMuZXhpc3RzU3luYyhhcnF1aXZvUGF0aCkpIHRocm93IG5ldyBFcnJvcignQXJxdWl2byBuw6NvIGVuY29udHJhZG86JyArIGFycXVpdm9QYXRoKTtcclxuLy9cclxuLy8gICAgICAgICAgICAgICAgdmFyIG1vZGVsID0gcmVxdWlyZShwYXRoLmpvaW4ocGF0aC5yZXNvbHZlKCcuJyksYXJxdWl2bykpO1xyXG4vL1xyXG4vLyAgICAgICAgICAgICAgICBnZXJlbmNpYWRvckRlTWFwZWFtZW50b3MuYWRpY2lvbmVNb2RlbChub21lQ2xhc3NlRG9taW5pbyxtb2RlbCk7XHJcbi8vICAgICAgICAgICAgfVxyXG4vLyAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciBhcnF1aXZvcyA9IGZzLnJlYWRkaXJTeW5jKGRpcl94bWwpO1xyXG4gICAgICAgIGZvciAodmFyIGkgaW4gYXJxdWl2b3MpIHtcclxuICAgICAgICAgICAgdmFyIGFycXVpdm8gPSBhcnF1aXZvc1tpXTtcclxuXHJcbiAgICAgICAgICAgIHZhciBtYXBlYW1lbnRvID0gdGhpcy5wcm9jZXNzZUFycXVpdm8oZGlyX3htbCArIGFycXVpdm8pO1xyXG5cclxuICAgICAgICAgICAgZ2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLmFkaWNpb25lKG1hcGVhbWVudG8pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcztcclxuICAgIH07XHJcblxyXG5cclxuICAgIFByaW5jaXBhbC5wcm90b3R5cGUucHJvY2Vzc2VBcnF1aXZvID0gZnVuY3Rpb24gKG5vbWVBcnF1aXZvKSB7XHJcbiAgICAgICAgaWYgKGZzLmxzdGF0U3luYyhub21lQXJxdWl2bykuaXNEaXJlY3RvcnkoKSlcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcblxyXG4gICAgICAgIHZhciB4bWwgPSBmcy5yZWFkRmlsZVN5bmMobm9tZUFycXVpdm8pLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgdmFyIHhtbERvYyA9IG5ldyBET01QYXJzZXIoKS5wYXJzZUZyb21TdHJpbmcoeG1sKTtcclxuICAgICAgICBcclxuICAgICAgICBpZiAoeG1sRG9jLmRvY3VtZW50RWxlbWVudC5ub2RlTmFtZSAhPSAnbWFwcGVyJykge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBub3MgPSB4bWxEb2MuZG9jdW1lbnRFbGVtZW50LmNoaWxkTm9kZXM7XHJcblxyXG4gICAgICAgIHZhciBtYXBlYW1lbnRvID0gbmV3IE1hcGVhbWVudG8oeG1sRG9jLmRvY3VtZW50RWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlKCduYW1lc3BhY2UnKS52YWx1ZSk7XHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdmFyIG5vWG1sID0gbm9zW2ldO1xyXG5cclxuICAgICAgICAgICAgaWYobm9YbWwubm9kZU5hbWUgIT0gJyN0ZXh0JyAmJiBub1htbC5ub2RlTmFtZSAhPSAnI2NvbW1lbnQnKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbm8gPSB0aGlzLmxlaWEobm9YbWwubm9kZU5hbWUsIG5vWG1sLCBtYXBlYW1lbnRvKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvL25vLmltcHJpbWEoKTtcclxuICAgICAgICAgICAgICAgIG1hcGVhbWVudG8uYWRpY2lvbmUobm8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gbWFwZWFtZW50bztcclxuICAgIH07XHJcbiAgICByZXR1cm4gUHJpbmNpcGFsO1xyXG59KSgpO1xyXG5leHBvcnRzLlByaW5jaXBhbCA9IFByaW5jaXBhbDtcclxuXHJcbnZhciBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MgPSAoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zKCkge1xyXG4gICAgICAgIHRoaXMubWFwZWFtZW50b3MgPSBbXTtcclxuICAgICAgICB0aGlzLm1hcGFNYXBlYW1lbnRvcyA9IHt9O1xyXG4gICAgICAgIHRoaXMubW9kZWxzID0ge307XHJcbiAgICB9XHJcbiAgICBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MucHJvdG90eXBlLm9idGVuaGFNb2RlbCA9IGZ1bmN0aW9uIChub21lKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubW9kZWxzW25vbWVdO1xyXG4gICAgfTtcclxuXHJcbiAgICBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MucHJvdG90eXBlLmFkaWNpb25lTW9kZWwgPSBmdW5jdGlvbiAobm9tZUNsYXNzZURvbWluaW8sIGNsYXNzZSkge1xyXG4gICAgICAgIGlmICh0aGlzLm1vZGVsc1tub21lQ2xhc3NlRG9taW5pb10gIT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICB0aGlzLm1vZGVsc1tub21lQ2xhc3NlRG9taW5pb10gPSBjbGFzc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIEdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcy5wcm90b3R5cGUuYWRpY2lvbmUgPSBmdW5jdGlvbiAobWFwZWFtZW50bykge1xyXG4gICAgICAgIGlmIChtYXBlYW1lbnRvID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgdGhpcy5tYXBhTWFwZWFtZW50b3NbbWFwZWFtZW50by5ub21lXSA9IG1hcGVhbWVudG87XHJcblxyXG4gICAgICAgIHRoaXMubWFwZWFtZW50b3MucHVzaChtYXBlYW1lbnRvKTtcclxuICAgIH07XHJcblxyXG4gICAgR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLnByb3RvdHlwZS5vYnRlbmhhUmVzdWx0TWFwID0gZnVuY3Rpb24gKG5vbWVDb21wbGV0b1Jlc3VsdE1hcCkge1xyXG4gICAgICAgIHZhciBub21lTmFtZXNwYWNlID0gbm9tZUNvbXBsZXRvUmVzdWx0TWFwLnNwbGl0KFwiLlwiKVswXTtcclxuICAgICAgICB2YXIgbm9tZVJlc3VsdE1hcCA9IG5vbWVDb21wbGV0b1Jlc3VsdE1hcC5zcGxpdChcIi5cIilbMV07XHJcblxyXG4gICAgICAgIHZhciBtYXBlYW1lbnRvID0gdGhpcy5tYXBhTWFwZWFtZW50b3Nbbm9tZU5hbWVzcGFjZV07XHJcblxyXG4gICAgICAgIGlmIChtYXBlYW1lbnRvID09IG51bGwpIHtcclxuICAgICAgICBcdGxvZ2dlci5lcnJvcihcInJlc3VsdCBtYXAgXCIgKyBub21lTmFtZXNwYWNlICsgXCIgY2FuJ3QgYmUgZm91bmQuXCIpO1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNYXBlYW1lbnRvIFwiICsgbm9tZU5hbWVzcGFjZSArIFwiIG7Do28gZW5jb250cmFkb1wiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciByZXN1bHRNYXAgPSBtYXBlYW1lbnRvLm9idGVuaGFSZXN1bHRNYXAobm9tZVJlc3VsdE1hcCk7XHJcblxyXG4gICAgICAgIHJldHVybiByZXN1bHRNYXA7XHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MucHJvdG90eXBlLm9idGVuaGFObyA9IGZ1bmN0aW9uIChub21lQ29tcGxldG9SZXN1bHRNYXApIHtcclxuICAgICAgICB2YXIgbm9tZU5hbWVzcGFjZSA9IG5vbWVDb21wbGV0b1Jlc3VsdE1hcC5zcGxpdChcIi5cIilbMF07XHJcblxyXG4gICAgICAgIHZhciBpZE5vID0gbm9tZUNvbXBsZXRvUmVzdWx0TWFwLnNwbGl0KFwiLlwiKVsxXTtcclxuXHJcbiAgICAgICAgdmFyIG1hcGVhbWVudG8gPSB0aGlzLm1hcGFNYXBlYW1lbnRvc1tub21lTmFtZXNwYWNlXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIG1hcGVhbWVudG8ub2J0ZW5oYU5vKGlkTm8pO1xyXG4gICAgfTtcclxuXHJcbiAgICBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MucHJvdG90eXBlLmluc2lyYSA9IGZ1bmN0aW9uIChub21lQ29tcGxldG8sIG9iamV0bywgY2FsbGJhY2spIHtcclxuICAgICAgICB2YXIgbWUgPSB0aGlzO1xyXG4gICAgICAgIHZhciBubyA9IHRoaXMub2J0ZW5oYU5vKG5vbWVDb21wbGV0byk7XHJcblxyXG4gICAgICAgIHZhciBjb21hbmRvU3FsID0gbmV3IENvbWFuZG9TcWwoKTtcclxuXHJcbiAgICAgICAgbm8ub2J0ZW5oYVNxbChjb21hbmRvU3FsLCBvYmpldG8pO1xyXG5cclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNvbWFuZG9TcWwuc3FsKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhjb21hbmRvU3FsLnBhcmFtZXRyb3MpO1xyXG5cclxuICAgICAgICBsb2dnZXIuaW5mbyhcIltzcWxJZDpcIiArIG5vbWVDb21wbGV0byArIFwiXVwiLCBjb21hbmRvU3FsLnNxbCk7XHJcbiAgICBcdGxvZ2dlci5pbmZvKFwiUGFyYW1ldGVyczogXCIsY29tYW5kb1NxbC5wYXJhbWV0cm9zKTtcclxuICAgICAgICB2YXIgZG9taW5pbyA9IHJlcXVpcmUoJ2RvbWFpbicpLmFjdGl2ZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25leGFvKGZ1bmN0aW9uKGNvbm5lY3Rpb24pe1xyXG4gICAgICAgICAgICAvL2Nvbm5lY3Rpb24ucXVlcnkoY29tYW5kb1NxbC5zcWwsY29tYW5kb1NxbC5wYXJhbWV0cm9zLGRvbWluaW8uaW50ZXJjZXB0KGZ1bmN0aW9uIChyb3dzLCBmaWVsZHMsZXJyKSB7XHJcbiAgICAgICAgXHRjb25uZWN0aW9uLnF1ZXJ5KGNvbWFuZG9TcWwuc3FsLGNvbWFuZG9TcWwucGFyYW1ldHJvcyxmdW5jdGlvbiAoZXJyLHJvd3MsIGZpZWxkcykge1xyXG4gICAgICAgICAgICBcdGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwwKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiggcm93cy5pbnNlcnRJZCApIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpldG8uaWQgPSByb3dzLmluc2VydElkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coJ2NhbGxiYWNrIGluc2VydC4uLicpXHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLHJvd3MuYWZmZWN0ZWRSb3dzKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICBcdCB9KTsgICAgIFxyXG4gICAgICAgICAgIC8vIH0pKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9O1xyXG5cclxuICAgIEdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcy5wcm90b3R5cGUuYXR1YWxpemUgPSBmdW5jdGlvbiAobm9tZUNvbXBsZXRvLCBvYmpldG8sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICB2YXIgbm8gPSB0aGlzLm9idGVuaGFObyhub21lQ29tcGxldG8pO1xyXG5cclxuICAgICAgICB2YXIgY29tYW5kb1NxbCA9IG5ldyBDb21hbmRvU3FsKCk7XHJcbiAgICAgICAgdmFyIHNxbCA9IG5vLm9idGVuaGFTcWwoY29tYW5kb1NxbCwgb2JqZXRvKTtcclxuXHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzcWwpO1xyXG5cclxuICAgICAgICBsb2dnZXIuaW5mbyhcIltzcWxJZDpcIiArIG5vbWVDb21wbGV0byArIFwiXVwiLCBjb21hbmRvU3FsLnNxbCk7XHJcbiAgICBcdGxvZ2dlci5pbmZvKFwiUGFyYW1ldGVyczogXCIsY29tYW5kb1NxbC5wYXJhbWV0cm9zKTtcclxuICAgICAgICB2YXIgZG9taW5pbyA9IHJlcXVpcmUoJ2RvbWFpbicpLmFjdGl2ZTtcclxuXHJcbiAgICAgICAgdGhpcy5jb25leGFvKGZ1bmN0aW9uKGNvbm5lY3Rpb24pIHtcclxuICAgICAgICAgICAgLy9jb25uZWN0aW9uLnF1ZXJ5KGNvbWFuZG9TcWwuc3FsLCBjb21hbmRvU3FsLnBhcmFtZXRyb3MsZG9taW5pby5pbnRlcmNlcHQoZnVuY3Rpb24gKHJvd3MsIGZpZWxkcyxlcnIpICB7XHJcbiAgICAgICAgXHRjb25uZWN0aW9uLnF1ZXJ5KGNvbWFuZG9TcWwuc3FsLCBjb21hbmRvU3FsLnBhcmFtZXRyb3MsZnVuY3Rpb24gKGVycixyb3dzLCBmaWVsZHMpICB7XHJcbiAgICAgICAgICAgIFx0aWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLDApO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVycixyb3dzLmFmZmVjdGVkUm93cyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgXHR9KTtcclxuICAgICAgICAgICAgLy99KSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLnByb3RvdHlwZS5yZW1vdmEgPSBmdW5jdGlvbiAobm9tZUNvbXBsZXRvLCBvYmpldG8sIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgdmFyIG1lID0gdGhpcztcclxuICAgICAgICB2YXIgbm8gPSB0aGlzLm9idGVuaGFObyhub21lQ29tcGxldG8pO1xyXG5cclxuICAgICAgICB2YXIgY29tYW5kb1NxbCA9IG5ldyBDb21hbmRvU3FsKCk7XHJcbiAgICAgICAgdmFyIHNxbCA9IG5vLm9idGVuaGFTcWwoY29tYW5kb1NxbCwgb2JqZXRvKTtcclxuXHJcbiAgICAgICAgdmFyIGRvbWluaW8gPSByZXF1aXJlKCdkb21haW4nKS5hY3RpdmU7XHJcblxyXG4gICAgICAgIFxyXG4gICAgICAgIGxvZ2dlci5pbmZvKFwiW3NxbElkOlwiICsgbm9tZUNvbXBsZXRvICsgXCJdXCIsIGNvbWFuZG9TcWwuc3FsKTtcclxuICAgIFx0bG9nZ2VyLmluZm8oXCJQYXJhbWV0ZXJzOiBcIixjb21hbmRvU3FsLnBhcmFtZXRyb3MpO1xyXG4gICAgICAgIHRoaXMuY29uZXhhbyhmdW5jdGlvbihjb25uZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIC8vY29ubmVjdGlvbi5xdWVyeShjb21hbmRvU3FsLnNxbCwgY29tYW5kb1NxbC5wYXJhbWV0cm9zLCBkb21pbmlvLmludGVyY2VwdChmdW5jdGlvbiAocm93cywgZmllbGRzLGVycikge1xyXG4gICAgICAgIFx0Y29ubmVjdGlvbi5xdWVyeShjb21hbmRvU3FsLnNxbCwgY29tYW5kb1NxbC5wYXJhbWV0cm9zLCBmdW5jdGlvbiAoZXJyLHJvd3MsIGZpZWxkcykge1xyXG4gICAgICAgICAgICBcdGlmIChlcnIpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVyci5tZXNzYWdlKTtcclxuICAgICAgICAgICAgICAgICAgICBsb2dnZXIuZXJyb3IoZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGVyciwwKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAoY2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBjYWxsYmFjayhlcnIscm93cy5hZmZlY3RlZFJvd3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgIFx0fSk7ICAgIFxyXG4gICAgICAgICAgICAvL30pKTtcclxuICAgICAgICB9KTtcclxuXHJcblxyXG4gICAgfTtcclxuXHJcbiAgICBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MucHJvdG90eXBlLnNlbGVjaW9uZVVtID0gZnVuY3Rpb24gKG5vbWVDb21wbGV0bywgZGFkb3MsIGNhbGxiYWNrKSB7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2J1c2NhbmRvICcgKyBub21lQ29tcGxldG8pO1xyXG4gICAgICAgIHRoaXMuc2VsZWNpb25lVmFyaW9zKG5vbWVDb21wbGV0bywgZGFkb3MsIGZ1bmN0aW9uIChlcnIsb2JqZXRvcykge1xyXG4gICAgICAgICAgICBpZiAob2JqZXRvcy5sZW5ndGggPT0gMClcclxuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIsW10pO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9iamV0b3MubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGVycixvYmpldG9zWzBdKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY2FsbGJhY2soZXJyLG9iamV0b3NbMF0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBHZXJlbmNpYWRvckRlTWFwZWFtZW50b3MucHJvdG90eXBlLnNlbGVjaW9uZVZhcmlvcyA9IGZ1bmN0aW9uIChub21lQ29tcGxldG8sIGRhZG9zLCBjYWxsYmFjaykge1xyXG4gICAgICAgIHZhciBtZSA9IHRoaXM7XHJcbiAgICAgICAgdmFyIG5vID0gdGhpcy5vYnRlbmhhTm8obm9tZUNvbXBsZXRvKTtcclxuXHJcbiAgICAgICAgdmFyIGNvbWFuZG9TcWwgPSBuZXcgQ29tYW5kb1NxbCgpO1xyXG5cclxuICAgICAgICBuby5vYnRlbmhhU3FsKGNvbWFuZG9TcWwsIGRhZG9zKTtcclxuXHJcbiAgICAgICAgdmFyIG5vbWVSZXN1bHRNYXAgPSBuby5yZXN1bHRNYXA7XHJcblxyXG4gICAgICAgIGlmIChuby5yZXN1bHRNYXAuaW5kZXhPZihcIi5cIikgPT0gLTEpIHtcclxuICAgICAgICAgICAgbm9tZVJlc3VsdE1hcCA9IG5vLm1hcGVhbWVudG8ubm9tZSArIFwiLlwiICsgbm8ucmVzdWx0TWFwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIG5vUmVzdWx0TWFwID0gdGhpcy5vYnRlbmhhUmVzdWx0TWFwKG5vbWVSZXN1bHRNYXApO1xyXG5cclxuICAgICAgICBpZiAobm8ucmVzdWx0TWFwICYmIG5vUmVzdWx0TWFwID09IG51bGwpIHtcclxuICAgICAgICAgICAgLy90aHJvdyBuZXcgRXJyb3IoXCJSZXN1bHQgbWFwICdcIiArIG5vLnJlc3VsdE1hcCArIFwiJyBuw6NvIGVuY29udHJhZG9cIik7XHJcbiAgICAgICAgXHRsb2dnZXIuZXJyb3IoXCJSZXN1bHQgbWFwICdcIiArIG5vLnJlc3VsdE1hcCArIFwiJyBjYW4ndCBiZSBmb3VuZC5cIik7XHJcbiAgICAgICAgXHRjYWxsYmFjayhcIlJlc3VsdCBtYXAgJ1wiICsgbm8ucmVzdWx0TWFwICsgXCInIGNhbid0IGJlIGZvdW5kLlwiLFtdKTtcclxuICAgICAgICBcdHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICB2YXIgZG9taW5pbyA9IHJlcXVpcmUoJ2RvbWFpbicpLmFjdGl2ZTtcclxuICAgICAgICB0aGlzLmNvbmV4YW8oZnVuY3Rpb24oY29ubmVjdGlvbil7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coY29tYW5kb1NxbC5zcWwpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKGNvbWFuZG9TcWwucGFyYW1ldHJvcyk7XHJcbiAgICAgICAgXHRsb2dnZXIuaW5mbyhcIltzcWxJZDpcIiArIG5vbWVDb21wbGV0byArIFwiXVwiLCBjb21hbmRvU3FsLnNxbCk7XHJcbiAgICAgICAgXHRsb2dnZXIuaW5mbyhcIlBhcmFtZXRlcnM6IFwiLGNvbWFuZG9TcWwucGFyYW1ldHJvcyk7XHJcbiAgICAgICAgICAgIC8vY29ubmVjdGlvbi5xdWVyeShjb21hbmRvU3FsLnNxbCwgY29tYW5kb1NxbC5wYXJhbWV0cm9zLCBkb21pbmlvLmludGVyY2VwdChmdW5jdGlvbiAocm93cywgZmllbGRzLGVycikge1xyXG4gICAgICAgIFx0Y29ubmVjdGlvbi5xdWVyeShjb21hbmRvU3FsLnNxbCwgY29tYW5kb1NxbC5wYXJhbWV0cm9zLCBmdW5jdGlvbiAoZXJyLHJvd3MsIGZpZWxkcykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycikge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyLm1lc3NhZ2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxvZ2dlci5lcnJvcihlcnIubWVzc2FnZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soZXJyLFtdKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZihjYWxsYmFjayAmJiAhbm9SZXN1bHRNYXApe1xyXG4gICAgICAgICAgICAgICAgXHQvL3RpY2ggbW9kaWZ5IGtob25nIHN1IGR1bmcgcmVzdWx0IG1hcCBhbiB0eXBlXHJcbiAgICAgICAgICAgICAgICBcdHZhciBvYmpldG9zID0gW107XHJcbiAgICAgICAgICAgICAgICBcdCBvYmpldG9zLnB1c2gocm93cyk7XHJcbiAgICAgICAgICAgICAgICBcdCBjYWxsYmFjayhudWxsLG9iamV0b3MpO1xyXG4gICAgICAgICAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayAmJiBub1Jlc3VsdE1hcCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKG51bGwsbm9SZXN1bHRNYXAuY3JpZU9iamV0b3MobWUsIHJvd3MpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5vLmphdmFUeXBlID09ICdTdHJpbmcnIHx8IG5vLmphdmFUeXBlID09ICdpbnQnIHx8IG5vLmphdmFUeXBlID09ICdsb25nJyB8fCBuby5qYXZhVHlwZSA9PSAnamF2YS5sYW5nLkxvbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvYmpldG9zID0gW107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgaW4gcm93cykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJvdyA9IHJvd3NbaV07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiBpbiByb3cpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpldG9zLnB1c2gocm93W2pdKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobnVsbCxvYmpldG9zKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vfSkpO1xyXG4gICAgICAgIFx0fSk7XHJcblxyXG4gICAgICAgIH0pXHJcblxyXG5cclxuICAgIH07XHJcblxyXG4gICAgR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLnByb3RvdHlwZS5jcmllID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zKTtcclxuICAgICAgICBpbnN0YW5jZS5jb25zdHJ1Y3Rvci5hcHBseShpbnN0YW5jZSwgW10pO1xyXG5cclxuICAgICAgICByZXR1cm4gaW5zdGFuY2U7XHJcbiAgICB9O1xyXG5cclxuICAgIEdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcy5wcm90b3R5cGUuY29udGV4dG89ZnVuY3Rpb24oKXtcclxuICAgICAgICB2YXIgZG9taW5pbyA9IHJlcXVpcmUoJ2RvbWFpbicpLmFjdGl2ZTtcclxuICAgICAgICByZXR1cm4gZG9taW5pby5jb250ZXh0bztcclxuICAgIH07XHJcblxyXG4gICAgR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLnByb3RvdHlwZS5jb25leGFvPWZ1bmN0aW9uKGNhbGxiYWNrKXtcclxuICAgIFx0dHJ5e1xyXG4gICAgICAgIHRoaXMuY29udGV4dG8oKVxyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHRvKCkub2J0ZW5oYUNvbmV4YW8oY2FsbGJhY2spO1xyXG4gICAgXHR9Y2F0Y2goZXJyKXtcclxuICAgIFx0XHRjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgXHR9XHJcbiAgICB9XHJcblxyXG4gICAgR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zLnByb3RvdHlwZS50cmFuc2FjYW89ZnVuY3Rpb24oY2FsbGJhY2spe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNvbnRleHRvKCkuaW5pY2llVHJhbnNhY2FvKGNhbGxiYWNrKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gR2VyZW5jaWFkb3JEZU1hcGVhbWVudG9zO1xyXG59KSgpO1xyXG5leHBvcnRzLkdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcyA9IEdlcmVuY2lhZG9yRGVNYXBlYW1lbnRvcztcclxuXHJcbnZhciBNYXBlYW1lbnRvID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIE1hcGVhbWVudG8obm9tZSkge1xyXG4gICAgICAgIHRoaXMubm9tZSA9IG5vbWU7XHJcbiAgICAgICAgdGhpcy5maWxob3MgPSBbXTtcclxuICAgICAgICB0aGlzLnJlc3VsdE1hcHMgPSBbXTtcclxuICAgICAgICB0aGlzLnJlc3VsdHNNYXBzUG9ySWQgPSB7fTtcclxuICAgICAgICB0aGlzLm5vc1BvcklkID0ge307XHJcbiAgICB9XHJcbiAgICBNYXBlYW1lbnRvLnByb3RvdHlwZS5hZGljaW9uZSA9IGZ1bmN0aW9uIChub0ZpbGhvKSB7XHJcbiAgICAgICAgbm9GaWxoby5tYXBlYW1lbnRvID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5maWxob3MucHVzaChub0ZpbGhvKTtcclxuXHJcbiAgICAgICAgaWYgKG5vRmlsaG8gaW5zdGFuY2VvZiBOb1Jlc3VsdE1hcCkge1xyXG4gICAgICAgICAgICB0aGlzLnJlc3VsdE1hcHMucHVzaChub0ZpbGhvKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMucmVzdWx0c01hcHNQb3JJZFtub0ZpbGhvLmlkXSA9IG5vRmlsaG87XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLm5vc1BvcklkW25vRmlsaG8uaWRdID0gbm9GaWxobztcclxuICAgIH07XHJcblxyXG4gICAgTWFwZWFtZW50by5wcm90b3R5cGUub2J0ZW5oYVJlc3VsdE1hcCA9IGZ1bmN0aW9uIChub21lUmVzdWx0TWFwKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVzdWx0c01hcHNQb3JJZFtub21lUmVzdWx0TWFwXTtcclxuICAgIH07XHJcblxyXG4gICAgTWFwZWFtZW50by5wcm90b3R5cGUub2J0ZW5oYU5vID0gZnVuY3Rpb24gKGlkTm8pIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5ub3NQb3JJZFtpZE5vXTtcclxuICAgIH07XHJcbiAgICByZXR1cm4gTWFwZWFtZW50bztcclxufSkoKTtcclxuXHJcbmV4cG9ydHMuZGlyX3htbCA9IGRpcl94bWw7XHJcbmV4cG9ydHMuTWFwZWFtZW50byA9IE1hcGVhbWVudG87XHJcbmV4cG9ydHMuQ29udGV4dG8gPSBDb250ZXh0bztcclxuXHJcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPU5vLmpzLm1hcFxyXG4iXX0=
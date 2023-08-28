import BaseValidate from './BaseValidate';
class AuthValidate extends BaseValidate{
    constructor(){
        super();
    }
    setRule(){
        this.addRuleForField('email', 'trim', true);
        this.addRuleForField('email', 'required', false, i18n.__('required'));
        this.addRuleForField('email', 'type', 'email', i18n.__('type_email'));
        this.addRuleForField('email', 'maxLength', 100, i18n.__('maxLength_input'));


        this.addRuleForField('id_company', 'trim', true);
        this.addRuleForField('id_company', 'required', false, i18n.__('required'));
        this.addRuleForField('id_company', 'maxLength', 100, i18n.__('maxLength_input'));

        
        this.v.addRule('password', 'trim', true);
        this.v.addRule('password', 'required', true);
        this.v.setMsg('password', 'required', i18n.__('required'));
        this.v.addRule('password', 'minLength', 3);
        this.v.setMsg('password', 'minLength', i18n.__('minLength_input'));
    }
    setAlias(){
        this.v.setAlias({
            email: i18n.__('email'),
            password: i18n.__('password'),
            id_company: i18n.__('id_company')
        });
    }
}
export default AuthValidate;
/**
 * http://usejsdoc.org/
 */
var kafka = require('kafka-node');
var KafkaProducer = function(){
}
KafkaProducer.init = function(config){
	require('./KafkaConfig.js')
	var client = new kafka.KafkaClient(kafkaHost);
	this.producer = new Producer(client,kafkaProducerConfig);
}
module.exports = KafkaProducer;
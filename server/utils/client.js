

var amqp = require('amqplib/callback_api');



async function getKudos (nickname) { 
    return new Promise(resolve => {
            amqp.connect('amqp://localhost', function(error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue('', {
                        exclusive: true
                    }, function(error2, q) {
                        if (error2) {
                            throw error2;
                        }
                        var correlationId = generateUuid();
                        // var num = parseInt(args[0]);
                        var num = nickname.toString();
                        console.log(num);

                        console.log(' [x] Requesting users of `%s`', num);

                        channel.consume(q.queue, function(msg) {
                            if (msg.properties.correlationId === correlationId) {

                                resolve(msg.content);

                            }
                        }, {
                            noAck: true
                        });

                        

                        channel.sendToQueue('rpc_queue',
                            Buffer.from(`GET_KUDOS:${num.toString()}`), {
                                correlationId: correlationId,
                                replyTo: q.queue
                            });
                    });
                    
                });
            });
    })
}


async function delKudos (nickname) { 
    return new Promise(resolve => {
            amqp.connect('amqp://localhost', function(error0, connection) {
                if (error0) {
                    throw error0;
                }
                connection.createChannel(function(error1, channel) {
                    if (error1) {
                        throw error1;
                    }
                    channel.assertQueue('', {
                        exclusive: true
                    }, function(error2, q) {
                        if (error2) {
                            throw error2;
                        }
                        var correlationId = generateUuid();
                        // var num = parseInt(args[0]);
                        var num = nickname.toString();
                        console.log(num);

                        console.log(' [x] Requesting users of `%s`', num);

                        channel.consume(q.queue, function(msg) {
                            if (msg.properties.correlationId === correlationId) {

                                resolve(msg.content);

                            }
                        }, {
                            noAck: true
                        });

                        

                        channel.sendToQueue('rpc_queue',
                            Buffer.from(`DEL_KUDOS:${num.toString()}`), {
                                correlationId: correlationId,
                                replyTo: q.queue
                            });
                    });
                    
                });
            });
    })
}


function generateUuid() {
    return Math.random().toString() +
        Math.random().toString() +
        Math.random().toString();
}


module.exports = {
    getKudos, delKudos
};
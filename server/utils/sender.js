var express = require('express');
var app = express();
var amqp = require('amqplib/callback_api');

const port = 3006;

const updateUser = (idUser) => {

    amqp.connect('amqp://localhost', (err, conn) => {
        conn.createChannel((err, ch) => {
            var queue = 'FirstQueue2';
            var message = { user: idUser, msg: 'UPDATE_USER'}


            ch.assertQueue(queue, {durable: false});
            ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
            console.log(`Message was sent: ${JSON.stringify(message)} `);
        });

        setTimeout(() => {
            conn.close();
            //process.exit(0); 
        }, 500);
    });

    //app.listen(port, () => console.log(`App listening on port ${port}!`));
}



module.exports = {
    updateUser
};
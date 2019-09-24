const Influx = require('influx');
const express = require('express')
const http = require('http')
const os = require('os')



// console.log("init");
const influx = new Influx.InfluxDB({
    host: 'localhost',
    database: 'telegraf',
    schema: [
      {
        measurement: 'response_times',
        fields: {
          path: Influx.FieldType.STRING,
          method: Influx.FieldType.STRING,
          duration: Influx.FieldType.INTEGER,
          myTime : Influx.FieldType.STRING
        },
        tags: [
          'host'
        ]
      }
    ]
  })

  influx.getDatabaseNames()
  .then(names => {
    if (!names.includes('telegraf')) {
      return influx.createDatabase('telegraf');
    }
  })
  .then(() => {
    // http.createServer(app).listen(5000, function () {
    //   console.log('Listening on port 5000')
    // })
  })
  .catch(err => {
    console.error(`Error creating Influx database!`);
  })


const useLog = function(app){  app.use((req, res, next) => {
    const start = Date.now()
    let myTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    
    res.on('finish', () => {
      const duration = Date.now() - start
      console.log(`Request to ${req.path} took ${duration}ms`);
  
      influx.writePoints([
        {
          measurement: 'response_times',
          tags: { host: os.hostname() },
          fields: { duration, path: req.path ,method: req.method , myTime: myTime},
        }
      ]).catch(err => {
        console.error(`Error saving data to InfluxDB! ${err.stack}`)
      })
    })
    return next()
  })
}

//   app.use((req, res, next) => {
//     const start = Date.now()
  
//     res.on('finish', () => {
//       const duration = Date.now() - start
//       console.log(`Request to ${req.path} took ${duration}ms`);
  
//       influx.writePoints([
//         {
//           measurement: 'response_times',
//           tags: { host: os.hostname() },
//           fields: { duration, path: req.path },
//         }
//       ]).catch(err => {
//         console.error(`Error saving data to InfluxDB! ${err.stack}`)
//       })
//     })
//     return next()
//   })

//   app.get('/', function (req, res) {
//     setTimeout(() => res.end('Hello world!'), Math.random() * 500)
//   })


//   app.get('/times', function (req, res) {
//     influx.query(`
//       select * from response_times
//       where host = ${Influx.escape.stringLit(os.hostname())}
//       order by time desc
//       limit 10
//     `).then(result => {
//       res.json(result)
//     }).catch(err => {
//       res.status(500).send(err.stack)
//     })
//   })

//console.log(os.hostname());


module.exports = {
    influx, useLog
};
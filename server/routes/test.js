// const clientRCP = require('../utils/client');



// let result = clientRCP.getKudos('mary').then(r => {
//     console.log(`result: ${r}`);
// });

let myTime = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
console.log(myTime);
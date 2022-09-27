// To run: node 'generate_jwt_key.js'
// Copy and store the key from the console
// This will be an unhackable key to use for the API

let key = require('crypto').randomBytes(128).toString('hex'); 
console.log(key);
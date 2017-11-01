const express = require('express')
const app = express()
const fs = require('fs')
const httpProxy = require('http-proxy')
const proxy = httpProxy.createProxyServer({

});
const port = 3000


// openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
// openssl rsa -in keytmp.pem -out key.pem

app.get('/', (req, res) => {
  res.send('WORKING!')
})
app.all('/dev', (req, res) => {
  proxy.web(req, res, { target: 'http://0x8okrpyl3.execute-api.us-west-2.amazonaws.com/dev' });
});

const httpsOptions = {
  key: fs.readFileSync('encryption/key.pem'),
  cert: fs.readFileSync('encryption/cert.pem')
}


// const https = require('https');
// const express = require('express');
// const app = express();
// var httpProxy = require('http-proxy');
// var apiProxy = new httpProxy.createProxyServer({target:'https://0x8okrpyl3.execute-api.us-west-2.amazonaws.com'}).listen(8000);
// var fs = require('fs');

// var options = {
//     key: fs.readFileSync('encryption/private.key'),
//     cert: fs.readFileSync('encryption/localhost.crt'),
//     requestCert: false,
//     rejectUnauthorized: false
// };




 
 


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

// console.dir(https.createServer(options, app).listen(8443));
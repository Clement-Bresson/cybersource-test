const https = require('https')
const fs = require('fs')
const express = require('express')
const path = require('path')

const app = express()

const HTTP_PORT = process.env.DEV_PORT || 8080
const HTTPS_PORT = process.env.DEV_PORT || 8443

const readIfExist = path => {
  if (!fs.existsSync(path)) {
    return
  }
  return fs.readFileSync(path)
}

app.use(express.static(path.join(__dirname, 'build')))

const options = {
  cert: readIfExist('./sslcert/fullchain.pem'),
  key: readIfExist('./sslcert/privkey.pem')
}

app.get('/', function (req, res) {
  res.set('Cache-Control', 'no-cache')
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(HTTP_PORT, () => {
  console.log(`HTTP server running on port ${HTTP_PORT}`)
})
https.createServer(options, app).listen(HTTPS_PORT, () => {
  console.log(`HTTPS server running on port ${HTTPS_PORT}`)
})



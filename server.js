const express = require('express')
const fs = require('fs')
const path = require('path')

const app = express()
require('express-ws')(app)

let names = []

app.use(express.static(path.join(__dirname, 'public')))

app.get('/api/files', (req, res) => {
  fs.readdir('public/files/', (err, files) => {
    res.json(files)
  })
})

app.delete('/api/files', (req, res) => {
  fs.unlink('public/files/'+req.query.fileName, (err) => {
    if (err) res.end(req.query.fileName + ' was already deleted')
    res.end(req.query.fileName + ' has been deleted')
  });
})

app.ws('/name', (ws, req) => {
  ws.on('message', (fname) => {
    names.unshift(fname)
  })
})

app.ws('/upload', (ws, req) => {
  ws.on('message', (file) => {
    let fname = names.pop();
    fs.writeFile('public/files/'+fname, file, (err) => { 
      if(err) throw err
      ws.send(fname)
    })
  })
})

app.listen((process.env.PORT || 3000), () => console.log('File Uploader listening on port 3000!'))
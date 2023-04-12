require('dotenv').config();
const express = require('express');
const dns = require('dns')
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const url = require('url')

let state = []

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use('/api', bodyParser.urlencoded({extended: false}))

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const parsedUrl = url.parse(req.body.url)
  
  dns.lookup(req.body.url, function(err, address) {
    if (!parsedUrl.protocol || !parsedUrl.hostname) {
      res.send({error: "Invalid URL"})
    } else {
      const original_url = req.body.url;
      state.push(original_url)
      const short_url = state.indexOf(original_url) + 1;
      res.send({
        original_url: original_url,
        short_url: short_url
      })
    }
})});
  
app.get('/api/shorturl/:shorturl', function(req, res) {
  const {short} = req.params;
  const original = state[(req.params.shorturl - 1)];
  res.redirect(original);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

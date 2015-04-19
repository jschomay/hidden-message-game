mongodb = require("mongodb").MongoClient
http = require "http"
postdata = require "postdata"

dbUrl = 'mongodb://localhost:27017/quotedecoder'

quotes = undefined
BUNDLE = "starter"

mongodb.connect dbUrl, (err, db) ->
  throw err if err
  quotes = db.collection "quotes"
  quotes.ensureIndex "quote", unique: true, (err, result) ->
    throw err if err
    console.log "connected to db"


doError = (err, res) ->
  console.log err
  res.writeHead 500,
    "Content-type": "text/plain"
    "access-control-allow-origin": "http://localhost:3333"
  res.end "Quote couldn't be saved to database:" + err.message

server = http.createServer (req, res) ->
  postdata req, res, (err, data) ->
    return doError err, res if err
    console.log "saving quote:", data.quote

    quotes.insert {quote: data.quote, bundle: BUNDLE}, (err, result) ->
      return doError err, res if err

      console.log "success"

      quotes.find({}).toArray (err, docs) ->
        return doError err, res if err
        console.log "quote collection:", docs

        res.writeHead 200,
          "Content-type": "text/plain"
          "access-control-allow-origin": "http://localhost:3333"
        res.end()

server.listen 8000
console.log "Server running at localhost:8000"

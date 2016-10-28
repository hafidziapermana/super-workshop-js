'use strict'

// -----------------------------------------------------------------------------
// NODE MODULES
// -----------------------------------------------------------------------------

// Express dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

// Initiate Express
const app = express()
const router = express.Router()

// -----------------------------------------------------------------------------
// APP CONFIGURATION
// -----------------------------------------------------------------------------

// req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

const books = require('./data.js')

// -----------------------------------------------------------------------------
// ROUTING
// -----------------------------------------------------------------------------

// req.body   >>> /data + { id: 0 }
// req.params >>> /data/:id
// req.query  >>> /data?q={id}

router.get('/ping', (req, res) => {
  res.json({ 'message': 'PONG!' })
})

router.get('/books', (req, res) => {
  res.json(books)
})

router.post('/books', (req, res) => {
  const book = {
    id: Number(req.body.id),
    name: req.body.name,
    price: Number(req.body.price)
  }
  books.push(book)
  res.json(book)
})

router.get('/books/:id', (req, res) => {
  const book = books.filter(book => {
    return book.id === Number(req.params.id)
  })[0]

  if (!book) res.status(404).json({ 'message': "No book found" })

  res.status(200).json(book)
})

// DELETE

router.delete('/books/:id', (req, res) => {
  // get book by id
  const book = books.filter(book => {
    return book.id === Number(req.params.id)
  })[0]

  // send 404 if book not found
  if (!book) res.status(404).json({ 'message': "No book found" })

  // delete the book by id from array of book
  books.splice(books.indexOf(book), 1)

  // send success message
  res.status(200).json({ 'message': `Book ${req.params.id} has been deleted` })
})

// -----------------------------------------------------------------------------
// REGISTER ROUTES
// -----------------------------------------------------------------------------

app.use('/', router)

// -----------------------------------------------------------------------------
// RUN THE APP
// -----------------------------------------------------------------------------

const host = process.env.HOST || "localhost"
const port = process.env.PORT || "3000"

app.listen(port, host, (err) => {
  if (err) console.log(err)
  console.log(`Server is running on ${host}:${port}`)
})

require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const PhonebookEntry = require('./models/person')
const server = express()

server.use(cors())
server.use(express.static('frontend'))
server.use(express.json())
server.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :post')
)
morgan.token('post', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ' '
})

// eslint-disable-next-line no-unused-vars
const globalErrorHandler = (err, req, res, next) => {
  console.error('Error name:', err.name)
  console.error('Error message:', err.message)

  if (err.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted ID' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message })
  }

  return res.status(500).json({ error: 'Internal server error' })
}

const notFoundHandler = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
}

server.get('/api/persons', (req, res) => {
  PhonebookEntry.find({}).then((entries) => {
    res.json(entries)
  })
})

server.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body

  if (!name && !number) {
    return res.status(400).json({
      error: 'Name and number are missing',
    })
  }

  if (!name) {
    return res.status(400).json({
      error: 'Name is missing',
    })
  }

  if (!number) {
    return res.status(400).json({
      error: 'Number is missing',
    })
  }

  const newEntry = new PhonebookEntry({
    name,
    number,
  })
  newEntry
    .save()
    .then((saved) => {
      res.json(saved)
    })
    .catch((err) => {
      next(err)
    })
})

server.get('/api/persons/:id', (req, res, next) => {
  PhonebookEntry.findById(req.params.id)
    .then((entry) => {
      if (entry) {
        res.json(entry)
      } else {
        res.status(404).end()
      }
    })
    .catch((err) => next(err))
})

server.put('/api/persons/:id', (req, res, next) => {
  const { name, number } = req.body

  const updateData = {
    name,
    number,
  }

  PhonebookEntry.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((updated) => {
      if (!updated) {
        return res.status(404).end()
      }
      res.json(updated)
    })
    .catch((err) => {
      next(err)
    })
})

server.delete('/api/persons/:id', (req, res, next) => {
  PhonebookEntry.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end()
    })
    .catch((err) => next(err))
})

server.get('/info', (req, res) => {
  PhonebookEntry.find({}).then((entries) => {
    res.send(
      `<p>Phonebook contains ${entries.length} entries</p>
      <p>${new Date()}</p>`
    )
  })
})

server.use(notFoundHandler)
server.use(globalErrorHandler)

const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`Application started on port ${PORT}`)
})

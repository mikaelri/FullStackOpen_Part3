require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

morgan.token('content', (request) =>
    request.method === 'POST'
    ? JSON.stringify(request.body)
    : null
  )

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>');
  });

app.get('/info', (request, response) => {
  const now = new Date()

  Person
  .find({})
  .then(persons => {
  response.send
      (`<p> Phonebook has info for ${persons.length} people</p> <p>${now}</p>`)
  });
  }
);

app.get('/api/persons', (request, response) => {
  Person
  .find({})
  .then(persons => {response.json(persons)})
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  
  const person = persons.find(person => person.id === id)

  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  const person = new Person ({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id '})
  }
  next(error)
}

app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

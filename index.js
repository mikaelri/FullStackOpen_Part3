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

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateID = () => {
  const maxId = persons.length > 0
  ? Math.max(...persons.map(p => p.id))
  : 0
  return maxId +1
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error:'name or number is missing'
    })
  }

  if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error:'name must be unique'
    })
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number
  }


  persons = persons.concat(person)

  response.json(person)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

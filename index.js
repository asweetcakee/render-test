require('dotenv').config()
const express = require('express')
const cors = require('cors')
const Note = require('./models/node.js')

const app = express()

let notes = []

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}


// === Middleware ===
app.use(requestLogger)
app.use(express.static('dist'))
app.use(cors())
app.use(express.json())


// === Routes ===
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.get('/api/notes/:id', (request, response) => {
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  const id = request.params.id
  notes = notes.filter((note) => note.id !== id)

  response.status(204).end()
})

app.put('/api/notes/:id', (request, response) => {
  const id = request.params.id
  const body = request.body

  const noteIndex = notes.findIndex(note => note.id === id)

  if (noteIndex === -1) {
    return response.status(404).json({ error: 'note not found' })
  }

  const updatedNote = {
    ...notes[noteIndex],
    content: body.content,
    important: body.important
  }

  notes[noteIndex] = updatedNote

  response.json(updatedNote)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
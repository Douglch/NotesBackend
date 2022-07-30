const notesRouter = require('express').Router()
// Import note model
const Note = require('../models/note')
// Import user model
const User = require('../models/users')

// "/" = application's root directory -> displays main page
notesRouter.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// displays notes from mongodb
notesRouter.get('/api/notes', async (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes)
    })
})

// Fetching individual notes by id
notesRouter.get('/api/notes/:id', (request, response, next) => {
    Note.findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch((err) => {
            // console.log(err);
            // response.status(400).send({ error: "malformatted id" });
            next(err)
        })
})

// Deleting data as a user, try doing it through postman
notesRouter.delete('/api/notes/:id', async (request, response) => {
    await Note.findByIdAndRemove(request.params.id)
    response.status(204).end()
})

// Adding notes
notesRouter.post('/api/notes', async (request, response) => {
    const body = request.body

    const user = await User.findById(body.userId)

    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
        user: user._id,
    })

    const savedNote = await note.save()
    user.notes = user.notes.concat(savedNote._id)
    response.status(201).json(savedNote)
})

// Updating notes
notesRouter.put('/api/:id', (request, response, next) => {
    const { content, important } = request.body

    Note.findByIdAndUpdate(
        request.params.id,
        { content, important },
        { new: true, runValidators: true, context: 'query' }
    )
        .then((updatedNote) => {
            response.json(updatedNote)
        })
        .catch((err) => next(err))
})

module.exports = notesRouter
/* procfile tells Heroku how to start the application.
   dependencies are done with npm install {dependency here}
*/

// Importing express as express
const express = require('express')
const app = express()
// Allows cross server and data references
const cors = require('cors')
// Sets the database and server environment to run from
require('dotenv').config()
app.use(express.json())
app.use(cors())
// Frontend production build import
app.use(express.static('build'))

// Import note model
const Note = require('./models/note')

// let notes = [
//   {
//     id: 1,
//     content: "HTML is easy",
//     date: "2022-05-30T17:30:31.098Z",
//     important: true,
//   },
//   {
//     id: 2,
//     content: "Browser can execute only Javascript",
//     date: "2022-05-30T18:39:34.091Z",
//     important: false,
//   },
//   {
//     id: 3,
//     content: "GET and POST are the most important methods of HTTP protocol",
//     date: "2022-05-30T19:20:14.298Z",
//     important: true,
//   },
// ];

// const generateId = () => {
//   const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
//   return maxId + 1;
// };

// "/" = application's root directory -> displays main page
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

// displays notes from mongodb
app.get('/api/notes', (request, response) => {
    Note.find({}).then((notes) => {
        response.json(notes)
    })
})

// Fetching individual notes by id
app.get('/api/notes/:id', (request, response, next) => {
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
app.delete('/api/notes/:id', (request, response, next) => {
    Note.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch((error) => next(error))
})

// Adding notes
app.post('/api/notes', (request, response, next) => {
    const body = request.body
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
    }
    const note = new Note({
        content: body.content,
        important: body.important || false,
        date: new Date(),
    })

    note
        .save()
        .then((savedNote) => {
            response.json(savedNote)
        })
        .catch((err) => next(err))
})

// Updating notes
app.put('/api/:id', (request, response, next) => {
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

// Shows a 404 error for a note with unknown id
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
    // If request does not fufill the schema of the model
        return response.status(400).send({ error: error.message })
    }

    next(error)
}

// handler of requests with result to errors
app.use(errorHandler)

// Port uses 3001 as set in .env
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    // ...notes.map(..) -> spread operator converts array to num
    // console.log(...notes.map((n) => n.id));
})

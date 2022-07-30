// Test that'll be run everytime
const Note = require('../models/note')
const User = require('../models/user')


const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true
    }
]

// Used for creating a database object ID that does not belong to any note object in the database.
const nonExistingId = async () => {
    const note = new Note({ content: 'willremovethissoon', date: new Date() })
    await note.save()
    await note.remove()

    return note._id.toString()
}

// Check notes can be addded
const notesInDb = async () => {
    const notes = await Note.find({})
    return notes.map(note => note.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialNotes, nonExistingId, notesInDb, usersInDb
}
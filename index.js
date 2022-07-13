/* procfile tells Heroku how to start the application.
   dependencies are done with npm install {dependency here}
*/

// Importing express as express
const express = require("express");
const app = express();
// Allows cross server and data references
const cors = require("cors");
// Sets the database and server environment to run from
require("dotenv").config();
app.use(express.json());
app.use(cors());
// Frontend production build import
app.use(express.static("build"));

// Import note model
const Note = require("./models/note");

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
app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

// displays notes from mongodb
app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

// Fetching individual notes by id
app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id).then((note) => {
    response.json(note);
  });
});

// Deleting data as a user, try doing it through postman
app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndDelete(request.params.id).then((note) => {
    response.json(note);
  });
});

// Adding notes
app.post("/api/notes", (request, response) => {
  const body = request.body;
  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }
  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

// Shows a 404 error for a note with unknown id
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

// Port uses 3001 as set in .env
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // ...notes.map(..) -> spread operator converts array to num
  // console.log(...notes.map((n) => n.id));
});

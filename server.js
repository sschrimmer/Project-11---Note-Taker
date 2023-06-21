//======================================================================
// Welcome to the Note Taker
//======================================================================

const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./DB/db")

//======================================================================
// This sets up the APP
//======================================================================

var app = express();
var PORT = process.env.PORT || 3000;

//==============================================================================
// Linking Assets
app.use(express.static('public'));

//==============================================================================
// This sets up data parsing--
// Required for calling API
//==============================================================================

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//==============================================================================
// On page load, it will start with index.html.
//==============================================================================

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Notes html "url"
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

//===============================================================================
// GET & Post API Endpoints.
//===============================================================================

// GET and the  POST functions grab from the route, we can set it 
app.route("/api/notes")
    // Grab the notes list
    .get(function (req, res) {
        res.json(database);
    })

    // new note to the json file
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        // test note to be the original note.
        let highestId = 99;
        // loops through array
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                // highestId will always be the highest numbered id in the notesArray.
                highestId = individualNote.id;
            }
        }
        // ID to newNote. 
        newNote.id = highestId + 1;
        // Pushed to db.json.
        database.push(newNote)

        // Write the db.json file
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // Gives back the response
        res.json(newNote);
    });

//=================================================================
// Delete a note based on an ID
// This route dependent ID of note.
//      1. Find note by id
//      2. out of array of notes.
//=================================================================

app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    // request to delete note by id.
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            // Splice takes i position, and then deletes the 1 note.
            database.splice(i, 1);
            break;
        }
    }
    // Write the db.json file again.
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});

//===========================================================================
// This sets up the server.
//===========================================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
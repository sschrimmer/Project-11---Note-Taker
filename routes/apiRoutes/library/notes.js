const fs = require('fs');
const path = require('path');

function createNewNote(body, notesArray) {
  const note = body;
  notesArray.push(note);
  fs.writeFileSync(
    path.join(__dirname, '../db/notes.json'),
    JSON.stringify({ notesArray }, null, 2)
  );
  return note;
}

// delete note with matching index
function deleteNote(id, notes) {
  let notesArray = notes.filter(el => {
    if (el.id == id) {
      return false
    } else {
      return true
    }
  })

  // re-index 
  let index = 0;
  notesArray.forEach(note => {
    note.id = index;
    index += 1;
  });

  //write to file
  fs.writeFileSync(
    path.join(__dirname, '../db/notes.json'),
    JSON.stringify({ notesArray }, null, 2)
  );
  return notesArray;
}

module.exports = {
  createNewNote,
  deleteNote
};
const router = require('express').Router();
const { createNewNote, deleteNote } = require('../../lib/notes');
let { notesArray } = require('../../db/notes');

// notes are available at api/notes in JSON 
router.get('/notes', (req, res) => {
  let results = notesArray;
  res.json(results);
});

router.post('/notes', (req, res) => {
  // set id based on what the next index of the array will be
  if(notesArray){
  req.body.id = notesArray.length.toString();
  } else 
  {req.body.id = 0}
  res.json(createNewNote(req.body, notesArray));
});

// Route parameters :👌 
router.delete('/notes/:id', async (req, res) => {
  const { id } = req.params
  notesArray = await deleteNote(id, notesArray);
  res.json(notesArray);
});

module.exports = router;
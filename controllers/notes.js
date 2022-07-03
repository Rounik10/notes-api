const { ObjectId } = require('mongodb');
const Note = require('../models/note');
const response = require('../utils/response');

exports.getNotes = (req, res) => {
  Note.findAll()
    .then((notes) => response.success(res, notes))
    .catch((err) => response.serverError(res, err));
};

exports.addNote = (req, res) => {
  const title = req.body.title;
  const description = req.body.description;

  if (!title) {
    response.badRequest(res, 'Title is required to create note!');
    return;
  }

  new Note(title, description)
    .save()
    .then(() => response.success(res, 'Note added successfully'))
    .catch((err) => response.serverError(res, err, 'Error in adding note'));
};

exports.getNoteById = (req, res) => {
  const id = req.params.id;
  if (!id || !ObjectId.isValid(id)) response.badRequest(res, 'Invalid note id!');

  Note.findById(id)
    .then((success) => {
      if (!success) response.notFound(res, `Note with id: ${id} was not found!`);
      else response.success(res, note);
    })
    .catch((err) => {
      response.serverError(res, err, `Error in retrieving note with id: ${id}!`);
    });
};

exports.updateNote = (req, res) => {
  const id = req.body.id;
  const title = req.body.title;
  const description = req.body.description;

  if (!id || !ObjectId.isValid(id)) {
    response.badRequest(res, 'Note id is required to update note!');
    return;
  }

  if (!title) {
    response.badRequest(res, 'Title is required to update note!');
    return;
  }

  Note.update(id, title, description)
    .then((success) => {
      if (success) response.success(res, `Successfully updated note with id: ${id}`);
      else response.serverError(res, undefined, 'Something went wrong');
    })
    .catch((err) => console.log(err));
};

exports.deleteNoteById = (req, res) => {
  const id = req.params.id;
  if (!id || !ObjectId.isValid(id)) return response.badRequest(res, `Invalid note ID: ${id}`);
  Note.delete(id)
    .then((success) => {
      console.log(success);
      if (success) response.success(res, `Successfully deleted note with id: ${id}`);
      else response.serverError(res, undefined, 'Something went wrong');
    })
    .catch((err) => response.serverError(res, err, "Couldn't delete the note"));
};

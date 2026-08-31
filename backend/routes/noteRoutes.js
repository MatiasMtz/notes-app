/*
* Defines the API endpoints for handling note-related operations.
* Maps HTTP methods and routes to the appropriate controller methods.
* Workflow: Frontend <-> Routes <-> Controller <-> Service <-> Repository <-> Database
*/

const express = require('express');
const noteController = require('../layer_controllers/noteController');
const categoryController = require('../layer_controllers/categoryController');
const router = express.Router();

router.post('/notes', noteController.createNote); // Create a new note
router.get('/notes', noteController.getAllNotes); // Retrieve all notes

router.get('/notes/:id', noteController.getNoteById); // Retrieve a specific note by ID
router.put('/notes/:id', noteController.updateNote); // Update a specific note by ID
router.delete('/notes/:id', noteController.deleteNote); // Delete a specific note by ID

router.get('/categories', categoryController.getCategories); // Retrieves all categories
module.exports = router;

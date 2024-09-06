const express = require('express');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, upvoteEvent, downvoteEvent } = require('../controllers/eventController');
const uploadMiddleware = require('../middleware/multerMiddleware');

const router = express.Router();

router.get('/events', getEvents);
router.post('/events', uploadMiddleware, createEvent);
router.get('/events/:id', getEventById);
router.put('/events/:id', uploadMiddleware, updateEvent);
router.delete('/events/:id', deleteEvent);

router.post('/events/:id/upvote', upvoteEvent);
router.post('/events/:id/downvote', downvoteEvent);

module.exports = router;

const express = require('express');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const uploadMiddleware = require('../middleware/multerMiddleware');

const router = express.Router();

router.get('/user-profile', (req, res) => {
    res.json(req.user);
});

router.get('/events', getEvents);
router.post('/events', uploadMiddleware, createEvent);
router.get('/events/:id', getEventById);
router.put('/events/:id', uploadMiddleware, updateEvent);
router.delete('/events/:id', deleteEvent);

module.exports = router;

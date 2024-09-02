
const express = require('express');
const Event = require('../models/eventModel');
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent } = require('../controllers/eventController');
const router = express.Router();

router.get('/user-profile', (req, res) => {
    res.json(req.user);
});

router.get('/events', async (req, res) => {
    const events = await Event.find({});
    res.json(events);
});

router.post('/create-event', createEvent);
router.get('/events', getEvents);
router.get('/event/:id', getEventById);
router.put('/update-event/:id', updateEvent);
router.delete('/delete-event/:id', deleteEvent);

module.exports = router;


const express = require('express');
const Event = require('../models/eventModel');
const router = express.Router();

router.get('/user-profile', (req, res) => {
    res.json(req.user);
});

router.post('/create-event', async (req, res) => {
    const { organizer, image, title, description, date, location } = req.body;

    try {
        const event = await Event.create({
            organizer,
            image,
            title,
            description,
            date,
            location
        });
    } catch (error) {
        res.status(500).send('Error creating event: ' + error.message);
    }

    res.send('Event created successfully!');
});

module.exports = router;

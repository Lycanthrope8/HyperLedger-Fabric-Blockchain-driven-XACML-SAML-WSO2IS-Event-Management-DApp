const fs = require('fs');
const path = require('path');
const Event = require('../models/eventModel');

const getEvents = async (req, res) => {
    try {
        const events = await Event.find({});
        res.json(events);
    } catch (error) {
        res.status(500).send('Error retrieving events: ' + error.message);
    }
};

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.json(event);
    } catch (error) {
        res.status(500).send('Error retrieving event: ' + error.message);
    }
};

const createEvent = async (req, res) => {
    const { organizer, title, description, date, location } = req.body;
    const image = {};
    console.log(req.file);
    if (req.file) {
        const filePath = path.join(__dirname, '..', 'uploads', req.file.filename);
        image.data = fs.readFileSync(filePath);
        image.contentType = req.file.mimetype;
    } else {
        return res.status(400).send('Image is required');
    }

    try {
        const event = new Event({
            organizer,
            image,
            title,
            description,
            date,
            location
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(400).send('Error creating event: ' + error.message);
    }
};

const updateEvent = async (req, res) => {
    const { organizer, title, description, date, location } = req.body;
    const update = { organizer, title, description, date, location };

    if (req.file) {
        update.image = {
            data: req.file.buffer,
            contentType: req.file.mimetype
        };
    }

    try {
        const event = await Event.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.json(event);
    } catch (error) {
        res.status(400).send('Error updating event: ' + error.message);
    }
};

const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.send('Event deleted successfully');
    } catch (error) {
        res.status(500).send('Error deleting event: ' + error.message);
    }
};

module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
};
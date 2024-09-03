const fs = require('fs');
const path = require('path');
const Event = require('../models/eventModel');

const getEvents = async (req, res) => {
    try {
        // Fetch all events from the database
        const events = await Event.find({});

        // Map over the events to format the response
        const formattedEvents = events.map(event => ({
            _id: event._id,
            organizer: event.organizer,
            title: event.title,
            description: event.description,
            date: event.date,
            location: event.location,
            // Construct the full image path if an image exists, and include the actual MIME type
            image: event.image ? {
                path: `${req.protocol}://${req.get('host')}/${event.image}`,
                contentType: event.contentType || 'application/octet-stream' // Fallback if MIME type is unknown
            } : null
        }));

        res.json(formattedEvents);
    } catch (error) {
        console.error('Failed to retrieve events:', error);
        res.status(500).send('Error retrieving events: ' + error.message);
    }
};

const getEventById = async (req, res, ) => {
    console.log(req.params.id);
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
    console.log(req.file);

    const imagePath = req.file ? req.file.path : null;

    if (!imagePath) {
        return res.status(400).send('Image is required');
    }

    try {
        const event = new Event({
            organizer,
            image: imagePath,  // Store only the path
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
        update.image = req.file.path;
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
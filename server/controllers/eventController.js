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
        const event = await Event.findOne({ eventId: req.params.id });
        if (!event) {
            return res.status(404).send('Event not found');
        }
        res.json(event);
    } catch (error) {
        res.status(500).send('Error retrieving event: ' + error.message);
    }
};

const createEvent = async (req, res) => {
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
        res.status(201).json({
            message: 'Event created successfully!',
            eventId: event.eventId,
            eventDetails: event
        });
    } catch (error) {
        res.status(400).send('Error creating event: ' + error.message);
    }
};

const updateEvent = async (req, res) => {
    const { id } = req.params;
    const { organizer, image, title, description, date, location } = req.body;

    try {
        const event = await Event.findOneAndUpdate({ eventId: id }, {
            organizer,
            image,
            title,
            description,
            date,
            location
        }, { new: true });

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
        const event = await Event.findOneAndDelete({ eventId: req.params.id });
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

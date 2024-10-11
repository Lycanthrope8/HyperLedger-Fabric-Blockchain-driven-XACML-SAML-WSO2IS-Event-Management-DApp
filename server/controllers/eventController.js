const fs = require('fs');
const path = require('path');
const Event = require('../models/eventModel');

const getEvents = async (req, res) => {
    const startTimestamp = Date.now();
    let count = 0;
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
            } : null,
            upvotes: event.upvotes,
            downvotes: event.downvotes,
            interested: event.interested,
            going: event.going
        }));

        res.json(formattedEvents);
    } catch (error) {
        count++;
        console.error('Failed to retrieve events:', error);
        res.status(500).send('Error retrieving events: ' + error.message);
    }
    const endTimestamp = Date.now();
    console.log(`Elapsed time: ${endTimestamp - startTimestamp}ms`);
    console.log(`Error count: ${count}`);
};

const getEventById = async (req, res,) => {
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

  // If no file is uploaded, return an error
  if (!req.file) {
    return res.status(400).json({ message: "Image is required" });
  }

  const imagePath = req.file.path;

  try {
    const event = new Event({
      organizer,
      image: imagePath,
      title,
      description,
      date,
      location,
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: "Error creating event: " + error.message });
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

const upvoteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        event.upvotes++;
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).send('Error upvoting event: ' + error.message);
    }
};

const downvoteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).send('Event not found');
        }
        event.downvotes++;
        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).send('Error downvoting event: ' + error.message);
    }
};

const bookTicket = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send("Event not found");

        const { username } = req.body;
        if (!event.booked.includes(username)) {
            event.booked.push(username);
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).send("Error booking ticket: " + error.message);
    }
};


const updateInterested = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send('Event not found');

        const { username } = req.body;
        if (event.interested.includes(username)) {
            event.interested.pull(username);
        } else {
            event.interested.push(username);
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).send('Error updating interested: ' + error.message);
    }
};

const updateGoing = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).send('Event not found');

        const { username } = req.body;
        if (event.going.includes(username)) {
            event.going.pull(username);
        } else {
            event.going.push(username);
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).send('Error updating going: ' + error.message);
    }
};


module.exports = {
    getEvents,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent,
    upvoteEvent,
    downvoteEvent,
    bookTicket,
    updateInterested,
    updateGoing
};
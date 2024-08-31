const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    organizer: {
        type: String,
        required: true,
        trim: true,
        required: true
    },
    image: {
        type: String,
        required: true,
        trim: true,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        required: true
    },
    description: {
        type: String,
        required: true,
        trim: true,
        required: true
    },
    date: {
        type: Date,
        required: true,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    organizer: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    upvotes: {
        type: Number,
        default: 0
    },
    downvotes: {
        type: Number,
        default: 0
    },
    interested: {
        type: [String],
        default: []
    },
    going: {
        type: [String],
        default: []
    },
    booked: {
        type: [String],
        default: []
    }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);

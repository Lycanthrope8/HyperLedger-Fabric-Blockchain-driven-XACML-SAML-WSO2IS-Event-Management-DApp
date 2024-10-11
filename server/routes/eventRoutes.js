const express = require("express");
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent,
  upvoteEvent,
  downvoteEvent,
  bookTicket,
  updateInterested,
  updateGoing,
} = require("../controllers/eventController");
const uploadMiddleware = require("../middleware/multerMiddleware");
const authorizationMiddleware = require("../middleware/authorizationMiddleware");

const router = express.Router();

router.get("/events", authorizationMiddleware("read", "events"), getEvents);
router.post(
  "/events",
  authorizationMiddleware("write", "events"),
  uploadMiddleware,
  createEvent
);
router.get(
  "/events/:id",
  authorizationMiddleware("read", "events"),
  getEventById
);
router.put(
  "/events/:id",
  authorizationMiddleware("update", "events"),
  uploadMiddleware,
  updateEvent
);
router.delete(
  "/events/:id",
  authorizationMiddleware("read", "events"),
  deleteEvent
);

router.post("/events/:id/upvote", upvoteEvent);
router.post("/events/:id/downvote", downvoteEvent);

router.post("/events/:id/book", bookTicket);
router.post("/events/:id/interested", updateInterested);
router.post("/events/:id/going", updateGoing);

module.exports = router;

'use strict';

const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');


router.get('/user-info', getUserProfile);

module.exports = router;

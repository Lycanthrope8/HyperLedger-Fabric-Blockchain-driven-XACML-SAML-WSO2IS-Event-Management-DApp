'use strict';

const express = require('express');
const router = express.Router();
const { getUserProfile, checkUserAccess } = require('../controllers/userController');


router.get('/user-info', getUserProfile);
router.post('/check-access', checkUserAccess);

module.exports = router;

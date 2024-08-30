
const express = require('express');
const router = express.Router();

router.get('/user-profile', (req, res) => {
          res.json(req.user);
});


module.exports = router;

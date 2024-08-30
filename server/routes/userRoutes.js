
const express = require('express');
const router = express.Router();

router.get('/user-profile', (req, res) => {
if (req.isAuthenticated()) {
          res.json(req.user);
} else {
          res.status(401).send('User is not authenticated');
}
});


module.exports = router;

const axios = require('axios');

// Middleware to check if the user is authorized to perform the action
const authorizationMiddleware = (action, resource) => {
    return async (req, res, next) => {
        try {
            const subject = req.user.username; // Assuming you have user info in req.user from Passport

            // Make a request to your XACML service to check authorization
            const response = await axios.post('https://localhost:3000/xacml/enforce', {
                subject,
                action,
                resource,
            });

            if (response.data === 'Result: Access granted') {
                next(); // Authorized, move to the next middleware or route handler
            } else {
                return res.status(403).json({ message: 'Access denied' }); // Unauthorized
            }
        } catch (error) {
            console.error('Authorization Middleware Error:', error);
            return res.status(500).json({ message: 'Authorization service error' });
        }
    };
};

module.exports = authorizationMiddleware;

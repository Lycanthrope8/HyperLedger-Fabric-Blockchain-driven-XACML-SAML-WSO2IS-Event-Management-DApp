const axios = require('axios');
const https = require('https');

// Middleware to check if the user is authorized to perform the action
const authorizationMiddleware = (action, resource) => {
          return async (req, res, next) => {
                    try {
                    // Log the incoming request
                    console.log('Authorization Middleware Invoked');
                    console.log('Action:', action);
                    console.log('Resource:', resource);

                    // Retrieve the username from req.user, headers, or query params
                    const subject = req.user?.username || req.headers['authorization']?.split(' ')[1] || req.query.username;

                    console.log('User information:', req.user); // Log the entire user profile (if available)
                    console.log('Subject (username):', subject);  // Log the retrieved username

                    if (!subject) {
                              console.log('No user information found. Returning 401 Unauthorized.');
                              return res.status(401).json({ message: 'Unauthorized: No user information found' });
                    }

                    // Make the request to your XACML service to check authorization
                    const response = await axios.post(
                              'https://localhost:3000/xacml/enforce',
                              { subject, action, resource },
                              { httpsAgent: new https.Agent({ rejectUnauthorized: false }) }
                    );

                    const granted = response.data === 'Result: Access granted';

                    if (granted) {
                              console.log('Access granted. Proceeding to next middleware...');
                              next(); // Authorized, move to the next middleware or route handler
                    } else {
                              console.log('Access denied. Returning 403 Forbidden.');
                              return res.status(403).json({ message: 'Access denied' });
                    }

                    } catch (error) {
                    console.error('Authorization Middleware Error:', error);
                    return res.status(500).json({ message: 'Authorization service error' });
                    }
          };
          };
      
      

module.exports = authorizationMiddleware;

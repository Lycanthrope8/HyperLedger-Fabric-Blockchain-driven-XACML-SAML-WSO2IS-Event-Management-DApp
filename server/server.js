const express = require('express');
const session = require('express-session');
const passport = require('./config/passport-config'); 
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const xacmlRoutes = require('./routes/xacmlRoutes'); // Add this line
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: 'https://localhost:3001',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', authRoutes);
app.use('/xacml', xacmlRoutes); // Use XACML routes

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'security', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'security', 'server.cert'))
};

https.createServer(httpsOptions, app).listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

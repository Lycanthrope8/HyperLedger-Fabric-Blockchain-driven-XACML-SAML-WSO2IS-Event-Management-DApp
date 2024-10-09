const express = require('express');
const session = require('express-session');
const passport = require('./config/passport-config');
const Docker = require('dockerode');
const docker = new Docker();
const bodyParser = require('body-parser');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const xacmlRoutes = require('./routes/xacmlRoutes');
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dockerRoutes = require('./routes/dockerRoutes');
const roleRoutes = require('./routes/roleRoutes');
require('dotenv').config();

const app = express();
const mongoose = require('mongoose');

const corsOptions = {
  origin: 'https://localhost:3001',
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/app/status', (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({ authenticated: true });
  } else {
    return res.json({ authenticated: false });
  }
});

app.use('/', authRoutes);
app.use('/', userRoutes);
app.use('/', eventRoutes);
app.use('/xacml', xacmlRoutes); 
app.use('/docker', dockerRoutes);
app.use('/roles', roleRoutes);

const authorizationMiddleware = require('./middleware/authorizationMiddleware');

// Create a test route to use the middleware
app.get('/test-middleware', authorizationMiddleware(), (req, res) => {
    res.send('Middleware test completed.');
});


// MONGOOSE CONNECTION
mongoose.connect(process.env.MONGO_URI).then(() => {
  https.createServer(httpsOptions, app).listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
  });
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.log('Error connecting to MongoDB:', error.message);
});

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'security', 'server.key')),
  cert: fs.readFileSync(path.join(__dirname, 'security', 'server.cert'))
};


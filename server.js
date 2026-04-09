const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/activities', require('./routes/activityRoutes'));

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// The dashboard is served automatically from the 'public' folder via express.static

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

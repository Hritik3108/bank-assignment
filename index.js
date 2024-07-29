const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config({path:'./process.env'});
const path = require('path');

const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173'
}));

// Static file serving
app.use(express.static(path.join(__dirname, './client/dist')));
app.use(express.static(path.join(__dirname, './images')));

app.listen(5100, () => {
    console.log('Server started on port 5100');
});

// mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => console.log('Connection to database successful'))
//     .catch(err => console.error('Connection with database failed:', err));

// const db = mongoose.connection;
// db.on('error', (err) => {
//     console.error('Database connection error:', err);
// });

mongoose.connect(process.env.DATABASE);

const db=mongoose.connection;
db.on('open',()=>{
    console.log('Connection to database successful');
});
db.on('error',()=>{
    console.log('Connection with database failed');
});

// Route handling
const authRoute = require('./routes/auth.routes');
app.use(authRoute);

const customerRoute = require('./routes/user.routes');
app.use(customerRoute);

const bankerRoute = require('./routes/banker.routes');
app.use(bankerRoute);

// Serve the index.html for all other routes to support client-side routing
app.get('*', (req, res) => res.sendFile(path.join(__dirname, './client/dist/index.html')));

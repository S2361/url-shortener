const express = require('express');
const { PORT = 8000 } = process.env; // Use environment variable for port or default to 8000
const expressApp = require('./express-app'); // Import the Express app configuration
const mongoose = require('./database');

const startServer = async () => {

    console.log("Starting the server...")
    const app = express();

    await expressApp(app);

    app.listen(PORT, () => {
        console.log(`Listening on port ${PORT}`);
    })
    .on('error', (err) => {
        console.error('Server error:', err);
        process.exit();
    });
};

startServer()
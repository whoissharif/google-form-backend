const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json({ limit: '100 mb' }));

// @connect database
const dbURL = `mongodb://localhost:27017/gform?readPreference=primary&ssl=false`;

mongoose.connect(dbURL, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once ('open', () => console.log(`Mongo Connected. Database: job-portal. Port: 27017`));


app.use('/api', require('./routes'))

app.listen(4000,()=>{
    console.log('server running on port : 4000')
})
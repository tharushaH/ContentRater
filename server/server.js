const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema.js');
const { sequelize } = require('../models/index.js');
const cors = require('cors');
require('dotenv').config();
const { User, Wishlist, Rating, Contents, MoviesAndShows, Genre, ContentGenre } = require('../models');

const app = express();

// Enable CORS
app.use(cors());

// Sync Sequelize models
sequelize.sync().then(async () => {
    console.log('Server starting up...')
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

// Middleware to pass the database connection to the schema
app.use((req, res, next) => {
    req.db = sequelize;
    next();
});

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}...`);
});
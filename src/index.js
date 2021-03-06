const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const path = require('path');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const moviesRoutes = require('./routes/movies.route');
const seriesRoutes = require('./routes/series.route');

dotenv.config();
dotenv.config({ path: path.join(__dirname, 'config/.env') });

const app = express();

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
// app.use(helmet());
app.use(cors());
// app.use(express.json());

dotenv.config();
dotenv.config({ path: path.join(__dirname, 'config/.env') });

/** Routes */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

/** Swagger Documentation */
const swaggerOptions = {
    definition: {
        openapi: '',
        info: {
            title: 'Movie App',
            version: '1.0.0',
            description: 'An API to get data about your favourite movies and series',
        },
        servers: [
            {
                url: 'http://localhost:6000',
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const specs = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.use('/movies', moviesRoutes);
app.use('/series', seriesRoutes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json({
        status : 404,
        message: error.message,
    });
});

const httpServer = http.createServer(app);
const PORT = process.env.PORT || 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));

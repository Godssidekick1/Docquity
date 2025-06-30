const express = require('express');
const mongoose = require('mongoose');  
require('dotenv').config(); // Load environment variables

const userRoutes = require('./routes/userRoutes'); // Import user routes
const shortUrlRoutes = require('./routes/shortUrlRoutes'); // Import short url routes
const redisClient = require('./services/redisClient'); // Import redis client
const { redirectShortUrl } = require('./controllers/shortUrlController'); // Import redirect short url controller
const swaggerUi = require('swagger-ui-express'); // Import Swagger UI
const yaml = require('yamljs'); // Import YAML parser

const openApiDocument = yaml.load('./openapi.yaml'); // Load OpenAPI specification from YAML file

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB error:', err));

// Connect to Redis
(async () => {
  await redisClient.connect();
  console.log('Redis connected');

  // Swagger API documentation route
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

  // Health check logic
  app.get('/healthcheck', (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    const redisStatus = redisClient.isOpen ? 'connected' : 'disconnected';

    res.status(200).json({
      status: 'API is healthy!',
      mongo: mongoStatus,
      redis: redisStatus,
    });
  });

  // Use routes
  app.use('/shorten', shortUrlRoutes); // Use short url routes
  app.use('/', userRoutes); // Use user routes

  // Dynamic route for short URL redirection
  app.get('/:short_code', redirectShortUrl); // Redirect short url

  app.get('/', (req, res) => {
    res.send('API is up and running!');
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger API documentation available at http://localhost:${port}/api-docs`);
  });
})();

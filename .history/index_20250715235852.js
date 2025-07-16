const express = require('express');
const mongoose = require('mongoose');  
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes'); // Import user routes
const shortUrlRoutes = require('./routes/shortUrlRoutes'); // Import short url routes
const appRoutes = require('./routes/appRoutes'); // Import app routes
const redisClient = require('./services/redisClient'); // Import redis client
const swaggerUi = require('swagger-ui-express'); // Import Swagger UI
const yaml = require('yamljs'); // Import YAML parser

const openApiDocument = yaml.load('./openapi.yaml'); // Load OpenAPI specification from YAML file

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json()); // Parse JSON request bodies
app.use(cors()); // Enable CORS if needed

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

  // Mount app registration routes
  app.use('/api/apps', appRoutes);

  // Use routes
  app.use('/shorten', shortUrlRoutes); // Use short url routes
  app.use('/', userRoutes); // Use user routes

  app.get('/', (req, res) => {
    res.send('API is up and running!');
  });

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    console.log(`Swagger API documentation available at http://localhost:${port}/api-docs`);
  });
})();

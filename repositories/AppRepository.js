const App = require('../models/App');

const AppRepository = {
  /**
   * Registers a new app or returns an existing one if the name already exists.
   * @param {string} name - The name of the app.
   * @param {string} baseUrl - The base URL of the app.
   * @returns {Promise<Object>} - The existing or newly created app document.
   */
  async registerApp(name, baseUrl) {
    try {
      // Check if an app with the given name already exists
      let app = await App.findOne({ name });
      if (app) {
        return app; // Return the existing app
      }

      // Create a new app if it doesn't exist
      app = new App({ name, base_url: baseUrl });
      return await app.save(); // Save and return the new app
    } catch (error) {
      throw new Error(`Error registering app: ${error.message}`);
    }
  },

  /**
   * Finds an app by its authentication token.
   * @param {string} token - The authentication token of the app.
   * @returns {Promise<Object|null>} - The app document or null if not found.
   */
  async findByToken(token) {
    try {
      return await App.findOne({ token });
    } catch (error) {
      throw new Error(`Error finding app by token: ${error.message}`);
    }
  },

  /**
   * Finds an app by its MongoDB ObjectId.
   * @param {string} appId - The ObjectId of the app.
   * @returns {Promise<Object|null>} - The app document or null if not found.
   */
  async findById(appId) {
    try {
      return await App.findById(appId);
    } catch (error) {
      throw new Error(`Error finding app by ID: ${error.message}`);
    }
  },
};

module.exports = AppRepository;
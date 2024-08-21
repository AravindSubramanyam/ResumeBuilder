// connect.js
require('dotenv').config(); // Load environment variables

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.MONGODB_URI; // Make sure your .env file has MONGODB_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  try {
    // Connect the client to the server
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  } finally {
    // Ensure the client will close when you finish/error
    await client.close();
  }
}

module.exports = connectDB; // Export the function

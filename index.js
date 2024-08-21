// index.js
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");


// Import the connectDB function
const connectDB = require('./pages/connect'); // Adjust the path if necessary

// Create an instance of Express
const app = express();

dotenv.config(); // Load environment variables

// Call the function to connect to MongoDB
connectDB();

const port = process.env.PORT || 3000;

// Define the schema for user registration
const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  number: String,
});

// Create a model based on the registration schema
const Registration = mongoose.model("Registration", registrationSchema);


mongoose.connect('mongodb+srv://Resumebuilder:Resumebuilder@myprojects.w56ys.mongodb.net/Myprojects', {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


// Configure Express to use bodyParser for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Middleware for serving static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Define routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/registerPage", (req, res) => {
  res.sendFile(__dirname + "/pages/index.html");
});

app.get("/loginPage", (req, res) => {
  res.sendFile(__dirname + "/pages/login.html");
});

app.post("/register", async (req, res) => {
  try {
    const { name, email, password, number } = req.body;

    const existingUser = await Registration.findOne({ email });

    if (!existingUser) {
      const registrationData = new Registration({
        name,
        email,
        password,
        number,
      });
      await registrationData.save();
      console.log("Registration successful");
      return res.redirect("/success");
    } else {
      console.log("User already exists");
      return res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/error");
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await Registration.findOne({ email, password });

    if (existingUser) {
      return res.redirect("/");
    } else {
      console.log("Invalid email or password");
      return res.redirect("/error");
    }
  } catch (error) {
    console.log(error);
    return res.redirect("/error");
  }
});

app.get("/success", (req, res) => {
  res.sendFile(__dirname + "/pages/success.html");
});

app.get("/resume", (req, res) => {
  res.sendFile(__dirname + "/resume.html");
});

app.get("/error", (req, res) => {
  res.sendFile(__dirname + "/pages/error.html");
});

app.get("/all-styles", (req, res) => {
  res.sendFile(__dirname + "/public/css/main.css");
});

app.listen(port, () => {
  console.log(`Server is running http://localhost:${port}`);
});

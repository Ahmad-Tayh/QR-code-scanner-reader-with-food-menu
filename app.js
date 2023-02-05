const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Restaurant = require('./models/restaurant');

mongoose.set('strictQuery', true);

const app = express();
app.use(bodyParser.json());

const dbURI = 'mongodb+srv://root:root@cluster0.3kt6ros.mongodb.net/resto?retryWrites=true&w=majority';
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => app.listen(3000))
  .catch(err => console.log(err));

mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", function() {
  console.log("Connected to MongoDB");
});

app.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.send(restaurants);
  } catch (error) {
    res.status(400).send(error);
  }
});

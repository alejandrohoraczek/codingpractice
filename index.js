const { response } = require("express");
const fetch = require("node-fetch");
const express = require("express");
const Datastore = require("nedb");
require("dotenv").config();

const app = express();
app.listen(3000, () => console.log("listening at 3000"));
app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

const database = new Datastore("database.db");
database.loadDatabase();

app.post("/api", (req, res) => {
  console.log("eh guacho me estan madnando algo");
  const timestamp = Date.now();
  req.body.timestamp = timestamp;
  res.json({
    status: "esito",
    timestamp: req.body.timestamp,
    latitude: req.body.lat,
    longitude: req.body.lon,
  });

  database.insert(req.body);
  console.log(req.body);
});

app.get("/api", (req, res) => {
  database.find({}, (error, data) => {
    if (error) response.end();
    res.json({ ...data });
  });
});

//Weather information

app.get("/weather/lat/:lat/lon/:lon", async (req, res) => {
  let lat = req.params.lat;
  let lon = req.params.lon;
  let location = await fetch(
    `http://api.positionstack.com/v1/reverse?access_key=${
      process.env.POS_API_KEY
    }&limit=1&query=${lat + "," + lon}`
  );
  let locationResults = await location.json();
  let city = locationResults.data[0].county;

  let weatherAPI = await fetch(
    `http://api.weatherstack.com/current?access_key=${process.env.WEA_API_KEY}&query=${city}`
  );
  let weatherResponse = await weatherAPI.json();
  res.json(weatherResponse);
});

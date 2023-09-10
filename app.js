// Import required Node.js modules
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

// Create an Express application
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  // Extract the user's input (city name) from the request body
  const query = req.body.cityName;

  // Construct the URL for the OpenWeatherMap API request
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=1dfa835ec3d8263d49061b2506eaa1ca&units=metric`;

  // Make an HTTPS GET request to the OpenWeatherMap API
  https.get(url, function (response) {
    console.log(response.statusCode);

    // Listen for data events from the API response
    response.on("data", function (data) {
      // Parse the JSON data received from the API
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp; // Extract temperature
      const weatherDescription = weatherData.weather[0].description; // Extract weather description
      const icon = weatherData.weather[0].icon; // Extract weather icon code
      const iconImg = `https://openweathermap.org/img/wn/${icon}@2x.png`; // Construct the weather icon URL

      // Send HTML response to the client
      res.write("<p>The weather is currently: " + weatherDescription + "</p>");
      res.write(
        "<h1>The Temperature in " + query + " is: " + temp + "C&deg;</h1>"
      );
      res.write(`<img src="${iconImg}">`);
      res.send(); // Send the response to the client's browser
    });
  });
});

app.listen(3000, function () {
  console.log("Server is running on port 3000.");
});

// // Define a route for handling POST requests to the root path "/"
// app.post("/", function (req, res) {
//   // Extract the user's input (city name) from the request body
//   const query = req.body.cityName;

//   // Define OpenWeatherMap API credentials and unit of measurement
//   const apiKey = "1dfa835ec3d8263d49061b2506eaa1ca";
//   const unit = "metric";

//   // Construct the URL for the OpenWeatherMap API request
//   const url =
//     "https://api.openweathermap.org/data/2.5/weather?q=" +
//     query +
//     "&appid=" +
//     apiKey +
//     "&units=" +
//     unit;

//   // Make an HTTPS GET request to the OpenWeatherMap API
//   https.get(url, function (response) {
//     console.log(response.statusCode); // Log the API response status code

//     // Listen for data events from the API response
//     response.on("data", (data) => {
//       // Parse the JSON data received from the API
//       const weatherData = JSON.parse(data);
//       const temp = weatherData.main.temp; // Extract temperature
//       const weatherDescription = weatherData.weather[0].description; // Extract weather description
//       const icon = weatherData.weather[0].icon; // Extract weather icon code

//       // Construct the URL for the weather icon image
//       const imgUrl = " https://openweathermap.org/img/wn/" + icon + "@2x.png";

//       // Build the HTML response to send to the user's browser
//       res.write(
//         "<p>The Weather is Currently <b>" + weatherDescription + "</b></p>"
//       );
//       res.write(
//         "<h1>The Current Temperature in " +
//           query +
//           " is " +
//           temp +
//           " C&deg; </h1>"
//       );
//       res.write("<img src=" + imgUrl + " >"); // Display the weather icon
//       res.send(); // Send the response to the user's browser
//     });
//   });
// });

// Start the server and listen on port 3000

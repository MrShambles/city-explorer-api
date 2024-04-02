'use strict';

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


const weatherData = require('./weather.json');


class Forecast {
  constructor(date, description) {
    this.date = date;
    this.description = description;
  }
}


app.get('/weather', (request, response) => {
  const { lat, lon, searchQuery } = request.query;


  const cityData = weatherData.find(city => 
    city.searchQuery.toLowerCase() === searchQuery.toLowerCase() &&
    city.lat === lat && 
    city.lon === lon);

  if (!cityData) {
    response.status(404).send('City not found or no weather data available for the specified location.');
    return;
  }


  const forecasts = cityData.forecast.map(forecastData => new Forecast(forecastData.date, forecastData.description));
  
  response.json(forecasts);
});

async function getLocation(request, response) {

  console.log(request.query);

  let city = request.query.city;

  let url = `https://us1.locationiq.com/v1/search?key=${process.env.LOCATION_API_KEY}&q=${city}&format=json`;
  const apiResponse = await axios.get(url);
  const data = apiResponse.data;
  response.json( data[0] );
}


function startServer() {
  let PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
}

startServer();


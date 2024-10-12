const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const GEOCODING_API_KEY = "0sl1WuorUUQqh9t0XG2w";
const DIRECTIONS_API_KEY = "YOUR_GOOGLE_DIRECTIONS_API_KEY";

app.post("/webhook", async (req, res) => {
  const city = req.body.queryResult.parameters.city; // Get city from user input

  try {
    // Make an API call to get to nearest restaurant in the city
    const response = await axios.get(
      `https://discover.search.hereapi.com/v1/discover?at=52.5228,13.4124&q=restaurants&apiKey={GEOCODING_API_KEY}`
    );

    const restaurants = response.data.results
      .map((place) => place.title)
      .slice(0, 5); // Limit to top 5 results

    // Format the response
    const reply = `Here are some restaurants in ${city}: ${restaurants.join(
      ", "
    )}`;

    return res.json({
      fulfillmentText: reply,
    });
  } catch (error) {
    console.error(error);
    return res.json({
      fulfillmentText:
        "Sorry, I couldn’t fetch restaurant data at this moment.",
    });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

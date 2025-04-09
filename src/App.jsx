import React, { useEffect, useState } from "react";
import Interface from "./components/Interface";
import Searchbar from "./components/Searchbar";
import LocationTime from "./components/LocationTime";
import Body from "./components/Body";
import FiveDay from "./components/FiveDay.jsx"; 
import getFormattedWeatherData from "./services/WeatherService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const App = () => {
  const [query, setQuery] = useState({ q: "bhubaneswar" });
  const [units, setUnits] = useState("metric");
  const [weather, setWeather] = useState(null);

  const getWeather = async () => {
    const cityName = query.q ? query.q : "current location";
    toast.info(`Fetching weather data for ${capitalizeFirstLetter(cityName)}`);

    try {
      const data = await getFormattedWeatherData({ ...query, units });
      toast.success(`Fetched weather data for ${data.name}, ${data.country}`);
      setWeather(data);
      console.log(data);
    } catch (err) {
      toast.error("Failed to fetch weather data");
      console.error(err);
    }
  };

  useEffect(() => {
    getWeather();
  }, [query, units]);

  return (
    <div
      className={`sm:flex-row gap-4 pb-6 shadow-lg rounded-2xl p-4 bg-white mx-auto max-w-screen-lg mt-4 py-5 px-32 bg-gradient-to-br shadow-gray-400 from-purple-900 to-black`}
    >
      <Interface setQuery={setQuery} />
      <Searchbar setQuery={setQuery} setUnits={setUnits} />

      {weather && (
        <>
          <LocationTime weather={weather} />
          <Body weather={weather} units={units} />
          <FiveDay title="3 hour step forecast" data={weather.hourly} />
          <FiveDay title="daily forecast" data={weather.daily} />
        </>
      )}

      <ToastContainer autoClose={2500} hideProgressBar={true} theme="colored" />
    </div>
  );
};

export default App;

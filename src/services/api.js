import axios from "axios";

const BASE_URL = "https://earthquake.usgs.gov/fdsnws/event/1/query";

export const fetchEarthquakesAPI = async (starttime, endtime, magnitude) => {
  const response = await axios.get(BASE_URL, {
    params: {
      format: "geojson",
      starttime,
      endtime,
      minmagnitude: magnitude,
    },
  });

  return response.data.features;
};

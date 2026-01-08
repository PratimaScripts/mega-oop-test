import axios from "axios";
import get from "lodash/get";

const SearchPlace = async (place) => {
  let placeResponse = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key=${process.env.REACT_APP_GOOGLE_MAPS_KEY}`
  );

  if (placeResponse.status === 200 && placeResponse.data?.results?.length) {
    placeResponse = placeResponse.data.results[0];
    return get(placeResponse, "geometry.location", {});
  }

  return false;
};

export default SearchPlace;

import axios from "axios";

const getLocationData = async () => {
  try {
    const { data } = await axios.get("https://api.db-ip.com/v2/free/self");
    return {
      location: data,
      hasLocation: true,
    };
  } catch (error) {
    return { hasLocation: false };
  }
};

export default getLocationData;

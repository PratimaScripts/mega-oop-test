import axios from "axios";
const findAddressFullApi = async addressId => {
  let addressResponse = await axios.get(
    `https://api.addressy.com/Capture/Interactive/Retrieve/v1.00/json3.ws?Key=${process.env.REACT_APP_LOQATE_API_KEY}&Id=${addressId}`,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return addressResponse.data;
};

export default findAddressFullApi;

import axios from "axios";

const AddressLookup = async () => {
  let res = await axios.get("https://ipapi.co/json/");
  return res.data;
};

export default AddressLookup;

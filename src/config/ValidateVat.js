import axios from "axios";

const verifyVat = async vatNumber => {
  let res = await axios.get(
    `http://apilayer.net/api/validate?access_key=${process.env.REACT_APP_VATLAYER_API_KEY}&vat_number=${vatNumber}&format=1`
  );

  return res;
};

export default verifyVat;

// import axios from "axios";

const validateEmail = async formData => {
  return true;
  // let data = {};
  // await axios
  //   .get(
  //     `https://api.addressy.com/EmailValidation/Interactive/Validate/v2.00/json3.ws?Key=${process.env.REACT_APP_LOQATE_API_KEY}&Email=${formData.email}&Timeout=5000`
  //   )
  //   .then(res => {
  //     data = res.data.Items[0];
  //   });

  // if (data.IsDisposableOrTemporary || data.ResponseCode === "Valid") {
  //   return true;
  // }

  // if (data.ResponseCode === "Invalid") {
  //   return false;
  // }
};

export default validateEmail;

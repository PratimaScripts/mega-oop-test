import axios from "axios";

const validateBank = async (sortCode, acNumber) => {
  let response = await axios.get(
    `https://api.addressy.com/BankAccountValidation/Batch/Validate/v1.00/json3ex.ws?Key=${process.env.REACT_APP_LOQATE_API_KEY}&AccountNumbers=${acNumber}&SortCodes=${sortCode}`
  );

  return response;
};

export default validateBank;

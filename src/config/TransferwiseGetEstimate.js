import axios from "axios";
import get from "lodash/get";

const GetEstimate = async data => {
  let res = await axios.get(
    `${process.env.REACT_APP_TRANSFERWISE_ENDPOINT}/v1/delivery-estimates/${get(
      data,
      "transferId"
    )}`,
    {
      headers: {
        Authorization: `Bearer` + process.env.REACT_APP_TRANSFERWISE_API_KEY
      }
    }
  );

  return res;
};

export default GetEstimate;

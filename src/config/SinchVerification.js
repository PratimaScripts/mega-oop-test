import axios from "axios";
import moment from "moment"
const VerificationRequest = async data => {
  let res = await axios.post(
    "https://verificationapi-v1.sinch.com/verification/v1/verifications",
    {
      identity: {
        type: "number",
        endpoint: data.number
      },
      custom: "Test",
      method: "sms",
      metadata: {
        os: "rest",
        platform: "N/A"
      }
    },
    {
      headers: {
        Authorization: `Application ${process.env.REACT_APP_SINCH_API_KEY}`,
        "X-Timestamp": moment().format(process.env.REACT_APP_DATE_FORMAT)
      }
    }
  );
  return res;
};

const VerifyOtp = async data => {
  let res = {};
  await axios
    .put(
      `https://verificationapi-v1.sinch.com/verification/v1/verifications/number/${data.number}`,
      {
        method: "sms",
        sms: { code: data.code }
      },
      {
        headers: {
          Authorization: `Application ${process.env.REACT_APP_SINCH_API_KEY}  `,
          "X-Timestamp": moment().format(process.env.REACT_APP_DATE_FORMAT)
        }
      }
    )
    .then(response => {
      res = response;
    })
    .catch(error => {
      res = error.response;
    });

  return res;
};

export default { VerificationRequest, VerifyOtp };

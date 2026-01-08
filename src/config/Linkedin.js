import axios from "axios";
const qs = require("querystring");

const config = {
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
};
const LinkedInLogin = async code => {
  let requestBody = {
    client_id: "78r4mrzvcc74ah",
    grant_type: "authorization_code",
    code,
    redirect_uri: "http://localhost:3000/linkedin",
    client_secret: "ZYrmOoUdEvCXCLrL"
  };

  let res = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    qs.stringify(requestBody),
    config
  );

  // console.log("LINKEDIN", res);

  let nextRes = await axios.get("https://api.linkedin.com/v2/me", {
    headers: {
      Authorization: `Bearer ${res.data.access_token}`
    }
  });

  return nextRes;
};

export default LinkedInLogin;

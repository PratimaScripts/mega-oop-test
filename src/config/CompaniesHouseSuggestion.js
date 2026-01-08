// This file is been not used anymore due to CORS error, it is been moved to backend.

import axios from "axios";

const getSuggestions = async (text) => {
  let response = await axios.get(
    `https://corsanywhere.herokuapp.com/https://api.companieshouse.gov.uk/search/companies?q=${text}`,
    {
      headers: {
        Authorization: `Basic ${process.env.REACT_APP_COMPANIES_HOUSE_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

export default getSuggestions;

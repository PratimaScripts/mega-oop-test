import axios from "axios";

const verifyCompany = async companyNumber => {
  let response = await axios.get(
    `https://api.companieshouse.gov.uk/company/${companyNumber}`,
    {
      headers: {
        Authorization: `Basic ${process.env.REACT_APP_COMPANIES_HOUSE_KEY}`
      }
    }
  );

  return response;
};

export default verifyCompany;

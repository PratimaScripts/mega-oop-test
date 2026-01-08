import axios from "axios";
const findAddressApi = async (address, container=false) => {
  let api = `https://api.addressy.com/Capture/Interactive/Find/v1.10/json3ex.ws?Key=${process.env.REACT_APP_LOQATE_API_KEY}&Countries=GB&Text=${address}&IsMiddleware=True&Limit=20&Language=`
  if(container) {
    api = `https://api.addressy.com/Capture/Interactive/Find/v1.10/json3ex.ws?Key=${process.env.REACT_APP_LOQATE_API_KEY}&Countries=GB&Container=${container}&IsMiddleware=True&Limit=20&Language=`
  }
  let addressResponse = await axios.get(
    api,
    {
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  return addressResponse.data;
};

export default findAddressApi;

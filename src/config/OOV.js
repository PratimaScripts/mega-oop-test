import axios from "axios";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

const ownershipVerfification = async (data, nameData) => {
  let urlAr = [
    "https://api.titleexpert.co.uk/api/rentoncloud/ownershipverify/2c78e9df8fb34638808d442d25457004",
    "https://api.titleexpert.co.uk/api/rentoncloud/ownershipverify/15c34400c91a427c98f527ef55e225bd",
    "https://api.titleexpert.co.uk/api/rentoncloud/ownershipverify/15c34400c91a427c98f527ef55e225bd",
    "https://api.titleexpert.co.uk/api/rentoncloud/ownershipverify/2c78e9df8fb34638808d442d25457004"
  ];

  let toVerifyProperties = [];
  let obj = [];

  let verifyProperties = data.map(async (property, i) => {
    let propertyAddress = get(property, "address");
    let addressObj = {
      BuildingName: get(propertyAddress, "BuildingName", "NO Name Specified"),
      BuildingNumber: get(propertyAddress, "BuildingNumber", "1"),
      Street: get(propertyAddress, "Street", "No Street Spcified"),
      City: get(propertyAddress, "City", "No City Spcified"),
      Postcode: get(propertyAddress, "PostalCode", "No Postal Code Spcified")
    };

    addressObj["BuildingName"] === "" && delete addressObj["BuildingName"];

    toVerifyProperties.push({
      propertyId: property._id,
      propertyUrl: urlAr[i]
    });

    // try {
    //   let ownerShipCheckStep1Response = await axios.post(
    //     "https://api.titleexpert.co.uk/api/rentoncloud/ownershipverify/address",
    //     {
    //       clientid: "rentoncloud",
    //       SearchAddress: {
    //         ...addressObj
    //       },
    //       Name: nameData
    //     },

    //     {
    //       headers: {
    //         Authorization: `Basic ${process.env.REACT_APP_OOV_TITLE_EXPERT_TOKEN}`
    //       }
    //     }
    //   );

    //   let urlToAccess = get(
    //     ownerShipCheckStep1Response,
    //     "data.ResponseCommon.ResponseUri"
    //   );

    //   toVerifyProperties.push({
    //     propertyId: property._id,
    //     propertyUrl: urlToAccess
    //   });
    // } catch (error) {
    //   toVerifyProperties.push({
    //     propertyId: property._id,
    //     propertyUrl: ""
    //   });
    // }

    // let urlToAccess = get(
    //   ownerShipCheckStep1Response,
    //   "data.ResponseCommon.ResponseUri"
    // );

    // toVerifyProperties.push({
    //   propertyId: property._id,
    //   propertyUrl: urlToAccess
    // });
  });

  await Promise.all(verifyProperties);

  let verifyMain = toVerifyProperties.map(async (property, j) => {
    if (property.propertyUrl !== "") {
      let ownerShipCheckStep2Response = await axios.get(property.propertyUrl, {
        headers: {
          Authorization: `Basic ${process.env.REACT_APP_OOV_TITLE_EXPERT_TOKEN}`
        }
      });

      if (!isEmpty(get(ownerShipCheckStep2Response, "data.Matches", []))) {
        property.isVerify = true;
      } else {
        property.isVerify = false;
      }

      obj.push({ propertyId: property.propertyId, status: property.isVerify });
    } else {
      obj.push({ propertyId: property.propertyId, status: false });
    }
  });

  await Promise.all(verifyMain);

  return obj;
};

export default ownershipVerfification;

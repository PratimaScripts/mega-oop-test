import React, { useState } from "react";
import ValueTrue from "./RenterAddressTrue";
// import LoqateAddress from "../../../../../../config/AddressAutoCompleteLoqate";
import LoqateAddressFull from "config/LoqateGetFullAddress";
// import SuggestionDropdown from "../../../CommonInfo/Downshift";
import AddressAutocomplete from "components/Common/AddressAutocomplete";

const ProfessionFormSection = (props) => {
  const [showCompany, setCompanyStatus] = useState(true);
  const [addressStr, setAddressStr] = useState("");

  const findAddress = async (address) => {
    let fullAddress = await LoqateAddressFull(address.Id);
    let completeAddress = fullAddress.Items[0];

    let obj = {
      addressLine1: completeAddress["Company"]
        ? completeAddress["Company"]
        : completeAddress["Line1"],
      addressLine2: completeAddress["Company"]
        ? `${completeAddress["Line1"]}, ${completeAddress["Line2"]}`
        : completeAddress["Line2"],
      city: completeAddress["City"],
      state: completeAddress["Province"],
      zip: completeAddress["PostalCode"],
      country: completeAddress["CountryName"],
    };

    let fullAddressMain = `${obj.addressLine1}, ${obj.addressLine2}, ${obj.city}, ${obj.state}`;
    setAddressStr(fullAddressMain);

    if (completeAddress) {
      setLoqateData({
        fullAddress: fullAddressMain,
      });
    }
    setLoqateData({
      fullAddress: fullAddressMain,
    });
  };

  const saveData = (data) => {
    data["isSameAddress"] = showCompany ? showCompany : true;
    // data["fullAddress"] = loqateData.fullAddress;
    props.saveLandlordAgentReference(data);
  };

  const [loqateData, setLoqateData] = useState({});

  return (
    <>
      <div className="landlordagent__tabs">
        <div className="form-group yes__no--toogle mb-3">
          <div className="btn-group">
            <label className="switch" for="current_add">
              <input
                onChange={(e) => setCompanyStatus(e.target.checked)}
                checked={showCompany}
                disabled={props.isPreviewMode}
                type="checkbox"
                id="current_add"
              />
              <span className="ml-2"></span>
              <div className="slider round inline-block"></div>
            </label>
            <label className="tab__deatils--label px-3 py-2">
              Is your past home or rented address is same as current Address ?
            </label>
          </div>
        </div>
        {!showCompany ? (
          <>
            {/* <SuggestionDropdown
              LoqateAddress={LoqateAddress}
              findAddress={findAddress}
              loqateData={loqateData}
              value={addressStr}
            /> */}
            <AddressAutocomplete
              findAddress={findAddress}
              value={addressStr}
              onChange={setAddressStr}
            />

            <input
              type="text"
              className="form-control mt-2"
              value={loqateData.fullAddress}
            />
          </>
        ) : (
          <></>
        )}

        <ValueTrue saveData={saveData} {...props} />
      </div>
    </>
  );
};

export default ProfessionFormSection;

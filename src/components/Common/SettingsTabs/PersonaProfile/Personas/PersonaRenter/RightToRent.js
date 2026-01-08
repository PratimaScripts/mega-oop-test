import React, { useState, useEffect } from "react";
import { Tooltip } from "antd";
import "../../style.scss";

let MainRtaData = [
  { text: "UK / EU / Swiss Passport", id: "swissPassport" },
  { text: "EEA / Swiss National ID", id: "swissNationalID" },
  {
    text: "Document certifying permanent residence of EEA / Swiss National",
    id: "documentCertifyingPermanentResidence",
  },
  {
    text: "EEA / Swiss family member Permanent Resident card",
    id: "permanentResidentCard",
  },
  {
    text: "Biometric Residence Permit with unlimited leave",
    id: "biometricResidencePermit",
  },
  {
    text: "Passport or Travel document endorsed with unlimited leave",
    id: "passportOrTravelDocument",
  },
  {
    text: "UK immigration status document endorsed with unlimited leave",
    id: "immigrationStatusDocument",
  },
  {
    text: "A certificate of naturalisation or registration as a British citizen",
    id: "registrationAsBritishCitizen",
  },
  {
    text: "A valid passport endorsed with a time-limited period",
    id: "passportEndorsed",
  },
  {
    text: "Biometric immigration document with permission to stay for time-limited period",
    id: "biometricImmigrationDocument",
  },
  { text: "Non-EEA national resident card", id: "nationalResidentCard" },
  {
    text: "UK Immigration status document with a time-limit endorsement from Home Office",
    id: "endorsementFromHomeOffice",
  },
];

const RightToRent = (props) => {
  let [rtaData, setRtaData] = useState(props.rightToRent);
  useEffect(() => {
    setRtaData(props.rightToRent);
  }, [props.rightToRent]);
  return (
    <>
      <div className="title">
        <h4>Do you have any of required documentation? </h4>
        <Tooltip
          color="white"
          overlayClassName="tooltip__color"
          title="For more information visit: https://www.gov.uk/landlord-immigration-check"
        >
          <img
            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
            alt="i"
            className="pull-right"
          />
        </Tooltip>
      </div>

      {MainRtaData.map((d, i) => {
        return (
          <div key={i} className="listing">
            <div className="custom-control custom-switch custom-control-inline">
              <input
                type="checkbox"
                checked={rtaData[d.id]}
                onChange={(event) => props.updateRTAData(event, d.id)}
                className="custom-control-input"
                id={`switch${i + 1}`}
              />
              <label className="custom-control-label" for={`switch${i + 1}`}>
                {" "}
                {d.text}
              </label>
            </div>
          </div>
        );
      })}
      <div className="row mt-3">
        <div className="col-lg-4">
          <div className="form-group">
            <button
              hidden={props.hideSaveButton}
              ref={props.otherInformationRef}
              type="submit"
              onClick={props.next}
              className="btn btn-primary btn-sm px-5"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RightToRent;

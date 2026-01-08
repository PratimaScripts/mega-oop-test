// import { Col } from "antd";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";
import BasicInfo from "./BasicInfo";
import ElectricityMeter from "./ElectricityMeter";
import Keys from "./Keys";
import MeterReading from "./MeterReading";
import OtherItem from "./OtherItem";
import SectionWrapper from "./SectionWrapper";
import "./styles.scss";
import WaterAndHomeHeating from "./WaterAndHomeHeating";

const GeneralInfo = ({ onSave, initialState }) => {
  const history = useHistory();

  const generalInfoRef = useRef({
    meterReading: [],
    electricityMeterReading: [],
    heatingSystem: [],
    waterAndHomeHeating: [],
    keys: [],
    otherItems: [],
  });

  useEffect(() => {
    generalInfoRef.current = {
      type: initialState.type,
      id: initialState.id,
      tenancy: initialState.tenancy,
      meterReading: initialState.meterReading,
      electricityMeterReading: initialState.electricityMeterReading,
      heatingSystem: initialState.heatingSystem,
      waterAndHomeHeating: initialState.waterAndHomeHeating,
      keys: initialState.keys,
      otherItems: initialState.otherItems,
    };
  }, [initialState]);

  const handleUpdateGeneralInfoRef = (key, value) => {
    const newRef = { ...generalInfoRef.current };
    newRef[key] = value;
    generalInfoRef.current = newRef;
    // console.log(generalInfoRef.current);
  };

  const handleOnSave = () => {
    onSave(generalInfoRef.current);
  };

  return (
    <div className="general-info__container bg-white p-3">
      <BasicInfo
        initialState={initialState}
        updateRef={handleUpdateGeneralInfoRef}
      />
      <SectionWrapper title="Meter Readings (water, gas, etc.)">
        <MeterReading
          objKey="meterReading"
          updateRef={handleUpdateGeneralInfoRef}
          initialState={initialState.meterReading}
        />
      </SectionWrapper>

      <SectionWrapper title="Electricity Meter Reading">
        <ElectricityMeter
          objKey="electricityMeterReading"
          updateRef={handleUpdateGeneralInfoRef}
          initialState={initialState.electricityMeterReading}
        />
      </SectionWrapper>

      <SectionWrapper title="Heating system">
        <MeterReading
          objKey="heatingSystem"
          updateRef={handleUpdateGeneralInfoRef}
          initialState={initialState.heatingSystem}
        />
      </SectionWrapper>

      <SectionWrapper title="Water And Home Heating">
        <WaterAndHomeHeating
          objKey="waterAndHomeHeating"
          updateRef={handleUpdateGeneralInfoRef}
          initialState={initialState.waterAndHomeHeating}
        />
      </SectionWrapper>

      <SectionWrapper title="Keys">
        <Keys
          objKey="keys"
          updateRef={handleUpdateGeneralInfoRef}
          initialState={initialState.keys}
        />
      </SectionWrapper>

      <SectionWrapper title="Other Items">
        <OtherItem
          objKey="otherItems"
          updateRef={handleUpdateGeneralInfoRef}
          initialState={initialState.otherItems}
        />
      </SectionWrapper>

      <div className="save-section">
        <button className="btn btn-primary btn-sm px-4" onClick={handleOnSave}>
          Save
        </button>
        <button
          className="btn btn-danger btn-sm px-4"
          onClick={() => history.goBack()}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default GeneralInfo;

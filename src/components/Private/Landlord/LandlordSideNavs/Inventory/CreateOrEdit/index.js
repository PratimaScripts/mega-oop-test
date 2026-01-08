import { Spin } from "antd";
import showNotification from "config/Notification";
import {
  createInventory,
  updateInventory,
  getInventoryById,
} from "config/queries/inventory";
import React, { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "react-apollo";
import { useLocation } from "react-router";
import { TabList, TabPanel, Tabs, Tab } from "react-tabs";
import GeneralInfo from "./GeneralInfo";
import Notes from "./Notes";
import {
  electricityMeter,
  heatingMeter,
  key,
  meterReading,
  newRoom,
  otherItem,
} from "./object-types";
import Preview from "./Preview";
import Room from "./Room";
import { inventoryValidation } from "../validators";
import "./styles.scss";

const CreateOrEdit = () => {
  const location = useLocation();

  const [getInventoryByIdQuery, { loading: getLoading }] = useLazyQuery(
    getInventoryById,
    {
      onCompleted: (data) => {
        // console.log(data);
        if (data.getInventoryById) {
          const inventory = data.getInventoryById;
          setMongoId(inventory._id);
          setRooms(inventory.rooms);
          setSignatures(inventory.signatures);
          setNotes(inventory.notes);

          setGeneralInfo({
            agreementData: { ...inventory?.agreementData },
            createdAt: inventory?.createdAt,
            type: inventory.inventoryType,
            id: inventory.inventoryId,
            tenancy: inventory.tenancy,
            meterReading: inventory.meterReading,
            electricityMeterReading: inventory.electricityMeterReading,
            heatingSystem: inventory.heatingSystem,
            waterAndHomeHeating: inventory.waterAndHomeHeating,
            keys: inventory.keys,
            otherItems: inventory.otherItems,
          });
        }
      },
    }
  );

  const [
    executeCreateInventoryMutation,
    { loading: createLoading, error: createError },
  ] = useMutation(createInventory, {
    onCompleted: (data) => {
      if (data?.createInventory?._id) {
        setMongoId(data?.createInventory?._id);
        setGeneralInfo((prevState) =>
          data?.createInventory
            ? { ...prevState, ...data?.createInventory }
            : { ...prevState }
        );
        setSignatures(
          data.createInventory?.signatures
            ? data.createInventory.signatures
            : []
        );
        showNotification("success", "Inventory info saved successfully!");
      } else {
        setMongoId(null);
        showNotification("info", "Inventory info not saved, please try again!");
      }
    },
  });

  const [
    executeUpdateInventoryMutation,
    { loading: editLoading, error: editError },
  ] = useMutation(updateInventory, {
    onCompleted: (data) => {
      if (data?.updateInventory?._id) {
        setMongoId(data?.updateInventory?._id);
        showNotification("success", "Inventory info saved successfully!");
      }
    },
  });

  const loading = createLoading || editLoading || getLoading;

  useEffect(() => {
    editError &&
      editError.graphQLErrors &&
      editError.graphQLErrors.map((error) =>
        showNotification("error", "An error occurred!", error.message)
      );
  }, [editError]);

  useEffect(() => {
    createError &&
      createError.graphQLErrors &&
      createError.graphQLErrors.map((error) =>
        showNotification("error", "An error occurred!", error.message)
      );
  }, [createError]);

  useEffect(() => {
    if (location.pathname === "/landlord/inventory/edit") {
      // fetch inventory
      const id = location?.state?.id;
      getInventoryByIdQuery({ variables: { inventoryId: id } });
      // set/update "generalInfo" State and Ref
      // set/update "rooms" State and Ref
    }
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const [mongoId, setMongoId] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [rooms, setRooms] = useState([newRoom]);
  const [generalInfo, setGeneralInfo] = useState({
    agreementData: {},
    createdAt: "",
    type: "checkIn",
    id: "",
    tenancy: "",
    meterReading: [meterReading],
    electricityMeterReading: [electricityMeter],
    heatingSystem: [meterReading],
    waterAndHomeHeating: [heatingMeter],
    keys: [key],
    otherItems: [otherItem],
  });
  const [notes, setNotes] = useState("");
  const [signatures, setSignatures] = useState([]);

  const handleAddNewTab = () => {
    setRooms([...rooms, newRoom]);
  };

  const handleRemoveTab = (index) => {
    if (index >= 0) {
      const newTabs = [...rooms];
      newTabs.splice(index, 1);
      setRooms(newTabs);
    }
  };

  const handleChangeTabName = (index, text) => {
    if (index > -1 && index < rooms.length) {
      const newTabs = [...rooms];
      newTabs[index] = { ...newTabs[index], name: text };
      setRooms(newTabs);
    }
  };

  const handleDuplicateTab = (index) => {
    if (index > -1 && index < rooms.length) {
      const newTabs = [...rooms];
      newTabs.splice(index + 1, 0, { ...newRoom, name: newTabs[index].name });
      setRooms(newTabs);
    }
  };

  const handleUpdateGeneralInfoState = (newGeneralInfoData) => {
    setGeneralInfo(newGeneralInfoData);
    handleOnSubmit(newGeneralInfoData, rooms, notes);
  };

  const handleUpdateRoomsState = (index, room) => {
    const newArr = [...rooms];
    newArr[index] = room;
    setRooms(newArr);
    handleOnSubmit(generalInfo, newArr, notes);
  };

  const handleUpdateNotesRef = (value) => {
    setNotes(value);
    handleOnSubmit(generalInfo, rooms, value);
  };

  const handleOnSubmit = async (generalInfo, rooms, notes) => {
    try {
      const variables = {
        /** Note: once edited it will be Draft status */
        status: 'Draft',
        inventoryId: generalInfo.id,
        inventoryType: generalInfo.type,
        tenancy: generalInfo.tenancy,

        meterReading: generalInfo.meterReading,
        electricityMeterReading: generalInfo.electricityMeterReading,
        heatingSystem: generalInfo.heatingSystem,
        waterAndHomeHeating: generalInfo.waterAndHomeHeating,
        keys: generalInfo.keys,
        otherItems: generalInfo.otherItems,

        rooms,
        notes,
      };

      await inventoryValidation.validate(variables);

      // return console.log(variables);

      if (mongoId) {
        variables.mongoId = mongoId;
        return executeUpdateInventoryMutation({ variables });
      } else {
        return executeCreateInventoryMutation({ variables });
      }
    } catch (error) {
      showNotification("error", "Validation error!", error.message);
    }
  };

  return (
    <div className="container-fluid">
      <Spin tip="Saving..." spinning={loading}>
        <div className="property__wrapper rooms__wrapper addTask--wrapper">
          {/* <p className="property-selected__title">{"title"}</p> */}

          <Tabs defaultIndex={activeTab}>
            <TabList>
              <Tab onClick={() => setActiveTab(0)}>General Info</Tab>
              {rooms.map((room, index) => (
                <Tab
                  key={`room-tab-${index}`}
                  onClick={() => setActiveTab(index + 1)}
                >
                  {room.name}
                </Tab>
              ))}
              {["+ New Room", "Notes", "Preview"].map((tab, index) => (
                <Tab
                  key={tab}
                  onClick={() =>
                    index === 0
                      ? handleAddNewTab()
                      : setActiveTab(rooms.length + index + 1)
                  }
                >
                  {tab}
                </Tab>
              ))}
            </TabList>

            <TabPanel>
              <GeneralInfo
                initialState={generalInfo}
                onSave={handleUpdateGeneralInfoState}
              />
            </TabPanel>

            {rooms.map((room, index) => (
              <TabPanel key={`room-${index}`}>
                <Room
                  tabIndex={index}
                  tabName={room.name}
                  commentsProps={room.comments}
                  initialState={room}
                  changeTabName={handleChangeTabName}
                  deleteTab={handleRemoveTab}
                  duplicateTab={handleDuplicateTab}
                  onSave={handleUpdateRoomsState}
                />
              </TabPanel>
            ))}

            <TabPanel></TabPanel>
            <TabPanel>
              <Notes initialState={notes} onBlur={handleUpdateNotesRef} />
            </TabPanel>
            <TabPanel>
              <Preview
                generalInfo={generalInfo}
                rooms={rooms}
                notes={notes}
                signatures={signatures}
              />
            </TabPanel>
          </Tabs>
        </div>
      </Spin>
    </div>
  );
};

export default CreateOrEdit;

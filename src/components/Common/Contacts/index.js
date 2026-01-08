/* eslint-disable array-callback-return */
import React, { useState, useContext, useRef, useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import {
  Button,
  Tooltip,
  Result,
  List,
  Checkbox,
  Dropdown,
  Menu,
  Input,
  Popover,
  Spin,
} from "antd";
import { InterfaceContext } from "store/contexts/InterfaceContext";
import ListContactCard from "./ListContactCard";
import GridContactCard from "./GridContactCard";
import contactsQuery from "config/queries/contacts";
import { UserDataContext } from "store/contexts/UserContext";
import { useLazyQuery, useMutation, useQuery } from "react-apollo";
import { gql } from "apollo-boost";
import cookie from "react-cookies";

import "./styles.scss";
import "./listContactStyle.scss";

import AddContact from "./AddContact";
import nProgress from "nprogress";
import { useMemo } from "react";
import { useCallback } from "react";
import showNotification from "config/Notification";
import axios from "axios";
import { SearchOutlined } from "@ant-design/icons";
import ViewProfileDrawer from "../ViewProfile/ViewProfileDrawer";

const ARCHIVE_CONTACTS = gql`
  mutation archiveContacts($contactIds: [String!], $archived: Boolean!) {
    archiveContacts(contactIds: $contactIds, archived: $archived) {
      success
      message
    }
  }
`;

const Contacts = (props) => {
  const fromDashboard = props.location.fromDashboard;
  const [isFromDashBoard, setIsFromDashboard] = useState(false);
  const [contacts, setContacts] = useState([]);
  const allContacts = useRef([]);
  const [contactCardType, setContactCardType] = useState("list");
  const [numCards, setNumCards] = useState(4);
  const [archiveContactList, setArchiveContactList] = useState({});
  const [markAllContacts, setMarkAllContacts] = useState(false);

  const [allContractCount, setAllContractCount] = useState(0);
  const [ownerContractCount, setOwnerContractCount] = useState(0);
  const [renterContractCount, setRenterContractCount] = useState(0);
  const [serviceProContractCount, setServiceProContractCount] = useState(0);

  const [viewProfileDrawer, setViewProfileDrawer] = useState({
    userParam: "",
    role: "",
  });

  const fileInputRef = useRef(null);
  const [openFilterMenu, setOpenFilter] = useState(false);
  const [importingContacts, setImportingContacts] = useState(false);

  const [openSearchPopOver, setOpenSearchPopOver] = useState(false);

  const initialSearchKeys = useMemo(() => ({ email: "" }), []);
  const [searchKeys, setSearchKeys] = useState(initialSearchKeys);

  const { state: interfaceState, dispatch: interfaceDispatch } =
    useContext(InterfaceContext);
  const { state: userDataState } = useContext(UserDataContext);
  const { userData } = userDataState;

  if (fromDashboard !== undefined && fromDashboard && !isFromDashBoard) {
    setIsFromDashboard(true);
    interfaceDispatch({ type: "OPEN_ADD_CONTACT_MODAL" });
  }

  const { openAddContactModal, windowWidth } = interfaceState;

  const initialFilterObject = useMemo(
    () => ({
      archived: false,
      receiverRole: [],
    }),
    []
  );
  const [filterObject, setFilterObject] = useState(initialFilterObject);

  const mapContactList = useCallback((getContactList) => {
    if (getContactList.success) {
      const data = getContactList.data;
      setContacts(data);
      setAllContractCount(data.length);
      setOwnerContractCount(
        data.filter((contact) => contact.role === "landlord").length
      );
      setRenterContractCount(
        data.filter((contact) => contact.role === "renter").length
      );
      setServiceProContractCount(
        data.filter((contact) => contact.role === "servicepro").length
      );
      allContacts.current = data;
      // console.log(getContactList);
    }
    nProgress.done();
  }, []);

  const { loading: fetchingContacts } = useQuery(contactsQuery.getContactList, {
    onCompleted: ({ getContactList }) => mapContactList(getContactList),
    onError: (error) => {
      nProgress.done();
    },
  });

  const [filterContactList, { loading: fetchingFilteredContacts }] =
    useLazyQuery(contactsQuery.getContactList, {
      onCompleted: ({ getContactList }) => {
        if (getContactList.success) {
          mapContactList(getContactList);
        } else {
          showNotification(
            "error",
            getContactList.message || "Something went wrong!"
          );
        }
      },
      onError: (error) => {
        nProgress.done();
      },
    });

  const applyFilter = (updatedFilterObject) => {
    filterContactList({
      variables: { filterString: JSON.stringify(updatedFilterObject) },
    });
  };

  useEffect(() => {
    nProgress.start();
    if (windowWidth <= 1400 && windowWidth >= 1100) {
      setNumCards(3);
    } else if (windowWidth < 1100 && windowWidth >= 580) {
      setNumCards(2);
    } else if (windowWidth < 580) {
      setNumCards(1);
      setContactCardType("grid");
    }
    nProgress.done();
  }, [windowWidth]);

  const filterContacts = (role) => {
    role
      ? setContacts(
          allContacts.current.filter((contact) => contact.role === role)
        )
      : setContacts(allContacts.current);
  };

  const getContactList = () => (
    <List
      itemLayout="horizontal"
      grid={{ gutter: 16, column: contactCardType === "grid" ? numCards : 1 }}
      style={{ marginTop: "10px" }}
      dataSource={contacts}
      renderItem={(item) => (
        <List.Item key={item.contactId}>
          <GridContactCard
            item={item}
            setContacts={setContacts}
            currentRole={userData.role}
          />
        </List.Item>
      )}
    />
  );

  const archiveContact = (id) => {
    let newArchiveContactList = { ...archiveContactList };

    if (id === "all") {
      let allIds = contacts.map((contact) => contact.contactId);
      allIds.map((id) => {
        newArchiveContactList[id] = !markAllContacts;
      });
      setMarkAllContacts(!markAllContacts);
    } else {
      if (newArchiveContactList[id]) {
        delete newArchiveContactList[id];
      } else {
        newArchiveContactList[id] = true;
      }
    }

    setArchiveContactList(newArchiveContactList);
  };

  const [archive] = useMutation(ARCHIVE_CONTACTS, {
    onCompleted: ({ archiveContacts }) => {
      if (archiveContacts.success) {
        showNotification("success", archiveContacts.message);
        setContacts((prevState) =>
          prevState.filter((contact) => !archiveContactList[contact.contactId])
        );
        setArchiveContactList({});
      }
    },
  });

  const onArchive = async () => {
    if (Object.keys(archiveContactList).length) {
      archive({
        variables: {
          contactIds: Object.keys(archiveContactList),
          archived: filterObject.archived ? false : true,
        },
      });
    }
  };

  const onFilterChange = (key, value) => {
    let filter = { ...filterObject };
    filter[key] = value;
    applyFilter(filter);
    setFilterObject(filter);
    if (key === "archived") {
      setArchiveContactList({});
    }
  };

  const onRoleFilterChange = (value) => {
    let roles = [...filterObject.receiverRole];
    if (roles.includes(value)) {
      roles = roles.filter((role) => role !== value);
    } else {
      roles.push(value);
    }
    onFilterChange("receiverRole", roles);
  };

  const uploadCSV = (file) => {
    fileInputRef.current.value = null;
    setImportingContacts(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("role", userData.role);
    formData.append("userId", userData._id);
    formData.append("uploadType", "importContactsFromCSV");

    const config = {
      headers: {
        "content-type":
          "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
        authorization: cookie.load(process.env.REACT_APP_AUTH_TOKEN),
      },
    };

    axios
      .post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        formData,
        config
      )
      .then((res) => {
        if (res.status === 200 && res.data.success) {
          applyFilter({ ...filterObject });
          showNotification("success", res.data.message);
          if (res.data?.data?.duplicateEmailList?.length) {
            setTimeout(() => {
              showNotification(
                "error",
                `User(s) with email ${res.data.data.duplicateEmailList.join(
                  ", "
                )} already exists.`
              );
            }, 1500);
          }
        } else {
          showNotification("error", res.data.message);
        }
        fileInputRef.current.value = null;
      })
      .catch((error) => {
        console.log(error);
        showNotification("error", "Something went wrong");
      })
      .finally(() => setImportingContacts(false));
  };

  const MenuList = (
    <Menu>
      <Menu.Item>
        <Checkbox
          name="archived"
          value={filterObject.archived}
          onChange={({ target: { name } }) =>
            onFilterChange(name, !filterObject.archived)
          }
        >
          Archived
        </Checkbox>
      </Menu.Item>
      <Menu.ItemGroup title="Role">
        <Menu.Item>
          <Checkbox
            name="landlord"
            checked={filterObject.receiverRole.includes("landlord")}
            onChange={({ target: { name } }) => onRoleFilterChange(name)}
          >
            Landlord
          </Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            name="renter"
            checked={filterObject.receiverRole.includes("renter")}
            onChange={({ target: { name } }) => onRoleFilterChange(name)}
          >
            Renter
          </Checkbox>
        </Menu.Item>
        <Menu.Item>
          <Checkbox
            name="servicepro"
            checked={filterObject.receiverRole.includes("servicepro")}
            onChange={({ target: { name } }) => onRoleFilterChange(name)}
          >
            ServicePro
          </Checkbox>
        </Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  const handleSearchKeyChange = (name, value) =>
    setSearchKeys((prevState) => ({ ...prevState, [name]: value }));

  const searchPopOverButtonOnClick = (param) => {
    if (param === "search") {
      setContacts([
        ...allContacts.current.filter((contact) => {
          let search = true;
          Object.keys(searchKeys).map((searchKey) => {
            search = Boolean(
              search && contact[searchKey].match(searchKeys[searchKey])
            );
          });
          return search;
        }),
      ]);
    } else if (param === "reset") {
      setContacts([...allContacts.current]);
      setSearchKeys(initialSearchKeys);
      setOpenSearchPopOver(false);
    }
  };

  const searchComponent = (param) => (
    <Popover
      key={param}
      visible={openSearchPopOver}
      onVisibleChange={(value) => setOpenSearchPopOver(value)}
      placement="bottom"
      content={
        <div>
          <Input
            name={param}
            value={searchKeys[param]}
            onChange={({ target: { name, value } }) =>
              handleSearchKeyChange(name, value)
            }
            placeholder={`Search by ${param}`}
            style={{
              width: 188,
              marginBottom: 8,
              display: "block",
            }}
          />
          <div className="d-flex justify-content-between">
            <Button
              type="primary"
              size="small"
              style={{ width: 90, marginRight: 8 }}
              className="d-flex align-items-center"
              onClick={() => searchPopOverButtonOnClick("search")}
            >
              <SearchOutlined />
              Search
            </Button>
            <Button
              size="small"
              style={{ width: 90 }}
              onClick={() => searchPopOverButtonOnClick("reset")}
            >
              Reset
            </Button>
          </div>
        </div>
      }
      trigger="click"
    >
      <SearchOutlined
        onClick={() => setOpenSearchPopOver((prevState) => !prevState)}
      />
    </Popover>
  );

  return (
    <>
      <div className="accounting-rental_invoice_transaction transaction__wrapper ">
        <div className="mx-3">
          <div className="row">
            <div className="main_wrap w-100">
              <div className="import__wrapper">
                <ul>
                  <li>
                    <div className="tabs__wrap">
                      <Tabs>
                        <TabList>
                          <Tab onClick={() => filterContacts()}>
                            All ({allContractCount})
                          </Tab>
                          <Tab onClick={() => filterContacts("landlord")}>
                            Owner ({ownerContractCount})
                          </Tab>
                          <Tab onClick={() => filterContacts("renter")}>
                            Renter ({renterContractCount})
                          </Tab>
                          <Tab onClick={() => filterContacts("servicepro")}>
                            ServicePro ({serviceProContractCount})
                          </Tab>
                        </TabList>
                        <TabPanel></TabPanel>
                        <TabPanel></TabPanel>
                        <TabPanel></TabPanel>
                        <TabPanel></TabPanel>
                      </Tabs>
                    </div>
                  </li>
                  <li>
                    <div className="btns__wrapper">
                      <Tooltip
                        title={
                          filterObject.archived
                            ? "Unarchive Contact"
                            : "Archive Contact"
                        }
                      >
                        <Button
                          onClick={onArchive}
                          className="btn"
                          size="large"
                          style={{
                            background: "#ffff",
                            borderRadius: "0.25em",
                          }}
                          icon={<i className="mdi mdi-archive"></i>}
                        />
                      </Tooltip>
                      <Tooltip title="Filter Contacts">
                        <Dropdown
                          visible={openFilterMenu}
                          onVisibleChange={(event) => setOpenFilter(event)}
                          overlay={MenuList}
                        >
                          <Button
                            className="btn"
                            size="large"
                            style={{
                              background: "#ffff",
                              borderRadius: "0.25em",
                            }}
                            onClick={() => setOpenFilter(false)}
                            icon={<i className="mdi mdi-filter"></i>}
                          />
                        </Dropdown>
                      </Tooltip>
                      <Tooltip title="Import Contacts">
                        <Button
                          className="btn"
                          size="large"
                          style={{
                            background: "#ffff",
                            borderRadius: "0.25em",
                          }}
                          icon={<i className="mdi mdi-import"></i>}
                          disabled={importingContacts}
                          onClick={() => fileInputRef.current.click()}
                        />
                        <input
                          type="file"
                          accept=".csv"
                          style={{ display: "none" }}
                          ref={fileInputRef}
                          onChange={({
                            target: {
                              files: [file],
                              validity,
                            },
                          }) => {
                            if (validity.valid) {
                              uploadCSV(file);
                            }
                          }}
                        />
                      </Tooltip>

                      <button
                        onClick={() => setContactCardType("list")}
                        className={`btn ${
                          contactCardType !== "grid"
                            ? "list-type-active"
                            : "btn-list"
                        }`}
                      >
                        <i className="mdi mdi-format-list-bulleted-square"></i>{" "}
                        List
                      </button>
                      <button
                        onClick={() => setContactCardType("grid")}
                        className={`btn ${
                          contactCardType === "grid"
                            ? "list-type-active"
                            : "btn-grid"
                        }`}
                      >
                        <i className="mdi mdi-grid"></i> Grid
                      </button>
                      <button
                        onClick={() =>
                          interfaceDispatch({ type: "OPEN_ADD_CONTACT_MODAL" })
                        }
                        className="btn btn_new_contact"
                      >
                        {" "}
                        + New Contact
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      {fetchingContacts ? (
        <div className="my-5 d-flex justify-content-center">
          <Spin size="large" />
        </div>
      ) : contacts.length === 0 ? (
        <Result
          status="404"
          title="No contacts found right now"
          subTitle=""
          extra={
            <Button
              className="btn-new"
              type="primary"
              onClick={() =>
                interfaceDispatch({ type: "OPEN_ADD_CONTACT_MODAL" })
              }
            >
              {" "}
              + New Contact
            </Button>
          }
        />
      ) : contactCardType !== "grid" ? (
        <div className="table-responsive">
          <table className="table table-borderless">
            <thead className="thead-dark">
              <tr>
                <th>
                  <Checkbox
                    checked={markAllContacts}
                    style={{ marginLeft: "4px" }}
                    onChange={() => archiveContact("all")}
                  />
                </th>
                <th>Name</th>
                <th>
                  <div className="d-flex justify-content-between align-items-center">
                    Email {searchComponent("email")}
                  </div>
                </th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="position-relative">
              {fetchingFilteredContacts ? (
                <div className="position-absolute w-100 d-flex justify-content-center">
                  <Spin />
                </div>
              ) : (
                contacts.map((contact) => (
                  <ListContactCard
                    item={contact}
                    setContacts={setContacts}
                    currentRole={userData.role}
                    key={contact.contactId}
                    isArchived={archiveContactList[contact.contactId]}
                    archiveContact={archiveContact}
                    setViewProfileDrawer={setViewProfileDrawer}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        getContactList()
      )}
      {openAddContactModal && (
        <AddContact setContacts={(val) => setContacts(val)} />
      )}

      <ViewProfileDrawer
        visible={viewProfileDrawer}
        onClose={() => setViewProfileDrawer({ userParam: "", role: "" })}
      />
    </>
  );
};

export default Contacts;

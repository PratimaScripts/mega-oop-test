import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  useContext,
} from "react";
import { withRouter, useLocation } from "react-router-dom";
// import { Formik, Form, Field } from "formik";
import isEmpty from "lodash/isEmpty";
import { Tooltip } from "antd";
import get from "lodash/get";
import find from "lodash/find";
import { Progress, message, Result, Modal, Button, Select, Spin } from "antd";
import axios from "axios";
import filter from "lodash/filter";
// import Slider from "react-slick";
import {
  useQuery,
  useMutation,
  // useLazyQuery
} from "@apollo/react-hooks";
import { useDropzone } from "react-dropzone";
import useForceUpdate from "use-force-update";
import cookie from "react-cookies";
import { Controller, useForm } from "react-hook-form";

import confirmModal from "config/ConfirmModal";
import PropertyQuery from "config/queries/property";
// import SuggestionDropdown from "../SettingsTabs/CommonInfo/Downshift";
import LoqateAddressFull from "config/LoqateGetFullAddress";
import AddressAutocomplete from "../AddressAutocomplete";
import "../SettingsTabs/CommonInfo/stylesConnect.scss";
import "./style.scss";
import showNotification from "config/Notification";
import { UserDataContext } from "store/contexts/UserContext";

function useLocationQuery() {
  return new URLSearchParams(useLocation().search);
}

const AddProperty = (props) => {
  let query = useLocationQuery();
  const { state } = useContext(UserDataContext);
  const { userData } = state;

  const { Option } = Select;
  const [addressStr, setAddressStr] = useState(undefined);
  const [shouldAddListing, setListingStatus] = useState(false);
  const [status, setStatus] = useState("success");
  const [loading, setLoading] = useState(false);
  const forceUpdate = useForceUpdate();
  const properties = useRef([]);
  // const propertiesList = useRef([]);
  const { address, ...rest } = get(props, "location.state", {});
  const defaultValues = {
    ...address,
    ...rest,
    privateTitle: rest.privateTitle ? rest.privateTitle : rest.title,
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const allProperties = useRef([]);
  const uniqEightRandomNum = useRef(
    Math.floor(Math.random() * 90000000) + 10000000
  );
  const [title, setTitle] = useState("");

  useQuery(PropertyQuery.fetchProperty, {
    onCompleted: (pro) => {
      properties.current = get(pro, "fetchProperty.data", []);
      // console.log("Properties", properties.current)
    },
  });

  const [propertyExist] = useMutation(PropertyQuery.checkPropertyExist);

  const MatchAddress = async (addressObj) => {
    const { data } = await propertyExist({
      variables: { address: addressObj.fullAddress },
    });

    if (data.checkPropertyExist) {
      // debugger;
      confirmModal({
        message: [
          <p>
            You have property titled {addressObj.fullAddress} with same address.
          </p>,
          <p>
            <strong>Do you want to duplicate property?</strong>
          </p>,
        ],
        okText: "Yes, Duplicate!",
        onOKFunction: () => setAddressFields(addressObj),
      });
      return true;
    }
    return false;
  };

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm({ defaultValues });

  const performCreatePropertyPostAction = (propertyData) => {
    if (propertyData.success) {
      message.success("Property Added!!");
      // props.contextData.endLoading();

      allProperties.current = get(propertyData, "data", []);

      if (props.isDrawer) {
        let selectedProp = filter(allProperties.current, { ...data });
        props.setData(selectedProp[0]);
        props.setProperties(allProperties.current);
        props.toggleAddPropertyDrawer(false);
      }

      if (!props.isDrawer) {
        if (shouldAddListing) {
          onAddListing();
        } else {
          setStatus("success");
          setModalVisible(true);
        }
      }
    } else {
      setStatus("error");
      setModalVisible(true);
      showNotification(
        "error",
        "Not able to process your request",
        get(propertyData, "message", "")
      );

      // message.error(get(createProperty, "message"));
    }
    setLoading(false);
  };

  const [createPropertyByLandlordMutation] = useMutation(
    PropertyQuery.createProperty,
    {
      onCompleted: ({ createProperty }) => {
        performCreatePropertyPostAction(createProperty);
      },
      onError: ({ graphQLErrors, networkError }) => {
        setLoading(false);
        showNotification(
          "error",
          "Not able to process your request",
          "Try Again"
        );
        // NProgress.done();
      },
    }
  );

  const [createPropertyWithLandlordAndRenter] = useMutation(
    PropertyQuery.createPropertyWithLandlordAndRenter,
    {
      onCompleted: ({ createPropertyWithLandlordAndRenter }) => {
        performCreatePropertyPostAction(createPropertyWithLandlordAndRenter);
      },
      onError: ({ graphQLErrors, networkError }) => {
        setLoading(false);
        showNotification(
          "error",
          "Not able to process your request",
          "Try Again"
        );
        // NProgress.done();
      },
    }
  );

  const [updateProperty] = useMutation(PropertyQuery.updateProperty, {
    onCompleted: async (propRes) => {
      allProperties.current = get(propRes, "updateProperty.data", []);
      let selectedProperty = await filter(allProperties.current, {
        propertyId: get(initialDataProperty, "propertyId"),
      });
      setLoading(false);

      if (get(propRes, "updateProperty.success")) {
        if (shouldAddListing) {
          props.history.push(`listing/edit`, {
            selectedProperty: get(selectedProperty, "[0]"),
            allProperties: allProperties.current,
          });
        } else {
          setStatus("success");
          setModalVisible(true);
        }
      } else {
        setStatus("error");
        setModalVisible(true);
      }
    },
    onError: ({ graphQLErrors, networkError }) => {
      setLoading(false);
      showNotification(
        "error",
        "Not able to process your request",
        "Try Again"
      );
      // NProgress.done();
    },
  });
  const { data } = useQuery(PropertyQuery.getPropertyType);
  let subTypes = get(data, "getPropertyType.data");
  const [isFormSubmitting, setFormSubmitting] = useState(false);
  const [initialDataProperty, setInitialData] = useState(
    get(props, "location.state", {})
  );

  const [propertyCover, setPropertyCover] = useState(
    get(initialDataProperty, "photos", [])
  );

  const [progressPercent, setProgressPercent] = useState(0);
  const [isUploadingImages, setIsUploadingImages] = useState(false);

  // address
  const [loqateData, setLoqateData] = useState({
    address: get(props, "location.state.address", {}),
  });

  useEffect(() => {
    if (!isEmpty(get(props, "propertyData", {}))) {
      setInitialData(get(props, "propertyData", {}));
    }
  }, [initialDataProperty, props]);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const updatePropertySubType = () => {
    // if (isUpdateProperty()) {
    getValues("propertyType") === defaultValues.propertyType
      ? setValue("subType", defaultValues.subType)
      : setValue("subType", undefined);
    // }
    forceUpdate();
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      let existingFiles = propertyCover ? propertyCover : [];
      setIsUploadingImages(true);
      setProgressPercent(progressPercent + 5);
      // Do something with the files
      let setPreview = acceptedFiles.map(async (file, i) => {
        let preview = await getBase64(file);
        file.preview = preview;
        existingFiles.push(file);
        setProgressPercent((prevState) => prevState + 15);
      });

      await Promise.all(setPreview);
      setProgressPercent(100);
      setIsUploadingImages(false);
      setPropertyCover(existingFiles);
    },
    [propertyCover, progressPercent]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const saveData = async (data, isListingMode = false) => {
    setLoading(true);
    let photos = [];
    setFormSubmitting(true);
    setIsUploadingImages(true);
    setProgressPercent((prevState) => prevState + 5);
    let uploadImages = propertyCover.map(async (img, i) => {
      try {
        if (typeof img !== "string") {
          var frmData = new FormData();
          frmData.append("file", img);
          frmData.append("filename", img.name);
          // for what purpose the file is uploaded to the server.
          frmData.append("uploadType", "Property Gallery");
          let uploadedFile = await axios.post(
            `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
            frmData,
            {
              headers: {
                authorization: await cookie.load(
                  process.env.REACT_APP_AUTH_TOKEN
                ),
              },
            }
          );
          if (!uploadedFile.data.success)
            return showNotification(
              "error",
              "An error occurred",
              uploadedFile.data.message
            );

          photos.push(get(uploadedFile, "data.data"));
          setProgressPercent((prevState) => prevState + 15);
        } else {
          photos.push(img);
        }
      } catch (error) {
        return showNotification("error", "An error occurred", error.message);
      }
    });

    await Promise.all(uploadImages);
    setProgressPercent(100);
    data.photos = !isEmpty(photos)
      ? photos
      : [
        "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1579693025/property_img_placeholder_thumb.png",
      ];
    data.address = get(loqateData, "address");
    data.title = title;

    if (isUpdateProperty()) {
      updateProperty({
        variables: data,
      });
    } else {
      data.uniqueId = `${uniqEightRandomNum.current}`;
      saveProperty(data, isListingMode);
    }
  };

  const isUpdateProperty = () => window.location.pathname.includes("edit");

  const saveProperty = async (data, isListingMode) => {
    // props.contextData.startLoading();
    setLoading(true);
    if (userData.role === "landlord") {
      createPropertyByLandlordMutation({
        variables: {
          ...data,
          landlordEmail: userData.email,
        },
      });
    } else {
      createPropertyWithLandlordAndRenter({
        variables: {
          ...data,
          landlordEmail: props?.landlordData?.email
            ? props?.landlordData?.email
            : "",
        },
      });
    }
  };

  const onAddListing = () => {
    props.history.push(`listing/edit`, {
      selectedProperty: allProperties.current[0],
      allProperties: allProperties.current,
    });
  };

  const findAddress = async (address) => {
    let fullAddress = await LoqateAddressFull(address.Id);
    let completeAddress = fullAddress.Items[0];

    if (completeAddress) {
      // setInitialData

      let addressObj = {
        fullAddress: completeAddress.Label,
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
        ...completeAddress,
      };

      if (
        addressObj.addressLine1 === undefined ||
        addressObj.country === undefined ||
        addressObj.zip === undefined
      ) {
        message.error("This address is not compatible, choose other one");
        return;
      }

      addressObj.fullAddress = `${addressObj.addressLine1}, ${addressObj.addressLine2}, ${addressObj.city}, ${addressObj.zip}`;

      const matched = await MatchAddress(addressObj);

      if (!matched) {
        setAddressFields(addressObj);
      }
    }
  };

  const setAddressFields = (addressObj) => {
    setAddressStr(get(addressObj, "fullAddress", ""));
    setValue("addressLine1", get(addressObj, "addressLine1", ""));
    setValue("addressLine2", get(addressObj, "addressLine2", ""));
    setValue("city", get(addressObj, "city", ""));
    setValue("state", get(addressObj, "city", ""));
    setValue("Street", get(addressObj, "Street", ""));
    setValue("zip", get(addressObj, "zip", ""));
    setValue("country", get(addressObj, "country", ""));
    setValue("SortingNumber1", get(addressObj, "SortingNumber1", ""));

    addressObj.fullAddress === undefined
      ? setValue("title", "")
      : updateTitle(getValues());
    setLoqateData({ address: addressObj ? addressObj : {} });
  };

  // let settings = {
  //   dots: true,
  //   arrows: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: propertyCover && propertyCover.length === 1 ? 1 : 2,
  //   slidesToScroll: 1
  // };

  const removeImage = (index) => {
    let photos = propertyCover;
    photos.splice(index, 1);

    setPropertyCover(photos);
    forceUpdate();
  };

  const updateTitle = () => {
    const postcode = getValues("zip").split(" ")[0];

    const {
      addressLine1 = "",
      addressLine2 = "",
      Street = "",
      city = "",
      numberOfBed = " ",
      subType = "",
      zip = "",
    } = getValues();

    const listingTitle = `${!isNaN(numberOfBed) ? numberOfBed : ""
      } Bed ${subType} ${Street} ${city} ${postcode}`;
    const propertyTitle = `${addressLine1} ${addressLine2 ? addressLine2 : ""
      } ${city} ${zip}`;
    setValue("privateTitle", propertyTitle);
    setTitle(listingTitle);
    // forceUpdate();
  };

  let showListingButton =
    !props.isDrawer && !window.location.pathname.includes("myrental/add");

  // console.log("*********************", query.get("redirect"))

  return (
    <Spin spinning={loading}>
      <form onSubmit={handleSubmit(saveData)}>
        <div>
          <div className="property--wrap">
            <div className="m-3">
              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="property-input_wrapper">
                    <div className="form-group">
                      <div className="title__input">
                        <label>Title of the property for private view</label>
                        <Tooltip
                          overlayClassName="tooltip__color"
                          title="To make it easy to manage and maintain privacy, Title text of property is auto-populated for the public and private view"
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                            alt="i"
                            className="pull-right"
                          />
                        </Tooltip>
                        <input
                          type="text"
                          name="privateTitle"
                          readOnly
                          className="form-control"
                          placeholder="Auto title text populated"
                          {...register("privateTitle", { required: true })}
                        />
                        {errors.privateTitle && (
                          <span role="alert" style={{ color: "red" }}>
                            This field is required
                          </span>
                        )}
                      </div>
                    </div>
                    <label>Let's start with property location?</label>
                    <Tooltip
                      overlayClassName="tooltip__color"
                      title="Please enter the full first line of your address including house number. We
                          won't publish the property number itself. For example you enter: '12 Imaginary Lane’ 
                          title will appear to tenants in search as: 'Imaginary Lane' If this is a flat, please 
                          enter Flat 12, or 345 Nelson Mandela House for example. This will all be kept private. "
                    >
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                        alt="i"
                        className="pull-right"
                      />
                    </Tooltip>
                    <div className="form-group">
                      {/* <SuggestionDropdown
                        LoqateAddress={LoqateAddress}
                        findAddress={findAddress}
                        loqateData={get(loqateData, "address")}
                        register={register}
                        required={false}
                        label="address"
                        value={addressStr}
                        onChange={(event, { newValue }) => {
                          setAddressStr(newValue ? newValue : "")
                          if(newValue === "") {
                            setAddressFields({})
                          }
                          // console.log("address str", addressStr, newValue)


                        } }
                        disabled={isUpdateProperty()}
                      /> */}

                      <AddressAutocomplete
                        value={addressStr}
                        onChange={(value) => {
                          setAddressStr(value ? value : "");
                          if (value === "") {
                            setAddressFields({});
                          }
                        }}
                        findAddress={findAddress}
                        disabled={isUpdateProperty()}
                        placeholder="Type property address and select"
                      />
                      {errors.address && (
                        <span style={{ color: "red" }}>
                          This field is required
                        </span>
                      )}
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        id="line1"
                        name="addressLine1"
                        // value={get(loqateData, "address.addressLine1")}
                        className="form-control"
                        placeholder="Address Line 1*"
                        readOnly
                        {...register("addressLine1", { required: true })}
                      />
                      {errors.addressLine1 && (
                        <span style={{ color: "red" }}>
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="form-group">
                      <input
                        type="text"
                        id="line2"
                        name="addressLine2"
                        // value={get(loqateData, "address.addressLine2")}
                        className="form-control"
                        placeholder="Address Line 2"
                        readOnly
                        {...register("addressLine2")}
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            id="city"
                            name="city"
                            // value={get(loqateData, "address.city")}
                            className="form-control"
                            placeholder="City *"
                            readOnly
                            {...register("city", { required: true })}
                          />
                          {errors.city && (
                            <span style={{ color: "red" }}>
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            id="zip"
                            name="zip"
                            // value={get(loqateData, "address.zip")}
                            className="form-control"
                            placeholder="Post Code/ZIP *"
                            readOnly
                            {...register("zip", { required: true })}
                          />
                          {errors.zip && (
                            <span style={{ color: "red" }}>
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            id="province"
                            name="state"
                            // value={get(loqateData, "address.state")}
                            className="form-control"
                            placeholder="Country / State / Region"
                            readOnly
                            {...register("state")}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <input
                            type="text"
                            id="country"
                            name="country"
                            // value={get(loqateData, "address.country")}
                            className="form-control"
                            placeholder="Country *"
                            readOnly
                            {...register("country", { required: true })}
                          />
                          {errors.country && (
                            <span style={{ color: "red" }}>
                              This field is required
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <label>Upload a cover image</label>

                    <div tabIndex="0" className="text-center">
                      <div
                        {...getRootProps({ className: "dropzone" })}
                        className="property__upload-img dropzone__task"
                      >
                        <div>
                          {isUploadingImages ? (
                            <Progress
                              width={80}
                              type="circle"
                              percent={progressPercent}
                            />
                          ) : (
                            <>
                              <input {...getInputProps()} />

                              {isEmpty(propertyCover) && (
                                <>
                                  <i className="far fa-images"></i>
                                  <p>
                                    Drop files here or Click here to upload
                                    (max. 30MB )
                                  </p>
                                </>
                              )}
                            </>
                          )}
                        </div>
                        <ul>
                          {!isEmpty(propertyCover) &&
                            propertyCover.map((img, i) => {
                              return (
                                <li key={i}>
                                  <div>
                                    {/* <input id={i} {...getInputProps()} /> */}

                                    <div>
                                      {img && (
                                        <img
                                          key={i}
                                          src={get(img, "preview", img)}
                                          alt={img.name}
                                        />
                                      )}
                                      <i
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeImage(i);
                                        }}
                                        className="fas fa-times-circle"
                                      ></i>
                                    </div>
                                  </div>
                                </li>
                              );
                            })}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="type__property--wrapper">
                    <label className="type__property">
                      What type of property do you have?
                    </label>

                    <ul>
                      <li>
                        <div
                          onClick={() => {
                            setValue("propertyType", "House");
                            // updateTitle();
                            updatePropertySubType();
                          }}
                          className={`property--type ${getValues("propertyType") === "House" && "active"
                            }`}
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/house.png"
                            alt="loading..."
                          />
                        </div>
                        <p>House</p>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            setValue("propertyType", "Apartment");
                            // updateTitle();
                            updatePropertySubType();
                          }}
                          className={`property--type ${getValues("propertyType") === "Apartment" &&
                            "active"
                            }`}
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/appartment.png"
                            alt="loading..."
                          />
                        </div>
                        <p>Apartment</p>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            setValue("propertyType", "Shared Property");
                            // updateTitle();
                            updatePropertySubType();
                          }}
                          className={`property--type ${getValues("propertyType") === "Shared Property" &&
                            "active"
                            }`}
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/Shared.png"
                            alt="loading..."
                          />
                        </div>
                        <p>Shared Property</p>
                      </li>
                      <li>
                        <div
                          onClick={() => {
                            setValue("propertyType", "Others");
                            // updateTitle();
                            updatePropertySubType();
                          }}
                          className={`property--type ${getValues("propertyType") === "Others" && "active"
                            }`}
                        >
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/other.png"
                            alt="loading..."
                          />
                        </div>
                        <p>Other</p>
                      </li>
                    </ul>

                    <div className="property--sub__type">
                      <label className="label_title_input">
                        Property Sub-Type*
                      </label>
                      <Controller
                        control={control}
                        name="subType"
                        rules={{
                          required: true,
                        }}
                        render={({ field: { onChange, ...rest } }) => (
                          <Select
                            name="subType"
                            size="large"
                            placeholder="Select Sub-Type"
                            className="w-100"
                            onChange={(value) => {
                              onChange(value);
                              updateTitle();
                            }}
                            {...rest}
                          >
                            {find(subTypes, {
                              propertyName: getValues("propertyType"),
                            }) &&
                              !isEmpty(
                                find(subTypes, {
                                  propertyName: getValues("propertyType"),
                                }).propertySubType
                              ) &&
                              find(subTypes, {
                                propertyName: getValues("propertyType"),
                              }).propertySubType.map((sub, j) => {
                                return (
                                  <Option key={sub} value={sub}>
                                    {sub}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      />
                      {errors.subType && (
                        <span style={{ color: "red" }}>
                          This field is required
                        </span>
                      )}
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <label>Number of bed *</label>
                        <div className="form-group">
                          <div className="flex__div">
                            <div className="input-group-prepend">
                              <div className="input-group-text input_icon border-radius__l">
                                <i className="fas fa-bed"></i>
                              </div>
                            </div>
                            <input
                              autoComplete="none"
                              placeholder="No. of Beds"
                              name="numberOfBed"
                              {...register("numberOfBed", {
                                required: true,
                                pattern: /^[1-9]\d*$/,
                                valueAsNumber: true,
                              })}
                              onChange={(e) => {
                                setValue(
                                  "numberOfBed",
                                  e.target.value ? e.target.value : 0
                                );
                                updateTitle();
                              }}
                              className="tab__deatils--input"
                              type="number"
                              required
                              min={1}
                            />
                            {errors.numberOfBed && (
                              <span style={{ color: "red" }}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>Number of bath *</label>
                        <div className="form-group">
                          <div className="flex__div">
                            <div className="input-group-prepend">
                              <div className="input-group-text input_icon border-radius__l">
                                <i className="fas fa-bath"></i>
                              </div>
                            </div>
                            <input
                              autoComplete="none"
                              placeholder="No. of Bath"
                              name="numberOfBath"
                              className="tab__deatils--input"
                              type="number"
                              required
                              min={1}
                              {...register("numberOfBath", {
                                required: true,
                                pattern: /^[1-9]\d*$/,
                                valueAsNumber: true,
                              })}
                            />
                            {errors.numberOfBath && (
                              <span style={{ color: "red" }}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>Number of reception *</label>
                        <div className="form-group">
                          <div className="flex__div">
                            <div className="input-group-prepend">
                              <div className="input-group-text input_icon border-radius__l">
                                <i className="fas fa-couch"></i>
                              </div>
                            </div>
                            <input
                              autoComplete="none"
                              name="numberOfReception"
                              placeholder="No. of reception"
                              className="tab__deatils--input"
                              type="number"
                              required
                              min={1}
                              {...register("numberOfReception", {
                                required: true,
                                pattern: /^[1-9]\d*$/,
                                valueAsNumber: true,
                              })}
                            />
                            {errors.numberOfReception && (
                              <span style={{ color: "red" }}>
                                This field is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <label>Size in Sq. Feet *</label>
                        <div className="form-group">
                          <div className="flex__div">
                            <div className="input-group-prepend">
                              <div className="input-group-text input_icon border-radius__l">
                                <i className="fas fa-tape"></i>
                              </div>
                            </div>
                            <input
                              autoComplete="none"
                              placeholder="Size in Sq. Feet"
                              name="sizeInSquareFeet"
                              className="tab__deatils--input"
                              type="number"
                              min={1}
                              required
                              {...register("sizeInSquareFeet", {
                                required: true,
                                pattern: /^[1-9]\d*$/,
                                valueAsNumber: true,
                              })}
                            />
                          </div>
                        </div>
                      </div>
                      {window.location.pathname.includes("myrental/add") && (
                        <div className="col-md-12">
                          <label>Landlord's Email</label>
                          <div className="form-group">
                            <div className="flex__div">
                              <div className="input-group-prepend">
                                <div className="input-group-text input_icon border-radius__l">
                                  <i className="fas fa-envelope"></i>
                                </div>
                              </div>
                              <input
                                autoComplete="none"
                                placeholder="Landlord's Email"
                                name="landlordEmail"
                                className="tab__deatils--input"
                                type="email"
                                required
                                {...register("landlordEmail", {
                                  required: true,
                                })}
                              />
                              {errors.landlordEmail && (
                                <span style={{ color: "red" }}>
                                  This field is required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="property__btn">
                    {query.get("redirect") !== "true" ? (
                      <button type="submit" className="btn btn-primary">
                        {window.location.pathname.includes("edit")
                          ? "Update"
                          : "Create"}{" "}
                        Property
                      </button>
                    ) : showListingButton ? (
                      <button
                        type="submit"
                        onClick={() => {
                          setListingStatus(true);
                        }}
                        disabled={isFormSubmitting}
                        className="btn add--listing"
                      >
                        {window.location.pathname.includes("edit")
                          ? "Update"
                          : "Add"}{" "}
                        Listing
                      </button>
                    ) : (
                      ""
                    )}

                    {/* just changed the position of buttons */}
                    <button
                      type="button"
                      onClick={() => {
                        props.isDrawer && props.toggleAddPropertyDrawer(false);

                        !props.isDrawer &&
                          props.history.push("/landlord/property");
                      }}
                      disabled={isFormSubmitting}
                      className="btn cancel"
                      style={{ backgroundColor: "rgb(90 98 104 / 62%)" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
      <Modal closable={false} visible={isModalVisible} footer={null}>
        {status === "success" ? (
          <Result
            status={status}
            title={`Property is ${isUpdateProperty() ? "updated" : "created"
              } successfully`}
            subTitle={`Property ${getValues("privateTitle")}`}
            extra={[
              <Button
                style={{
                  padding: "5px 10px",
                  margin: "10px",
                  color: "#fff",
                  width: "150px",
                  height: "40px",
                }}
                type="primary"
                key="dashboard"
                onClick={() =>
                  props.history.push(
                    "/landlord/property",
                    allProperties.current
                  )
                }
              >
                Return To Properties
              </Button>,
              <Button
                style={{
                  padding: "5px 10px",
                  margin: "10px",
                  color: "#fff",
                  width: "150px",
                  height: "40px",
                  background: "#f28e1e",
                  borderColor: "#f28e1e",
                }}
                key="listing"
                onClick={() => onAddListing()}
              >
                Update Listing
              </Button>,
            ]}
          />
        ) : (
          <Result
            status={status}
            title={`Failed To ${isUpdateProperty() ? " update" : "create"
              } Property`}
            extra={[
              <Button
                type="primary"
                key="dashboard"
                onClick={() =>
                  props.history.push(
                    "/landlord/property",
                    allProperties.current
                  )
                }
              >
                Return To Properties
              </Button>,
              <Button key="try again" onClick={() => setModalVisible(false)}>
                Try Again
              </Button>,
            ]}
          />
        )}
      </Modal>
    </Spin>
  );
};
export default withRouter(AddProperty);

import React, { useState, useCallback, useRef, useContext } from "react";
import {
  Progress,
  DatePicker,
  // Tooltip,
  // Tag,
  message,
  Upload,
  Input,
} from "antd";
// import { YoutubeOutlined } from "@ant-design/icons";
import { useDropzone } from "react-dropzone";
import moment from "moment";
import isEmpty from "lodash/isEmpty";
import isArray from "lodash/isArray";
import get from "lodash/get";
import useForceUpdate from "use-force-update";
import axios from "axios";
import cookie from "react-cookies";
import NProgress from "nprogress";
import "./gallery.scss";
import showNotification from "config/Notification";
import {
  LoadingOutlined,
  InboxOutlined,
  FileTextTwoTone,
} from "@ant-design/icons";
import {
  createOrUpdateListingPhotosVideo,
  createOrUpdateListingDocument,
} from "config/queries/listing";
import { useMutation } from "@apollo/react-hooks";
import DocumentQuery from "config/queries/document";
import { UserDataContext } from "store/contexts/UserContext";

const { Dragger } = Upload;

const Gallery = (props) => {
  const forceUpdate = useForceUpdate();
  const { state: userState } = useContext(UserDataContext);
  const { accountSetting } = userState;
  const dateFormat =
    accountSetting && accountSetting["dateFormat"]
      ? accountSetting["dateFormat"].toUpperCase()
      : process.env.REACT_APP_DATE_FORMAT.toUpperCase();

  // const [photos, setPhotos] = useState([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [coverImageIndex, setCoverImageIndex] = useState(0);
  const currentUploadedDocument = useRef({});

  // const [videoUrl, setvideoUrl] = useState([]);
  const photos = get(props, "listingData.captionedPhotos", []);
  const videoUrl = get(props, "listingData.videoUrl", []);
  const listingDocuments = isArray(get(props, "listingData.documents", []))
    ? get(props, "listingData.documents", [])
    : [];

  const constantsElem = {
    EPC_CERTIFICATE: "EPC certificate",
    GAS_SAFETY_CERTIFICATE: "Gas Safety certificate",
    ELECTRICITY_CERTIFICATE: "Electricity condition report",
    BUILDING_CERTIFICATE: "Building Insurance",
  };

  const [certificateButtonActive, setCertificateButtonActive] = useState(
    constantsElem.EPC_CERTIFICATE
  );

  //eslint-disable-next-line
  const setphotos = (data) => {
    props.setListingData({ ...props.listingData, captionedPhotos: data });
  };
  const setvideoUrl = (data) => {
    props.setListingData({ ...props.listingData, videoUrl: data });
  };
  const setListingDocuments = (data) => {
    props.setListingData({ ...props.listingData, documents: data });
  };

  // eslint-disable-next-line no-unused-vars
  const [createOrUpdateListingGalleryDocumentsMutation] = useMutation(
    createOrUpdateListingPhotosVideo,
    {
      onCompleted: ({ createOrUpdateListingPhotosVideo }) => {
        if (get(createOrUpdateListingPhotosVideo, "success", false)) {
          showNotification(
            "success",
            "Your changes have been successfully saved!"
          );
          props.setPropertyData((prevState) => ({
            ...prevState,
            isDraft: createOrUpdateListingPhotosVideo?.data?.isDraft,
          }));
          props.setListingData({
            ...props.listingData,
            ...createOrUpdateListingPhotosVideo.data,
          });
          props.updateActiveTab();
        } else {
          showNotification("error", "Failed to update listing detail", "");
        }
        NProgress.done();
      },
      onError: (error) => {
        NProgress.done();
        showNotification(
          "error",
          "Not able to update",
          "Reload page and try again"
        );
      },
    }
  );

  const [submitDocumentData] = useMutation(createOrUpdateListingDocument, {
    onCompleted: ({ createOrUpdateListingDocument }) => {
      if (createOrUpdateListingDocument.success) {
        // add id of newly created docuemnt
        setListingDocuments([
          ...listingDocuments,
          createOrUpdateListingDocument?.data,
        ]);
        // props.setListingData({...props.listingData, documents: listingDocuments})
      } else {
        showNotification(
          "error",
          "Failed To upload image",
          get(createOrUpdateListingDocument, "message", "")
        );
      }
      setIsUploadingImages(false);
      NProgress.done();
    },
    onError: (error) => {
      setIsUploadingImages(false);
      NProgress.done();
      showNotification(
        "error",
        "Failed To upload image",
        "Reload and try again"
      );
    },
  });

  const [deleteDocs] = useMutation(DocumentQuery.deleteDocs);

  const [update] = useMutation(DocumentQuery.update);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      let existingFiles = photos ? photos : [];
      setIsUploadingImages(true);
      setProgressPercent(progressPercent + 5);
      // Do something with the files
      let setPreview = acceptedFiles.map(async (file, i) => {
        let preview = await getBase64(file);
        file.preview = preview;
        existingFiles.push({ url: file, caption: "" });
        setProgressPercent((prevState) => prevState + 15);
      });

      await Promise.all(setPreview);
      setProgressPercent(100);
      setIsUploadingImages(false);
      setphotos(existingFiles);
    },
    [photos, progressPercent, setphotos]
  );

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  const renderItem = () => {
    return (
      <div className="preview_photo property__upload-img dropzone__task">
        <ul>
          {listingDocuments?.map((doc, i) => {
            return (
              <li key={i}>
                <div>
                  <div>
                    {doc?.fileType?.includes("image") ? (
                      <img
                        key={doc._id}
                        src={doc?.url}
                        alt={doc?.description}
                      />
                    ) : (
                      <FileTextTwoTone style={{ fontSize: "150px" }} />
                    )}

                    <p>{doc.description}</p>
                    <p>Expiry Date</p>
                    <DatePicker
                      placeholder="Select Expiry Date"
                      // defaultValue={moment("01/01/2022", dateFormatList[0])}
                      value={
                        doc.expiryDate ? moment(doc.expiryDate) : undefined
                      }
                      format={dateFormat}
                      required={true}
                      onChange={(date, dateString) =>
                        handleDateChange(date, dateString, i)
                      }
                      className="slider_input"
                    />
                    <i
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDocs({
                          variables: {
                            ids: [listingDocuments[i]._id],
                          },
                        }).then((res) => {
                          if (res.data.deleteDocs.success) {
                            showNotification(
                              "success",
                              "Document deleted successfully!"
                            );
                            setListingDocuments(
                              listingDocuments?.filter(
                                (doc, index) => index !== i
                              )
                            );
                          } else {
                            showNotification(
                              "error",
                              res?.data?.deleteDocs?.message ||
                                "Something went wrong!"
                            );
                          }
                        });
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
    );
  };

  const updateGallery = async () => {
    if (isEmpty(photos)) {
      message.info("Please add atleast one image");
      return;
    }
    const regex =
      /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (videoUrl?.length > 0 && videoUrl[0] !== "" && !regex.test(videoUrl)) {
      message.info("Invlid Youtube link");
      return;
    }
    try {
      NProgress.start();
      const newPhotos = [];
      const captionedPhotos = [];
      const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);

      let uploadPhotos =
        photos &&
        !isEmpty(photos) &&
        photos.map(async (photo, i) => {
          if (typeof photo.url !== "string") {
            var frmData = new FormData();
            frmData.append("file", photo.url);
            frmData.append("filename", photo.url.name);
            // for what purpose the file is uploaded to the server.
            frmData.append("uploadType", "Property Gallery");
            let uploadedFile = await axios.post(
              `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
              frmData,
              {
                headers: {
                  authorization: token,
                },
              }
            );
            newPhotos.push(get(uploadedFile, "data.data", ""));
            captionedPhotos.push({
              ...photo,
              url: get(uploadedFile, "data.data", ""),
            });
          } else {
            newPhotos.push(photo.url);
            captionedPhotos.push(photo);
          }
        });
      photos &&
        typeof uploadPhotos !== "boolean" &&
        (await Promise.all(uploadPhotos));

      createOrUpdateListingGalleryDocumentsMutation({
        variables: {
          propertyId: props.propertyData.propertyId,
          listingGallery: {
            photos: newPhotos,
            videoUrl,
          },
          captionedPhotos,
        },
      });
    } catch (error) {
      showNotification("error", "An error occurred", error.message);
    }
  };

  const removeImage = (index) => {
    photos.splice(index, 1);

    setphotos(photos);
    forceUpdate();
  };

  const handleDateChange = (date, dateString, index) => {
    update({
      variables: {
        documentId: listingDocuments[index]._id,
        expiryDate: date,
      },
    });
    setListingDocuments(
      listingDocuments?.map((doc, i) =>
        i !== index ? doc : { ...doc, expiryDate: date }
      )
    );
  };

  const acceptedFileTypes = [
    "doc",
    "application//docx",
    "application/pdf",
    "image/jpg",
    "application/xls",
    "application/xlsx",
    "image/jpeg",
    "image/png",
  ];

  const beforeUpload = (file) => {
    // console.log("File type", file.type, file.size)
    const isAcceptedFileType = acceptedFileTypes.includes(file.type);
    if (!isAcceptedFileType) {
      message.error(`${file.type} file is not supported!`);
    }
    const isLt3M = file.size / 1024 / 1024 < 3;
    if (!isLt3M) {
      message.error("File must be smaller than 3MB!");
    }
    return isAcceptedFileType && isLt3M;
  };

  const uploadDocumentProps = {
    name: certificateButtonActive,
    multiple: true,
    action: `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
    disabled:
      listingDocuments?.some(
        (doc) => doc.description === certificateButtonActive
      ) || isUploadingImages,
    beforeUpload: beforeUpload,

    customRequest: (options) => {
      const data = new FormData();
      data.append("file", options.file);
      data.append("uploadType", "Property Gallery");
      data.append("filename", options.file.name);
      const config = {
        headers: {
          "content-type":
            "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
          authorization: cookie.load(process.env.REACT_APP_AUTH_TOKEN),
        },
      };
      axios
        .post(options.action, data, config)
        .then((res) => {
          options.onSuccess(res.data, options.file);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    onChange(info) {
      const { status } = info.file;
      if (status === "uploading") {
        NProgress.start();
        setIsUploadingImages(true);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
        currentUploadedDocument.current = {
          name: certificateButtonActive,
          url: info.file.response.data,
        };
        // create document
        submitDocumentData({
          variables: {
            fileName: info.file.name,
            url: info.file.response.data,
            description: certificateButtonActive,
            fileType: info.file.type,
            fileSize: info.file.size,
            s3ObjectName: info.file.name,
            propertyId: props.propertyData.propertyId,
            status: "Active",
          },
        });
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },

    itemRender: (originNode, file, currFileList) => undefined,
  };

  return (
    <>
      <div className="gallery___wrap">
        <div className="row">
          <div className="col-lg-6 col-md-12 show-off-place">
            <h3 className="special_space">Show off your place</h3>
            <label className="labels__global">Upload Photos *</label>

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
                      <input
                        disabled={props.isPreviewMode}
                        {...getInputProps()}
                      />

                      <>
                        <i className="far fa-images"></i>
                        <p>
                          Drop files here or Click here to upload (max. 3MB )
                        </p>
                      </>
                    </>
                  )}
                </div>
              </div>
            </div>
            <p className="alert_message_listing_gallery">
              Atleast 1 photo is required. Max-photo upto-10 file size is 3MB
              per image. JPG, PNG, GIF format only.
            </p>
            <label className="labels__global">Preview and Photo Caption</label>
            <div className="preview_photo property__upload-img dropzone__task">
              <ul>
                {!isEmpty(photos) &&
                  photos.map((img, i) => {
                    return (
                      <li key={i}>
                        <div>
                          {/* <input id={i} {...getInputProps()} /> */}

                          <div>
                            <img
                              onClick={() => setCoverImageIndex(i)}
                              key={i}
                              src={get(img.url, "preview", img.url)}
                              alt={img.caption}
                            />
                            {coverImageIndex === i && (
                              <p className="cover_image">COVER IMAGE</p>
                            )}
                            <br />
                            <input
                              type="text"
                              value={img.caption ? img.caption : ""}
                              onChange={(e) =>
                                setphotos([
                                  ...photos.slice(0, i),
                                  { ...img, caption: e.target.value },
                                  ...photos.slice(i + 1),
                                ])
                              }
                              className="slider_input"
                              placeholder="Add a caption"
                            />
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
            <p className="alert_message_listing_gallery">
              The first photo will be your cover image, this is used as a
              general representation of your property. Click any image to make
              cover image
            </p>
            <div className="add_video">
              <label className="labels__global">Add video (optional)</label>
              <Input
                style={{ width: "100%" }}
                value={videoUrl}
                placeholder="YouTube videos only. Paste your link here."
                onChange={(e) => setvideoUrl(e.target.value)}
              />

              {/* <Select
                mode="tags"
                style={{ width: "100%", overflow: "hidden" }}
                value={videoUrl}
                placeholder="YouTube videos only. Paste your link here."
                onChange={(value) => {
                  const youtubeUrl = value[value.length - 1];
                  if (videoUrl.length < 1) {
                    try {
                      const url = new URL(youtubeUrl);
                      if (url.host.search(/youtube/) !== -1) {
                        setvideoUrl(value);
                      } else {
                        message.error("The link must be Youtube Link");
                      }
                    } catch (_) {
                      message.error("Enter a valid URL");
                    }
                  } else {
                    message.error("Maximum 1 youtube videos are allowed!");
                  }
                }}
                tokenSeparators={[","]}
                tagRender={videoTagRender}
                dropdownStyle={{ display: "none" }}
              /> */}
            </div>
          </div>
          <div className="col-lg-6 col-md-12 upload-zone">
            <h3 className="schedule__left--heading">
              Upload your Essential Document
            </h3>
            <div className="wrap_browse">
              <div className="button__listing">
                <ul>
                  <li>
                    <button
                      type="button"
                      disabled={listingDocuments?.some(
                        (doc) =>
                          doc.description === constantsElem.EPC_CERTIFICATE
                      )}
                      onClick={() => {
                        setCertificateButtonActive(
                          constantsElem.EPC_CERTIFICATE
                        );
                      }}
                      className={`btn btn__selectable 
                            ${
                              certificateButtonActive ===
                                constantsElem.EPC_CERTIFICATE &&
                              "btn__selectable--active"
                            }`}
                    >
                      EPC Certificate
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      disabled={listingDocuments?.some(
                        (doc) =>
                          doc.description ===
                          constantsElem.GAS_SAFETY_CERTIFICATE
                      )}
                      onClick={() => {
                        setCertificateButtonActive(
                          constantsElem.GAS_SAFETY_CERTIFICATE
                        );
                      }}
                      className={`btn btn__selectable ${
                        certificateButtonActive ===
                          constantsElem.GAS_SAFETY_CERTIFICATE &&
                        "btn__selectable--active"
                      }`}
                    >
                      Gas Safety
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      disabled={listingDocuments?.some(
                        (doc) =>
                          doc.description ===
                          constantsElem.ELECTRICITY_CERTIFICATE
                      )}
                      onClick={() => {
                        setCertificateButtonActive(
                          constantsElem.ELECTRICITY_CERTIFICATE
                        );
                      }}
                      className={`btn btn__selectable 
                            ${
                              certificateButtonActive ===
                                constantsElem.ELECTRICITY_CERTIFICATE &&
                              "btn__selectable--active"
                            }`}
                    >
                      Electricity
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      disabled={listingDocuments?.some(
                        (doc) =>
                          doc.description === constantsElem.BUILDING_CERTIFICATE
                      )}
                      onClick={() => {
                        setCertificateButtonActive(
                          constantsElem.BUILDING_CERTIFICATE
                        );
                      }}
                      className={`btn btn__selectable ${
                        certificateButtonActive ===
                          constantsElem.BUILDING_CERTIFICATE &&
                        "btn__selectable--active"
                      }`}
                    >
                      Building Insurance
                    </button>
                  </li>
                </ul>
                <Dragger {...uploadDocumentProps}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>

                  <p className="ant-upload-text">{`Click or drag file to this area to upload ${certificateButtonActive}`}</p>
                  <p className="ant-upload-hint">Maximum 3MB</p>
                </Dragger>
                {!isEmpty(listingDocuments) && renderItem()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <hr />
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 text-right">
          <button
            ref={props.submitButtonRef}
            disabled={isUploadingImages}
            onClick={() => updateGallery()}
            className="btns__warning--schedule"
          >
            {isUploadingImages ? <LoadingOutlined /> : "Save"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Gallery;

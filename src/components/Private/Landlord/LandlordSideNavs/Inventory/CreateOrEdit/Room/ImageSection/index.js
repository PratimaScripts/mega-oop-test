import React, { useCallback, useEffect, useState } from "react";
import { message, Progress, Row } from "antd";
import { useDropzone } from "react-dropzone";
import { isEmpty } from "lodash-es";
import useForceUpdate from "use-force-update";
import cookie from "react-cookies";

import "./styles.scss";
import axios from "axios";
import { Col } from "antd/lib/grid";

const ImageSection = ({ onImageArrayChange, initialState }) => {
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState(false);
  const [isUploadingImages, setIsUploadingImages] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const forceUpdate = useForceUpdate();

  useEffect(() => {
    setPhotos(initialState);
  }, [initialState]);

  useEffect(() => {
    onImageArrayChange(photos);

    //eslint-disable-next-line
  }, [photos]);

  const uploadImage = async (file) => {
    try {
      const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);
      const frmData = new FormData();
      frmData.append("file", file);
      // for what purpose the file is uploaded to the server.
      frmData.append("uploadType", "Inventory");
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        frmData,
        {
          headers: {
            authorization: token,
          },
        }
      );
      return data.data;
    } catch (error) {
      setError(true);
      message.error("The size limit for images are too large, try again later!");
    }
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      let existingFiles = photos ? photos : [];
      setIsUploadingImages(true);
      setProgressPercent(progressPercent + 5);
      // Do something with the files
      let setPreview = acceptedFiles.map(async (file) => {
        const url = await uploadImage(file);
        existingFiles.push({ name: file.name, url });
        setProgressPercent((prevState) => prevState + 15);
      });

      await Promise.all(setPreview);
      setProgressPercent(100);
      setIsUploadingImages(false);
      setPhotos(existingFiles);
      onImageArrayChange(existingFiles);
    },

    // eslint-disable-next-line
    [photos, progressPercent]
  );

  const removeImage = (index) => {
    photos.splice(index, 1);
    setPhotos(photos);
    onImageArrayChange(photos);
    forceUpdate();
  };

  const handleChangeImageName = (index, name) => {
    const newArr = [...photos];
    newArr[index].name = name;
    setPhotos(newArr);
    // onImageArrayChange(photos);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div>
      <Row className="orange-border section-title">
        <Col span={24}>
          <h4>Photos of the room</h4>
        </Col>
      </Row>
      <Row>
        <div className="w-100">
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
                    <input disabled={false} {...getInputProps()} />

                    <>
                      <i className="far fa-images"></i>
                      <p>
                        Drop files here or Click here to upload (max. 30MB )
                      </p>
                    </>
                  </>
                )}
              </div>
            </div>
          </div>
          <p className="alert_message_listing_gallery">
            Atleast 1 photo is required. Max-photo upto-10 file size is 30MB per
            image. JPG, PNG, GIF format only.
          </p>
        </div>
        <div className="w-100">
          <label className="labels__global">Preview and Photo Caption</label>
        </div>
        <div className="preview_photo property__upload-img dropzone__task">
          <ul>
            {!isEmpty(photos) && !error &&
              photos.map((img, i) => (
                <li key={i}>
                  <img key={i} src={img.url} alt={img.name} />

                  <br />
                  <input
                    type="text"
                    className="room-gallery_input"
                    placeholder="Add a caption"
                    value={img.name}
                    onChange={(e) => handleChangeImageName(i, e.target.value)}
                  />
                  <i
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
                    }}
                    className="fas fa-times-circle"
                  ></i>
                </li>
              ))}
          </ul>
        </div>
        <div className="w-100">
          <p className="alert_message_listing_gallery">
            The first photo will be your cover image, this is used as a general
            representation of your property. Click any image to make cover image
          </p>
        </div>
      </Row>
    </div>
  );
};

export default ImageSection;

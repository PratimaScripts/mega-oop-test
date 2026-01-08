import React, { useState } from "react";
import FileUploader from "./FileDropzone";
import VideoUpload from "./VideoUploader";
import axios from "axios";
import get from "lodash/get";
import { Spin } from "antd";
import "../styles.scss";
import cookie from "react-cookies";
import showNotification from "config/Notification";

const UploadTaskDocuments = (props) => {
  const [videoFile, setVideoFile] = useState([]);
  const [images, setImageFiles] = useState(
    get(props, "uploadedTaskDocs.images", [])
  );
  const [uploadingDocs, setUploadingStatus] = useState(false);

  const uploadFiles = async (type) => {
    let vidUrl = "";
    setUploadingStatus(true);
    let uploadedImages = [];

    if (videoFile) {
      var frmData = new FormData();
      frmData.append("file", videoFile);
      frmData.append("filename", videoFile.name);
      // for what purpose the file is uploaded to the server.
      frmData.append("uploadType", "Task");
      let uploadedFile = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        frmData,
        {
          headers: {
            authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
          },
        }
      );
      if (!uploadedFile.data.success)
        return showNotification(
          "error",
          "An error occurred",
          uploadedFile.data.message
        );

      vidUrl = get(uploadedFile, "data.data", "");
    }

    let uploadAllImages = images.map(async (img, i) => {
      if (img.preview) {
        var frmData = new FormData();
        frmData.append("file", img);
        frmData.append("filename", img.name);
        // for what purpose the file is uploaded to the server.
        frmData.append("uploadType", "Task");
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

        uploadedImages.push({
          image: get(uploadedFile, "data.data", ""),
          status: true,
        });
      } else {
        uploadedImages.push({
          image: img.image,
          status: true,
        });
      }
    });

    await Promise.all(uploadAllImages);
    setUploadingStatus(false);
    props.setTaskDocs({ images: uploadedImages });
    props.updateTaskFull(uploadedImages, vidUrl, type);
  };

  return (
    <>
      <p className="head--task">
        <b>New Task:</b> Attach pictures of issue to help narrowing down the
        issue
      </p>
      <div className="attachments-task">
        <Spin
          size="large"
          tip="Uploading Video! Please wait..."
          spinning={uploadingDocs}
        >
          <label>Upload photo of the problem</label>
          <div tabIndex="0" className="input--image mb-3 row">
            <FileUploader images={images} setImageFiles={setImageFiles} />
          </div>

          <label>Upload video of the problem</label>
          <div className="video-upload">
            <video controls="" className="video-preview">
              <source id="videoSource" type="video/mp4" />
            </video>

            <div className="video-edit">
              <label>
                <i className="fa fa-video">
                  <VideoUpload
                    videoFile={videoFile}
                    setVideoFile={setVideoFile}
                  />
                </i>

                {/* <input type="file" id="videoUpload" accept="video/*" /> */}
              </label>
            </div>
          </div>
        </Spin>
      </div>
      <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-3">
        <button
          onClick={() => uploadFiles("Draft")}
          className="btn saveDraft push-left"
        >
          Save Draft
        </button>
        <button
          onClick={() => uploadFiles("Open")}
          // onClick={() => props.addTaskFull()}
          className="btn btn-warning  pull-right"
        >
          Post &nbsp;
          <i className="fa fa-angle-double-right" aria-hidden="true"></i>
        </button>
      </div>
    </>
  );
};

export default UploadTaskDocuments;

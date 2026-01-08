import { Button, Input, message, Modal, Progress, Spin } from "antd";
import axios from "axios";
import showNotification from "config/Notification";
import { submitForPayment } from "config/queries/serviceOrder";
import { get, isEmpty } from "lodash-es";
import React, { useCallback, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import cookie from "react-cookies";
import { useDropzone } from "react-dropzone";
import useForceUpdate from "use-force-update";
import VideoUpload from "../../../../Common/VideoUpload/VideoUpload";

const { TextArea } = Input;

const SubmitOrder = ({ orderId, handleCloseModal }) => {
  // debugger;
  const forceUpdate = useForceUpdate();
  const [video, setVideo] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      setVideo([]);
      setPhotos([]);
      setComments("");
    };
  }, [orderId]);

  const [executeSubmitForPaymentMutation, { error }] = useMutation(
    submitForPayment,
    {
      onCompleted: (data) => {
        if (data) {
          message.success(data.submitForPayment);
          handleCloseModal();
        }
      },
    }
  );

  useEffect(() => {
    error &&
      error.graphQLErrors &&
      error.graphQLErrors.forEach((error) => message.error(error.message));
  }, [error]);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      let existingFiles = photos ? photos : [];
      setLoading(true);

      // Do something with the files
      let setPreview = acceptedFiles.map(async (file, i) => {
        let preview = await getBase64(file);
        file.preview = preview;
        existingFiles.push(file);
      });

      await Promise.all(setPreview);
      setLoading(false);
      setPhotos(existingFiles);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeImage = (index) => {
    let _photos = [...photos];
    _photos.splice(index, 1);

    setPhotos(_photos);
    forceUpdate();
  };

  const uploadFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("filename", file.name);
      // for what purpose the file is uploaded to the server.
      formData.append("uploadType", "Service Order");
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        formData,
        {
          headers: {
            authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
          },
        }
      );
      if (!data.success)
        return showNotification("error", "An error occurred", data.message);
      return data.data;
    } catch (error) {
      return showNotification("error", "An error occurred", error.message);
    }
  };

  const handleOnSubmit = async () => {
    if (!comments) return message.error("Comments are required!");
    setLoading(true);
    let videoUrl = "";
    let photoUrls = [];

    for (let i = 0; i < photos.length; i++) {
      const element = photos[i];
      photoUrls.push(await uploadFile(element));
    }

    if (!isEmpty(video)) {
      videoUrl = await uploadFile(video);
    }

    executeSubmitForPaymentMutation({
      variables: {
        inputs: {
          serviceOrderId: orderId,
          photos: photoUrls,
          video: videoUrl,
          comments,
        },
      },
    });
    setLoading(false);
  };

  return (
    <Modal
      title="Submit order & request for payment!"
      visible={orderId}
      onCancel={handleCloseModal}
      footer={null}
    >
      <Spin spinning={loading}>
        <label className="label-modal">
          Upload Photo of the completed Task
        </label>
        <div
          tabIndex="0"
          className="upload_img text-center"
          {...getRootProps({ multiple: true })}
        >
          {loading ? (
            <Progress width={80} type="circle" />
          ) : (
            <>
              <input {...getInputProps()} />
              {isEmpty(photos) && (
                <>
                  <i className="far fa-images"></i>
                  <p>Drop files here or Click here to upload (max. 30MB )</p>
                </>
              )}
            </>
          )}

          <div className="markasdone__slider">
            <ul>
              {!isEmpty(photos) &&
                photos.map((img, i) => {
                  return (
                    <li>
                      <div>
                        <div>
                          <img
                            key={i}
                            src={get(img, "preview", img)}
                            alt={img.name}
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
        </div>

        <label className="label-modal">
          Upload Video of the completed task
        </label>
        <div className="video-upload">
          <video controls="" className="video-preview">
            <source id="videoource" type="video/mp4" />
          </video>

          <div className="video-edit">
            <label>
              <i className="fa fa-video">
                <VideoUpload videoFile={video} setVideoFile={setVideo} />
              </i>
            </label>
          </div>
        </div>
        <div>
          <label className="label-modal">Message/Comments *</label>
          <div className="form-group">
            <TextArea
              required
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <Button type="primary" onClick={handleOnSubmit}>
            Submit
          </Button>
        </div>
      </Spin>
    </Modal>
  );
};

export default SubmitOrder;

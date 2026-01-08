import { CloseCircleOutlined, CloudUploadOutlined } from "@ant-design/icons";
import { Button, message, Spin } from "antd";
import axios from "axios";
import React, { useRef, useState } from "react";
import cookie from "react-cookies";
import "./style.scss";

const ImageSection = ({ images, setImages }) => {
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const handleInputFileChange = async (event) => {
    const { files } = event.target;
    if (images.length >= 3 || files.length > 3)
      return message.error("You cannot upload more than 3 images!");

    for (let i = 0; i < files.length; i++) {
      await uploadImage(files[i]);
    }
  };

  const uploadImage = async (file) => {
    try {
      setLoading(true);
      const token = await cookie.load(process.env.REACT_APP_AUTH_TOKEN);
      const frmData = new FormData();
      frmData.append("file", file);
      // for what purpose the file is uploaded to the server.
      frmData.append("uploadType", "Service");
      const { data } = await axios.post(
        `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
        frmData,
        {
          headers: {
            authorization: token,
          },
        }
      );
      if (images.length >= 3)
        return message.error("You cannot upload more than 3 images!");
      setImages([...images, data.data]);
      setLoading(false);
    } catch (error) {
      message.error("Server error, try again later!");
      setLoading(false);
      // console.log(error);
    }
  };

  const handleInputClick = () => {
    if (images.length >= 3)
      return message.error("You cannot upload more than 3 images!");
    fileInputRef.current.click();
  };

  const handleRemoveImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        name="serviceAlbumImage"
        id="serviceAlbumImage"
        type="file"
        hidden
        accept="image/*"
        // multiple
        onChange={handleInputFileChange}
      />

      <Button className="file-upload__container" onClick={handleInputClick}>
        <CloudUploadOutlined />
        Upload Image
      </Button>

      <div id="imageperviews" className="fileDropper">
        <Spin tip="Uploading..." spinning={loading} />
        {images.length === 0 ? (
          <>
            {!loading && (
              <div className="imageChooserText">No image chosen!</div>
            )}
          </>
        ) : (
          images.map((image, index) => (
            <div className="image___container">
              <img className="image" src={image} alt={image} />
              <CloseCircleOutlined
                onClick={() => handleRemoveImage(index)}
                className="close-btn"
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ImageSection;

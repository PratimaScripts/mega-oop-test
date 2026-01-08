import React from "react";
import MimeTypes from "../../../config/MimeTypes";
import "./styles.scss"

const AssetPreview = props => {
  const getFileExtensions = fileName => {
    if (fileName) {
      let extension = fileName.slice(
        ((fileName.lastIndexOf(".") - 1) >>> 0) + 2
      );
      return MimeTypes[extension];
    }
  };
  let assetType = props.file ? getFileExtensions(props.file) : "11";

  return (
    <>
      {assetType.includes("image") ? (
        <img className="type_img" src={props.file} alt={props.file} />
      ) : (
        props.file
      )}
    </>
  );
};

export default AssetPreview;

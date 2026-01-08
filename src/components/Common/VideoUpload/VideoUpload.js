/* eslint-disable array-callback-return */
import showNotification from "config/Notification";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

function VideoUpload(props) {
  const [files, setFiles] = useState([]);
  const [uploadedFile, setuploadedFile] = useState({ preview: "", type: "" });

  // const getBase64 = file => {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = error => reject(error);
  //   });
  // };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "video/*",
    multiple: false,
    onDrop: async acceptedFiles => {
      // if (acceptedFiles[0].size >= process.env.REACT_APP_FILE_SIZE_LIMIT) {
      // message.error("File size can't be larger than 50kb!");
      // } else {
      let pr = acceptedFiles.map(file => {
        Object.assign(file, {
          // preview: b4,
          preview: URL.createObjectURL(file)
        });

        props.setVideoFile(file);
      });

      await Promise.all(pr);
      setuploadedFile(acceptedFiles[0]);
      setFiles(acceptedFiles);

      setTimeout(async () => {
        let video = document.getElementById("taskAddVideoPreview");
        try {
          if (video !== document.pictureInPictureElement) {
            await video.requestPictureInPicture();
          }
        } catch (error) {
          // console.log(`Error! ${error}`);
          showNotification("error", "An error occurred!")
        }
      }, 800);
      // }
    }
  });

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <div {...getRootProps({ className: "dropzone" })}>
      <input id="videoUpload" {...getInputProps()} />

      <video
        id="taskAddVideoPreview"
        // width="320"

        className="video__width"
        height="150"
        src={uploadedFile.preview}
        type={uploadedFile.type}
        controls
      >
        {/* <source src={uploadedFile.preview} type={uploadedFile.type} /> */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoUpload;

/* eslint-disable array-callback-return */
import React, { useEffect, useState } from "react";
import isEmpty from "lodash/isEmpty";
import { useDropzone } from "react-dropzone";
import get from "lodash/get";
import useForceUpdate from "use-force-update";

function Previews(props) {
  let forceUpdate = useForceUpdate();
  const [files, setFiles] = useState([]);
  const [uploadedFile, setuploadedFile] = useState({ preview: "", type: "" });

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
      });

      await Promise.all(pr);
      setuploadedFile(acceptedFiles[0]);
      props.setVideoFile(acceptedFiles[0]);
      setFiles(acceptedFiles);
      // setTimeout(async () => {
      //   let video = document.getElementById("taskAddVideoPreview");
      //   // try {
      //   //   if (video !== document.pictureInPictureElement) {
      //   //     await video.requestPictureInPicture();
      //   //   }
      //   // } catch (error) {
      //   //   console.log(`Error! ${error}`);
      //   // }
      // }, 800);
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
    <>
      <div {...getRootProps({ className: "dropzone" })}>
        <input id="videoUpload" {...getInputProps()} />

        {get(uploadedFile, "type") !== "" && !isEmpty(files) && (
          <video
            id="taskAddVideoPreview"
            width="600"
            className="video__width"
            height="150"
            src={get(uploadedFile, "preview")}
            type={get(uploadedFile, "type")}
            controls
          >
            {/* <source src={uploadedFile.preview} type={uploadedFile.type} /> */}
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      {!isEmpty(files) && (
        <i
          onClick={e => {
            e.stopPropagation();
            setuploadedFile({ preview: "", type: "" });
            props.setVideoFile({});
            setFiles([]);
            forceUpdate();
            // setVideoFile([]);
          }}
          className="fa fa-close close__video"
        ></i>
      )}
    </>
  );
}

export default Previews;

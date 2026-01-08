import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { message } from "antd";

// const thumbsContainer = {
//   display: "flex",
//   flexDirection: "row",
//   flexWrap: "wrap",
//   marginTop: 16
// };

function Previews(props) {
  const [files, setFiles] = useState([]);

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async acceptedFiles => {
      let p = await getBase64(acceptedFiles[0]);
      if (acceptedFiles[0].size >= process.env.REACT_APP_FILE_SIZE_LIMIT) {
        message.error("File size can't be larger than 50kb!");
      } else {
        setFiles(
          acceptedFiles.map(async file => {
            Object.assign(file, {
              preview: p
              // preview: URL.createObjectURL(file)
            });
          })
        );

        let mainField = props.fieldVal;
        props.setFieldValue(
          `${props.setFieldValueData.main}.${props.setFieldValueData.index}.${props.setFieldValueData.fileKey}`,
          mainField[props.setFieldValueData.fileKey].concat(acceptedFiles)
        );
      }
    }
  });

  // const thumbs = files.map(file => (
  //   // <div style={thumb} key={file.name}>
  //   //   <div style={thumbInner}>
  //   //     <p>{file.name}</p>
  //   //     <img alt={file.name} src={file.preview} style={img} />
  //   //   </div>
  //   // </div>
  //   <></>
  // ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <>
      <div {...getRootProps({ className: "dropzone browse__input" })}>
        <input {...getInputProps()} />
      </div>
    </>
  );
}

export default Previews;

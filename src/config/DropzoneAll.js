import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { message } from "antd";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  marginTop: 16
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: "border-box"
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden"
};

// const img = {
//   display: "block",
//   width: "auto",
//   height: "100%"
// };

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

function Previews(props) {
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async acceptedFiles => {
      if (acceptedFiles[0].size >= process.env.REACT_APP_FILE_SIZE_LIMIT) {
        message.error("File size can't be larger than 50kb!");
      } else {
        setFiles(
          acceptedFiles.map(file =>
            Object.assign(file, {
              preview: URL.createObjectURL(file)
            })
          )
        );

        let getB64File = await getBase64(acceptedFiles[0]);

        props.getValue({
          avatar: getB64File,
          filename: acceptedFiles[0].name,
          file: acceptedFiles
        });
      }
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        {/* <p>{file.name}</p> */}
        {/* <img alt={file.name} src={file.preview} style={img} /> */}
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach(file => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="posi__rel">
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
        <div className="overlay_Wrap">
          <div className="overlay">
            <div href="#" className="icon_profile" title="User Profile">
              <i className="fa fa-camera"></i>
            </div>
          </div>
        </div>
      </div>

      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
}

export default Previews;

import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { message } from "antd";

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
    // accept: "image/*",
    multiple: false,
    onDrop: async acceptedFiles => {
      let p = await getBase64(acceptedFiles[0]);
      if (acceptedFiles[0].size >= process.env.REACT_APP_FILE_SIZE_LIMIT) {
        message.error("File size can't be larger than 50kb!");
      } else {
        setFiles(
          acceptedFiles.map(async file => {
            Object.assign(file, {
              preview: file.name.includes("pdf")
                ? "https://res.cloudinary.com/dkxjsdsvg/image/upload/v1579001610/placeholder_application/pdf.png"
                : p
              // preview: URL.createObjectURL(file)
            });
          })
        );

        props.setDocs(props.name, acceptedFiles);
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
      {/* <div {...getRootProps({ className: "dropzone browse__input" })}>
        <input {...getInputProps()} />
      </div> */}
      <div
        {...getRootProps({
          className: "dropzone browse__input add_listing_browser"
        })}
      >
        Select file...
        <input disabled={props.disabled} {...getInputProps()} />
      </div>

      {/* <aside style={thumbsContainer}>{thumbs}</aside> */}
    </>
  );
}

export default Previews;

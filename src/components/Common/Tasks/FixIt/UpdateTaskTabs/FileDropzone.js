import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { message } from "antd";
import useForceUpdate from "use-force-update";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

function Previews(props) {
  const forceUpdate = useForceUpdate();

  const [files, setFiles] = useState([]);

  const getBase64 = file => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = index => {
    let photos = files;
    photos.splice(index, 1);
    props.setImageFiles(photos);
    setFiles(photos);

    forceUpdate();
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: async acceptedFiles => {
      let b4 = await getBase64(acceptedFiles[0]);
      if (acceptedFiles[0].size >= process.env.REACT_APP_FILE_SIZE_LIMIT) {
        message.error("File size can't be larger than 50kb!");
      } else {
        // eslint-disable-next-line array-callback-return
        let pr = acceptedFiles.map(file => {
          Object.assign(file, {
            preview: b4
          });
        });

        await Promise.all(pr);

        let images = props.images;

        images.push(acceptedFiles[0]);
        props.setImageFiles(images);
        // setFiles(acceptedFiles);
      }
    }
  });

  useEffect(() => {
    setFiles(get(props, "images"));
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files, props]);

  return (
    <>
      {!isEmpty(files) ? (
        <>
          <div
            {...getRootProps({ className: "dropzone" })}
            className="slider_upload_img dropzone__task"
          >
            <input {...getInputProps()} />
            <ul>
              {files.map((file, i) => {
                return (
                  <li key={i}>
                    <div>
                      {/* <input id={i} {...getInputProps()} /> */}

                      <div>
                        <img
                          src={get(file, "image", get(file, "preview"))}
                          alt=""
                        />
                        <i
                          onClick={e => {
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
        </>
      ) : (
        <div className="col-md-12">
          <section className="container">
            <div {...getRootProps({ className: "dropzone" })}>
              <input {...getInputProps()} />

              <div className="dropzone__task">
                Upload / Drop Images <br />
                <i className="far fa-images"></i>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default Previews;

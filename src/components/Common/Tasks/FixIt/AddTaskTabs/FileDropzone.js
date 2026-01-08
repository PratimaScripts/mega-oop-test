import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { message } from "antd";
import useForceUpdate from "use-force-update";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import "./style.scss";

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
      if (acceptedFiles[0].size >= process.env.REACT_APP_FILE_SIZE_LIMIT) {
        message.error("File size can't be larger than 50kb!");
      } else {
        // eslint-disable-next-line array-callback-return
        let pr = acceptedFiles.map(async file => {
          Object.assign(file, {
            preview: await getBase64(file)
          });
        });

        await Promise.all(pr);

        let images = props.images;

        images.push(...acceptedFiles);
        props.setImageFiles(images);
        forceUpdate();
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
            className="slider_upload_img display_add_more dropzone__task"
          >
            <input {...getInputProps()} />
            <ul>
              {files.map((file, i) => {
                return (
                  <li>
                    <div>
                      {/* <input id={i} {...getInputProps()} /> */}

                      <div>
                        <img src={file.preview} alt="" />
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
            <div className="add_more_wrap">
                    <div>
                      {/* <input id={i} {...getInputProps()} /> */}

                      <div>
                      Upload / Drop Images <br />
                      <i className="far fa-images add_more"></i>
                      </div>
                    </div>
                  </div>
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

      {/* <div className="col-md-3">
        <section className="container">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />

            <div className="upload__image_preview">
              <img
                src={`https://images.unsplash.com/photo-1581252165015-9b5151a6930e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=330&q=80`}
                alt=""
              />
              <i className="fas fa-times-circle"></i>
            </div>
          </div>
        </section>
      </div>

      <div className="col-md-3">
        <section className="container">
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />

            <div className="upload__image_preview">
              <img
                src={`https://images.unsplash.com/photo-1581252165015-9b5151a6930e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=330&q=80`}
                alt=""
              />
              <i className="fas fa-times-circle"></i>
            </div>
          </div>
        </section>
      </div> */}
    </>
  );
}

export default Previews;

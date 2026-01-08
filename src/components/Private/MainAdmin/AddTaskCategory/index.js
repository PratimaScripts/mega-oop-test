import React, { useState } from "react";
import AddForm from "./AddForm";
import axios from "axios";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import cookie from "react-cookies";
import { Skeleton } from "antd"

import { useMutation, useQuery } from "react-apollo";
import AdminQueries from "config/queries/admin";
import showNotification from "config/Notification";

const AddCategory = (props) => {
  const [taskCategories, setCategoryData] = useState([{ name: "", subCategory: [], docRaw: [], avatar: "" }]);
  const [loading, setLoading] = useState(true)


  useQuery(AdminQueries.getTaskCategories, {
    onCompleted: ({ getTaskCategories }) => {
      if (getTaskCategories.success) {
        // const taskCategories = getTaskCategories.data;
        // const updateAr = taskCategories.map((doc, i) => {
        //   doc["docRaw"] = [];
        // });

        // await Promise.all(updateAr);
        setCategoryData({ taskCategories: getTaskCategories.data })
        // console.log(getTaskCategories.data)
      }
      setLoading(false)
    }
  })



  const [addTaskCategories] = useMutation(AdminQueries.createTaskCategory, {
    onCompleted: ({ updateTaskCategories }) => {
      if (updateTaskCategories.success) {
        showNotification("success", "Accreditation Updated!", "");
        setCategoryData({ taskCategories: updateTaskCategories.data })
      } else {
        showNotification(
          "error",
          "An error occured",
          updateTaskCategories.message
        );
      }
      setLoading(false)
    }
  })

  const submitForm = async data => {
    let finalDocAr = [];
    let uploadFiles = data["taskCategories"].map(async (file, i) => {
      if (file.docRaw && !isEmpty(file.docRaw)) {
        let toUpload = file.docRaw[file.docRaw.length - 1];
        // let getB64File = await this.getBase64(toUpload);

        var formData = new FormData();
        formData.append("file", toUpload);
        formData.append("filename", toUpload.name);
        // for what purpose the file is uploaded to the server.
			formData.append("uploadType", "Task Category");

        let uploadedFile = await axios.post(
          `${process.env.REACT_APP_SERVER}/api/v1/file-upload`,
          formData,
          {
            headers: {
              authorization: await cookie.load(process.env.REACT_APP_AUTH_TOKEN),
            }
          }
        );
        if (!uploadedFile.data.success)
          return showNotification(
            "error",
            "An error occurred",
            uploadedFile.data.message
          );

        if (get(uploadedFile, "data.success")) {
          let documentUrl = get(uploadedFile, "data.data");
          delete file["docRaw"];
          file["avatar"] = documentUrl;

          finalDocAr.push(file);
        } else {
          if (file.avatar) {
            delete file["docRaw"];
            finalDocAr.push(file);
          }
        }
      } else {
        if (file.avatar) {
          delete file["docRaw"];
          finalDocAr.push(file);
        }
      }
    });

    await Promise.all(uploadFiles);
    // setLoading(true)
    addTaskCategories({ variables: { taskCategories: finalDocAr } });
  };
  return (
    loading ? <Skeleton active /> : <> <p>
      Add category!{" "}</p>
      <AddForm submitForm={submitForm} taskCategories={taskCategories} />
    </>
  );
};

export default AddCategory;

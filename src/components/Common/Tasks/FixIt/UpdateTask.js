/* eslint-disable array-callback-return */
import React, { useState, useRef, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { withRouter } from "react-router-dom";
import Location from "./UpdateTaskTabs/Location";
import CategorySelection from "./UpdateTaskTabs/CategorySelection";
import TaskAdditionalDetails from "./UpdateTaskTabs/TaskAdditionalDetails";
import UploadTaskDocuments from "./UpdateTaskTabs/UploadTaskDocuments";
import { useQuery } from "@apollo/react-hooks";
import AdminQueries from "../../../../config/queries/admin";
import TaskQueries from "../../../../config/queries/tasks";
import showNotification from "../../../../config/Notification";
import { useMutation } from "@apollo/react-hooks";
import get from "lodash/get";
import { UserDataContext } from "store/contexts/UserContext"
import "./styles.scss";

const TaskDash = props => {
  let locationBtnRef = useRef();
  let categoryBtnRef = useRef();
  let taskDetailBtnRef = useRef();
  let attachmentBtnRef = useRef();
  const { state: userState } = useContext(UserDataContext)
  const { userData } = userState

  let userRole = userData.role;
  const taskCategories = useQuery(AdminQueries.getTaskCategories);
  const [isAddingTask, setTaskAddStatus] = useState(false);
  const [taskData, setTaskData] = useState(get(props, "location.state", {}));

  // console.log("INIIIITALALALALALA", taskData);

  const [tabIndex, setTabIndex] = useState(0);
  const setActiveClass = i => {
    setTabIndex(i);
    // let tabsAll = document.querySelectorAll(`.react-tabs__tab-list li`);
    // Array.from({ length: i }).map((tab, index) => {
    //   tabsAll[index].classList.add("react-tabs__tab--selected");
    // });
  };

  // useEffect(() => {
  // }, [props]);

  const [updateTask, { data, loading, called }] = useMutation(
    TaskQueries.updateTask
  );

  if (isAddingTask) {
    if (!loading && called) {
      if (get(data, "updateTask.success")) {
        showNotification(
          "success",
          "Task has been Updated!",
          "Task was updated successfully"
        );

        // props.contextData.endLoading();
        props.history.push(
          `/${userRole}/fixit`,
          get(data, "updateTask.data", [])
        );
        setTaskAddStatus(false);
      }
      if (!get(data, "updateTask.success")) {
        showNotification(
          "error",
          "An error occured",
          get(data, "updateTask.message")
        );
        // props.contextData.endLoading();
        setTaskAddStatus(false);
      }
    }
  }
  const updateTaskFull = async (uploadedImages, videoUrl, type) => {
    // props.contextData.startLoading();
    let finalObj = {
      ...taskData,
      images: uploadedImages,
      videoUrl,
      status: type
    };

    delete finalObj["property"];
    delete finalObj["createdAt"];
    delete finalObj["postedBy"];
    delete finalObj["identity"];
    delete finalObj["offers"];

    delete finalObj["photos"];
    delete finalObj["videos"];
    delete finalObj["comment"];
    delete finalObj["selected"];
    setTaskAddStatus(true);
    delete finalObj["_id"];
    delete finalObj["taskId"];

    updateTask({ variables: { taskId: taskData.taskId, task: finalObj } });
  };

  return (
    <>
      <div className="addTask--wrapper">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-10">
              <Tabs selectedIndex={tabIndex}>
                <TabList>
                  <Tab onClick={() => setActiveClass(0)}>Location</Tab>
                  <Tab onClick={() => setActiveClass(1)}>Category</Tab>
                  <Tab onClick={() => setActiveClass(2)}>Task Detail</Tab>
                  <Tab onClick={() => setActiveClass(3)}>Attachment</Tab>
                </TabList>
                <TabPanel>
                  <Location
                    locationData={taskData}
                    setLocationData={data => {
                      // console.log("LOCATION DATATATAT", data);
                      setTaskData(data);
                    }}
                    setActiveClass={setActiveClass}
                    locationBtnRef={locationBtnRef}
                    {...props}
                  />
                </TabPanel>
                <TabPanel>
                  <CategorySelection
                    categoryData={taskData}
                    setCategoryData={data => {
                      // console.log("CATEGORY DATATATA", data);
                      setTaskData(data);
                    }}
                    setActiveClass={setActiveClass}
                    categoryBtnRef={categoryBtnRef}
                    categories={taskCategories["data"]}
                    {...props}
                  />
                </TabPanel>
                <TabPanel>
                  <TaskAdditionalDetails
                    taskAdditionalData={taskData}
                    setAdditionalData={data => {
                      // console.log("TASK ADDITIONAL DATATATATA", data);
                      setTaskData(data);
                    }}
                    setActiveClass={setActiveClass}
                    taskDetailBtnRef={taskDetailBtnRef}
                    {...props}
                  />
                </TabPanel>
                <TabPanel>
                  <UploadTaskDocuments
                    uploadedTaskDocs={taskData}
                    setTaskDocs={data => {
                      // console.log("TASSSSSSSSSSK DOCSSS", data);
                      setTaskData(data);
                    }}
                    setActiveClass={setActiveClass}
                    updateTaskFull={updateTaskFull}
                    attachmentBtnRef={attachmentBtnRef}
                    {...props}
                  />
                </TabPanel>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(TaskDash);

/* eslint-disable array-callback-return */
import React, { useState, useContext } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import Location from "./AddTaskTabs/Location";
import CategorySelection from "./AddTaskTabs/CategorySelection";
import TaskAdditionalDetails from "./AddTaskTabs/TaskAdditionalDetails";
import UploadTaskDocuments from "./AddTaskTabs/UploadTaskDocuments";
import { useQuery } from "@apollo/react-hooks";
import AdminQueries from "../../../../config/queries/admin";
import TaskQueries from "../../../../config/queries/tasks";
import showNotification from "../../../../config/Notification";
import { useMutation } from "@apollo/react-hooks";
import { useHistory, withRouter } from "react-router-dom";
import get from "lodash/get";
import { UserDataContext } from "store/contexts/UserContext"

import "./styles.scss";
//Initial commit

const AddTask = props => {
	const history = useHistory()
	const [isEnabled, setEnabled] = useState(false);
	const { state: userState } = useContext(UserDataContext)
	const { userData } = userState
	const userRole = userData.role;

	const taskCategories = useQuery(AdminQueries.getTaskCategories);

	// eslint-disable-next-line no-unused-vars
	const [locationData, setLocationData] = useState({});
	const [categoryData, setCategoryData] = useState({});
	const [taskAdditionalData, setAdditionalData] = useState({});
	const [tabIndex, setTabIndex] = useState(0);
	const setActiveClass = (i) => {
		if (i === 3) {
			setEnabled(true);
		}
		setTabIndex(i);

		// let tabsAll = document.querySelectorAll(`.react-tabs__tab-list li`);
		// Array.from({ length: i }).map((tab, index) => {
		//   tabsAll[index].classList.add("react-tabs__tab--selected");
		// });
	};

	// useEffect(() => {
	// }, [props]);

	const [addTask] = useMutation(TaskQueries.createTask, {
		onCompleted: (data) => {
			history.push(`/${userRole}/fixit`);
			if (get(data, "createTask.success")) {
				showNotification(
					"success",
					"Task has been added!",
					"Task was added successfully"
				);
			}
			else {
				showNotification(
					"error",
					"An error occured",
					get(data, "createTask.message")
				);
			}
			
		},
	});

	const addTaskFull =  (uploadedImages, videoUrl, type) => {
		let finalObj = {
			...locationData,
			...categoryData,
			status: type,
			...taskAdditionalData,
			images: uploadedImages,
			videoUrl,
		};

		delete finalObj["selected"];
		
		addTask({ variables: { task: finalObj } });
	};

	const [tData, setTdata] = useState("no");

	const handletaskAdditionalData = (childTdata) => {
		setTdata(childTdata);
	};

	return (
		<>
			<div className='addTask--wrapper'>
				<div className='container-fluid'>
					<div className='row'>
						<div className='col-md-10'>
							<Tabs selectedIndex={tabIndex}>
								<TabList>
									<Tab onClick={() => (isEnabled || tabIndex > 0) && setActiveClass(0)}>
										Location
									</Tab>
									<Tab onClick={() => (isEnabled || tabIndex > 1) && setActiveClass(1)}>
										Category
									</Tab>
									<Tab onClick={() => (isEnabled || tabIndex > 2) && setActiveClass(2)}>
										Task Detail
									</Tab>
									<Tab
										onClick={
											() => setActiveClass(3)
											// (isEnabled || tabIndex > 3) && setActiveClass(3)
										}
									>
										Attachment
									</Tab>
								</TabList>
								<TabPanel>
									<Location
										locationData={locationData}
										setLocationData={setLocationData}
										setActiveClass={setActiveClass}
										// {...props}
									/>
								</TabPanel>
								<TabPanel>
									<CategorySelection
										categoryData={categoryData}
										setCategoryData={setCategoryData}
										setActiveClass={setActiveClass}
										categories={taskCategories["data"]}
										// {...props}
									/>
								</TabPanel>
								<TabPanel>
									<TaskAdditionalDetails
										taskAdditionalData={taskAdditionalData}
										setAdditionalData={setAdditionalData}
										setActiveClass={setActiveClass}
										addTaskCallBack={handletaskAdditionalData}
										// {...props}
									/>
								</TabPanel>
								<TabPanel>
									<UploadTaskDocuments
										addTaskFull={addTaskFull}
										renterChoseL={tData}
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

export default withRouter(AddTask);

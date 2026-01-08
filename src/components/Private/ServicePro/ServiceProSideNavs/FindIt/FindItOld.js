import React, { useState, useEffect, useContext } from "react";
import { Formik, Form, Field } from "formik";
import {
	Drawer,
	Spin,
	Modal,
	message,
	Dropdown,
	Select,
	Menu,
	Slider,
	Button,
	DatePicker,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import TaskDetails from "./TaskDetails";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import LocationMap from "../../../Landlord/LandlordSideNavs/Properties/Maps";
import moment from "moment";
import { useQuery, useMutation } from "@apollo/react-hooks";
import TaskQueries from "../../../../../config/queries/tasks";
import AdminQueries from "../../../../../config/queries/admin";
import "./style.scss";
import useForceUpdate from "use-force-update";
import axios from "axios";
//import Categories from "./category.js";
import { Link } from "react-router-dom";
import showNotification from "config/Notification";
import { UserDataContext } from "store/contexts/UserContext";


const { Option } = Select;

const FindIt = (props) => {
	const BACKEND_SERVER = process.env.REACT_APP_SERVER;
	const { state } = useContext(UserDataContext);


	let adminRates = get(props, "contextData.adminRates");

	let isRole = window.location.href.includes("servicepro") ? true : false;
	const forceUpdate = useForceUpdate();
	const [viewPropertyLocationMap, togglePropertyLocationView] = useState(false);
	const [currentTaskToViewOnMap, selectTaskToViewInMap] = useState({});
	const [isLeaveReviewModalVisible, setLeaveReviewModal] = useState(false);
	const [isSavingReview, setReviewSaving] = useState(false);
	const [visible, setVisible] = useState(false);
	const [taskOfferValue, setTaskOfferValue] = useState(0);
	const [offerModalLoader, toggleOfferModalLoader] = useState(false);
	const [subCategories, setSubCategories] = useState([]);
	const [viewTaskDetails, toggleTaskDetails] = useState(false);
	const [isMakeOfferModalVisible, toggleMakeOfferModal] = useState(false);
	const [selectedTask, setSelectedTask] = useState({});
	const [filter, setFilter] = useState({});
	const [timeAvailability, setTimeAvailability] = useState(undefined);
	const [dayAvailability, setDayAvailability] = useState(undefined);
	const [category, setCategory] = useState(undefined);
	const [postedDate, setPostedDate] = useState(undefined);
	const [subCategory, setSubCategory] = useState(undefined);
	const [isUpdateOfferVisible, toggleUpdateOfferModal] = useState(false);

	const { loading, data } = useQuery(TaskQueries.fetchTasksList, {
		onCompleted: (tasks) => setTaskLists(get(tasks, "fetchTasksList.data")),
	});

	const accountSetting = state.accountSettings
  	const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat") + " hh:mm a"
    : `${process.env.REACT_APP_DATE_FORMAT} hh:mm a`;

	const [setTaskOffer] = useMutation(TaskQueries.makeTaskOffer, {
		onCompleted: (data) => {
			setTaskOfferValue(0);

			toggleOfferModalLoader(false);
			message.success("Your Offer has been sent successfully!");
			setTaskLists(get(data, "makeTaskOffer.data", []));
			toggleMakeOfferModal(false);
		},
	});

	const [createConversation] = useMutation(TaskQueries.createConversation, {
		onCompleted: (data) => {
			if (get(data, "createConversation.success", false)) {
				message.success("Your message has been sent successfully!");

				setLeaveReviewModal(false);
			}
		},
	});

	const [taskLists, setTaskLists] = useState(
		get(data, "fetchTasksList.data", [])
	);

	const taskCategories = useQuery(AdminQueries.getTaskCategories);

	const [updateTaskOffer] = useMutation(TaskQueries.updateTaskOffer, {
		onCompleted: (updatedTasks) => {
			setTaskOfferValue("");
			toggleOfferModalLoader(false);
			setTaskLists(get(updatedTasks, "updateTaskOffer.data", []));
			toggleUpdateOfferModal(false);
		},
	});

	const selectCurrentTask = (task, type) => {
		setSelectedTask(task);
		(type === "offer" && toggleMakeOfferModal(true)) ||
			(type === "update" && toggleUpdateOfferModal(true)) ||
			(type === "detail" && toggleTaskDetails(true));

		forceUpdate();
	};

	let calculatedServiceFee =
		(get(adminRates, "serviceCharge", 10) * Number(taskOfferValue)) / 100;

	let calculatedVat = (get(adminRates, "vat", 20) * calculatedServiceFee) / 100;

	let TaskListing =
		!isEmpty(taskLists) &&
		taskLists.map((task, i) => {
			let offerExists = false;
			!isEmpty(task.offers)
				? get(task, "offers").map((ofr, i) => {
						if (ofr.user) {
							if (
								get(props, "contextData.userData.authentication.data._id", "") ===
								ofr.user._id
							) {
								offerExists = true;
								task.myOffer = ofr;
							}
						}
				  })
				: (offerExists = false);

			return (
				<>
					<div className='col-md-6'>
						<div className='wrapper'>
							<div className='sub_wrap'>
								<p className='heading'>
									{get(task, "title", "No title").length > 50
										? get(task, "title", "No title").slice(0, 50) + "..."
										: get(task, "title", "No title")}
								</p>
								<p className='cost_content'>
									<i className='fas fa-coins'></i>£ {get(task, "budgetAmount")}
								</p>
							</div>
							<div className='sub_wrap'>
								<p className='task_category'>
									{" "}
									{get(task, "category")} {">"} {get(task, "subCategory")}
								</p>
								<p className='address'>
									<i className='fa fa-map-marker'></i>
									{get(task, "property.address.City", "")},{" "}
									{get(task, "property.address.zip", "").split(" ")[0]}{" "}
									<small
										onClick={() => {
											selectTaskToViewInMap(task);
											togglePropertyLocationView(true);
										}}
									>
										view in map
									</small>
								</p>
							</div>
							<div className='sub_wrap'>
								<p className='date_info'>
									Posted on<i className='fa fa-calendar-alt'></i>
									{moment(get(task, "createdAt", new Date())).format(dateFormat)}
								</p>
								<p className='days_info'>
									{" "}
									{get(task, "dayAvailability", "")} -{" "}
									{get(task, "timeAvailability", "  ").split(" ")[0]}
								</p>
							</div>
							<div className='sub_wrap'>
								<button className='btn_open'> {get(task, "status", "")}</button>
								<div>
									<img
										onClick={() => {
											setSelectedTask(task);
											setLeaveReviewModal(true);
										}}
										src='https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.webp'
										alt='send message'
									/>
									<img
										src='https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png'
										alt='add to favourite'
									/>
								</div>
							</div>
							<div className='sub_wrap'>
								<div className='user_wrap'>
									<img
										className='user_img'
										src={get(
											task,
											"postedBy.avatar",
											"https://res.cloudinary.com/dkxjsdsvg/image/upload/v1578926398/images/prof-2.jpg"
										)}
										alt=''
									/>
									<p className='user_name'>
										Posted By <br />
										<span>
											{" "}
											{get(task, "postedBy.firstName")} {get(task, "postedBy.lastName")}
										</span>
									</p>
								</div>
								<div className='info_user'>
									<button className='btn_verified'>
										Verified <i className='fa fa-check'></i>
									</button>
									<p className='ratings'>
										{" "}
										<i className='fa fa-star'></i> 4.5
									</p>
									<p className='followers'>(1k+)</p>
								</div>
							</div>
							<div className='details__wrap'>
								<button
									onClick={() => selectCurrentTask(task, "detail")}
									className='btn btn-primary'
								>
									Task Detail
								</button>
								{offerExists ? (
									<button
										onClick={() => selectCurrentTask(task, "update")}
										className='btn btn-outline-warning'
									>
										Update Offer
									</button>
								) : (
									<button
										onClick={() => selectCurrentTask(task, "offer")}
										className='btn btn-outline-warning'
									>
										Make an Offer
									</button>
								)}
							</div>
						</div>
					</div>
				</>
			);
		});

	const menu = (
		<Menu className='filterMenu'>
			<div className='filter_dropdown'>
				<ul>
					<li className='p-1'>
						<label className='labels__global'>Day Availability</label>
						<Select
							placeholder='Day Availability'
							dropdownMatchSelectWidth={false}
							className='input__globe'
							value={dayAvailability}
							onChange={(e) => setDayAvailability(e)}
						>
							<Option value='Weekdays'>Weekdays</Option>
							<Option value='Weekend'>Weekend</Option>
							<Option value='All Day'>All Day</Option>
						</Select>
					</li>
					<li className='p-1'>
						<label className='labels__global'>Time Availability</label>
						<Select
							placeholder='Day Availability'
							dropdownMatchSelectWidth={false}
							className='input__globe'
							value={timeAvailability}
							onChange={(e) => setTimeAvailability(e)}
						>
							<Option value='Morning'>Weekdays</Option>
							<Option value='Afternoon'>Weekend</Option>
							<Option value='Evening'>Evening</Option>
							<Option value='Evening'>Anytime</Option>
						</Select>
					</li>
					<li className='p-1'>
						<label className='labels__global'>Category</label>

						<Select
							placeholder='Category'
							dropdownMatchSelectWidth={false}
							className='input__globe'
							value={category}
							onChange={(e) => {
								setCategory(e);

								let subCategories = taskCategories.data.getTaskCategories.data.filter(
									(value) => {
										return value.name === e;
									}
								);
								setSubCategories(subCategories);
								setSubCategory(undefined);
							}}
						>
							{!taskCategories.loading
								? taskCategories.data.getTaskCategories.data.map((item) => {
										return (
											<Option key={item.name} value={item.name}>
												{item.name}
											</Option>
										);
								  })
								: null}
						</Select>
					</li>
					<li className='p-1'>
						<label className='labels__global'>Sub Category</label>

						<Select
							name='subCategory'
							placeholder='Sub Category'
							dropdownMatchSelectWidth={false}
							className='input__globe'
							value={subCategory}
							onChange={(e) => setSubCategory(e)}
						>
							{subCategories.map((item) => {
								return item.subCategory.map((subCat) => {
									return (
										<Option key={subCat} value={subCat}>
											{subCat}
										</Option>
									);
								});
							})}
						</Select>
					</li>
					<li className='p-1'>
						<label className='labels__global'>Posted Date </label>
						<br />
						<DatePicker
							onChange={(date, dateString) => setPostedDate(dateString)}
							picker='postedDate'
						/>
					</li>
				</ul>
				<div className='text-center p-2'>
					<button
						type='button'
						onClick={() => {
							setFilter({ timeAvailability, dayAvailability, category, subCategory });
							setVisible(false);
						}}
						className='btn btn-warning'
					>
						Apply
					</button>
					<button
						type='button'
						onClick={() => {
							setFilter({});
							setTimeAvailability(undefined);
							setDayAvailability(undefined);
							setCategory(undefined);
							setSubCategory(undefined);
							setPostedDate(null);
							setVisible(false);
						}}
						className='btn btn-default'
					>
						Clear
					</button>
				</div>
			</div>
		</Menu>
	);

	const [payType, setPayType] = useState(false);
	const [completeConnectAcc, setCompleteConnectAcc] = useState(false);

	let spId = get(props, "contextData.userData.authentication.data._id");

	const getPayType = async () => {
		await axios({
			method: "POST",
			url: `${BACKEND_SERVER}/api/wise/paytype`,
			data: {
				id: spId,
				role: "servicepro",
			},
		})
			.then(function (response) {
				// console.log("use details", response.data.details.stripeConnectAccId);
				if (response.data.details.paymentType === "bank") {
					setPayType(true);
				}
				if (response.data.details.paymentType === "stripe") {
					getStripeAccData(response.data.details.stripeConnectAccId);
				}
			})
			.catch(function (error) {
				// console.log(error);
				showNotification("error", "An error occurred!")
			});
	};

	const getStripeAccData = async (id) => {
		await axios({
			method: "POST",
			url: `${BACKEND_SERVER}/api/stripe/get-connected-account-details`,
			data: {
				accId: id,
			},
		})
			.then((res) => {
				// console.log(res.data.accDetails.requirements.disabled_reason);
				if (res.data.accDetails.requirements.disabled_reason !== null) {
					setCompleteConnectAcc(false);
				}

				if (res.data.accDetails.requirements.disabled_reason === null) {
					setPayType(true);
					setCompleteConnectAcc(true);
				}
			})

			.catch((err) => {
				// console.log(err);
				showNotification("error", "An error occurred!")
			});
	};

	useEffect(() => {
		// const payTypeFunc = async  () => {
		//   await axios({
		//     method: "POST",
		//     url: "http://localhost:4003/api/wise/paytype",
		//     data: {
		//       id: spId,
		//     },
		//   })
		//     .then(function (response) {
		//       console.log(
		//         "use details",
		//         response.data.details.transferwise.accountId
		//       );
		//       if (response.data.details.transferwise.accountId !== "" || ) {
		//         setPayType(true);
		//       }
		//     })
		//     .catch(function (error) {
		//       console.log(error);
		//     });
		// };

		getPayType();
	}, []);

	// const selectedMakeOffer = (task) => {
	//   if (payType) {
	//       selectCurrentTask(task, "offer");
	//   }

	// };

	const [isModalVisible, setIsModalVisible] = useState(false);

	const handleOk = () => {
		setIsModalVisible(false);
	};

	const handleCancel = () => {
		// setIsModalVisible(false);
		toggleMakeOfferModal(false);
	};

	return (
		<>
			<div className='list_grid__view--wrapper'>
				<div className='container'>
					<div className='sub_header'>
						<h4>
							Searched result for{" "}
							<span className='searched_for'>{get(props, "searchQuery", "All")}</span>{" "}
							<span className='searched_quantity'>
								(found {taskLists.length} tasks)
							</span>
						</h4>
						<div className='btn__wrapper'>
							<div className='btn save_wishlist mr-2'>
								<i className='fa fa-heart' aria-hidden='true'></i> Save Wishlist
							</div>
						</div>
					</div>

					<Formik
						enableReinitialize
						initialValues={{}}
						onSubmit={(values, { setSubmitting }) => {
							props.setFilterObj(values);
							props.fetchSearchedTasks({
								variables: {
									search: get(props, "searchQuery"),
									filter: values,
								},
							});
						}}
					>
						{({ isSubmitting, errors, setFieldValue, values }) => (
							<Form>
								<div className='setting__results'>
									<ul>
										<li>
											<div className='form-group location_width'>
												<label htmlFor=''>Location</label>
												<Field
													name='location'
													type='text'
													className='form-control input__global'
													placeholder='e.g. Bristol SW6'
												/>
											</div>
										</li>
										<li>
											<div className='form-group type_width'>
												<label htmlFor=''>Task Type</label>

												<Select
													defaultValue={get(values, "taskType")}
													placeholder='Please Select Type'
													dropdownMatchSelectWidth={false}
													className='input__globe'
													value={get(values, "taskType")}
													onChange={(e) => setFieldValue("taskType", e)}
												>
													<Option value='Update Offer'>Update Offer</Option>
													<Option value='Make an Offer'>Make an Offer</Option>

													{/* <Option value="Yiminghe">yiminghe</Option> */}
												</Select>
											</div>
										</li>
										<li>
											<div className='form-group mileage_width'>
												<label htmlFor=''>Task Budget (approx)</label>

												<Slider
													onChange={(e) => {
														setFieldValue("rentRang.min", e[0]);
														setFieldValue("rentRang.max", e[1]);
													}}
													marks={[
														get(props, "ranges.monthlyRentMin"),
														get(props, "ranges.monthlyRentMax"),
													]}
													values={[
														get(props, "ranges.monthlyRentMin"),
														get(props, "ranges.monthlyRentMax"),
													]}
													min={get(props, "ranges.monthlyRentMin")}
													max={get(props, "ranges.monthlyRentMax")}
													range
													defaultValue={[get(props, "ranges.monthlyRentMin"), 10]}
												/>
											</div>
										</li>

										<li>
											<div className='form-group type_width'>
												<label htmlFor=''>Task Status</label>
												<Select
													defaultValue={isRole ? "open" : null}
													placeholder='Please Select Status'
													className='input__globe'
													disabled={isRole}
													onChange={(e) => setFieldValue("taskStatus", e)}
												>
													<Option value='open'>Open</Option>
												</Select>
											</div>
										</li>

										<li>
											<div className='form-group type_width dropdown-filter'>
												<label htmlFor=''>Filter</label>
												<br />
												<Dropdown
													overlay={menu}
													overlayClassName='dropdown-overlay'
													visible={visible}
													handleVisibleChange={(flag) => setVisible(flag)}
													placement='bottomCenter'
													arrow
												>
													<Button
														class='btnFilter'
														onClick={() => setVisible(true)}
														placeholder='Filter'
													>
														Filter
														<DownOutlined className='pull-right outline-icon' />
													</Button>
												</Dropdown>
											</div>
											<div className='form-group filter_width'>
												{/* <Dropdown
                          overlayClassName="parentClassDropdown"
                          onVisibleChange={handleVisibleChange}
                          visible={visible}
                          overlay={menu}
                          trigger={["click"]}
                        >
                          <p className="dropdown_field">
                            Any <DownOutlined />
                          </p>
                        </Dropdown> */}
											</div>
										</li>
									</ul>
									<div className='btn_wrap_submit'>
										<button type='submit' className='btn btn-primary'>
											Search
										</button>
									</div>
								</div>
							</Form>
						)}
					</Formik>
				</div>
			</div>
			<Spin spinning={loading} size='large' tip='Fetching tasks...'>
				<div>
					<div className='row'>
						<div className='searchtask-grid'>
							<div className='searchtask__wrapper'>
								<div className='container'>
									<div className='row'>
										<div className='main_wrap'>
											<div className='public_search_task'>
												<div className='container'>
													<div className='row'>{TaskListing}</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<Drawer
					title='Quick Viewer'
					placement='right'
					closable={false}
					className='width_drawer_findit'
					onClose={() => toggleTaskDetails(false)}
					visible={viewTaskDetails}
				>
					<TaskDetails
						{...props}
						selectedTask={selectedTask}
						toggleUpdateOfferModal={() => {
							toggleTaskDetails(false);
							toggleUpdateOfferModal(true);
						}}
						makeOffer={(task) => selectCurrentTask(task, "offer")}
					/>
				</Drawer>

				{payType ? (
					<Modal
						title='Make an Offer'
						className='modal-offer-form'
						visible={isMakeOfferModalVisible}
						footer={null}
						maskClosable={false}
						closable={!offerModalLoader}
						destroyOnClose
						onCancel={() => {
							setTaskOfferValue("");
							toggleMakeOfferModal(false);
						}}
						width={700}
					>
						<Spin spinning={offerModalLoader} size='large' tip='Fetching tasks...'>
							<form
								id='makeOfferForm'
								onSubmit={(e) => {
									e.preventDefault();
									toggleOfferModalLoader(true);
									let bidAmount = Number(taskOfferValue).toFixed(2);
									setTaskOfferValue("");
									setTaskOffer({
										variables: {
											taskId: selectedTask._id,
											amount: Number(bidAmount),
											description: e.target[1].value,
										},
									});
								}}
							>
								<div className='text-center'>
									<h3>Your Offer</h3>
									<div className='form-group'>
										<div className='date__flex--makeorder'>
											<div className='input-group-prepend'>
												<div className='input-group-text'>
													<i className='mdi mdi-currency-gbp' />
												</div>
											</div>
											<input
												type='number'
												value={taskOfferValue}
												placeholder='35.00'
												min={1}
												onChange={(e) => setTaskOfferValue(e.target.value)}
												required
												className='form-control select----global'
											/>
										</div>
									</div>
								</div>
								<div>
									<table class='table table-hover table-borderless'>
										<tbody>
											<tr>
												<td>Service Fee</td>
												<td>
													- <i className='mdi mdi-currency-gbp' /> {calculatedServiceFee}
												</td>
											</tr>
											<tr>
												<td>VAT</td>
												<td>
													- <i className='mdi mdi-currency-gbp' /> {calculatedVat}
												</td>
											</tr>
											<tr className='recieved_amount'>
												<td>You will recieve</td>
												<td>
													<i className='mdi mdi-currency-gbp' />{" "}
													{(
														Number(taskOfferValue) -
														calculatedServiceFee -
														calculatedVat
													).toFixed(2) < 0
														? 0
														: (
																Number(taskOfferValue) -
																calculatedServiceFee -
																calculatedVat
														  ).toFixed(2)}
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div>
									<p className='bestforjob'>
										Why are you the best person for this task ?
										{completeConnectAcc ? "complete" : "incomplete"}
									</p>
									<p>
										For your safety, please do not share personal infomation, example-
										email, phone or address.
									</p>
									<div className='form-group'>
										<textarea
											className='form-control textarea'
											placeholder="I'll be great for this task. I have the necessary experience, skills and equipment required to get this task done."
											name='description'
											spellcheck='false'
										></textarea>
										<p className='character_remain'>1500 Characters remaining</p>
									</div>
								</div>
								<div>
									<a href> Find out how your service fee is calculated </a>
									<p>As soon as offer is accepted, contact details will be shared </p>
									<div className='btn_wrap_modal'>
										<button type='submit' className='btn btn-warning'>
											{" "}
											Submit{" "}
										</button>
									</div>
								</div>
							</form>
						</Spin>
					</Modal>
				) : (
					<Modal
						title='How do you want to get paid ?'
						visible={isMakeOfferModalVisible}
						footer={null}
						onOk={handleOk}
						onCancel={handleCancel}
						onClose={handleCancel}
					>
						<>
							<span>
								Please select an option to confirm how you want to get paid. Options can
								be found in{" "}
							</span>
							<u>
								<Link to='/servicepro/settings/info'>Settings Menu</Link>
							</u>
							<span>
								{" "}
								under <b>Bank & Card tab</b>
							</span>

							<p style={{ color: "grey", marginTop: "2%" }}>
								<i>
									(If you have chosen Automatic as the payement method, please complete
									the Stripe Connect Account Onboarding process to make an offer.)
								</i>
							</p>
						</>
					</Modal>
				)}

				<Modal
					title='Update Offer'
					visible={isUpdateOfferVisible}
					className='modal-offer-form'
					footer={null}
					destroyOnClose
					maskClosable={false}
					closable={!offerModalLoader}
					// onOk={this.handleOk}
					onCancel={() => {
						setTaskOfferValue("");
						toggleUpdateOfferModal(false);
					}}
				>
					<Spin spinning={offerModalLoader} size='large' tip='Fetching tasks...'>
						{/* <h2>Update your offer - {get(selectedTask, "myOffer.amount")}</h2> */}
						<div className='current_offer'>
							<p>
								Your current offer is <i className='mdi mdi-currency-gbp' />
								{get(selectedTask, "myOffer.amount")}{" "}
							</p>
						</div>
						<form
							onSubmit={(e) => {
								e.preventDefault();
								let bidAmount = Number(taskOfferValue).toFixed(2);
								toggleOfferModalLoader(true);
								updateTaskOffer({
									variables: {
										offerId: get(selectedTask, "myOffer.offerId"),
										amount: Number(bidAmount),
										description: "test",
									},
								});
							}}
						>
							<>
								<div className='text-center'>
									<h3>Update Your Offer</h3>
									<div className='form-group'>
										<div className='date__flex--makeorder'>
											<div className='input-group-prepend'>
												<div className='input-group-text'>
													<i className='mdi mdi-currency-gbp' />
												</div>
											</div>
											<input
												type='number'
												name='bidAmount'
												value={taskOfferValue}
												placeholder='35.00'
												onChange={(e) => setTaskOfferValue(e.target.value)}
												// min={get(selectedTask, "budgetAmount")}
												className='form-control select----global'
												required
											/>
										</div>

										<div>
											<table className='table table-hover table-borderless'>
												<tbody>
													<tr>
														<td>Service Fee</td>
														<td>
															- <i className='mdi mdi-currency-gbp' /> {calculatedServiceFee}
														</td>
													</tr>
													<tr>
														<td>VAT</td>
														<td>
															- <i className='mdi mdi-currency-gbp' /> {calculatedVat}
														</td>
													</tr>
													<tr className='recieved_amount'>
														<td>You will recieve</td>
														<td>
															<i className='mdi mdi-currency-gbp' />{" "}
															{(
																Number(taskOfferValue) -
																calculatedServiceFee -
																calculatedVat
															).toFixed(2) < 0
																? 0
																: (
																		Number(taskOfferValue) -
																		calculatedServiceFee -
																		calculatedVat
																  ).toFixed(2)}
														</td>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
								<div>
									<div className='form-group'>
										<textarea
											className='form-control textarea'
											placeholder='Add a Description!'
											name='description'
											spellcheck='false'
										></textarea>
									</div>
								</div>
								<button type='submit' className='btn btn-warning'>
									{" "}
									Submit{" "}
								</button>
							</>
						</form>
					</Spin>
				</Modal>

				<Modal
					title={null}
					footer={null}
					wrapClassName={"map---modal"}
					visible={viewPropertyLocationMap}
					onCancel={() => togglePropertyLocationView(false)}
				>
					<LocationMap propertyData={get(currentTaskToViewOnMap, "property")} />
				</Modal>
			</Spin>
			<Modal
				title={`Send a message to ${get(selectedTask, "postedBy.firstName")}!`}
				footer={null}
				closable={true}
				maskClosable={false}
				visible={isLeaveReviewModalVisible}
				onCancel={() => setLeaveReviewModal(false)}
				destroyOnClose
			>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setReviewSaving(true);
						// get(task, "postedBy._id")
						createConversation({
							variables: {
								receiverId: get(selectedTask, "postedBy._id"),
								role: get(selectedTask, "postedBy.role"),
								message: `For Task #${get(selectedTask, "identity")}:  ${
									e.target[0].value
								}`,
								type: "text",
							},
						});
					}}
				>
					<div>
						<label className='label__modal_review'>Please write your message.</label>
						<textarea
							name='rating'
							placeholder='Hi! I wanted to know more about this task'
							className='form-control textarea__modal_review'
							id='rating'
							cols='30'
							rows='10'
						></textarea>
					</div>
					<div className='text-right mt-3'>
						<button
							disabled={isSavingReview}
							className='btn btn-primary'
							type='submit'
						>
							Submit
						</button>
					</div>
				</form>
			</Modal>
		</>
	);
};

export default FindIt;

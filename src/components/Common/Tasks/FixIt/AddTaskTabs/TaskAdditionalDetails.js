import React, { useState, useEffect } from "react";
import { Tooltip, Modal, message } from "antd";
import { Formik, Form, Field } from "formik";
import get from "lodash/get";
import MyNumberInput from "../../../../../config/CustomNumberInput";

import "../styles.scss";

const TaskAdditionalDetails = (props) => {
	const [taskAdditionalData, setAddData] = useState(
		get(props, "taskAdditionalData", {})
	);

	useEffect(() => {
		setAddData(get(props, "taskAdditionalData"));

		//eslint-disable-next-line
	}, [props.taskAdditionalData]);

	let isOwnedBy = !window.location.href.includes("renter")
		? "Landlord"
		: "";

	let isRole = window.location.href.includes("landlord") ? true : false;

	return (
		<>
			<p className='head--task'>
				<b>New Task:</b> Tell us what needs to be done?
			</p>
			<Formik
				enableReinitialize
				initialValues={{ ...taskAdditionalData, payOwnedBy: isOwnedBy }}
				onSubmit={(values, { setSubmitting }) => {
					const titleLength = values.title.length >= 10 && values.title.length <= 50;
					const descriptionLength = values.description.length >= 30 && values.description.length <= 200;
					if (titleLength && descriptionLength) {
						props.setAdditionalData(values);
						props.setActiveClass(3);
					}
					if (!titleLength) {
						message.error("The Title should be between 10 to 50 characters!");
						return false;
					}
					if (!descriptionLength) {
						message.error("The Description should be between 30 to 200 characters!");
						return false;
					}
				}}
			>
				{({ isSubmitting, values, setFieldValue }) => (
					<Form>
						<div className='details--task'>
							<label>Title of the Task:</label>
							<Field
								className='w-100 input'
								type='text'
								name='title'
								required
								placeholder='Enter the title of your task - e.g Help move my sofa.'
							/>
							<label>What are the details:</label>
							<Field
								component={"textarea"}
								className='w-100 input'
								type='text'
								name='description'
								minLength="30"
								maxLength="200"
								// defaultValue={get(values, "description", "")}
								// onChange={e => setFieldValue("description", e.target.value)}
								required
								placeholder='Be as specific as you can about what needs to be done.'
							/>
						</div>
						<div className='selection__wrapper'>
							<label>Set Task Priority:</label>
							<div className='form-group'>
								<div className='radio-box'>
									<label htmlFor='radio11'>
										<Field
											type='radio'
											name='priority'
											defaultChecked={get(values, "priority") === "Low"}
											value='Low'
											required
											id='radio11'
										/>
										<div className='radio-item low'>
											<span>Low </span>
										</div>
									</label>
									<label htmlFor='radio12'>
										<Field
											type='radio'
											name='priority'
											value='Medium'
											defaultChecked={get(values, "priority") === "Medium"}
											id='radio12'
										/>
										<div className='radio-item medium'>
											<span>Medium</span>
										</div>
									</label>
									<label htmlFor='radio13'>
										<Field
											type='radio'
											name='priority'
											value='High'
											defaultChecked={get(values, "priority") === "High"}
											id='radio13'
										/>
										<div className='radio-item high'>
											<span>High</span>
										</div>
									</label>
								</div>
							</div>

							<div className='budget-task'>
								<div className='form-group'>
									<label>Task Pay Owned By:</label>

									<div className='radio-box'>
										<label htmlFor='landlord'>
											<Field
												type='radio'
												name='payOwnedBy'
												onChange={(e) => {
													e.preventDefault();
													if (!window.location.href.includes("renter")) {
														setFieldValue("payOwnedBy", "Landlord");
													} else {
														//when "renter" is included in the URL - when you logged in as renter
														//   Modal.info({
														//     title: "You can't select Landlord",
														//     content: (
														//       <div>
														//         <p>
														//           Please ask your landlord to create this task
														//           from their side!
														//         </p>
														//       </div>
														//     ),
														//     onOk() {}
														//   });
														// }

														setFieldValue("payOwnedBy", "Landlord");

														const passToAddTask = () => {
															props.addTaskCallBack("yes");
														};

														passToAddTask();
													}
												}}
												// disabled={
												//   props.location.pathname.includes("renter") && true
												// }
												value='Landlord'
												required
												checked={get(values, "payOwnedBy") === "Landlord"}
												id='landlord'
											/>
											<div className='radio-item'>
												<span>Landlord</span>
											</div>
										</label>
										<label htmlFor='renter'>
											<Field
												type='radio'
												name='payOwnedBy'
												value='Renter'
												onChange={(e) => {
													if (!window.location.href.includes("landlord")) {
														setFieldValue("payOwnedBy", "Renter");
													} else {
													Modal.info({
														title: "You can't select Renter",
														content: (
															<div>
																<p>
																	Please ask your renter to create this task from their side!
																</p>
															</div>
														),
														onOk() { },
													});
													}
												}}
												// disabled={
												//   props.location.pathname.includes("landlord") && true
												// }
												checked={get(values, "payOwnedBy") === "Renter"}
												id='renter'
											/>
											<div className='radio-item'>
												<span>Renter</span>
											</div>
										</label>
									</div>
								</div>
								<div className='form-group'>
									<label>
										Enter Your Budget Amount:
										<Tooltip
											overlayClassName='tooltip__color'
											title="Enter the price you're comfortable to pay to get your task done. ServicePro will use this as a guide for how much to offer."
										>
											<img
												src='https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png'
												alt='i'
											/>
										</Tooltip>
									</label>
									<div className='input-group'>
										<div className='input-group-prepend'>
											<div className='input-group-text'>
												<i className='fas fa-pound-sign'></i>
											</div>
										</div>
										<MyNumberInput
											name='salary.amount'
											placeholder={
												get(values, "payOwnedBy") === "Landlord" && !isRole
													? "Enter an estimated value or leave it blank"
													: "Estimated Amount"
											}
											className='form-control'
											mask='_'
											required={
												get(values, "payOwnedBy") === "Landlord" && !isRole ? false : true
											}
											min={1}
											value={
												get(values, "payOwnedBy") === "Landlord" && !isRole
													? 0 || get(values, "budgetAmount")
													: get(values, "budgetAmount")
											}
											onValueChange={(val) => {
												val.floatValue = Math.round(val.floatValue);
												setFieldValue("budgetAmount", val.floatValue);
											}}
										/>
										{/* <input
                      className="form-control"
                      type="text"
                      placeholder="Choose Sub Category Or Issue"
                    /> */}
									</div>
								</div>
							</div>
						</div>
						<div className='col-sm-12 col-md-12 col-lg-12 col-xl-12'>
							<button type='submit' className='btn btn-warning  pull-right'>
								Next &nbsp;
								<i className='fa fa-angle-double-right' aria-hidden='true'></i>
							</button>
						</div>
					</Form>
				)}
			</Formik>
		</>
	);
};

export default TaskAdditionalDetails;

import React from "react";
import "./styles.scss";

const Application = props => {
  return (
    <>
      <div className={`application__wrapper ${props.responsiveClasses}`}>
        <div className="application__wrap">
        <div className="row">
          <div className="col-lg-8">
            <div className="declaration__wrap">
              <h3>Apply TO Rent: 2 bed Mall Road, London</h3>
              <label>Are you applying to rent with others jointly?</label>
              <div className="inputs__wrapper">
                <ul>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Co-applicant's First Name"
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Co-applicant's Last Name"
                    />
                  </li>
                  <li>
                    <button className="form-control btn btn-outline-warning mb-2">
                      Lookup Profile
                    </button>
                  </li>
                </ul>
                <ul>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Co-applicant's Mobile"
                    />
                  </li>
                  <li>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Co-applicant's Email"
                    />
                  </li>
                  <li>
                    <button className="form-control btn btn-outline-primary mb-2">
                      Add More Renter
                    </button>
                  </li>
                </ul>
                <p className="text-primary mb-0">
                  <i className="fas fa-check text-primary"></i>&nbsp;&nbsp;
                  Profile found! Invitation email sent to join you as
                  co-applicant{" "}
                </p>
                <p className="text-danger mb-0">
                  <i className="fas fa-check text-danger"></i>
                  &nbsp;&nbsp;Profile doesn't exist! Invitaion email sent to
                  complete referencing and join as co-applicant
                </p>
              </div>
              <label> Review declaration and commit to rental terms </label>
              <div className="duration_input">
                <ul>
                  <li>
                    <label className="labels__global">
                      Min. duration in months *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="12"
                    />
                  </li>
                  <li>
                    <div className="form-group">
                      <label className="labels__global">Monthly Rent *</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-pound-sign"></i>
                          </div>
                        </div>
                        <input
                          type="box-title"
                          className="form-control select__global"
                          id="date"
                          autoComplete="off"
                          placeholder="1200"
                          value=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <label className="labels__global">Deposit *</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-pound-sign"></i>
                          </div>
                        </div>
                        <input
                          type="box-title"
                          className="form-control select__global"
                          id="date"
                          autoComplete="off"
                          placeholder="2400"
                          value=""
                        />
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="form-group">
                      <label className="labels__global">Move in Date *</label>
                      <div className="input-group">
                        <div className="input-group-prepend">
                          <div className="input-group-text">
                            <i className="fas fa-calendar-alt"></i>
                          </div>
                        </div>
                        <input
                          type="box-title"
                          className="form-control select__global"
                          id="date"
                          autoComplete="off"
                          placeholder="Select Date"
                          value=""
                        />
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              <textarea
                className="form-control"
                placeholder="Enter message to Landlord: Tell the Landlord a little about yourself, why you would like to move. It is likely that other renters might have applied, so this is an opportunity to make sure Landlord picks you. "
                name="description"
                spellcheck="false"
              ></textarea>
              <div className="terms_conditions_checkbox mt-4">
                <div className="d-flex">
                  <input type="checkbox" id="agree" />
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry
                  </p>
                </div>
                <div className="d-flex">
                  <input type="checkbox" id="agree" />
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry
                  </p>
                </div>
                <div className="d-flex">
                  <input type="checkbox" id="agree" />
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry
                  </p>
                </div>
                <div className="d-flex">
                  <input type="checkbox" id="agree" />
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry
                  </p>
                </div>
              </div>
              <div className="btn_card">
                <button className="form-control btn btn-primary mb-2">
                  Checkout by UK Debit Card
                </button>
                <div className="badge badge-secondary">Powered by stripe</div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="progress__wrapper">
              <div className="progress_report">
                <ul>
                  <li>Referencing</li>
                  <li></li>
                </ul>
              </div>
              <div className="progress_report">
                <ul>
                  <li></li>
                  <li>Apply to Rent</li>
                </ul>
              </div>
              <div className="progress_report">
                <ul>
                  <li>Landlord Review, Accept Application & issue agreement</li>
                  <li></li>
                </ul>
              </div>
              <div className="progress_report">
                <ul>
                  <li></li>
                  <li>Agreement Sign & share to all</li>
                </ul>
              </div>
              <div className="progress_report">
                <ul>
                  <li>Pay Deposit & 1st month Rent, Schedule recurring rent</li>
                  <li></li>
                </ul>
              </div>
              <div className="progress_report">
                <ul>
                  <li></li>
                  <li>Inventory Check-in & store</li>
                </ul>
              </div>
              <div className="progress_report last__progress_report">
                <ul>
                  <li>Move in complete</li>
                  <li></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </>
  );
};

export default Application;

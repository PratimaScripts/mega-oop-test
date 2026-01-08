import React from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./style.scss";

const AddressComp = props => {
  return (
    <div>
      <div className="content">
        <div className="container-fluid">
          <div className="tab-content">
            <div className="row">
              <div className="col-md-10">TASK ID #90810</div>
              <div className="col-md-2">POSTED BY</div>
            </div>
          </div>
        </div>
      </div>

      <div className="wrapper--task">
        <div className="row">
          <div className="col-md-12">
            <div className="content">
              <div className="budget-task">
                <div className="form-group">
                  <h3>Carpenter Who can make and fit 2 wardrobe doors</h3>
                  <ul>
                    <li>
                      <div className="task--info">
                        <i className="fa fa-home fa-lg" aria-hidden="true"></i>
                        <p>Household > Wall Cabinates</p>
                      </div>
                    </li>
                    <li>
                      <div className="task--info">
                        <i className="fas fa-map-marker-alt fa-lg"></i>
                        <p>
                          Feltham,Tw13{" "}
                          <small>
                            <a href="test">View in map</a>
                          </small>
                        </p>
                      </div>
                    </li>
                    <li>
                      <div className="task--info">
                        <i className="fas fa-calendar-check fa-lg"></i>
                        <p>Posted on Wed, 20th March 19</p>
                      </div>
                    </li>
                    <li>
                      <div className="task--info">
                        <i className="fas fa-clock fa-lg"></i>
                        <p>Weekdays Evening</p>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="form-group">
                  <div className="tab-content">
                    <h6>
                      <i className="fas fa-coins"></i>&nbsp;TASK BUDGET
                    </h6>
                    <h3>
                      <i className="fas fa-pound-sign"></i>100 &nbsp;&nbsp;
                      <i className="fas fa-edit"></i>
                    </h3>
                    <button className="btn btn-warning">Review & Post</button>
                  </div>
                  <a href="test">
                    <i className="fas fa-share-alt"></i>&nbsp;Share or invite
                  </a>
                </div>
              </div>
              <div className="clearfix"></div>
              <hr></hr>
              <div className="notify--taskList">
                <div className="row">
                  <div className="col-md-3 text-center">
                    <button className="btn btn-warning">
                      Awaiting Landlord Approval
                    </button>
                  </div>
                  <div className="col-md-6 text-center">
                    <label>
                      <span>2</span> Offers &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{" "}
                      <span>4</span> Messages
                    </label>
                    <a href="test">
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                        alt=""
                      />
                    </a>
                    <a href="test">
                      <img
                        src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                        alt=""
                      />
                    </a>
                  </div>
                  <div className="col-md-3 text-center">
                    <div className="row">
                      <div className="col-md-10">
                        <input
                          className="form-control w-100"
                          placeholder="More Action"
                        />
                      </div>
                      <div className="col-md-2">
                        <i className="fas fa-ellipsis-v"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="tab--list--details">
          <Tabs>
            <TabList>
              <Tab>Details</Tab>
              <Tab>Messages</Tab>
              <Tab>Offers(1)</Tab>
            </TabList>
            <TabPanel>
              <div className="row">
                <div className="col-md-8">
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                    sed do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>
                <div className="col-md-2 text-right">
                  <img
                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                    alt=""
                  />
                </div>
                <div className="col-md-2 text-left">
                  <img
                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                    alt=""
                  />
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="messages--taskList">
                <div className="col-md-12">
                  <h3>
                    Connect your Social profile to build your online social
                    reputation.
                  </h3>
                </div>
                <p>Messages</p>
              </div>
            </TabPanel>
            <TabPanel>
              <div className="offers--taskList">
                <label className="btn btn-offer">Accepted Offer</label>
                <div className="offers-list">
                  <div className="card">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="offer--info">
                          <p>
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification3.png"
                              alt=""
                              className="mr-3"
                            />
                            Rajiv S.
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h3 className="text-right">
                          <i className="fas fa-pound-sign"></i>&nbsp;35&nbsp;
                          <i className="far fa-edit"></i>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat.
                        </p>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-Change">
                          Change to Fix
                        </button>
                        <button className="btn btn-Release">
                          Release Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-3 mb-3">
                  <p className="info--offers">
                    3hours ago &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <i className="fa fa-thumbs-up" aria-hidden="true"></i>{" "}
                    &nbsp; &nbsp;
                    <i
                      className="fa fa-thumbs-down"
                      aria-hidden="true"
                    ></i>{" "}
                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <a href="test">
                      <i className="far fa-comment-dots"></i> send message
                    </a>
                  </p>
                </div>
                <div className="col-md-12">
                  <label className="btn btn-other">Other Offers</label>
                </div>
                <div className="offers-list">
                  <div className="card">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="offer--info">
                          <p>
                            <img
                              src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/icon-notification3.png"
                              alt=""
                              className="mr-3"
                            />
                            Rajiv S.
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <h3 className="text-right">
                          <i className="fas fa-pound-sign"></i>&nbsp;35&nbsp;
                          <i className="far fa-edit"></i>
                        </h3>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-9">
                        <p>
                          Lorem ipsum dolor sit amet, consectetur adipisicing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat.
                        </p>
                      </div>
                      <div className="col-md-3">
                        <button className="btn btn-Change">Accept</button>
                        <button className="btn btn-Release">Reject</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-12 mt-3 mb-3">
                  <p className="info--offers">
                    3hours ago &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <i className="fa fa-thumbs-up" aria-hidden="true"></i>{" "}
                    &nbsp; &nbsp;
                    <i
                      className="fa fa-thumbs-down"
                      aria-hidden="true"
                    ></i>{" "}
                    &nbsp; &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;
                    <a href="test">
                      <i className="far fa-comment-dots"></i> send message
                    </a>
                  </p>
                </div>
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default AddressComp;

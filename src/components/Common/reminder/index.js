import React, { Component } from "react";
import "./stylees.scss";
export class index extends Component {
  render() {
    return (
      <div>
        <div className="reminder__wrapper">
          <div className="main__wrap">
            <div className="row">
              <div className="col-md-8">
                <div className="panel_view">
                  <div className="data_view">
                    <div className="data_header">
                      <p>Sunday, 19th May 2019 - Viewing request</p>
                    </div>
                    <div className="data_body">
                      <form>
                        <ul>
                          <li>
                            <div className="form-group">
                              <div className="date__flex">
                                <div className="input-group-prepend">
                                  <div className="input-group-text">
                                    <i className="fa fa-clock"></i>
                                  </div>
                                </div>
                                <input
                                  placeholder="9:30 AM - 10:00 AM"
                                  className="form-control"
                                />
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <h4>
                                <i className="fa fa-map-marker"></i> 8 Amesbury
                                Road, TW13 5HJ
                              </h4>
                            </div>
                          </li>
                        </ul>
                        <ul>
                          <li>
                            <div className="d-flex active">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                                alt="userImage"
                              />
                              <h4>lan H.</h4>
                              <i className="fa fa-envelope-o"></i>
                            </div>
                          </li>
                          <li>
                            <div className="details">
                              <h4>
                                <i className="fa fa-mobile"></i> 9XXXX XXX30
                              </h4>
                            </div>
                          </li>
                        </ul>
                        <div className="buttons d-flex">
                          <div className="btn__send pr-3">
                            <button className="send">Accept</button>
                          </div>
                          <div className="btn__send pr-3">
                            <button className="reschedule">Reschedule</button>
                          </div>
                          <div className="btn__send">
                            <button className="cancel">Cancel</button>
                          </div>
                        </div>
                        <ul>
                          <li>
                            <div className="date">
                              <div className="form-group">
                                <div className="date__flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fa fa-calendar"></i>
                                    </div>
                                  </div>
                                  <input
                                    placeholder="July 23, 2019"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                          <li>
                            <div className="time">
                              <div className="form-group">
                                <div className="date__flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fa fa-clock"></i>
                                    </div>
                                  </div>
                                  <input
                                    placeholder="9:30 AM - 10:00 AM"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                        <div className="btn__send">
                          <button className="send">Send</button>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="edit_view__data">
                    <div className="data_view">
                      <div className="data_header">
                        <p>Sunday, 19th May 2019 - Viewing request</p>
                        <div className="btn__send">
                          <button className="reschedule m-1">Reschedule</button>
                        </div>
                      </div>
                      <div className="data_body">
                        <form>
                          <ul>
                            <li>
                              <div className="form-group">
                                <div className="date__flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fa fa-clock"></i>
                                    </div>
                                  </div>
                                  <input
                                    placeholder="9:30 AM - 10:00 AM"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="details">
                                <h4>
                                  <i className="fa fa-map-marker"></i> 8
                                  Amesbury Road, TW13 5HJ
                                </h4>
                              </div>
                            </li>
                          </ul>
                          <ul>
                            <li>
                              <div className="d-flex active">
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                                  alt="userImage"
                                />
                                <h4>lan H.</h4>
                                <i className="fa fa-envelope-o"></i>
                              </div>
                            </li>
                            <li>
                              <div className="details">
                                <h4>
                                  <i className="fa fa-mobile"></i> 9XXXX XXX30
                                </h4>
                              </div>
                            </li>
                          </ul>
                          <div className="buttons d-flex">
                            <div className="btn__send pr-3">
                              <button className="send">Accept</button>
                            </div>
                            <div className="btn__send pr-3">
                              <button className="reschedule">Reschedule</button>
                            </div>
                            <div className="btn__send">
                              <button className="cancel">Cancel</button>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <div className="date">
                                <div className="form-group">
                                  <div className="date__flex">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text">
                                        <i className="fa fa-calendar"></i>
                                      </div>
                                    </div>
                                    <input
                                      placeholder="July 23, 2019"
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="time">
                                <div className="form-group">
                                  <div className="date__flex">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text">
                                        <i className="fa fa-clock"></i>
                                      </div>
                                    </div>
                                    <input
                                      placeholder="9:30 AM - 10:00 AM"
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                          <div className="btn__send">
                            <button className="send">Send</button>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="data_view">
                      <div className="data_header">
                        <p>Sunday, 19th May 2019 - Viewing request</p>
                        <div className="btn__send">
                          <button className="cancel m-1">Cancel</button>
                        </div>
                      </div>
                      <div className="data_body">
                        <form>
                          <ul>
                            <li>
                              <div className="form-group">
                                <div className="date__flex">
                                  <div className="input-group-prepend">
                                    <div className="input-group-text">
                                      <i className="fa fa-clock"></i>
                                    </div>
                                  </div>
                                  <input
                                    placeholder="9:30 AM - 10:00 AM"
                                    className="form-control"
                                  />
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="details">
                                <h4>
                                  <i className="fa fa-map-marker"></i> 8
                                  Amesbury Road, TW13 5HJ
                                </h4>
                              </div>
                            </li>
                          </ul>
                          <ul>
                            <li>
                              <div className="d-flex active">
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/logo-300.png"
                                  alt="userImage"
                                />
                                <h4>lan H.</h4>
                                <i className="fa fa-envelope-o"></i>
                              </div>
                            </li>
                            <li>
                              <div className="details">
                                <h4>
                                  <i className="fa fa-mobile"></i> 9XXXX XXX30
                                </h4>
                              </div>
                            </li>
                          </ul>
                          <div className="buttons d-flex">
                            <div className="btn__send pr-3">
                              <button className="send">Accept</button>
                            </div>
                            <div className="btn__send pr-3">
                              <button className="reschedule">Reschedule</button>
                            </div>
                            <div className="btn__send">
                              <button className="cancel">Cancel</button>
                            </div>
                          </div>
                          <ul>
                            <li>
                              <div className="date">
                                <div className="form-group">
                                  <div className="date__flex">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text">
                                        <i className="fa fa-calendar"></i>
                                      </div>
                                    </div>
                                    <input
                                      placeholder="July 23, 2019"
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="time">
                                <div className="form-group">
                                  <div className="date__flex">
                                    <div className="input-group-prepend">
                                      <div className="input-group-text">
                                        <i className="fa fa-clock"></i>
                                      </div>
                                    </div>
                                    <input
                                      placeholder="9:30 AM - 10:00 AM"
                                      className="form-control"
                                    />
                                  </div>
                                </div>
                              </div>
                            </li>
                          </ul>
                          <div className="btn__send">
                            <button className="send">Send</button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="add_reminderbtn">
                  <button className="add_reminder">+ Add Reminder</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default index;

import React, { useState } from "react";
import { Menu, Dropdown } from "antd";
import { DownOutlined } from '@ant-design/icons';

import "./styles.scss";

const GridView = props => {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = flag => {
    setVisible(flag);
  };

  const menu = (
    <Menu
      onClick={e => {
        handleVisibleChange(true);
        e && e.domEvent.stopPropagation();
      }}
    >
      <div className="filter_dropdown">
        <ul>
          <li className="p-1">
            <label className="labels__global">Furnishing</label>
            <input
              type="text"
              className="form-control"
              placeholder="Please Select"
            />
          </li>
          <li className="p-1">
            <label className="labels__global">Minimum Duration</label>
            <input
              type="text"
              className="form-control"
              placeholder="Please Select"
            />
          </li>
        </ul>
        <p>Features</p>
        <ul>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Garden</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Bills included</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Disabled Accessibility</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Balcony / Patio</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Ensuit Bathroom</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Laundry</label>
          </li>
        </ul>
        <p>Suitability</p>
        <ul>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Family</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Student</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Couple</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Single</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Smoker</label>
          </li>
          <li>
            <input type="checkbox" className="smallCheckbox" id="agree" />
            <label className="labels__global">Pets</label>
          </li>
        </ul>
        <div className="text-center">
          <button className="btn btn-warning">Apply</button>
        </div>
      </div>
    </Menu>
  );

  return (
    <>
      <div className="list_grid__view--wrapper">
        <div className="container">
          <div className="sub_header">
            <h4>
              Searched result for <span className="searched_for">London</span>{" "}
              <span className="searched_quantity">(found 15 properties)</span>
            </h4>
            <div className="btn__wrapper">
              <div className="btn save_wishlist mr-2">
                <i className="fa fa-heart" aria-hidden="true"></i> Save Wishlist
              </div>
              <div className="btn btn_view active mr-2">
                <i className="fa fa-list-ul" aria-hidden="true"></i> List
              </div>
              <div className="btn btn_view">
                <i className="fa fa-th" aria-hidden="true"></i> Grid
              </div>
            </div>
          </div>
          <div className="setting__results">
            <ul>
              <li>
                <div className="form-group location_width">
                  <label htmlFor="">Location</label>
                  <input
                    type="text"
                    className="form-control input__global"
                    placeholder="e.g. Bristol SW6"
                  />
                </div>
              </li>
              <li>
                <div className="form-group mileage_width">
                  <label htmlFor="">Mileage (mi)</label>
                  <input
                    type="text"
                    className="form-control input__global"
                    placeholder=""
                  />
                </div>
              </li>
              <li>
                <div className="form-group type_width">
                  <label htmlFor="">Property Type</label>
                  <input
                    type="text"
                    className="form-control input__global"
                    placeholder="Any"
                  />
                </div>
              </li>
              <li>
                <div className="form-group rentrange_width">
                  <label htmlFor="">Rent Range (per month)</label>
                  <input
                    type="text"
                    className="form-control input__global"
                    placeholder=""
                  />
                </div>
              </li>
              <li>
                <div className="form-group mb__bedroom">
                  <label htmlFor="">No. of Bed Room</label>
                  <div className="bedroom_width">
                    <input
                      type="text"
                      className="form-control input__global"
                      placeholder="Min"
                    />
                    <input
                      type="text"
                      className="form-control input__global"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </li>
              <li>
                <div className="form-group filter_width">
                  <label htmlFor="">Filter</label>
                  <Dropdown
                    overlayClassName="parentClassDropdown"
                    onVisibleChange={handleVisibleChange}
                    visible={visible}
                    overlay={menu}
                    trigger={["click"]}
                  >
                    <p>
                      Click me <DownOutlined />
                    </p>
                    {/* <input
                      type="text"
                      className="form-control input__global"
                      placeholder="Any"
                    /> */}
                  </Dropdown>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {Array.from({ length: 1 }).map((meow, j) => {
        return (
          <div className="list__view" key={j}>
            <div className="bg">
              <div className="bg_main">
                <div className="container">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="image_wishlist">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg"
                          alt="img"
                        />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <div className="list">
                        <ul>
                          <li>
                            <p>
                              <i
                                className="fa fa-credit-card"
                                aria-hidden="true"
                              ></i>
                              Rent p/m<a href> £1500</a>
                            </p>
                          </li>
                          <li>
                            <p>
                              <i
                                className="fa fa-database"
                                aria-hidden="true"
                              ></i>
                              Deposit p/m<a href> £3000</a>
                            </p>
                          </li>
                          <li>
                            <p>
                              <i
                                className="fa fa-map-marker"
                                aria-hidden="true"
                              ></i>
                              Distance<a href> view map</a>
                            </p>
                          </li>
                        </ul>
                      </div>
                      <div className="description">
                        <p>
                          2 Bed Semi-Detached House, Fernside Avenue, TW13 -1113
                        </p>
                        <p>
                          Beautiful 2 bedroom semi detached house in Feltham;
                          Close to Hanworth park and Feltham High street and
                          local amenities. The ...
                        </p>
                      </div>
                      <div className="listing">
                        <ul>
                          <li>
                            <button className="btn btn_furnished">
                              Furnised
                            </button>
                          </li>
                          <li>
                            <p>
                              <i className="fa fa-bed" aria-hidden="true"></i>2
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fa fa-bath" aria-hidden="true"></i>1
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fa fa-bath" aria-hidden="true"></i>1
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fa fa-bath" aria-hidden="true"></i>
                              300 sq. ft.
                            </p>
                          </li>
                          <li>
                            <p>
                              <i
                                className="fa fa-camera"
                                aria-hidden="true"
                              ></i>
                              5
                            </p>
                          </li>
                          <li>
                            <img
                              src="httpshttps://res.cloudinary.com/dkxjsdsvg/image/upload/imagesary.com/dkxjsdsvg/image/upload/images/mail.png"
                              className="mr-3"
                              alt="img"
                            />
                            <img
                              src="httpshttps://res.cloudinary.com/dkxjsdsvg/image/upload/imagesary.com/dkxjsdsvg/image/upload/images/newlove.png"
                              alt="img"
                            />
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="btn_rightsection text-right">
                        <button className="btn btn_rent">Apply to Rent</button>
                        <button className="btn btn_offer">Make an Offer</button>
                        <button className="btn btn_book">Book Viewing</button>
                        <button className="btn btn_view">View Details</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="bg_">
              <div className="bg_mainly">
                <div className="container">
                  <div className="row">
                    <div className="col-xl-4 col-lg-4 col-md-4">
                      <div className="card">
                        <div className="img_hover">
                          <img
                            src="httpshttps://res.cloudinary.com/dkxjsdsvg/image/upload/imagesary.com/dkxjsdsvg/image/upload/images/properties/1.jpg"
                            alt="img"
                            width="100%"
                          />
                        </div>
                        <div className="card-body">
                          <div className="details">
                            <ul>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-bed"
                                    aria-hidden="true"
                                  ></i>
                                  2
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-bath"
                                    aria-hidden="true"
                                  ></i>
                                  1
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-couch"
                                    aria-hidden="true"
                                  ></i>
                                  1
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-tape"
                                    aria-hidden="true"
                                  ></i>
                                  2540 sq. ft.
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-camera"
                                    aria-hidden="true"
                                  ></i>
                                  5
                                </p>
                              </li>
                              <li>
                                <p>
                                  <i
                                    className="fa fa-map-marker"
                                    aria-hidden="true"
                                  ></i>
                                  London, UK
                                </p>
                              </li>
                            </ul>
                          </div>
                          <div className="content">
                            <p>
                              <a href>
                                {" "}
                                2 bed Maisonette Amesbury Road, TW13 - 11112
                              </a>
                            </p>
                          </div>

                          <div className="row property-card-row2">
                            <div className="col-11 p-0">
                              <span className="badge badge-success">
                                Listed
                              </span>
                              <span className="mdi mdi-briefcase-account p-2"></span>
                              Tenancies &nbsp;
                              <span className="mdi mdi-scale-balance p-2"></span>
                              Accounting &nbsp;
                              <span className="mdi mdi-hand-pointing-right p-2"></span>
                              Fixit &nbsp;
                            </div>

                            <div className="col-1 text-right pl-0">
                              <a
                                className="dropdownIcon"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                href
                              >
                                <i className="fa fa-ellipsis-v"></i>
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        );
      })}
    </>
  );
};

export default GridView;

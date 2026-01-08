import React from "react";
import "./styles.scss";

const Test = () => {
  return (
    <>
      <div>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
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
                                      <span className="name">
                                        Servicepro name
                                      </span>
                                      <span className="serial_number">
                                        M-25
                                      </span>
                                      (
                                      <span className="years">
                                        Experience 5 years
                                      </span>
                                      )
                                    </p>
                                    <p className="address">
                                      <i className="fa fa-map-marker"></i> lorem
                                      ipsum
                                    </p>
                                  </li>
                                  <li>
                                    <p>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <a href>(157)</a>
                                    </p>
                                  </li>
                                  <li>
                                    <img
                                      src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                      alt="loading..."
                                    />{" "}
                                    <img
                                      src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                      alt="loading..."
                                    />
                                  </li>
                                </ul>
                              </div>
                              <div className="description">
                                <p>
                                  Lorem ipsum dolor, sit amet consectetur
                                  adipisicing elit. Id quibusdam, minima ab
                                  laborum illo eaque quaerat fuga delectus
                                  ducimus voluptas nobis veniam. Rerum, quos
                                  maxime! In sequi quisquam atque animi!
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
                                    <p>Installing Pipe</p>
                                  </li>
                                  <li>
                                    <p>Cleaning Sewer Line</p>
                                  </li>
                                  <li>
                                    <p>Manual Dexterity + more 2</p>
                                  </li>
                                  <li>
                                    <p>Starting at £50</p>
                                    <p>Starting at £5/ph</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="btn_rightsection text-right">
                                <button className="btn btn_rent">
                                  Apply to Rent
                                </button>
                                <button className="btn btn_view">
                                  View Details
                                </button>
                                <button className="btn btn_book">
                                  Book Viewing
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* <div className="container">
        <div className="row">
          <div className="col-md-12">
            {Array.from({ length: 1 }).map((meow, j) => {
              return (
                <div className="grid__view" key={j}>
                  <div className="container">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="bg">
                          <div className="bg_main">
                            <div className="sub_wrap">
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
                                      <span className="name">
                                        Servicepro name
                                      </span>
                                      <span className="serial_number">
                                        M-25
                                      </span>
                                      (
                                      <span className="years">
                                        Experience 5 years
                                      </span>
                                      )
                                    </p>
                                    <p className="address">
                                      <i className="fa fa-map-marker"></i> lorem
                                      ipsum
                                    </p>
                                  </li>
                                  <li>
                                    <p>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <i className="fa fa-star"></i>
                                      <a href="">(157)</a>
                                    </p>
                                  </li>
                                  <li>
                                    <img
                                      src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                      alt="loading..."
                                    />{" "}
                                    <img
                                      src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                      alt="loading..."
                                    />
                                  </li>
                                </ul>
                              </div>
                              <div className="description">
                                <p>
                                  Lorem ipsum dolor, sit amet consectetur
                                  adipisicing elit. Id quibusdam, minima ab
                                  laborum illo eaque quaerat fuga delectus
                                  ducimus voluptas nobis veniam. Rerum, quos
                                  maxime! In sequi quisquam atque animi!
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
                                    <p>Installing Pipe</p>
                                  </li>
                                  <li>
                                    <p>Cleaning Sewer Line</p>
                                  </li>
                                  <li>
                                    <p>Manual Dexterity + more 2</p>
                                  </li>
                                  <li>
                                    <p>Starting at £50</p>
                                    <p>Starting at £5/ph</p>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="col-md-2">
                              <div className="btn_rightsection text-right">
                                <button className="btn btn_rent">
                                  Apply to Rent
                                </button>
                                <button className="btn btn_view">
                                  View Details
                                </button>
                                <button className="btn btn_book">
                                  Book Viewing
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div> */}

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {Array.from({ length: 1 }).map((meow, j) => {
                return (
                  <div className="grid__view" key={j}>
                    <div className="container">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="bg">
                            <div className="bg_main">
                              <div className="sub_wrap">
                                <div className="image_wishlist">
                                  <img
                                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg"
                                    alt="img"
                                  />
                                </div>
                                <div className="info_wrap">
                                  <p>
                                    <span className="name">
                                      Servicepro name
                                    </span>
                                    <span className="serial_number">M-25</span>
                                  </p>
                                  <p className="years">(Experience 5 years)</p>
                                  <p className="address">
                                    <i className="fa fa-map-marker"></i> lorem
                                    ipsum
                                  </p>
                                </div>
                              </div>

                              <div className="work_wrap">
                                <button className="btn btn_furnished">
                                  Furnised
                                </button>
                                <p>
                                  <i className="fa fa-star"></i>
                                  4.5
                                  <span>(1.5k+)</span>
                                </p>
                                <div className="wrapper">
                                  <p>Installing Pipe</p>
                                  <p>Cleaning Sewer Line</p>
                                  <p>Manual Dexterity + more 2</p>
                                </div>
                              </div>

                              <div className="range_wrap">
                                <div>
                                  <img
                                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                    alt="loading..."
                                  />{" "}
                                  <img
                                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                    alt="loading..."
                                  />
                                </div>
                                <div>
                                  <p>Starting at £50</p>
                                  <p>Starting at £5/ph</p>
                                </div>
                              </div>

                              <div className="btn_wrap">
                                <button className="btn btn_rent">
                                  Apply to Rent
                                </button>
                                <button className="btn btn_view">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {Array.from({ length: 1 }).map((meow, j) => {
                return (
                  <div className="landlord__grid__view" key={j}>
                    <div className="container">
                      <div className="row">
                        <div className="col-md-4">
                          <div className="bg">
                            <div className="bg_main">
                              <div className="sub_wrap">
                                <div className="image_wishlist">
                                  <img
                                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg"
                                    alt="img"
                                  />
                                </div>
                                <div className="info_wrap">
                                  <p>
                                    <span className="name">
                                      Servicepro name
                                    </span>
                                    <span className="serial_number">M-25</span>
                                  </p>
                                  <p className="years">(Experience 5 years)</p>
                                  <p className="address">
                                    <i className="fa fa-map-marker"></i> lorem
                                    ipsum
                                  </p>
                                </div>
                              </div>

                              <div className="work_wrap">
                                <button className="btn btn_furnished">
                                  Furnised
                                  <i className="fa fa-check"></i>
                                </button>
                                <p>
                                  <i className="fa fa-star"></i>
                                  4.5
                                  <span>(1.5k+)</span>
                                </p>
                                <div className="wrapper">
                                  <span className="mdi mdi-account-card-details verified"></span>
                                  <span className="mdi mdi-bank"></span>
                                  <span className="mdi mdi-search-web verified"></span>
                                  <span className="mdi mdi-phone-in-talk"></span>
                                  <span className="mdi mdi-bank verified"></span>
                                </div>
                              </div>

                              <div className="range_wrap">
                                <div>
                                  <img
                                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                    alt="loading..."
                                  />{" "}
                                  <img
                                    src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                    alt="loading..."
                                  />
                                </div>
                              </div>

                              <div className="btn_wrap">
                                <button className="btn btn_rent">
                                  Apply to Rent
                                </button>
                                <button className="btn btn_view">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="task_list_view">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="main_wrapper">
                  <div className="row">
                    <div className="col-md-8">
                      <div className="info_main_wrap">
                        <p className="heading">
                          {" "}
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit{" "}
                        </p>
                        <div className="info_content">
                          <ul>
                            <li>
                              <p>
                                <i
                                  className="fa fa-home fa-lg"
                                  aria-hidden="true"
                                ></i>
                                Households > grass
                              </p>
                            </li>
                            <li>
                              <p>
                                <i className="fas fa-map-marker-alt fa-lg"></i>
                                Aberdeen, NG3 6EP{" "}
                                <small>
                                  <span>View in map</span>
                                </small>
                              </p>
                            </li>
                            <li>
                              <p>
                                <i className="fas fa-calendar-check fa-lg"></i>
                                Posted on Monday, February 3 2020
                              </p>
                            </li>
                          </ul>
                        </div>
                        <div className="content">
                          <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Quisquam blanditiis eaque facere asperiores
                            optio quo explicabo. Illo, provident expedita.
                            Voluptate sequi totam molestiae velit eum eius
                            quibusdam blanditiis possimus quo.
                          </p>
                        </div>
                        <div className="listing">
                          <ul>
                            <li>
                              <button className="btn btn_open">Furnised</button>
                            </li>
                            <li>
                              <p className="info_notify">
                                <span>2</span> Offers,<span> 2</span> Messages
                              </p>
                            </li>
                            <li>
                              <p className="time_wrap">Weekdays - Evening</p>
                            </li>
                            <li>
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                alt="loading..."
                              />{" "}
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                alt="loading..."
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="budget_wrap">
                        <i className="fas fa-coins"></i>
                        <p>TASK BUDGET</p>
                        <p className="amount_budget">£100</p>
                      </div>
                      <div className="posted_wrap">
                        <div>
                          <p>Posted by</p>
                          <p className="user_name">test user</p>
                        </div>
                        <div className="user_image">
                          <img
                            src="https://www.itl.cat/pngfile/big/43-430987_cute-profile-images-pic-for-whatsapp-for-boys.jpg"
                            alt="userImage"
                          />
                          <i className="fa fa-check"></i>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2 last_child">
                      <div className="btn_rightsection text-right">
                        <button className="btn btn_rent">Apply to Rent</button>
                        <button className="btn btn_view">View Details</button>
                        <button className="btn btn_book">Book Viewing</button>
                      </div>
                    </div>
                    <div className="col-md-2"></div>
                    <div className="col-md-2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Test;

import React from "react";

import "./styles.scss";

const PropertyDetail = props => {
  // const [isApplyToRent, setApplyToRent] = useState(false);
  // const [isSendMessage, setSendMessageStatus] = useState(false);
  // const [isBookViewing, setBookViewingStatus] = useState(false);

  // let settings = {
  //   dots: false,
  //   arrows: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 7,
  //   slidesToScroll: 1
  // };

  // let settingsTwo = {
  //   dots: false,
  //   arrows: true,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 3,
  //   slidesToScroll: 1,
  //   centerPadding: "60px",
  //   rows: 2
  // };
  // const settingsTwo = {
  //   className: "center",
  //   centerMode: true,
  //   infinite: true,
  //   centerPadding: "60px",
  //   slidesToShow: 3,
  //   speed: 500,
  //   rows: 2,
  //   slidesPerRow: 2
  // };

  return (
    <>
      {/* Property Details */}
      <div>
        {/* <div className="propertydetails__wrapper">
        <div className="row">
          <div className="col-md-12">
            <div className="property__wrapperdetails">
              <ul>
                <li>
                  <div className="property_address">
                    <h3>
                      2 Bed Semi-detached House, Fernside Avenue, TW13-1113{" "}
                      <a href>view map</a>
                    </h3>
                    <ul>
                      <li>
                        <label className="badge badge-success">Furnished</label>
                      </li>
                      <li>
                        <i className="fas fa-bed"></i> 2 Bedrrom
                      </li>
                      <li>
                        <i className="fas fa-bath"></i> 1 Bathroom
                      </li>
                      <li>
                        <i className="fas fa-couch"></i> 1 Reception
                      </li>
                      <li>
                        <i className="fas fa-tape"></i> 300 sq. ft.
                      </li>
                    </ul>
                  </div>
                </li>
                <li>
                  <span>£1500</span>
                  <p>
                    {" "}
                    <i className="fas fa-money-bill-alt"></i> Rent p/m{" "}
                  </p>
                </li>
                <li>
                  <span>£3000</span>
                  <p>
                    {" "}
                    <i className="fas fa-coins"></i> Deposit p/m{" "}
                  </p>
                </li>
                <li>
                  <button
                    onClick={() => setApplyToRent(true)}
                    className="btn btn-primary"
                  >
                    Apply to rent
                  </button>
                </li>
              </ul>
            </div>
            <div className="row">
              <div className="col-md-9">
                <div className="tabs__propertydetails">
                  <Tabs>
                    <TabList>
                      <Tab>Description</Tab>
                      <Tab>Amenities</Tab>
                      <Tab>Neighbourhood</Tab>
                    </TabList>

                    <TabPanel>
                      <label>Letting Info</label>
                      <div className="description__wrap">
                        <ul>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/max.png"
                                alt="img"
                              />
                              <p>
                                Max Occupancy : <span>2</span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/cal1.png"
                                alt="img"
                              />
                              <p>
                                Min. Duration in months : <span>2</span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/cal2.png"
                                alt="img"
                              />
                              <p>
                                Move in : <span>2</span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/gar.png"
                                alt="img"
                              />
                              <p>
                                Garage : <span>2</span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/clock.png"
                                alt="img"
                              />
                              <p>
                                Viewing : <span>2</span>{" "}
                              </p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/thun.png"
                                alt="img"
                              />
                              <p>
                                EPC Rating : <span>2</span>{" "}
                              </p>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <hr />
                      <label>Suitibility</label>
                      <div className="description__wrap suitibility__wrap">
                        <ul>
                          <li>
                            <p>
                              Student &nbsp;&nbsp;
                              <i className="fas fa-check text-success"></i>
                            </p>
                          </li>
                          <li>
                            <p>
                              Couple &nbsp;&nbsp;
                              <i className="fas fa-check text-danger"></i>
                            </p>
                          </li>
                          <li>
                            <p>
                              Family &nbsp;&nbsp;
                              <i className="fas fa-check text-success"></i>
                            </p>
                          </li>
                          <li>
                            <p>
                              Single &nbsp;&nbsp;
                              <i className="fas fa-check text-danger"></i>
                            </p>
                          </li>
                          <li>
                            <p>
                              Smoker &nbsp;&nbsp;
                              <i className="fas fa-check text-success"></i>
                            </p>
                          </li>
                          <li>
                            <p>
                              Pets &nbsp;&nbsp;
                              <i className="fas fa-check text-danger"></i>
                            </p>
                          </li>
                        </ul>
                      </div>
                      <hr />
                      <label>Detail Description</label>
                      <div className="details_wrap">
                        <p>
                          Beautiful 2 bedroom semi detached house in Faltham,
                          Close to Hanworth park and faltham High street and
                          local amenities. We have 2 school near by and easy
                          acess accessible to public transport. Rooms are
                          recently furnished so they are nice and clean.You will
                          feel like other home, smoking is strictly prohibited
                          inside the house. Most of the white goods are new and
                          under warrenty status. Once tenants move, all those
                          service manual will be handed over
                        </p>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <label>Key Feature</label>
                      <div className="description__wrap suitibility__wrap">
                        <ul>
                          <li>
                            <p>
                              <i className="fas fa-check text-success"></i>
                              &nbsp;&nbsp; Garden
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fas fa-check text-success"></i>
                              &nbsp;&nbsp; Bills included
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fas fa-check text-success"></i>
                              &nbsp;&nbsp; Ensuite Bathroom
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fas fa-check text-success"></i>
                              &nbsp;&nbsp; Disabled Accessibility
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fas fa-check text-success"></i>
                              &nbsp;&nbsp; Balcony/Patio
                            </p>
                          </li>
                          <li>
                            <p>
                              <i className="fas fa-check text-success"></i>
                              &nbsp;&nbsp; Laundry/Utility Room
                            </p>
                          </li>
                        </ul>
                      </div>
                      <hr />
                      <label>Other Amenities</label>
                      <div className="description__wrap">
                        <ul>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/shield.png"
                                alt="img"
                              />
                              <p>Gated Entrance</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/walkietalkie.png"
                                alt="img"
                              />
                              <p>Intercom</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/air-conditioner.png"
                                alt="img"
                              />
                              <p>Air Conditioner</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/carpark.png"
                                alt="img"
                              />
                              <p> Visitor Parking</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/washing-machine.png"
                                alt="img"
                              />
                              <p> Conservatory</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dumbbell.png"
                                alt="img"
                              />
                              <p>Gym</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/carpet.png"
                                alt="img"
                              />
                              <p>Carpet Floors</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/wooden-floor.png"
                                alt="img"
                              />
                              <p> Wood Floors</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/water-park.png"
                                alt="img"
                              />
                              <p>Waterfront</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/swimming-filled.png"
                                alt="img"
                              />
                              <p> Swimming Pool</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/heating-room.png"
                                alt="img"
                              />
                              <p> Central Heating</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/voltage.png"
                                alt="img"
                              />
                              <p> Electric Oven</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/basement.png"
                                alt="img"
                              />
                              <p>Basement / Loft</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/park-bench.png"
                                alt="img"
                              />
                              <p>Park</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/gas-industry.png"
                                alt="img"
                              />
                              <p>Gas Cooker</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/fridge.png"
                                alt="img"
                              />
                              <p> Refrigerator</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/elevator.png"
                                alt="img"
                              />
                              <p>Lift</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/fireplace.png"
                                alt="img"
                              />
                              <p>Fireplace</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/washing-machine.png"
                                alt="img"
                              />
                              <p>Washer / Dryer</p>
                            </div>
                          </li>
                          <li>
                            <div className="d-flex">
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/dishwasher.png"
                                alt="img"
                              />
                              <p>Dishwasher</p>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </TabPanel>
                    <TabPanel>
                      <div className="d-flex">
                        <button className="btn btn-secondary m-3">
                          Map View
                        </button>
                        <button className="btn btn-secondary m-3">
                          Street View
                        </button>
                        <input type="text" className="form-control m-3 w-25" />
                        <button className="btn btn-warning m-3">
                          Get Directions
                        </button>
                      </div>
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
              <div className="col-md-3">
                <button
                  onClick={() => setSendMessageStatus(true)}
                  className="form-control btn btn-outline-warning mb-2"
                >
                  Send message
                </button>
                <button
                  onClick={() => setBookViewingStatus(true)}
                  className="form-control btn btn-warning mb-2"
                >
                  Book Viewing
                </button>
                <div className="card__info">
                  <p className="card_info_head">View complience documents</p>
                  <p>
                    <a href>EPC Certficates</a>
                  </p>
                  <p>
                    <a href>Gas Safety</a>
                  </p>
                  <p className="m-0">
                    <a href>Electricity Condition</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Apply to Rent"
        visible={isApplyToRent}
        footer={null}
        width={700}
        onOk={() => setApplyToRent(false)}
        onCancel={() => setApplyToRent(false)}
      >
        <div className="applyrent__modal">
          <h4>Profile Referencing Request</h4>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <div className="info__inputwrapper"></div>
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.Lorem Ipsum is simply dummy text of the
            printing and typesetting industry.Lorem Ipsum is simply dummy text
            of the printing and typesetting industry.{" "}
            <a href>View example report</a>{" "}
          </p>
          <p className="confirm_order">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <hr />
          <div className="d-flex justify-content-between">
            <button className="btn btn-outline-primary">Cancel</button>
            <button className="btn btn-primary">Order Now</button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Send Message"
        footer={null}
        width={700}
        visible={isSendMessage}
        onOk={() => setSendMessageStatus(false)}
        onCancel={() => setSendMessageStatus(false)}
      >
        <div className="applyrent__modal">
          <h4>Message to Landlord: xxxxxxxxxxxxxxxxxxxxxxxxxxx</h4>
          <p className="confirm_order">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <div className="info__inputwrapper">
            <textarea
              className="form-control"
              placeholder="I would like to know about school of this area........"
              name="description"
              spellcheck="false"
            ></textarea>
          </div>
          <p className="text-danger">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <hr />
          <div className="text-right">
            <button className="btn btn-warning">Send</button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Book Viewing"
        footer={null}
        width={700}
        visible={isBookViewing}
        onOk={() => setBookViewingStatus(false)}
        onCancel={() => setBookViewingStatus(false)}
      >
        <div className="applyrent__modal">
          <h4>Arrange a Viewing for 2 bed Semi-detached house, TW13</h4>
          <p className="confirm_order mb-0">
            Lorem Ipsum is simply dummy text.
          </p>
          <p className="select_datetext">Lorem Ipsum is simply dummy text.</p>
          <div className="info__inputwrapper">
            <Slider className="parentClassSlider" {...settings}>
              {" "}
              {Array.from({ length: 21 }).map((img, i) => {
                return (
                  <button key={i} className="btn btn-outline-primary">
                    21 May
                  </button>
                );
              })}
            </Slider>
          </div>

          <div className="info__inputwrapper">
            <Slider className="parentClassSliderTwo" {...settingsTwo}>
              {" "}
              {Array.from({ length: 21 }).map((img, i) => {
                return (
                  <button key={i} className="btn btn-outline-primary">
                    9:00 - 9:30
                  </button>
                );
              })}
            </Slider>
          </div>
          <p className="text-danger">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.Lorem Ipsum is simply dummy text of the printing and
            typesetting industry.
          </p>
          <hr />
          <div className="text-right">
            <button className="btn btn-warning">Request Slot</button>
          </div>
        </div>
      </Modal> */}
      </div>

      {/* Public search Task - List */}
      <div>
        <div className="searchtask-list">
          <div className="searchtask__wrapper">
            <div className="container">
              <div className="row">
                <div className="main_wrap">
                  <ul>
                    <li>
                      <div className="description_wrap">
                        <p className="heading">
                          Lorem ipsum dolor, sit amet consectetur adipisicing
                          elit!
                        </p>
                        <p className="subhead">Lorem > ipsum dolor</p>
                        <p className="location_info">
                          <i className="fa fa-map-marker"></i>
                          London, London
                          <a href> view on map</a>
                        </p>
                        <p className="date_timewrap">
                          Posted on
                          <i className="fas fa-clock"></i>
                          10:20 am
                          <i className="fa fa-calendar-alt"></i>
                          20-10-2019
                        </p>
                        <div className="d-flex">
                          <button className="btn btn_open">Open</button>
                          <p>Week Days - Evening</p>
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png"
                            alt="loading..."
                          />
                          <img
                            src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                            alt="loading..."
                          />
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="budget_wrap">
                        <i className="fas fa-coins"></i>
                        <p className="budget_content">Task Budget</p>
                        <p className="amount">£200</p>
                      </div>
                    </li>
                    <li>
                      <div className="user_wrap">
                        <img
                          src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/prof-2.jpg"
                          alt=""
                        />
                        <p>Posted by</p>
                        <p className="user_name">User Name</p>
                        <div>
                          <i className="fa fa-facebook-f facebookicon"></i>
                          <i className="fa fa-linkedin-in linkedinicon"></i>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="details__wrap">
                        <button className="btn btn-primary">Task Detail</button>
                        <button className="btn btn-outline-warning">
                          Make an Offer
                        </button>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Public search Task - Grid */}
      <div>
        <div className="searchtask-grid">
          <div className="searchtask__wrapper">
            <div className="container">
              <div className="row">
                <div className="main_wrap">
                  <div className="row">
                    {/* repeating div for grid view */}
                    <div className="col-md-4">
                      <ul>
                        <li>
                          <div className="description_wrap">
                            <p className="heading">
                              Lorem ipsum dolor, sit amet consectetur
                              adipisicing elit!
                            </p>
                            <p className="subhead">Lorem > ipsum dolor</p>
                            <p className="location_info">
                              <i className="fa fa-map-marker"></i>
                              London, London
                              <a href> view on map</a>
                            </p>
                            <p className="date_timewrap">
                              Posted on
                              <i className="fas fa-clock"></i>
                              10:20 am
                              <i className="fa fa-calendar-alt"></i>
                              20-10-2019
                            </p>
                            <div className="d-flex">
                              <button className="btn btn_open">Open</button>
                              <p>Week Days - Evening</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="budget_wrap">
                            <div>
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                alt="loading..."
                              />
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                alt="loading..."
                              />
                            </div>
                            <div className="amount_wrap">
                              <i className="fas fa-coins"></i>
                              <p className="amount">£200</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="user_wrap">
                            <div className="info___wrapper">
                              <div>
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/prof-2.jpg"
                                  alt=""
                                />
                              </div>
                              <div className="details_wrap">
                                <p>Posted by</p>
                                <p className="user_name">User Name</p>
                              </div>
                            </div>
                            <div>
                              <i className="fa fa-facebook-f facebookicon"></i>
                              <i className="fa fa-linkedin-in linkedinicon"></i>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="details__wrap">
                            <button className="btn btn-primary">
                              Task Detail
                            </button>
                            <button className="btn btn-outline-warning">
                              Make an Offer
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <ul>
                        <li>
                          <div className="description_wrap">
                            <p className="heading">
                              Lorem ipsum dolor, sit amet consectetur
                              adipisicing elit!
                            </p>
                            <p className="subhead">Lorem > ipsum dolor</p>
                            <p className="location_info">
                              <i className="fa fa-map-marker"></i>
                              London, London
                              <a href> view on map</a>
                            </p>
                            <p className="date_timewrap">
                              Posted on
                              <i className="fas fa-clock"></i>
                              10:20 am
                              <i className="fa fa-calendar-alt"></i>
                              20-10-2019
                            </p>
                            <div className="d-flex">
                              <button className="btn btn_open">Open</button>
                              <p>Week Days - Evening</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="budget_wrap">
                            <div>
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                alt="loading..."
                              />
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                alt="loading..."
                              />
                            </div>
                            <div className="amount_wrap">
                              <i className="fas fa-coins"></i>
                              <p className="amount">£200</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="user_wrap">
                            <div className="info___wrapper">
                              <div>
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/prof-2.jpg"
                                  alt=""
                                />
                              </div>
                              <div className="details_wrap">
                                <p>Posted by</p>
                                <p className="user_name">User Name</p>
                              </div>
                            </div>
                            <div>
                              <i className="fa fa-facebook-f facebookicon"></i>
                              <i className="fa fa-linkedin-in linkedinicon"></i>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="details__wrap">
                            <button className="btn btn-primary">
                              Task Detail
                            </button>
                            <button className="btn btn-outline-warning">
                              Make an Offer
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-4">
                      <ul>
                        <li>
                          <div className="description_wrap">
                            <p className="heading">
                              Lorem ipsum dolor, sit amet consectetur
                              adipisicing elit!
                            </p>
                            <p className="subhead">Lorem > ipsum dolor</p>
                            <p className="location_info">
                              <i className="fa fa-map-marker"></i>
                              London, London
                              <a href> view on map</a>
                            </p>
                            <p className="date_timewrap">
                              Posted on
                              <i className="fas fa-clock"></i>
                              10:20 am
                              <i className="fa fa-calendar-alt"></i>
                              20-10-2019
                            </p>
                            <div className="d-flex">
                              <button className="btn btn_open">Open</button>
                              <p>Week Days - Evening</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="budget_wrap">
                            <div>
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/mail.png"
                                alt="loading..."
                              />
                              <img
                                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/newlove.png"
                                alt="loading..."
                              />
                            </div>
                            <div className="amount_wrap">
                              <i className="fas fa-coins"></i>
                              <p className="amount">£200</p>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="user_wrap">
                            <div className="info___wrapper">
                              <div>
                                <img
                                  src="https://res.cloudinary.com/dkxjsdsvg/image/upload/imagesoudinary.com/dkxjsdsvg/image/upload/images/udinary.com/dkxjsdsvg/image/upload/images/prof-2.jpg"
                                  alt=""
                                />
                              </div>
                              <div className="details_wrap">
                                <p>Posted by</p>
                                <p className="user_name">User Name</p>
                              </div>
                            </div>
                            <div>
                              <i className="fa fa-facebook-f facebookicon"></i>
                              <i className="fa fa-linkedin-in linkedinicon"></i>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="details__wrap">
                            <button className="btn btn-primary">
                              Task Detail
                            </button>
                            <button className="btn btn-outline-warning">
                              Make an Offer
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Search Landlord-List */}
      <div>
        {/* <div className="list__view">
          <div className="bg">
            <div className="bg_main">
              <div className="container">
                <div className="row">
                  <div className="col-md-2">
                    <div className="image_wishlist">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="list">
                      <ul>
                        <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>(Employed)</small></p></li>
                        <li className="ratings"><i className="fa fa-star" aria-hidden="true"></i><i className="fa fa-star" aria-hidden="true"></i><i className="fa fa-star" aria-hidden="true"></i><i className="fas fa-star-half-alt" aria-hidden="true"></i><i className="far fa-star" aria-hidden="true"></i>  <a href="">(153)</a></li>
                        <li className="img_li">
                          <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                          <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                        </li>
                      </ul>
                    </div>
                    <div className="description">
                      <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                      <p>2 Bed Semi-Detached House, Fernside Avenue, TW13 -1113Beautiful 2 bedroom semi detached house in Feltham; Close to Hanworth park and Feltham High street and local amenities. The ...</p>
                    </div>
                    <div className="listing">
                      <ul>
                        <li><button className="btn btn_verified">Verified   <span className="fa fa-check text-white"></span></button></li>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>                        
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="btn_rightsection text-right">
                      <button className="btn btn-primary">View Profile</button>
                      <button className="btn btn-outline-primary">View Portfolio</button>
                      <button className="btn btn_send">Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="list__view">
          <div className="bg">
            <div className="bg_main">
              <div className="container">
                <div className="row">
                  <div className="col-md-2">
                    <div className="image_wishlist">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="list">
                      <ul>
                        <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>(Employed)</small></p></li>
                        <li className="ratings"><i className="fa fa-star" aria-hidden="true"></i><i className="fa fa-star" aria-hidden="true"></i><i className="fa fa-star" aria-hidden="true"></i><i className="fas fa-star-half-alt" aria-hidden="true"></i><i className="far fa-star" aria-hidden="true"></i>  <a href="">(153)</a></li>
                        <li className="img_li">
                          <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                          <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                        </li>
                      </ul>
                    </div>
                    <div className="description">
                      <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                      <p>2 Bed Semi-Detached House, Fernside Avenue, TW13 -1113Beautiful 2 bedroom semi detached house in Feltham; Close to Hanworth park and Feltham High street and local amenities. The ...</p>
                    </div>
                    <div className="listing">
                      <ul>
                        <li><button className="btn btn_partial">Partially Verified   <span className="fa fa-check text-white"></span></button></li>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>                        
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="btn_rightsection text-right">
                      <button className="btn btn-primary">View Profile</button>
                      <button className="btn btn-outline-primary">View Portfolio</button>
                      <button className="btn btn_send">Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="list__view">
          <div className="bg">
            <div className="bg_main">
              <div className="container">
                <div className="row">
                  <div className="col-md-2">
                    <div className="image_wishlist">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                    </div>
                  </div>
                  <div className="col-md-8">
                    <div className="list">
                      <ul>
                        <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>(Employed)</small></p></li>
                        <li className="ratings"><i className="fa fa-star" aria-hidden="true"></i><i className="fa fa-star" aria-hidden="true"></i><i className="fa fa-star" aria-hidden="true"></i><i className="fas fa-star-half-alt" aria-hidden="true"></i><i className="far fa-star" aria-hidden="true"></i>  <a href="">(153)</a></li>
                        <li className="img_li">
                          <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                          <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                        </li>
                      </ul>
                    </div>
                    <div className="description">
                      <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                      <p>2 Bed Semi-Detached House, Fernside Avenue, TW13 -1113Beautiful 2 bedroom semi detached house in Feltham; Close to Hanworth park and Feltham High street and local amenities. The ...</p>
                    </div>
                    <div className="listing">
                      <ul>
                        <li><button className="btn btn-danger">Not Verified</button></li>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>                        
                      </ul>
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="btn_rightsection text-right">
                      <button className="btn btn-primary">View Profile</button>
                      <button className="btn btn-outline-primary">View Portfolio</button>
                      <button className="btn btn_send">Send Message</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
      {/* Search Landlord-Grid */}
      <div>
        {/* <div className="grid__view">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="bg">
                  <div className="bg_main">

                    <div className="wishlist__Wrapper">
                      <div className="image_wishlist">
                        <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                      </div>
                      <div className="list">
                        <ul>
                          <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>Employed</small></p></li>

                        </ul>
                        <div className="description">
                          <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <div><button className="btn btn_verified">Verified   <span className="fa fa-check text-white"></span></button></div>
                      <div className="ratings"><p><i className="fa fa-star" aria-hidden="true"></i>4.5 <a href="">(1k+)</a></p></div>
                    </div>
                    <div className="listing justify-content-center pb-3 border_btm">
                      <ul>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>
                      </ul>
                    </div>
                    <div className="img_li pt-3 pb-3">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                    </div>
                    <div className="btn_rightsection">
                      <button className="btn btn-primary">Profile</button>
                      <button className="btn btn_send">Message</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg">
                  <div className="bg_main">

                    <div className="wishlist__Wrapper">
                      <div className="image_wishlist">
                        <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                      </div>
                      <div className="list">
                        <ul>
                          <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>Employed</small></p></li>

                        </ul>
                        <div className="description">
                          <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <div><button className="btn btn_partial">Verified   <span className="fa fa-check text-white"></span></button></div>
                      <div className="ratings"><p><i className="fa fa-star" aria-hidden="true"></i>4.5 <a href="">(1k+)</a></p></div>
                    </div>
                    <div className="listing justify-content-center pb-3 border_btm">
                      <ul>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>
                      </ul>
                    </div>
                    <div className="img_li pt-3 pb-3">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                    </div>
                    <div className="btn_rightsection">
                      <button className="btn btn-primary">Profile</button>
                      <button className="btn btn_send">Message</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg">
                  <div className="bg_main">

                    <div className="wishlist__Wrapper">
                      <div className="image_wishlist">
                        <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                      </div>
                      <div className="list">
                        <ul>
                          <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>Employed</small></p></li>

                        </ul>
                        <div className="description">
                          <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <div><button className="btn btn-danger">Verified</button></div>
                      <div className="ratings"><p><i className="fa fa-star" aria-hidden="true"></i>4.5 <a href="">(1k+)</a></p></div>
                    </div>
                    <div className="listing justify-content-center pb-3 border_btm">
                      <ul>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>
                      </ul>
                    </div>
                    <div className="img_li pt-3 pb-3">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                    </div>
                    <div className="btn_rightsection">
                      <button className="btn btn-primary">Profile</button>
                      <button className="btn btn_send">Message</button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="bg">
                  <div className="bg_main">

                    <div className="wishlist__Wrapper">
                      <div className="image_wishlist">
                        <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/properties/3.jpg" alt="img" />
                      </div>
                      <div className="list">
                        <ul>
                          <li><p className="landlordname">Landlord Name<span>, M-45</span> <small>Employed</small></p></li>

                        </ul>
                        <div className="description">
                          <p className="address"> <i className="fa fa-map-marker"></i> London, 231</p>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex justify-content-center pt-3">
                      <div><button className="btn btn_verified">Verified   <span className="fa fa-check text-white"></span></button></div>
                      <div className="ratings"><p><i className="fa fa-star" aria-hidden="true"></i>4.5 <a href="">(1k+)</a></p></div>
                    </div>
                    <div className="listing justify-content-center pb-3 border_btm">
                      <ul>
                        <li><i className="mdi mdi-account-card-details verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-search-web" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-phone-in-talk verified" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-account-card-details" aria-hidden="true"></i></li>
                        <li><i className="mdi mdi-bank verified" aria-hidden="true"></i></li>
                      </ul>
                    </div>
                    <div className="img_li pt-3 pb-3">
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/mail.png" alt="img" />
                      <img src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/newlove.png" alt="img" />
                    </div>
                    <div className="btn_rightsection">
                      <button className="btn btn-primary">Profile</button>
                      <button className="btn btn_send">Message</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </>
  );
};

export default PropertyDetail;

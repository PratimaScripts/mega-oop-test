import React, { useState } from "react";
import Slider from "react-slick";
import { Modal, Menu, Dropdown } from "antd";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import { DownOutlined } from '@ant-design/icons';

import "./style.scss";

const img = [
  "https://images.unsplash.com/photo-1583345225876-637b45cd62d7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1583317916915-503b629e81a3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1583334045372-468493344b99?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1583331989229-9cc35b3e3423?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1583331989262-61e96eb9b706?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
  "https://images.unsplash.com/photo-1583195341040-54a500a13352?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
];

const Services = props => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false
  };

  const [isModalOpen, toggleModal] = useState(false);
  const [selectedTab, selectTab] = useState(0);
  return (
    <>
      <div className="services_servicepro">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                {/* repeating div start */}
                <div className="col-md-3">
                  <div
                    onClick={() => toggleModal(!isModalOpen)}
                    className="card"
                  >
                    {/* <img className="card-img-top" src="..." alt="Card image cap" /> */}
                    <Slider {...settings}>
                      {img.map((im, i) => {
                        return (
                          <div key={i}>
                            <img
                              alt="imgna"
                              className="card-img-top"
                              src={im}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                    <div className="card-body">
                      <div className="user_profile_wrap">
                        <div className="user_profile_image">
                          <img
                            alt="imgna"
                            src="https://images.unsplash.com/photo-1583331989262-61e96eb9b706?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                          />
                        </div>
                        <div className="user_profile_name">
                          <p>User Name</p>
                          <p>
                            <small>Lorem Ipsum</small>
                          </p>
                        </div>
                      </div>
                      <p className="card-text">
                        This is a longer card with supporting text below as a
                        natural.
                      </p>
                      <div className="ratings_service">
                        <p>
                          <i className="fa fa-star"></i> 5{" "}
                          <small>(1.2k+)</small>
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div>
                        <p>
                          <i className="fas fa-heart liked"></i>
                        </p>
                      </div>
                      <div>
                        <p>
                          STARTING AT <span> £123</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* repeating div end */}
                {/* repeating div start */}
                <div className="col-md-3">
                  <div
                    onClick={() => toggleModal(!isModalOpen)}
                    className="card"
                  >
                    {/* <img className="card-img-top" src="..." alt="Card image cap" /> */}
                    <Slider {...settings}>
                      {img.map((im, i) => {
                        return (
                          <div key={i}>
                            <img
                              alt="imgna"
                              className="card-img-top"
                              src={im}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                    <div className="card-body">
                      <div className="user_profile_wrap">
                        <div className="user_profile_image">
                          <img
                            alt="imgna"
                            src="https://images.unsplash.com/photo-1583331989262-61e96eb9b706?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                          />
                        </div>
                        <div className="user_profile_name">
                          <p>User Name</p>
                          <p>
                            <small>Lorem Ipsum</small>
                          </p>
                        </div>
                      </div>
                      <p className="card-text">
                        This is a longer card with supporting text below as a
                        natural.
                      </p>
                      <div className="ratings_service">
                        <p>
                          <i className="fa fa-star"></i> 5{" "}
                          <small>(1.2k+)</small>
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div>
                        <p>
                          <i className="fas fa-heart liked"></i>
                        </p>
                      </div>
                      <div>
                        <p>
                          STARTING AT <span> £123</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* repeating div end */}
                {/* repeating div start */}
                <div className="col-md-3">
                  <div
                    onClick={() => toggleModal(!isModalOpen)}
                    className="card"
                  >
                    {/* <img className="card-img-top" src="..." alt="Card image cap" /> */}
                    <Slider {...settings}>
                      {img.map((im, i) => {
                        return (
                          <div key={i}>
                            <img
                              alt="imgna"
                              className="card-img-top"
                              src={im}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                    <div className="card-body">
                      <div className="user_profile_wrap">
                        <div className="user_profile_image">
                          <img
                            alt="imgna"
                            src="https://images.unsplash.com/photo-1583331989262-61e96eb9b706?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                          />
                        </div>
                        <div className="user_profile_name">
                          <p>User Name</p>
                          <p>
                            <small>Lorem Ipsum</small>
                          </p>
                        </div>
                      </div>
                      <p className="card-text">
                        This is a longer card with supporting text below as a
                        natural.
                      </p>
                      <div className="ratings_service">
                        <p>
                          <i className="fa fa-star"></i> 5{" "}
                          <small>(1.2k+)</small>
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div>
                        <p>
                          <i className="fas fa-heart liked"></i>
                        </p>
                      </div>
                      <div>
                        <p>
                          STARTING AT <span> £123</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* repeating div end */}
                {/* repeating div start */}
                <div className="col-md-3">
                  <div
                    onClick={() => toggleModal(!isModalOpen)}
                    className="card"
                  >
                    {/* <img className="card-img-top" src="..." alt="Card image cap" /> */}
                    <Slider {...settings}>
                      {img.map((im, i) => {
                        return (
                          <div key={i}>
                            <img
                              alt="imgna"
                              className="card-img-top"
                              src={im}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                    <div className="card-body">
                      <div className="user_profile_wrap">
                        <div className="user_profile_image">
                          <img
                            alt="imgna"
                            src="https://images.unsplash.com/photo-1583331989262-61e96eb9b706?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                          />
                        </div>
                        <div className="user_profile_name">
                          <p>User Name</p>
                          <p>
                            <small>Lorem Ipsum</small>
                          </p>
                        </div>
                      </div>
                      <p className="card-text">
                        This is a longer card with supporting text below as a
                        natural.
                      </p>
                      <div className="ratings_service">
                        <p>
                          <i className="fa fa-star"></i> 5{" "}
                          <small>(1.2k+)</small>
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div>
                        <p>
                          <i className="fas fa-heart liked"></i>
                        </p>
                      </div>
                      <div>
                        <p>
                          STARTING AT <span> £123</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* repeating div end */}
                {/* repeating div start */}
                <div className="col-md-3">
                  <div
                    onClick={() => toggleModal(!isModalOpen)}
                    className="card"
                  >
                    {/* <img className="card-img-top" src="..." alt="Card image cap" /> */}
                    <Slider {...settings}>
                      {img.map((im, i) => {
                        return (
                          <div key={i}>
                            <img
                              alt="imgna"
                              className="card-img-top"
                              src={im}
                            />
                          </div>
                        );
                      })}
                    </Slider>
                    <div className="card-body">
                      <div className="user_profile_wrap">
                        <div className="user_profile_image">
                          <img
                            alt="imgna"
                            src="https://images.unsplash.com/photo-1583331989262-61e96eb9b706?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                          />
                        </div>
                        <div className="user_profile_name">
                          <p>User Name</p>
                          <p>
                            <small>Lorem Ipsum</small>
                          </p>
                        </div>
                      </div>
                      <p className="card-text">
                        This is a longer card with supporting text below as a
                        natural.
                      </p>
                      <div className="ratings_service">
                        <p>
                          <i className="fa fa-star"></i> 5{" "}
                          <small>(1.2k+)</small>
                        </p>
                      </div>
                    </div>
                    <div className="card-footer">
                      <div>
                        <p>
                          <i className="fas fa-heart liked"></i>
                        </p>
                      </div>
                      <div>
                        <p>
                          STARTING AT <span> £123</span>{" "}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* repeating div end */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Basic Modal"
        visible={isModalOpen}
        onOk={() => toggleModal(!isModalOpen)}
        onCancel={() => toggleModal(!isModalOpen)}
        footer={null}
      >
        <div className="modal_wrap">
          <Tabs
            onSelect={tab => selectTab(tab)}
            defaultIndex={"0"}
            selectedTabClassName={`selectedtab-${(selectedTab === 0 &&
              "premium") ||
              (selectedTab === 1 && "standard") ||
              (selectedTab === 2 && "basic")}`}
          >
            <TabList>
              <Tab>Premium</Tab>
              <Tab>Standard</Tab>
              <Tab>Basic</Tab>
            </TabList>
            <TabPanel>Premium</TabPanel>

            <TabPanel>Standard</TabPanel>

            <TabPanel>
              <div className="wrap_basic_plan">
                <div className="head_wrap">
                  <h1>Basic Package - For Start-up</h1>
                  <h1>£123</h1>
                </div>
              </div>
              <p className="text_card">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit.
                Dolores, veniam odit. Aut quod ex, dolor rem sed itaque natus
                deserunt quos earum iusto accusamus est eveniet obcaecati
                consectetur vitae a?
              </p>
              <Dropdown
                overlay={
                  <>
                    <Menu>
                      <Menu.Item key="0">1st menu item</Menu.Item>
                      <Menu.Item key="1">2nd menu item</Menu.Item>
                      <Menu.Divider />
                      <Menu.Item key="3">3rd menu item</Menu.Item>
                    </Menu>
                  </>
                }
                trigger={["click"]}
              >
                <a
                  href
                  className="ant-dropdown-link"
                  onClick={e => e.preventDefault()}
                >
                  Click me <i className="fas fa-chevron-down"></i>
                </a>
              </Dropdown>
            </TabPanel>
            <div className="btn_wrap">
              <button
                className={`btn btn_order_basic ${`btn_order_${(selectedTab ===
                  0 &&
                  "premium") ||
                  (selectedTab === 1 && "standard") ||
                  (selectedTab === 2 && "basic")}`} `}
              >
                Order Now <small>(£123)</small>
              </button>
            </div>
          </Tabs>
        </div>
      </Modal>
    </>
  );
};

export default Services;

import React, { useState } from "react"
import moment from "moment";
import {
    Avatar,
    Tag,
    Steps,
    Space
  } from "antd";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import {  MobileOutlined, ClockCircleOutlined } from "@ant-design/icons";



const BookViewingSenderCard = ({ bookViewing, isOpen=false }) => {
    const { Step } = Steps;
    const [collapse, setCollapse] = useState(isOpen)
    const toggle = () => setCollapse(!collapse);
    const sharePrivateInfoStatusList = ["Approved", "Accepted", "InProgress", "Completed"]

   return <Card style={{ marginBottom: "1rem" }}>
            <CardHeader
              onClick={toggle}
              data-type="collapseLayout"
              className={`card__title card__middle ${
                collapse && "active__tab"
              }`}
            >
              <span className="dot" 
              style={{ backgroundColor: bookViewing.status === "Request" ? "#bbb" :  
              (sharePrivateInfoStatusList.includes(bookViewing.status) ? "green" : "red") }}></span>
              <span>{moment(bookViewing.date).format("Do MMM YYYY")} Property View Request</span>
              <Tag className="tag">{bookViewing.status}</Tag>
              {collapse ? (
                <div className="details__icons active">
                  <i className="mdi mdi-chevron-up"></i>
                </div>
              ) : (
                <div className="details__icons">
                  <i className="mdi mdi-chevron-down down__marg"></i>
                </div>
              )}
            </CardHeader>
            <Collapse isOpen={collapse}>
              <CardBody>
                <div className="row col-12 mb-3">
                  <div className="col-4">
                 <Space size={"small"}> <ClockCircleOutlined /> {bookViewing.bookedTimeSlot ? bookViewing.bookedTimeSlot : "Not Available"}</Space>
                  </div>
                  <div className="col-6 mt-2">
                    <span>
                      <i className="fa fa-map-marker" aria-hidden="true"></i>
                      <p className="ml-3 d-inline-block">
                        {sharePrivateInfoStatusList.includes(bookViewing.status)
                        && bookViewing.propertyId?.privateTitle 
                        ? bookViewing.propertyId?.privateTitle
                        : bookViewing.propertyId?.title}
                      </p>
                    </span>
                  </div>
                </div>
                <div className="row col-12 mt-4">
                  <div className="col-4">
                    <span className="avatar-item mr-3">
                        <Avatar size="small" src={bookViewing.receiverId?.avatar} />
                    </span>
                    <p className="ml-1 d-inline-block">{bookViewing.receiverId?.firstName} {bookViewing.receiverId?.lastName}.</p>
                    <i
                      className="fa fa-envelope ml-2 custom-icon"
                      aria-hidden="true"
                    ></i>
                  </div>
                  <div className="col-4">
                    <span>
                      <MobileOutlined />
                      <p className="ml-3 d-inline-block">
                          {sharePrivateInfoStatusList.includes(bookViewing.status)
                        && bookViewing.receiverId?.phoneNumber ? bookViewing.receiverId?.phoneNumber : "+44XXXXXXXXXXX"}</p>
                    </span>
                  </div>
                </div>
                    <Steps>
                    <Step status="finish" title="Booked View" description={`You booked property view on ${moment(bookViewing.createdAt).format("Do MMM")}`} />
                    <Step status="finish" title="Requested"  description="Request has been sent to landlord" />
                    <Step title={bookViewing.status === 'Request' ? 
                    "waiting" : bookViewing.status} 
                    description={bookViewing.status === 'Request' ? 
                    "Waiting for landlord's approval" : `Your request has been ${bookViewing.status === 'Cancelled' ? "Cancelled" : bookViewing.status}`}
                    status={bookViewing.status === 'Request' ? "process" : (bookViewing.status === 'Cancelled' ? 'error': "finish") }  />
                  </Steps>    
              </CardBody>
            </Collapse>
          </Card>
}

export default BookViewingSenderCard
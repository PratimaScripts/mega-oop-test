import { Col, Layout, Row, Table, Typography } from "antd";
import React, { useContext } from "react";
import "./styles.scss";
import moment from "moment";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import RoomIndicatory from "../../../../../../../img/room-indicator.svg";
import { UserDataContext } from "store/contexts/UserContext";

const Preview = ({ generalInfo, rooms, notes, signatures }) => {
  const { state } = useContext(UserDataContext);
  const accountSetting = state.accountSettings;
  const dateFormat = !isEmpty(accountSetting)
    ? get(accountSetting, "dateFormat", "DD-MM-YYYY")
    : process.env.REACT_APP_DATE_FORMAT;

  const landlord = signatures.filter((item) => item.signeeType === "landlord");

  return (
    <Layout className="inventory-preview__container">
      <Row>
        <Col className="inventory-title" span={24}>
          <Typography.Title>Inventory {generalInfo.type}</Typography.Title>
        </Col>
        <Col span={24}>
          <p>
            Date:{" "}
            {generalInfo?.createdAt
              ? moment(generalInfo?.createdAt).format(dateFormat)
              : "-"}
          </p>
        </Col>
        <Col span={24}>
          <strong>Property Address</strong>
          <p>{generalInfo?.agreementData?.propertyAddress}</p>
        </Col>
        <Col span={24}>
          <strong>Landlord</strong>
          <p>{landlord.length ? landlord[0].name : ""}</p>
        </Col>
        <Col span={24}>
          <strong>Tenant(s)</strong>
          {generalInfo?.agreementData?.tenants?.length
            ? generalInfo?.agreementData?.tenants.map((ten) => {
                return (
                  <p>{`${ten}${
                    generalInfo?.agreementData?.tenants.length > 1 ? ", " : ""
                  }`}</p>
                );
              })
            : ""}
        </Col>
        <Col span={24}>
          <Table
            className="data-table"
            title={(_) => <strong>Meter Readings (water, gas, etc.)</strong>}
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: "Type of meter", dataIndex: "typeOfMeter" },
              { title: "Serial No", dataIndex: "serialNo" },
              { title: "M3", dataIndex: "m3" },
              { title: "Condition", dataIndex: "condition" },
              { title: "Notes", dataIndex: "notes" },
            ]}
            dataSource={generalInfo.meterReading}
          />
        </Col>
        <Col span={24}>
          <Table
            className="data-table"
            title={(_) => <strong>Electricity Meter Reading</strong>}
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: "Type of meter", dataIndex: "typeOfMeter" },
              { title: "Serial No", dataIndex: "serialNo" },
              { title: "KWH", dataIndex: "kwh" },
              { title: "Condition", dataIndex: "condition" },
              { title: "Notes", dataIndex: "notes" },
            ]}
            dataSource={generalInfo.electricityMeterReading}
          />
        </Col>
        <Col span={24}>
          <Table
            className="data-table"
            title={(_) => <strong>Heating system</strong>}
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: "Type of meter", dataIndex: "typeOfMeter" },
              { title: "Serial No", dataIndex: "serialNo" },
              { title: "M3", dataIndex: "m3" },
              { title: "Condition", dataIndex: "condition" },
              { title: "Notes", dataIndex: "notes" },
            ]}
            dataSource={generalInfo.heatingSystem}
          />
        </Col>
        <Col span={24}>
          <Table
            className="data-table"
            title={(_) => <strong>Water And Home Heating</strong>}
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: "Product type", dataIndex: "productType" },
              { title: "Wear & tear", dataIndex: "wearAndTear" },
              { title: "Condition", dataIndex: "condition" },
              { title: "Notes", dataIndex: "notes" },
            ]}
            dataSource={generalInfo.waterAndHomeHeating}
          />
        </Col>
        <Col span={24}>
          <Table
            className="data-table"
            title={(_) => <strong>Keys</strong>}
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: "Key type", dataIndex: "keyType" },
              { title: "Number", dataIndex: "number" },
              { title: "Given", dataIndex: "given" },
              { title: "Date", dataIndex: "date" },
              { title: "Comments", dataIndex: "comments" },
            ]}
            dataSource={generalInfo.keys}
          />
        </Col>
        <Col span={24}>
          <Table
            className="data-table"
            title={(_) => <strong>Other items</strong>}
            size="small"
            bordered
            pagination={false}
            columns={[
              { title: "Equipments", dataIndex: "equipments" },
              { title: "Description", dataIndex: "description" },
              { title: "Wear & tear", dataIndex: "wearAndTear" },
              { title: "Condition", dataIndex: "condition" },
              { title: "Comments", dataIndex: "comments" },
            ]}
            dataSource={generalInfo.otherItems}
          />
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <h5>Property description</h5>
        </Col>
      </Row>

      {rooms.map((room, index) => (
        <Row className="room-row" key={`room-preview-${index}`}>
          <Col span={24}>
            <strong>{room.name}</strong>
          </Col>
          <Col span={24}>
            <div className="room-title__wrapper">
              <img src={RoomIndicatory} alt="room-indicator" />
              <div className="info-paragraph">
                <Typography>
                  For each room and for each equipment, precise the nature, the
                  wear state and its functioning.
                </Typography>
                <Typography>
                  Example:{" "}
                  {
                    "<<New>>, <<In good condition>>, <<working order>>, <<out of order>>"
                  }
                  .
                </Typography>
                <Typography>
                  The image indicates the position of the walls(N-north, E-east,
                  S-south, W-west)
                </Typography>
              </div>
            </div>
          </Col>
          <Col span={24} className="comment-section">
            <Typography>Comments:</Typography>
            <p>{room.comments}</p>
          </Col>
          <Col span={24}>
            <Table
              className="data-table"
              size="small"
              bordered
              pagination={false}
              columns={[
                { title: "Equipment(s)", dataIndex: "name" },
                { title: "Description", dataIndex: "description" },
                { title: "Wear & tear", dataIndex: "wearAndTear" },
                { title: "Condition", dataIndex: "condition" },
                { title: "Comments", dataIndex: "comments" },
              ]}
              dataSource={room.equipments}
            />
          </Col>
          <Col span={24}>
            <Table
              className="data-table"
              size="small"
              bordered
              pagination={false}
              columns={[
                { title: "Wall", dataIndex: "item" },
                { title: "Description", dataIndex: "description" },
                { title: "Wear & tear", dataIndex: "wearAndTear" },
                { title: "Comments", dataIndex: "comments" },
              ]}
              dataSource={room.wallsCeilingFloor}
            />
          </Col>
          <Col span={24} className="gallery-wrapper">
            {room.images.map((image, index) => (
              <div className="gallery-image">
                <img src={image.url} alt="gallery" />
                <p>{image.name}</p>
              </div>
            ))}
          </Col>
        </Row>
      ))}
      <Row>
        <Col span={24}>
          <h5>Observation</h5>
        </Col>
        <Col span={24} className="comment-section">
          <p>{notes}</p>
        </Col>
        <Col span={24}>
          <p>
            Date: <span>{new Date().toISOString()}</span>
          </p>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <h5>Signature</h5>
          {signatures.map((item) => (
            <div key={item.email} className="signature-item">
              <strong>{item.signeeType}</strong>

              <div>
                <b>Signature: </b>
                {!item.imageUrl ? (
                  <p>
                    {item.typedName} ({item.signatureType})
                  </p>
                ) : (
                  <img
                    alt="signature"
                    src={item.imageUrl}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      backgroundColor: "#fafafa",
                      margin: "0 10px",
                    }}
                  />
                )}
              </div>
              <div>
                <b>Name: </b>
                <p>{item.name}</p>
              </div>
              <div>
                <b>Singed on: </b>
                <p>
                  {item.signedOn
                    ? moment(item.signedOn).format("DD/MM/YYYY")
                    : "Not signed"}
                </p>
              </div>
              <div>
                <b>Email: </b>
                <p>{item.email}</p>
              </div>
              <div>
                <b>IP address: </b>
                <p>{item.ipAddress}</p>
              </div>
            </div>
          ))}
        </Col>
      </Row>
    </Layout>
  );
};

export default Preview;

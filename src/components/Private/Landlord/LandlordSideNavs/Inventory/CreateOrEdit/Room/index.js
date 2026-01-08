import {
  CopyOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { Col, Tooltip, Row, Input, Typography } from "antd";
import ImageSection from "./ImageSection";
import React, { useEffect, useRef, useState } from "react";
import RoomWalls from "./RoomWalls";
import Equipments from "./Equipments";

import RoomIndicatorImg from "../../../../../../../img/room-indicator.svg";

import "./styles.scss";

const Room = ({
  changeTabName,
  tabName,
  tabIndex,
  duplicateTab,
  deleteTab,
  initialState,
  onSave,
  commentsProps,
}) => {
  const commentsRef = useRef(null);
  const imagesRef = useRef([]);
  const equipmentsRef = useRef([]);
  const wallsRef = useRef([]);

  const [roomName, setRoomName] = useState("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    commentsRef.current = initialState.comments;
    imagesRef.current = initialState.images;
    equipmentsRef.current = initialState.equipments;
    wallsRef.current = initialState.wallsCeilingFloor;
  }, [initialState]);

  useEffect(() => {
    setRoomName(tabName);
  }, [tabName]);

  useEffect(() => {
    setComments(commentsProps);
  }, [commentsProps]);

  const updateImageRef = (images) => {
    imagesRef.current = images;
  };

  const updateWallsRef = (walls) => {
    wallsRef.current = walls;
  };

  const updateEquipmentsRef = (equipments) => {
    equipmentsRef.current = equipments;
  };

  const handleInputChange = (e) => {
    setRoomName(e.target.value);
  };

  const handleInputBlur = () => {
    changeTabName(tabIndex, roomName);
  };

  const handleOnSave = () => {
    onSave(tabIndex, {
      name: roomName,
      wallsCeilingFloor: wallsRef.current,
      equipments: equipmentsRef.current,
      comments: comments,
      images: imagesRef.current,
    });
  };

  // console.log("re-render room component");

  return (
    <div className="room__wrapper bg-white p-3">
      <div gutter={[16, 16]} className="room__header orange-border">
        <Col span={24}>
          <h4>Room</h4>
        </Col>
      </div>
      <Row gutter={[16, 16]} className="room-info">
        <img src={RoomIndicatorImg} alt="indicator" />
        <div className="info-paragraph">
          <Typography>
            For each room and for each equipment, precise the nature, the wear
            state and its functioning.
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
      </Row>
      <Row gutter={[16, 16]} className="">
        <Col span={24} className="">
          <h6 className="align-center">
            Name of the Room{" "}
            <Tooltip
              placement="top"
              title="Example: Living room, Kitchen, Bedroom, etc."
            >
              <InfoCircleOutlined className="cursor-pointer" />
            </Tooltip>
          </h6>
        </Col>
      </Row>
      <div className="row">
        <div className="col-md-4 col-lg-4">
          <Input
            value={roomName}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
          />
        </div>
        <div className="col-md-8 col-lg-8 p-0">
          <button
            className="btn btn-sm btn-primary mx-2 px-3"
            icon={<CopyOutlined />}
            type="primary"
            onClick={() => duplicateTab(tabIndex)}
          >
            Duplicate
          </button>
          <button
            className="btn btn-sm btn-danger mx-2 px-3"
            icon={<DeleteOutlined />}
            danger
            onClick={() => deleteTab(tabIndex)}
          >
            Delete
          </button>
        </div>
      </div>
      <Row gutter={[16, 16]}>{/* For wall image */}</Row>

      <RoomWalls
        initialState={initialState.wallsCeilingFloor}
        onWallsArrayChange={updateWallsRef}
      />
      <Equipments
        initialState={initialState.equipments}
        onEquipmentArrayChange={updateEquipmentsRef}
      />

      <Row className="orange-border section-title">
        <Col span={24}>
          <h4>Comments</h4>
        </Col>
        <Col span={24}>
          <Input.TextArea
            placeholder="Comments"
            maxLength={300}
            minLength={100}
            showCount
            value={comments}
            onChange={(e) => {
              setComments(e.target.value);
            }}
            // ref={commentsRef}
          />
        </Col>
      </Row>

      <ImageSection
        initialState={initialState.images}
        onImageArrayChange={updateImageRef}
      />

      <Col span={24} className="save-section">
        <button className="btn btn-sm btn-primary px-3" onClick={handleOnSave}>
          Save
        </button>
        <button className="btn btn-sm btn-danger px-3">Cancel</button>
      </Col>
    </div>
  );
};

export default Room;

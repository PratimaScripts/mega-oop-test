import { Col, Row, Typography, Input } from "antd";
import React, { useEffect, useState } from "react";

const { TextArea } = Input;

const Notes = ({ onBlur, initialState }) => {
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setNotes(initialState);
  }, [initialState]);

  const handleOnChange = (e) => {
    const value = e.target.value;
    setNotes(value);
  };

  return (
    <Row>
      <Col span={24}>
        <Typography>Notes</Typography>
      </Col>
      <Col span={24}>
        <TextArea
          value={notes}
          onChange={handleOnChange}
          onBlur={() => onBlur(notes)}
          placeholder="Notes"
        />
      </Col>
    </Row>
  );
};

export default Notes;

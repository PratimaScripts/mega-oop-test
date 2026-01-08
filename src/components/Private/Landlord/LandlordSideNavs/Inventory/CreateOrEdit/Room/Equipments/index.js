import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { equipmentRow } from "../../object-types";
import EquipmentRow from "./EquipmentRow";


const Equipments = ({ initialState, onEquipmentArrayChange }) => {
  const [equipments, setEquipments] = useState([]);

  useEffect(() => {
    setEquipments(initialState);
  }, [initialState]);

  useEffect(() => {
    onEquipmentArrayChange(equipments);

    //eslint-disable-next-line
  }, [equipments]);

  const onEquipmentRowDragEnd = (args) => {
    const newEquipmentRows = [...equipments];
    const destinationIndex = args?.destination?.index,
      sourceIndex = args?.source?.index;

    if (
      destinationIndex > -1 &&
      destinationIndex < equipments.length &&
      sourceIndex > -1 &&
      sourceIndex < equipments.length
    ) {
      if (destinationIndex < sourceIndex) {
        // console.log("Up");
        newEquipmentRows.splice(
          destinationIndex,
          0,
          newEquipmentRows[sourceIndex]
        );
        newEquipmentRows.splice(sourceIndex + 1, 1);
      } else if (destinationIndex > sourceIndex) {
        // console.log("Down");
        const row = newEquipmentRows[sourceIndex];
        newEquipmentRows.splice(sourceIndex, 1);
        newEquipmentRows[destinationIndex] = row;
      }

      setEquipments(newEquipmentRows);
    }
  };

  const handleDeleteEquipmentRow = (index) => {
    const newEquipmentsRows = [...equipments];
    newEquipmentsRows.splice(index, 1);
    setEquipments(newEquipmentsRows);
  };

  const handleAddNewEquipmentRow = () => {
    setEquipments([...equipments, equipmentRow]);
  };

  const handleChangeEquipmentRows = (equipmentRow, index) => {
    const newEquipmentRows = [...equipments];
    newEquipmentRows[index] = equipmentRow;
    // console.log(newEquipmentRows);
    setEquipments(newEquipmentRows);
  };
  return (
    <div>
      <Row className="orange-border section-title">
        <Col span={24}>
          <h4>Equipments</h4>
        </Col>
      </Row>

      <DragDropContext onDragEnd={onEquipmentRowDragEnd}>
        <Droppable droppableId="Equipment-droppable-1" type="Equipment">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver ? "#F8F9FA" : "white",
              }}
              {...provided.droppableProps}
            >
              {equipments.map((rowItem, index) => (
                <Draggable
                  key={index}
                  draggableId={`Equipment-draggable-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <EquipmentRow
                        equipmentRowIndex={index}
                        data={rowItem}
                        onChange={handleChangeEquipmentRows}
                        onRowDelete={handleDeleteEquipmentRow}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Button
            // className="inline-center add-wallRow-btn"
            className="inline-center"
            type="default"
            icon={<PlusOutlined />}
            onClick={handleAddNewEquipmentRow}
          >
            Add More
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default Equipments;

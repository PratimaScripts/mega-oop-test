import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { wallsRow } from "../../object-types";
import WallsRow from "./WallsRow";

const RoomWalls = ({ onWallsArrayChange, initialState }) => {
  const [walls, setWalls] = useState([]);

  useEffect(() => {
    setWalls(initialState);
  }, [initialState]);

  useEffect(() => {
    onWallsArrayChange(walls);

    //eslint-disable-next-line
  }, [walls]);

  const handleChangeWallRows = (wallRow, index) => {
    const newWallRows = [...walls];
    newWallRows[index] = wallRow;
    setWalls(newWallRows);
  };

  const onWallRowDragEnd = (args) => {
    const newWallRows = [...walls];
    const destinationIndex = args?.destination?.index,
      sourceIndex = args?.source?.index;

    if (
      (destinationIndex > -1 && destinationIndex < walls.length) &&
      (sourceIndex > -1 && sourceIndex < walls.length)
    ) {
      if (destinationIndex < sourceIndex) {
        // console.log("Up");
        newWallRows.splice(destinationIndex, 0, newWallRows[sourceIndex]);
        newWallRows.splice(sourceIndex + 1, 1);
      } else if (destinationIndex > sourceIndex) {
        // console.log("Down");
        const row = newWallRows[sourceIndex];
        newWallRows.splice(sourceIndex, 1);
        newWallRows[destinationIndex] = row;
      }

      setWalls(newWallRows);
    }
  };

  const handleDeleteWallRow = (index) => {
    const newWallRows = [...walls];
    newWallRows.splice(index, 1);
    setWalls(newWallRows);
  };

  const handleAddNewWallRow = () => {
    setWalls([...walls, wallsRow]);
  };

  return (
    <div>
      <Row className="orange-border section-title">
        <Col span={24}>
          <h4>Walls, Ceiling, floor</h4>
        </Col>
      </Row>

      <DragDropContext onDragEnd={onWallRowDragEnd}>
        <Droppable
          droppableId="WallCeilingFloor-droppable-1"
          type="WallCeilingFloor"
        >
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={{
                backgroundColor: snapshot.isDraggingOver ? "#F8F9FA" : "white",
              }}
              {...provided.droppableProps}
            >
              {walls.map((rowItem, index) => (
                <Draggable
                  key={index}
                  draggableId={`WallCeilingFloor-draggable-${index}`}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <WallsRow
                        wallRowIndex={index}
                        data={rowItem}
                        onChange={handleChangeWallRows}
                        onRowDelete={handleDeleteWallRow}
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
            className="inline-center"
            type="default"
            icon={<PlusOutlined />}
            onClick={handleAddNewWallRow}
          >
            Add More
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default RoomWalls;

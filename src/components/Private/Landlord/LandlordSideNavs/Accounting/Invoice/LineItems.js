import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { PlusCircleOutlined } from "@ant-design/icons";
import LineItem from "./LineItem";
// import { MdAddCircle as AddIcon } from 'react-icons/md'
import styles from "./LineItems.module.scss";

const LineItems = (props) => {
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // helper function to reorder result (src: react-beautiful-dnd docs)
    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    };

    // perform reorder
    const lineItems = reorder(
      props.items,
      result.source.index,
      result.destination.index
    );

    // call parent handler with new state representation
    props.reorderHandler(lineItems);
  };

  const { items, addHandler, reorderHandler, disableForm, ...functions } =
    props;

  return (
    <form>
      <div className={styles.lineItems}>
        <div className={`${styles.gridTable}`}>
          <div className={`${styles.row} ${styles.header}`}>
            <div>#</div>
            <div>Item</div>
            <div>Description</div>
            <div>Rate</div>
            <div>Qty</div>
            <div>Total</div>
            <div></div>
          </div>

          <DragDropContext onDragEnd={(items) => handleDragEnd(items)}>
            <Droppable droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  className={
                    snapshot.isDraggingOver ? styles.listDraggingOver : ""
                  }
                >
                  {props.items.map((item, i) => {
                    const id = item.id
                      ? item.id
                      : Math.random().toString(36).substring(7);
                    return (
                      <Draggable key={id} draggableId={id} index={i}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                            className={
                              snapshot.isDragging ? styles.listItemDragging : ""
                            }
                          >
                            <LineItem
                              style={{ color: "red" }}
                              key={id}
                              index={i}
                              accountId={item.accountId || ""}
                              description={item.description}
                              quantity={item.quantity}
                              rate={item.rate}
                              disableForm={disableForm}
                              {...functions}
                            />
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>

        <div className={styles.addItem}>
          <button type="button" onClick={addHandler} disabled={disableForm}>
            <PlusCircleOutlined size="1.25em" className={styles.addIcon} /> Add
            Item
          </button>
        </div>
      </div>
    </form>
  );
};

export default LineItems;

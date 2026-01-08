import React from "react";

const Comp = props => {
  return (
    <>
      <button
        onClick={() => {
          window.open(
            "http://localhost:3001/closethis",
            "test",
            "width=500,height=500"
          );
        }}
      >
        Open
      </button>
    </>
  );
};

export default Comp;

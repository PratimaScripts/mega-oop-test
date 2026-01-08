import React from "react";

const Seperator = (props) => {
  const style = {
    height: props.height,
    width: "100%",
    margin: "20px 0px 10px 0px",
    background: props.background,
  };

  return (
    <>
      <div style={style}></div>
    </>
  );
};

export default Seperator;

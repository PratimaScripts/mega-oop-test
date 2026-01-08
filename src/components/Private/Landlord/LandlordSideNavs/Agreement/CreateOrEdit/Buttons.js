// import { Button } from "antd";
import React from "react";

export const NextButton = ({ children, ...rest }) => {
  return (
    <button className="btn btn-primary" {...rest}>
      {children}
    </button>
  );
};

export const BackButton = ({ children, ...rest }) => {
  return (
    <button className="btn btn-outline-dark mx-3" {...rest}>
      {children}
    </button>
  );
};

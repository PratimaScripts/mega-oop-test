// import { Badge } from "antd";
import React  from "react";

const ComingSoonWrapper = ({ children }) => {
  return (
    <div>
      <div
        style={{
          backgroundColor: "#13c2c2",
          color: "#fff",
          // position: "absolute",
          // top: 0,
          // left: 0,
          // zIndex: 10,
          width: 110,
          padding: "2px 10px",
          borderRadius: "2px",
        }}
      >
        Coming soon!
      </div>
      {/* <Badge.Ribbon
        badge=""
        color="cyan"
        placement="start"
        text="Coming soon!"
        style={{ zIndex: 999 }}
      >
        <div className="pt-1" />
      </Badge.Ribbon> */}
      <div
        style={{
          pointerEvents: "none",
          opacity: 0.5,
          cursor: "no-drop"
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ComingSoonWrapper;

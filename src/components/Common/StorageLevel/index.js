import {
  Spin,
  // Progress
} from "antd";
import { getStorageLevel } from "config/queries/storage";
import React, { Fragment } from "react";
import { useQuery } from "react-apollo";
// import styled from "styled-components";
import { LIMIT_50_MB } from "utils/constants";

// const ProgressBar = styled(Progress)`
//   .ant-progress-bg {
//     background-color: #ffc107;
//   }
// `;

function bytesToSize(bytes) {
  var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  if (bytes === 0) return "0 Byte";
  var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
  return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
}

const StorageLevel = () => {
  const { data, loading } = useQuery(getStorageLevel);

  const storagePercentage = (data?.getStorageLevel * 100) / LIMIT_50_MB;

  return (
    <Spin spinning={loading}>
      {data?.getStorageLevel && (
        <Fragment>
          <span>
            <a href={process.env.REACT_APP_URL} style={{ color: "#fff" }}>
              Used {bytesToSize(data?.getStorageLevel)}/50 MB
            </a>
          </span>
          {/* <ProgressBar percent={storagePercentage} showInfo={false} /> */}
          <div className="progress">
            <div
              className="progress-bar"
              role="progressbar"
              style={{ width: storagePercentage + "%" }}
            ></div>
          </div>
        </Fragment>
      )}
    </Spin>
  );
};

export default StorageLevel;

import { Progress } from "antd";
import React from "react";
import { LIMIT_50_MB } from "utils/constants";

const StorageLevel = ({ storageUsed }) => {
  return (
    <div>
      <div className="bg-custom p-4 shadow">
        <div className="inContainer">
          <p className="infoP1">
            You have used {(storageUsed / 1000000).toFixed(2)} MB (
            {((storageUsed / LIMIT_50_MB) * 100).toFixed(0)}%) of 50 MB
            authorised.{" "}
            <a
              href="/#"
              onClick={(e) => e.preventDefault()}
              style={{ color: "#357BC2" }}
            >
              Need more space?
            </a>
          </p>
          <Progress
            percent={(storageUsed / LIMIT_50_MB) * 100}
            showInfo={false}
            className="progressBar"
          />
          <h2 className="infoheading">Information</h2>
          <p className="infoP2">
            Archieve your scanned documents and share them with your tenents.
            Max storage 20 MB.
          </p>
          <p className="infoP2">
            Accepted formats Word, PDF, Pictures (GIF, JPG, PNG). Maxumum size
            15 MB.
          </p>
          <p className="infoP3">To scan your documents, you can: </p>
          <ul className="infoLi">
            <li>
              Take a picture but be careful with the framing quality of the
              image. You can also use an app for smartphones.
            </li>
            <li>
              Scan your picuture a resultion of 150 to 200 DPI is more than
              enough to avoid excessively large files.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StorageLevel;

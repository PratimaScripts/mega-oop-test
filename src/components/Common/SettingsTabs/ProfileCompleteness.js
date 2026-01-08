import React from "react";

const ProfileCompleteness = props => {
  return (
    <>
      <div className="main_head">
        <div className="container test">
          <div className="header">
            <h5>
              <b>Profile Completeness</b>
            </h5>
          </div>
          <div className="progress mb-3">
            <div className="progress-bar bg-danger" style={{ width: "30%" }}>
              {" "}
              30%{" "}
            </div>
          </div>
          <div className="progress mb-3">
            <div className="progress-bar bg-warning" style={{ width: "45%" }}>
              {" "}
              45%{" "}
            </div>
          </div>
          <div className="progress mb-3">
            <div className="progress-bar bg-success" style={{ width: "70%" }}>
              {" "}
              70%{" "}
            </div>
          </div>
          <div className="info">
            <h6>
              <b>ACCOUNT</b>
            </h6>
            <div className="row">
              <div className="col-md-6">
                Upload Profile Picture <span>5%</span>
              </div>
              <div className="col-md-6">
                Connect to Social Profile <span>10%</span>
              </div>
              <div className="col-md-6">
                Update Bank Account <span>15%</span>
              </div>
              <div className="col-md-6">
                Mobile Number Verification <span>10%</span>
              </div>
            </div>
          </div>
          <div className="info">
            <h6>
              <b>PROFILE</b>
            </h6>
            <div className="row">
              <div className="col-md-6">
                Update Income or Profession <span>10%</span>
              </div>
              <div className="col-md-6">
                Complete 2 or more profile sections <span>15%</span>
              </div>
            </div>
          </div>
          <div className="info">
            <h6>
              <b>REFERENCE</b>
            </h6>
            <div className="row">
              <div className="col-md-6">
                Get a reference <span>15%</span>
              </div>
              <div className="col-md-6">
                Complete Screening by ZYPASS <span>20%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileCompleteness;

import React, { useState } from "react";
// import get from "lodash/get";
import { useQuery } from "@apollo/react-hooks";
import { useParams } from "react-router-dom";
// import { find } from "lodash";
import AdminQueries from "../../../../../config/queries/admin";

const Portfolio = (props) => {
  // const history = useHistory();
  const serachparams = useParams().searchstring;
  const { data: allusernames } = useQuery(AdminQueries.usernameList);
  const [targetUserId, setTargetUserId] = useState();

  const handleClick = async () => {
    if (allusernames) {
      // console.log("alluser name",allusernames);
      const allusername = allusernames.usernameList.data;
      await allusername.map((userrecord) => {
        if (userrecord.userId === serachparams) {
          setTargetUserId(serachparams);
          // console.log("inside 3",targetUserId);
        }
        if (userrecord.userName === serachparams) {
          setTargetUserId(userrecord.userId);
          // console.log("inside",targetUserId);
        }
        return 0;
      });
    }
  };
  // console.log("url is",props.location.pathname);
  return (
    <div>
      <div>Hey ! Welcome {targetUserId}</div>
      <button className="btn btn-primary" onClick={handleClick}>
        Click
      </button>
    </div>
  );
};

export default Portfolio;

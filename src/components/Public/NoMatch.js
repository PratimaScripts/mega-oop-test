import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { Tag } from "antd"
import BasicHeader from "components/layout/headers/BasicHeader";
import { UserDataContext } from "store/contexts/UserContext";

import "./NoMatch.css";

const NoMatch = props => {
	const { state } = useContext(UserDataContext);
	const isAuthenticated = state.isAuthenticated;
	const role = state.userData?.role
	const path = window.location.pathname
	const isSameRole = path.includes(role);
	console.log("path", window.location.pathname, role, isSameRole )
  return (
    <>
    <BasicHeader />
    <section className="page_404">
		  <div className="text-center">
		    <div className="four_zero_four_bg">
			    <h1 className="text-center ">404</h1>
	      </div>
		
		    <div className="contant_box_404">
		      <h3 className="h2">
		        Looks like you're lost
		      </h3>
			  {(isAuthenticated && !isSameRole)? 
			  (<>
			  	<span>Your current role : <Tag color="green">{role}</Tag></span>
				  <h6>You are looking for page of diffent role</h6>
			  </>)
			//   :  (path==="/servicepro/fixit/raisetask" || path==="/servicepro/fixit/raisetask/") ?
			//   <>
			//   	<span>Your current role : <Tag color="green">{role}</Tag></span>
			// 	  <h6>You need to change role to landlord/renter to post  the maintenance task</h6>
			//   </>
			  : 
			  <p>The page you are looking for not avaible!</p>}
		
		    
		      <Link to="/" className="link_404">Go to Home</Link>
	      </div>
		  </div>
    </section>
    </>
  );
};

export default NoMatch;

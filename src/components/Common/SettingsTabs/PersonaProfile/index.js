import React, { useContext } from "react";
import PersonaQueries from "../../../../config/queries/personas";
import Personas from "./Personas";
import get from "lodash/get";
import "react-tabs/style/react-tabs.css";
import { withApollo } from 'react-apollo';
import { UserDataContext } from "store/contexts/UserContext"

const PersonaProfile = props => {
  const { state: userState } = useContext(UserDataContext)
  const { userData } = userState
  const userRole = userData.role;

  return (
    <>
      {(userRole === "renter" && (
        <Personas.PersonaRenter
          PersonaQueries={PersonaQueries}
          isPersonaUpdate={get(userData, "isPersonaUpdate", false)}
          {...props}
        />
      )) ||
        (userRole === "landlord" && (
          <Personas.PersonaLandlord
            PersonaQueries={PersonaQueries}
            isPersonaUpdate={get(userData, "isPersonaUpdate", false)}
            {...props}
          />
        )) ||
        (userRole === "servicepro" && (
          <Personas.PersonaServicePro
            PersonaQueries={PersonaQueries}
            isPersonaUpdate={get(userData, "isPersonaUpdate", false)}
            {...props}
          />
        ))}
    </>
  );
};

export default withApollo(PersonaProfile);

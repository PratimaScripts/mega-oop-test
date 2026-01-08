import React from "react";
import { Map, GoogleApiWrapper } from "google-maps-react";

const mapStyles = {
  width: "500%",
  height: "500%"
};

const MapContainer = props => {
  return (
    <Map
      google={props.google}
      zoom={8}
      style={{ width: "300%", height: "300%", position: "relative" }}
      initialCenter={{ lat: 47.444, lng: -122.176 }}
    />
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyCV4wJ_kxfj735JByJd1M2BvN72M8DlBAA"
})(MapContainer);

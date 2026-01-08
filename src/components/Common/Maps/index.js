import React, { useState } from "react";
import GoogleMapReact from "google-map-react";
import isEmpty from "lodash/isEmpty";

const AnyReactComponent = ({ text }) => (
  <i
    style={{ color: "red", fontSize: "30px" }}
    className="fa fa-map-marker"
    aria-hidden="true"
  ></i>
);

const mapStyles = {
  width: "50vw",
  height: "100vh",
};

const MapContainer = (props) => {
  const [markerObj, setMarkerObj] = useState({});

  const fetchPlaces = ({ map, maps }) => {
    const service = new maps.places.PlacesService(map);
    var request = {
      query: props.place,
      fields: ["name", "geometry"],
    };
    service.findPlaceFromQuery(request, function (results, status) {
      if (results?.length) setMarkerObj(results[0].geometry.location);
    });
  };

  return (
    <div style={mapStyles}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: process.env.REACT_APP_GOOGLE_MAPS_KEY,
          language: "en-US",
          libraries: "places",
        }}
        center={{
          lat: !isEmpty(markerObj) ? markerObj.lat() : 59.955413,
          lng: !isEmpty(markerObj) ? markerObj.lng() : 30.337844,
        }}
        defaultZoom={8}
        yesIWantToUseGoogleMapApiInternals={true}
        onGoogleApiLoaded={(data) => fetchPlaces(data)}
      >
        <AnyReactComponent
          lat={!isEmpty(markerObj) ? markerObj.lat() : 59.955413}
          lng={!isEmpty(markerObj) ? markerObj.lng() : 30.337844}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
};

export default MapContainer;

// export default GoogleApiWrapper({
//   apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
//   libraries: ["places"]
// })(MapContainer);

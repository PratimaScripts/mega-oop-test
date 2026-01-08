import React, { useState, useRef, useEffect } from "react";
import { Circle, Map, GoogleApiWrapper, Marker } from "google-maps-react";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";

const mapStyles = {
  width: "95%",
  height: "50vh"
};

const MapContainer = props => {
  let mapRef = useRef();

  const [currentZoom, setZoom] = useState(12);

  const [mainMarker, setmainMarker] = useState({
    lat: get(props, "propertyData.location.coordinates[1]", 59.955413),
    lng: get(props, "propertyData.location.coordinates[0]", 30.337844)
  });

  const [markerObj, setMarkerObj] = useState({
    lat: get(props, "propertyData.location.coordinates[1]", 59.955413),
    lng: get(props, "propertyData.location.coordinates[0]", 30.337844)
  });

  useEffect(() => {
    setmainMarker({
      lat: get(props, "propertyData.location.coordinates[1]", 59.955413),
      lng: get(props, "propertyData.location.coordinates[0]", 30.337844)
    });
    setMarkerObj({
      lat: get(props, "propertyData.location.coordinates[1]", 59.955413),
      lng: get(props, "propertyData.location.coordinates[0]", 30.337844)
    });
  }, [props]);

  const fetchPlaces = ({ map, maps }) => {
    // const service = new maps.places.PlacesService(map);
    // var request = {
    //   query: props.place,
    //   fields: ["name", "geometry"]
    // };
    // service.findPlaceFromQuery(request, function(results, status) {
    //   setMarkerObj(results[0].geometry.location);
    // });
  };

  const onclicked = data => {
    setMarkerObj({ lat: data.lat, lng: data.lng });
    setZoom(20);
  };

  return (
    <div style={mapStyles}>
      <Map
        ref={mapRef}
        onReady={fetchPlaces}
        google={props.google}
        zoom={currentZoom}
        style={mapStyles}
        center={markerObj}
      >
        <Marker
          title={"Hi this is marker"}
          name={"Your position"}
          position={mainMarker}
          animation={props.google.maps.Animation.DROP}
        // icon={{
        //   url: hood.icon,
        //   scaledSize: new props.google.maps.Size(20, 15)
        // }}
        />
        <Circle
          radius={4829}
          center={mainMarker}
          strokeColor="transparent"
          strokeOpacity={0}
          strokeWeight={5}
          fillColor="#FF0000"
          fillOpacity={0.2}
        />
        {!isEmpty(props.neighborHoodData) &&
          props.neighborHoodData.map((hood, i) => {
            return (
              <Marker
                title={hood.name}
                name={"Your position"}
                onClick={() => onclicked(hood)}
                position={{ lat: hood.lat, lng: hood.lng }}
                icon={{
                  url: hood.icon,
                  scaledSize: new props.google.maps.Size(20, 15)
                }}
              />
            );
          })}
      </Map>
    </div>
  );
};

// export default MapContainer;

export default GoogleApiWrapper({
  // apiKey: process.env.REACT_APP_GOOGLE_MAPS_KEY,
  libraries: ["places"]
})(MapContainer);

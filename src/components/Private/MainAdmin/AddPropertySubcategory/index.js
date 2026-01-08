import React, { useState } from "react";
import get from "lodash/get";
import find from "lodash/find";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import { useMutation, useQuery } from "react-apollo";
import { Skeleton } from "antd"
import PropertyQueries from "config/queries/property";
import showNotification from "config/Notification";

const Accrediations = () => {
  const [tags, setTags] = useState([
    {
      propertyName: "House",
      avatar: "",
      propertySubType: []
    },
    {
      propertyName: "Apartment",
      avatar: "",
      propertySubType: []
    },
    {
      propertyName: "Shared Property",
      avatar: "",
      propertySubType: []
    },
    {
      propertyName: "Others",
      avatar: "",
      propertySubType: []
    }
  ])
  const [loading, setLoading] = useState(true)

  useQuery(PropertyQueries.getPropertyType, {
    onCompleted: ({ getPropertyType }) => {
      if (getPropertyType.success) {
        setTags(getPropertyType.data)
      }
      setLoading(false)
    }
  })

  const updatePropertySubtypes = async data => {
    data.map(async (obj, j) => {
      // setLoading(true)
      updatePropertySubtypesMutation({ variables: { propertyType: obj } })
    });
  };

  const [updatePropertySubtypesMutation] = useMutation(PropertyQueries.updatePropertyType, {
    onCompleted: ({ updatePropertyType }) => {
      if (updatePropertyType.success) {
        showNotification("success", "Request Updated!", "")
      } else {
        showNotification("error",
          "An Error Occured", updatePropertyType.message)
      }
      // setLoading(false)
    }
  })


  const updateTags = (tagsToSet, type) => {
    // setTags(tags);
    let finalAr = [];
    let obj = find(tags, { propertyName: type });
    if (obj) {
      let subType = get(obj, "propertySubType");
      subType = tagsToSet;
      obj.propertySubType = subType;
    }

    // eslint-disable-next-line array-callback-return
    tags.map((t, i) => {
      if (t.propertyName === "type") {
        finalAr.push(obj);
      } else {
        finalAr.push(t);
      }
    });

    setTags(finalAr);
  };

  const updateAccreditations = () => {
    updatePropertySubtypes(tags);
  };

  // console.log();

  return (
    loading ? <Skeleton active /> : <div className="row">
      <h3>Add Property Subtypes</h3>{" "}
      <div className="col-md-12">
        <h4>House</h4>
        <TagsInput
          value={get(
            find(tags, { propertyName: "House" }),
            "propertySubType",
            []
          )}
          onChange={tags => updateTags(tags, "House")}
          className="tab__deatils--input"
        />
      </div>
      <br />
      <hr />
      <div className="col-md-12">
        <h4>Apartment</h4>
        <TagsInput
          value={get(
            find(tags, { propertyName: "Apartment" }),
            "propertySubType",
            []
          )}
          onChange={tags => updateTags(tags, "Apartment")}
          className="tab__deatils--input"
        />
      </div>
      <br />
      <hr />
      <div className="col-md-12">
        <h4>Shared Property</h4>
        <TagsInput
          value={get(
            find(tags, { propertyName: "Shared Property" }),
            "propertySubType",
            []
          )}
          onChange={tags => updateTags(tags, "Shared Property")}
          className="tab__deatils--input"
        />
      </div>
      <br />
      <hr />
      <div className="col-md-12">
        <h4>Others</h4>
        <TagsInput
          value={get(
            find(tags, { propertyName: "Others" }),
            "propertySubType",
            []
          )}
          onChange={tags => updateTags(tags, "Others")}
          className="tab__deatils--input"
        />
      </div>
      <button onClick={updateAccreditations}>Save</button>
    </div>
  );
};

export default Accrediations;

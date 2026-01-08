import React, { useState } from "react";
import { useMutation, useQuery } from "react-apollo";
import TagsInput from "react-tagsinput";
import { Skeleton, Button } from "antd";
import "react-tagsinput/react-tagsinput.css";
import AdminQueries from "config/queries/admin";
import showNotification from "config/Notification";

const Accrediations = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true)

  const updateTags = tags => {
    setTags(tags);
  };

  const updateAccreditations = () => {
    updateAccreditationsMutation({ variables: { accreditations: tags } });
  };



  useQuery(AdminQueries.fetchAccreditation, {
    onCompleted: ({ getAccreditation }) => {
      if (getAccreditation.success) {
        setTags(getAccreditation.data.accreditations)
      }
      setLoading(false)
    }
  })

  const [updateAccreditationsMutation] = useMutation(AdminQueries.updateAccreditation, {
    onCompleted: ({ updateAccreditation }) => {
      if (updateAccreditation.success) {
        setTags(updateAccreditation.data.accreditations)
        showNotification('success', "Accreditation Updated!", "")
      } else {
        showNotification(
          "error",
          "An error occured",
          updateAccreditation.message
        );
      }
    }
  })

  return (
    loading ? <Skeleton active /> : <div className="row">
      <h3>Accreditations</h3>{" "}
      <div className="col-md-12">
        <TagsInput
          value={tags}
          onChange={updateTags}
          className="tab__deatils--input"
        />
      </div>
      <Button onClick={updateAccreditations}>Save</Button>
    </div>
  );
};

export default Accrediations;

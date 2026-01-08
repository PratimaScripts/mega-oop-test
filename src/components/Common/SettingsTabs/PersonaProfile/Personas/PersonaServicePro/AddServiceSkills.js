import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import SericeSk from "./ServiceSkillsDropdown";
import "react-tagsinput/react-tagsinput.css";
import "./tagsInput.scss";
import { Tooltip } from "antd";

const AddSkillsTags = props => {
  const updateTags = tags => {
    setTags(tags);
  };

  // const saveUpdateTags = async () => {
  //   props.updateSkillTags(ServiceOrSkillTags);
  // };

  const [ServiceOrSkillTags, setTags] = useState(props.ServiceOrSkillTags);

  useEffect(() => {
    setTags(props.ServiceOrSkillTags);
  }, [props.ServiceOrSkillTags]);

  return (
    <Formik
      enableReinitialize
      initialValues={{ ...props.ProfessionFormData }}
      onSubmit={(values, { validateForm, setSubmitting }) => {
        setSubmitting(true);
      }}
    >
      {({ isSubmitting, setFieldValue, values, errors }) => (
        <Form>
          <div className="tab__details">
            <label className="tab__deatils--label">Tag services or skill</label>
            <Tooltip
              overlayClassName="tooltip__color"
              title="To add multiple professions press 'Enter' after each profession "
            >
              <img
                src="https://res.cloudinary.com/dkxjsdsvg/image/upload/images/i.png"
                alt="i"
              />
            </Tooltip>
            <div className="form-group">
              {/* <TagsInput
                value={ServiceOrSkillTags}
                onChange={updateTags}
                tagProps={{
                  className: "react-tagsinput-tag badge badge-primary",
                  classNameRemove: "react-tagsinput-remove"
                }}
                className="tab__deatils--input"
              /> */}
              <SericeSk values={ServiceOrSkillTags} updateTags={updateTags} />
            </div>

            
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AddSkillsTags;

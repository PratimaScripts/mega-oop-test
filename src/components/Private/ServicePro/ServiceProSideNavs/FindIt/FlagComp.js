import React, { useState } from "react";
import { Modal, message, Spin, Input } from "antd";
import { Formik, Form } from "formik";
import FetchUserLocationMetadata from "../../../../../config/LocationLookup";
import AdminQueries from "../../../../../config/queries/admin";
import { useMutation } from "@apollo/react-hooks";
import get from "lodash/get";

const { TextArea } = Input;

const FlagComp = (props) => {
  const [isFlagModalOpen, toggleFlagModal] = useState(false);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [selectedTask, selectTask] = useState(get(props, "selectedTask"));
  const [flagTask] = useMutation(AdminQueries.flagATask, {
    onCompleted: (data) => {
      if (get(data, "flagATask.success")) {
        setLoading(false);
        toggleFlagModal(false);
        message.success("Thanks for reporting! We will look into it!");
      }

      if (!get(data, "flagATask.success")) {
        setLoading(false);
        toggleFlagModal(false);
        message.error(get(data, "flagATask.message"));
      }
    },
  });

  return (
    <>
      <button
        onClick={() => toggleFlagModal(!isFlagModalOpen)}
        className="btn btn-outline-dark"
      >
        <i className="fas fa-flag" />
      </button>
      <Modal
        title="Mark as Inappropriate"
        closable={true}
        onCancel={() => toggleFlagModal(!isFlagModalOpen)}
        visible={isFlagModalOpen}
        footer={null}
      >
        <Spin spinning={loading}>
          <Formik
            onSubmit={async (values, { setSubmitting }) => {
              let flaggingLocationMetaData = await FetchUserLocationMetadata();
              setLoading(true);
              flagTask({
                variables: {
                  taskId: selectedTask._id,
                  ...values,
                  flaggingLocationMetaData,
                },
              });
            }}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form>
                <h5>Please state your reason for reporting this task:</h5>
                {/* <Field name="flagReason" component="textarea" required /> */}
                <TextArea
                  // value={value}
                  // onChange={this.onChange}
                  placeholder="..."
                  autoSize={{ minRows: 3, maxRows: 5 }}
                />
                <button className="btn btn-warning mt-3" type="submit">
                  SUBMIT
                </button>
              </Form>
            )}
          </Formik>
        </Spin>
      </Modal>
    </>
  );
};

export default FlagComp;

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import get from "lodash/get";
import AdminQueries from "../../../../config/queries/admin";
import { useMutation, useQuery } from "@apollo/react-hooks";
import showNotification from "config/Notification";

const UpdateRates = props => {
  const [adminRates, setAdminRates] = useState({});

  useQuery(AdminQueries.fetchAdminRates, {
    onCompleted: data => {
      setAdminRates(get(data, "fetchAdminRates.data"));
    }
  });

  const [updateRates] = useMutation(AdminQueries.updateAdminRates, {
    onCompleted: ({ updateAdminRates }) => {
      if (updateAdminRates.success) {
        setAdminRates(updateAdminRates.data);
        showNotification('success', 'Rate updated', '')
      }
      showNotification('success', 'Rate updated', '')

    }
  });

  return (
    <>
      <Formik
        enableReinitialize
        initialValues={adminRates}
        onSubmit={(values, { validateForm, setSubmitting }) => {
          updateRates({
            variables: {
              data: {
                name: "chargesAndTaxes",
                ...values
              }
            }
          });
        }}
      >
        {({ isSubmitting, setFieldValue, values, errors }) => (
          <Form>
            <div className="col-md-4">
              <label>VAT</label>
              <Field
                className="form-control"
                type="number"
                name="vat"
                min={1}
                placeholder="Please enter VAT"
              />

              <label>Service Charge</label>
              <Field
                className="form-control"
                type="number"
                name="serviceCharge"
                min={1}
                placeholder="Please enter Service Charge"
              />
            </div>

            <button className="btn btn-primary">Save</button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default UpdateRates;

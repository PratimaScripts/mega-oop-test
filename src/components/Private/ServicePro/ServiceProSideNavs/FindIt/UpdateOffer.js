import { Spin } from "antd";
import React, { useState } from "react";
import { useMutation } from "react-apollo";
import TaskQueries from "config/queries/tasks";
import get  from "lodash/get";

const UpdateOffer = ({ selectedTask }) => {
  const [taskOfferValue, setTaskOfferValue] = useState(0)

  const [updateTaskOffer, { loading }] = useMutation(
    TaskQueries.updateTaskOffer,
    {
      onCompleted: (updatedTasks) => {
        // setTaskOfferValue("");
        // toggleOfferModalLoader(false);
        // setTaskLists(get(updatedTasks, "updateTaskOffer.data", []));
        // toggleUpdateOfferModal(false);
      },
    }
  );

  return (
    <Spin spinning={loading} size="large" tip="Updating your offer...">
      {/* <h2>Update your offer - {get(selectedTask, "myOffer.amount")}</h2> */}
      <div className="current_offer">
        <p>
          Your current offer is <i className="mdi mdi-currency-gbp" />
          {get(selectedTask, "myOffer.amount")}{" "}
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          let bidAmount = Number(taskOfferValue).toFixed(2);
          // console.log(selectedTask.myOffer._id);
          // console.log(selectedTask);
          // toggleOfferModalLoader(true);
          // updateTaskOffer({
          //   variables: {
          //     offerId: get(selectedTask, "myOffer.offerId"),
          //     amount: Number(bidAmount),
          //     description: "test",
          //   },
          // });
        }}
      >
        <>
          <div className="text-center">
            <h3>Update Your Offer</h3>
            <div className="form-group">
              <div className="date__flex--makeorder">
                <div className="input-group-prepend">
                  <div className="input-group-text">
                    <i className="mdi mdi-currency-gbp" />
                  </div>
                </div>
                <input
                  type="number"
                  name="bidAmount"
                  value={taskOfferValue}
                  placeholder="Add an amount"
                  onChange={(e) => setTaskOfferValue(e.target.value)}
                  // min={get(selectedTask, "budgetAmount")}
                  className="form-control select----global"
                  required
                />
              </div>

              <div>
                <table className="table table-hover table-borderless">
                  <tbody>
                    <tr>
                      <td>Service Fee</td>
                      <td>
                        - <i className="mdi mdi-currency-gbp" />{" "}
                        {calculatedServiceFee}
                      </td>
                    </tr>
                    <tr>
                      <td>VAT</td>
                      <td>
                        - <i className="mdi mdi-currency-gbp" /> {calculatedVat}
                      </td>
                    </tr>
                    <tr className="recieved_amount">
                      <td>You will recieve</td>
                      <td>
                        <i className="mdi mdi-currency-gbp" />{" "}
                        {(
                          Number(taskOfferValue) -
                          calculatedServiceFee -
                          calculatedVat
                        ).toFixed(2) < 0
                          ? 0
                          : (
                              Number(taskOfferValue) -
                              calculatedServiceFee -
                              calculatedVat
                            ).toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div>
            <div className="form-group">
              <TextArea
                placeholder="Add your description"
                value={taskOfferDescription}
                onChange={(e) => setTaskOfferDescription(e.target.value)}
              />
            </div>
          </div>
          <button type="submit" className="btn btn-warning">
            {" "}
            Submit{" "}
          </button>
        </>
      </form>
    </Spin>
  );
};

export default UpdateOffer;

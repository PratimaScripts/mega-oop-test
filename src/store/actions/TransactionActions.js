import TransactionQuery from "config/queries/transaction";
import { useQuery } from "@apollo/react-hooks";
import showNotification from "config/Notification";

export const GetTransactions = (dispatch) => {
  useQuery(TransactionQuery.fetchTransactions, {
    onCompleted: ({ getTransactionList }) => {
      if (getTransactionList?.success) {
        let response = { ...getTransactionList };

        response.data.businessIncome = response.data.businessIncome.map(
          (transaction) => ({
            ...transaction,
            ...(transaction?.rentalInvoice ? transaction.rentalInvoice : {}),
          })
        );

        dispatch({
          type: "GET_TRANSACTIONS",
          payload: { ...response, data: { ...response.data } },
        });
      } else {
        showNotification(
          "error",
          getTransactionList.message || "Something went wrong."
        );
      }
    },
  });
};

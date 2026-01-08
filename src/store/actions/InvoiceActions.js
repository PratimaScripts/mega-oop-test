import InvoiceQuery from "config/queries/invoice";
import { useQuery } from "@apollo/react-hooks";

export const GetInvoices = (dispatch) => {
  useQuery(InvoiceQuery.fetchTransactions, {
    onCompleted: ({ getInvoiceList }) => {
      dispatch({
        type: "GET_TRANSACTIONS",
        payload: getInvoiceList,
      });
    },
  });
};

import React, { createContext, useCallback, useReducer } from "react";

const initalState = {
  loading: true,
  invoices: [],
  openInvoiceModal: false,
  openEditPaymentModal: false,
  transactionDetail: null,
  openCreateInvoiceModal: false,
  transactionType: "businessIncome",
  editInvoice: false,

  fetchingInvoiceById: false,
};

const InvoiceContext = createContext(initalState);

const { Provider } = InvoiceContext;

const InvoiceProvider = ({ children }) => {
  const memoizedReducer = useCallback(
    (state, action) => {
      switch (action.type) {
        case "SET_LOADING":
          return {
            ...state,
            loading: action.payload,
          };

        case "GET_INVOICES":
          return {
            ...state,
            loading: false,
            invoices: action.payload,
          };
        case "CREATE_INVOICE":
          return {
            ...state,
            loading: false,
            invoices: action.payload,
          };
        case "UPDATE_INVOICE_LIST":
          return {
            ...state,
            loading: false,
            invoices: state.invoices.map((item) =>
              item._id === action.payload._id
                ? { ...item, ...action.payload }
                : { ...item }
            ),
          };

        case "DELETE_TRANSACTION":
          return {
            ...state,
            loading: false,
            invoices: {
              ...state.invoices,
              data: state.invoices.data.filter(
                (item) => item._id !== action.payload.data._id
              ),
            },
          };
        case "DELETE_INVOICE":
          return {
            ...state,
            loading: false,
            invoices: state.invoices.filter(
              (item) => item._id !== action.payload
            ),
          };
        case "OPEN_EDIT_PAYMENT_MODAL":
          return {
            ...state,
            openEditPaymentModal: true,
            transactionDetail: action.payload,
          };
        case "CLOSE_EDIT_PAYMENT_MODAL":
          return {
            ...state,
            openEditPaymentModal: false,
          };
        case "OPEN_INVOICE_MODAL":
          return {
            ...state,
            openInvoiceModal: true,
            fetchingInvoiceById: true,
          };
        case "VIEW_INVOICE_DETAILS":
          return {
            ...state,
            fetchingInvoiceById: false,
            transactionDetail: action.payload,
          };
        case "CLOSE_INVOICE_MODAL":
          return {
            ...state,
            openInvoiceModal: false,
            fetchingInvoiceById: false,
          };
        case "OPEN_CREATE_TRANSACTION_DRAWER":
          return {
            ...state,
            editInvoice: false,
            transactionType: action.payload,
            openCreateInvoiceModal: true,
          };
        case "UPDATE_INVOICE":
          return {
            ...state,
            editInvoice: true,
            transactionType: "Business Income",
            transactionDetail: action.payload,
            openCreateInvoiceModal: true,
            ...(Object.keys(action.payload).length
              ? {}
              : { fetchingInvoiceById: true }),
          };
        case "CLOSE_CREATE_TRANSACTION_DRAWER":
          return {
            ...state,
            editInvoice: false,
            transactionDetail: null,
            openCreateInvoiceModal: false,
          };
        default:
          return state;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [initalState]
  );

  const [state, dispatch] = useReducer(memoizedReducer, initalState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { InvoiceProvider, InvoiceContext };

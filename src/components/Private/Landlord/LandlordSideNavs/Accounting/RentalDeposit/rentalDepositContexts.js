import React, { createContext, useCallback, useReducer } from 'react';
import isArray from "lodash/isArray";

const initalState = {
    loading: true,
    deposits: [],
    depositsIn: [],
    depositsOut: [],
    openDepositModal: false,
    openEditPaymentModal: false,
    depositDetail: null,
    openCreateDepositDrawer: false,
    transactionType: "businessIncome",
    editDeposit: false,
    releaseDeposit: true
};

const DepositContext = createContext(initalState);

const { Provider } = DepositContext;
let type = '';

const updatedDeposits = (deposits, depositToUpdate) => {
    if(isArray(deposits) && depositToUpdate && typeof(depositToUpdate) === 'object') {
        return deposits?.map(deposit => deposit._id === depositToUpdate._id ? depositToUpdate : deposit)
    }
    return deposits
}

const filterDepositsById = (deposits, depositId) => {
    if(isArray(deposits) && depositId) {
        return deposits?.filter(deposit => deposit._id !== depositId)
    }
    return deposits
}

const DepositProvider = ({ children }) => {
    const memoizedReducer = useCallback((state, action) => {
        switch (action.type) {
            case 'SET_LOADING':
                return {
                    ...state, loading: action.payload
                }

            case 'GET_DEPOSITS':
                return {
                    ...state, loading: false, deposits: action.payload,
                    depositsIn: action.payload.filter(deposit => deposit?.depositIncomeType === "deposit-in"),
                    depositsOut: action.payload.filter(deposit => deposit?.depositIncomeType === "deposit-out")
                }
            case 'CREATE_DEPOSIT':
                return {
                    ...state, loading: false,
                    deposits: [...state.deposits, action.payload],
                    depositsIn: action.payload?.depositIncomeType === "deposit-in" ? [ action.payload, ...state.depositsIn] : state.depositsIn,
                    depositsOut: action.payload?.depositIncomeType === "deposit-out" ? [action.payload, ...state.depositsOut] : state.depositsOut
                }
            case 'UPDATE_DEPOSIT':
                type = action.payload?.depositIncomeType;
                return {
                    ...state, loading: false,
                    deposits: updatedDeposits(state.deposits, action.payload),
                    depositsIn: action.payload?.depositIncomeType === "deposit-in" ? updatedDeposits(state.depositsIn, action.payload) : state.depositsIn,
                    depositsOut: action.payload?.depositIncomeType === "deposit-out" ? updatedDeposits(state.depositsOut, action.payload) : state.depositsOut
                }
            
            case 'DELETE_DEPOSIT':
                return {
                    ...state, loading: false,
                    deposits: filterDepositsById(state.deposits, action.payload._id),
                    depositsIn: action.payload?.depositIncomeType === "deposit-in" ? filterDepositsById(state.depositsIn, action.payload._id) : state.depositsIn,
                    depositsOut: action.payload?.depositIncomeType === "deposit-out" ? filterDepositsById(state.depositsOut, action.payload._id) : state.depositsOut
                }
            case 'OPEN_EDIT_PAYMENT_MODAL':
                return {
                    ...state,
                    openEditPaymentModal: true,
                    depositDetail: action.payload
                }
            case 'CLOSE_EDIT_PAYMENT_MODAL':
                return {
                    ...state,
                    openEditPaymentModal: false
                }
            case 'OPEN_DEPOSIT_MODAL':
                return {
                    ...state,
                    openDepositModal: true,
                    depositDetail: action.payload
                }
            case 'CLOSE_DEPOSIT_MODAL':
                return {
                    ...state,
                    openDepositModal: false
                }
            case 'OPEN_CREATE_DEPOSIT_DRAWER':
                return {
                    ...state,
                    editDeposit: false,
                    transactionType: action.payload,
                    openCreateDepositDrawer: true
                }
            case 'OPEN_CREATE_DEPOSIT_DRAWER_IN_EDIT_MODE':
                type = action.payload.transaction.transactionType ===
                    'Business Income' ? 'businessIncome' : 'businessExpenses'
                return {
                    ...state,
                    editDeposit: true,
                    transactionType: type,
                    depositDetail: action.payload,
                    openCreateDepositDrawer: true
                }
            case 'INITIATE_RELEASE_DEPOSIT':
                type = 'businessExpenses'
                return {
                    ...state,
                    editDeposit: true,
                    releaseDeposit: true,
                    transactionType: type,
                    depositDetail: action.payload,
                    openCreateDepositDrawer: true
                }
            case 'CLOSE_CREATE_DEPOSIT_DRAWER':
                return {
                    ...state,
                    editDeposit: false,
                    depositDetail: null,
                    openCreateDepositDrawer: false
                }
            default:
                return state
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initalState]);

    const [state, dispatch] = useReducer(memoizedReducer, initalState)
    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { DepositProvider, DepositContext }
import React, { createContext, useCallback, useReducer } from 'react';

const initalState = {
    loading: true,
    chartOfAccounts: [],
    openCreateChartOfAccountDrawer: false,
};

const ChartOfAccountContext = createContext(initalState);

const { Provider } = ChartOfAccountContext;
let type = '';

const ChartOfAccountProvider = ({ children }) => {
    const memoizedReducer = useCallback((state, action) => {
        switch (action.type) {

            case 'GET_CHART_OF_ACCOUNTS':
                return {
                    ...state, loading: false, chartOfAccounts: action.payload
                }
            case 'CREATE_CHART_OF_ACCOUNT':
                type = action.payload.data.chartOfAccountType ===
                    'Business Income' ? 'businessIncome' : 'businessExpenses'
                return {
                    ...state, loading: false,
                    chartOfAccounts: {
                        ...state.chartOfAccounts,
                        data: {
                            ...state.chartOfAccounts.data,
                            [type]: [action.payload.data, ...state.chartOfAccounts.data[type]]
                        }
                    }
                }
            case 'UPDATE_CHART_OF_ACCOUNT':
                type = action.payload.data.chartOfAccountType ===
                    'Business Income' ? 'businessIncome' : 'businessExpenses'

                return {
                    ...state, loading: false,
                    chartOfAccounts: {
                        ...state.chartOfAccounts,
                        data: {
                            ...state.chartOfAccounts.data,
                            [type]: state.chartOfAccounts.data[type].map(item =>
                                item._id === action.payload.data._id ?
                                    action.payload.data : item)
                        }
                    }
                }

            case 'DELETE_CHART_OF_ACCOUNT':
                type = action.payload.data.chartOfAccountType ===
                    'Business Income' ? 'businessIncome' : 'businessExpenses'

                return {
                    ...state, loading: false,
                    chartOfAccounts: {
                        ...state.chartOfAccounts,
                        data: {
                            ...state.chartOfAccounts.data,
                            [type]: state.chartOfAccounts.data[type].filter(item =>
                                item._id !== action.payload.data._id)
                        }
                    }
                }

            case 'OPEN_CREATE_CHART_OF_ACCOUNT_DRAWER':
                return {
                    ...state,
                    editChartOfAccount: false,
                    chartOfAccountType: action.payload,
                    openCreateChartOfAccountDrawer: true
                }

            case 'CLOSE_CREATE_CHART_OF_ACCOUNT_DRAWER':
                return {
                    ...state,
                    openCreateChartOfAccountDrawer: false
                }
            default:
                return state
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, initalState);

    const [state, dispatch] = useReducer(memoizedReducer, initalState)
    return <Provider value={{ state, dispatch }}>{children}</Provider>
}

export { ChartOfAccountProvider, ChartOfAccountContext }
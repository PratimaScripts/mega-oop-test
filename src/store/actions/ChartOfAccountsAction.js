import AccountQueries from "config/queries/account";
import { useQuery } from '@apollo/react-hooks';


export const GetChartOfAccounts = (dispatch) => {
    useQuery(AccountQueries.fetchChartOfAccount, {
        fetchPolicy: "cache-and-network",
        onCompleted: ({ getChartOfAccount }) => {
            // console.log("Data fetched", getChartOfAccount)
            dispatch({
                type: 'GET_CHART_OF_ACCOUNTS', payload: getChartOfAccount.data
            });
        }
    });
}

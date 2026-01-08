import React from "react";
import { useQuery } from '@apollo/react-hooks';
import { Spin, notification, Select, Alert } from 'antd';

import AccountsQuery from '../../../../../config/queries/account';

const { Option, OptGroup } = Select;

const SelectChartOfAccountList = ({
    accountType = 'businessExpenses',
    placeholder = 'Select Account Type',
    className = "w-100",
    size = "large",
    onStateChanged = f => f
}) => {
    /* possibe value of account types => capitalInflow, businessExpenses, capitalOutflow, businessIncome  */

    const { loading, error, data } = useQuery(AccountsQuery.fetchChartOfAccount);

    const nameOfAmountType = accountType === 'businessExpenses' ? 'Business Expenses' : 'Business Income'
    const typeOfAmountFlow = accountType === 'businessExpenses' ? 'capitalOutflow' : 'capitalInflow';
    const nameOfAmountFlow = typeOfAmountFlow === 'capitalOutflow' ? 'Capital Outflow' : 'Capital Inflow';
    if (error) {
        notification['error']({
            message: 'Unable to fetch data',
            description: error,
        });
        return (
            <Alert message="Unable to fetch data" type="error" />
        )
    }
    // console.log("Account type", data);

    return (
        <>
            {loading ? <Spin /> : data && data.getChartOfAccount.success ? (
                <Select
                    placeholder={placeholder}
                    className={className}
                    onChange={(value) => onStateChanged(value)}
                    size={size}
                >
                    <OptGroup label={nameOfAmountType}>
                        {data.getChartOfAccount.data[accountType].map(accountType => (accountType.accountName &&
                            <Option
                                key={accountType._id}
                                value={accountType._id}
                            >
                                {accountType.accountName}
                            </Option>
                        ))}
                    </OptGroup>
                    <OptGroup label={nameOfAmountFlow}>
                        {data.getChartOfAccount.data[typeOfAmountFlow].map(accountType => (accountType.accountName &&
                            <Option
                                key={accountType._id}
                                value={accountType._id}
                            >
                                {accountType.accountName}
                            </Option>
                        ))}
                    </OptGroup>
                </Select>
            ) : <Alert message="Unable to fetch data" type="error" />}
        </>

    )
}

export default SelectChartOfAccountList;
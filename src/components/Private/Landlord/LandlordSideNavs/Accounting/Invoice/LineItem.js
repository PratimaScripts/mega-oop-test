import React from "react";
import styles from "./LineItem.module.scss";
import AccountsQuery from "config/queries/account";
import { useQuery } from "@apollo/react-hooks";
import { Select } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

const LineItem = (props) => {
  const { Option, OptGroup } = Select;
  const { index, accountId, description, quantity, rate } = props;

  // console.log(accountId)

  const {
    loading: accountsLoading,
    // error: accountsError,
    data: accountsData,
  } = useQuery(AccountsQuery.fetchChartOfAccount, {
    fetchPolicy: "cache-and-network",
  });

  return (
    <div className={styles.lineItem}>
      <div>{index + 1}</div>
      <div>
        <Select
          name="accountId"
          className="w-100"
          size="large"
          value={accountId ? accountId : undefined}
          placeholder="Select Income Type"
          required={true}
          loading={accountsLoading}
          onChange={(value) => props.nameChangeHandler(value, index)}
          disabled={props.disableForm}
        >
          <OptGroup label="Business Income">
            {accountsData?.getChartOfAccount?.data["businessIncome"]?.map(
              (accountType) =>
                accountType.accountName && (
                  <Option key={accountType._id} value={accountType._id}>
                    {accountType.accountName}
                  </Option>
                )
            )}
          </OptGroup>
          <OptGroup label="Capital Inflow">
            {accountsData?.getChartOfAccount?.data["capitalInflow"]?.map(
              (accountType) =>
                accountType.accountName && (
                  <Option key={accountType._id} value={accountType._id}>
                    {accountType.accountName}
                  </Option>
                )
            )}
          </OptGroup>
        </Select>
      </div>

      <div>
        <input
          name="description"
          type="text"
          placeholder=" Add description"
          value={description}
          onChange={(e) => props.changeHandler(e, index)}
          disabled={props.disableForm}
        />
      </div>

      <div className={styles.currency}>
        <input
          name="rate"
          step="1"
          type="number"
          min="0.00"
          max="9999999.99"
          value={rate}
          required={true}
          onChange={(e) =>
            !isNaN(parseFloat(e.target.value)) && props.changeHandler(e, index)
          }
          onFocus={props.focusHandler}
          disabled={props.disableForm}
        />
      </div>

      <div>
        <input
          name="quantity"
          type="number"
          step="1"
          value={quantity}
          required={true}
          onChange={(e) =>
            !isNaN(parseFloat(e.target.value)) && props.changeHandler(e, index)
          }
          onFocus={props.focusHandler}
          disabled={props.disableForm}
        />
      </div>
      <div className={styles.currency}>
        {props.currencyFormatter(quantity * rate)}
      </div>
      <div>
        <button
          type="button"
          className={styles.deleteItem}
          onClick={props.deleteHandler(index)}
          disabled={props.disableForm}
        >
          <DeleteOutlined size="1.25em" />
        </button>
      </div>
    </div>
  );
};

export default LineItem;

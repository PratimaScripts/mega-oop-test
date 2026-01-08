import React, { useState, useRef } from "react";
import ReactToPrint from "react-to-print";
import { Drawer } from "antd";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import ChartOfAccountTabs from "./coaTabs";
import { Formik, Form, Field } from "formik";
import ChartOfAccountSchema from "config/FormSchemas/ChartOfAccount";
import { useQuery, useMutation } from "@apollo/react-hooks";

// import { CSVLink, CSVDownload } from "react-csv";
import showNotification from "config/Notification";
import AccountQueries from "config/queries/account";
import AccountTable from "./AccountTable";


const ChartOfAccount = props => {
  const printBusinessExpenses = useRef();
  const printBusinessIncome = useRef();
  const printCapitalInflow = useRef();
  const printCapitalOutflow = useRef();
  const printButtonRef = useRef();


  const chartOfAccounts = useRef({});
  const [activeRef, setActiveRef] = useState(printBusinessExpenses);
  const [activeTab, setActiveTab] = useState(0);
  const [drawerType, setDrawerType] = useState("new");
  const [updateData, setUpdateData] = useState({});
  const [openAddCoaDrawer, setCoaDrawer] = useState(false);
  const [loading, setLoading] = useState(true)
  let printAr = [
    printBusinessExpenses,
    printBusinessIncome,
    printCapitalOutflow,
    printCapitalInflow
  ];

  // let finalData = [
  //   chartOfAccounts["businessExpenses"],
  //   chartOfAccounts["businessIncome"],
  //   chartOfAccounts["capitalOutflow"],
  //   chartOfAccounts["capitalInflow"]
  // ];

  useQuery(
    AccountQueries.fetchChartOfAccount, {
    onCompleted: ({ getChartOfAccount }) => {
      if (getChartOfAccount.success && getChartOfAccount.data) {
        chartOfAccounts.current = getChartOfAccount.data
      }
      setLoading(false)
    },
    onError: (error) => {
      setLoading(false)
    }
  })

  const organiseData = (coaData) => {
    const byAdmin = []
    const notByAdmin = []
    coaData?.forEach(item => item.isCreatedByAdmin ?
      byAdmin.push(item) : notByAdmin.push(item))
    return [...byAdmin, ...notByAdmin]
  }

  const [addChartOfAccount] = useMutation(AccountQueries.addChartOfAccount, {
    onCompleted: ({ createChartOfAccount }) => {
      if (createChartOfAccount.success && createChartOfAccount.data) {
        chartOfAccounts.current = createChartOfAccount.data;
        closeDrawer();
        showNotification("success", "Chart of Account Added!", "");
      } else {
        showNotification("error", "Failed to update chart of Accounts", "");
      }
      setLoading(false)
    },
    onError: (error) => {
      showNotification("error", `Failed to update chart of Accounts`, "");
      setLoading(false)

    }
  }
  )
  // context.startLoading();


  const [updateChartOfAccount] = useMutation(AccountQueries.updateChartOfAccount, {
    onCompleted: ({ updateChartOfAccount }) => {
      if (updateChartOfAccount.success && updateChartOfAccount.data) {
        chartOfAccounts.current = updateChartOfAccount.data
        showNotification("success", "Chart of Account Updated!", "");
      } else {
        showNotification("error", "Failed to update chart of Accounts", "");
      }
      setLoading(false)
      setCoaDrawer(false)
    },
    onError: (error) => {
      showNotification("error", `Failed to update chart of Accounts`, "");
      setLoading(false)
    }
  }
  )

  let businessIncomeCategories = [
    {
      title: "Property Income",
      value: "propertyIncome"
    }
  ];

  let businessCapitalOutflowCategories = [
    {
      title: "Capital Expenses",
      value: "capitalExpenses"
    }
  ];

  let businessCapitalInflowCategories = [
    {
      title: "Capital Income",
      value: "capitalIncome"
    },
    {
      title: "Capital Receipts",
      value: "capitalReceipts"
    }
  ];

  let businessExpensesCategories = [
    {
      title: "Legal and Professional costs",
      value: "legalProfessionalCosts"
    },
    {
      title: "Finance Charges",
      value: "financeCharges"
    },
    {
      title: "Rent rates, insurance, ground rent",
      value: "rentRatesInsurance"
    },
    {
      title: "Repair, Maintenance, and renewals",
      value: "repairMaintenance"
    },
    {
      title: "Other Expenses",
      value: "otherExpenses"
    },
    {
      title: "Costs of services provided, inlcuding wages",
      value: "costOfServicesProvided"
    }
  ];

  // const downloadCSV = data => {
  //   let obj = finalData[data];
  // };

  const onChange = data => {
    let value = data.target.value;

    value === "Business Expenses" &&
      changeAccountType(businessExpensesCategories);
    value === "Business Income" && changeAccountType(businessIncomeCategories);
    value === "Capital Outflow" &&
      changeAccountType(businessCapitalOutflowCategories);
    value === "Capital Inflow" &&
      changeAccountType(businessCapitalInflowCategories);
  };

  let [accountType, changeAccountType] = useState(businessExpensesCategories);

  const closeDrawer = () => {
    setCoaDrawer(false);
  };
  const openDrawer = (type, data) => {
    setCoaDrawer(true);
    setDrawerType(type);
    setUpdateData(data);
  };

  const setActiveTabValue = tab => {
    setActiveRef(printAr[tab]);
    setActiveTab(tab);
    // downloadCSV(tab);
  };

  return (

    <>
      <Tabs className="charact__tabs" defaultIndex={activeTab}>
        <TabList>
          <Tab onClick={() => setActiveTabValue(0)}>Business Expenses</Tab>
          <Tab onClick={() => setActiveTabValue(1)}>Business Income</Tab>
          <Tab onClick={() => setActiveTabValue(2)}>Capital Outflow</Tab>
          <Tab onClick={() => setActiveTabValue(3)}>Capital Inflow</Tab>
        </TabList>
        <div className="row">
          <div className="col-md-12 text-right">
            <div className="print__download">
              <ReactToPrint
                trigger={() => (
                  <button hidden ref={printButtonRef}>
                    Print!
                  </button>
                )}
                content={() => activeRef.current}
              />
              {/* <button onClick={() => openDrawer("new", {})}>Add New</button> */}
            </div>
          </div>
        </div>
        <TabPanel>
          <AccountTable
            coaData={organiseData(chartOfAccounts.current["businessExpenses"])}
            testRef={printBusinessExpenses}
            openDrawer={openDrawer}
            printButtonRef={printButtonRef}
            loading={loading}
          />
        </TabPanel>
        <TabPanel>
          <AccountTable
            coaData={organiseData(chartOfAccounts.current["businessIncome"])}
            testRef={printBusinessIncome}
            openDrawer={openDrawer}
            printButtonRef={printButtonRef}
            loading={loading}
            setLoading={setLoading}
          />
        </TabPanel>
        <TabPanel>
          <AccountTable
            coaData={organiseData(chartOfAccounts.current["capitalOutflow"])}
            testRef={printCapitalOutflow}
            openDrawer={openDrawer}
            printButtonRef={printButtonRef}
            loading={loading}
            setLoading={setLoading}
          />
        </TabPanel>
        <TabPanel>
          <AccountTable
            coaData={organiseData(chartOfAccounts.current["capitalInflow"])}
            testRef={printCapitalInflow}
            openDrawer={openDrawer}
            printButtonRef={printButtonRef}
            loading={loading}
            setLoading={setLoading}
          />
        </TabPanel>
      </Tabs>
      <Drawer
        title="Add Chart Of Account"
        // level={"#root"}
        width={window.innerWidth > 900 ? 500 : window.innerWidth - 100}
        zIndex={99999}
        className="drawer__parent"
        placement="right"
        onClose={closeDrawer}
        visible={openAddCoaDrawer}
        destroyOnClose={true}
      >
        <Formik
          initialValues={updateData}
          validationSchema={ChartOfAccountSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            setSubmitting(true);
            if (drawerType === "new") {
              // console.log(values)
              addChartOfAccount({ variables: values });
            }

            if (drawerType === "update") {
              let obj = {};
              obj.chartId = updateData._id;
              obj.accountType = values.accountType;
              obj.accountName = values.accountName;
              obj.category = values.category;
              // console.log(obj)
              updateChartOfAccount({ variables: obj });
            }
          }}
        >
          {({ isSubmitting, setFieldValue, errors, values }) => (
            <Form>
              <label className="labels__global">Account Type</label>
              <div className="form-group">
                <select
                  name="accountType"
                  defaultValue={values["accountType"]}
                  component="select"
                  className={
                    errors["accountType"]
                      ? "form-control error__field_show"
                      : "form-control tab__select"
                  }
                  onChange={e => {
                    onChange(e);
                    setFieldValue("accountType", e.target.value);
                  }}
                >
                  <option selected disabled value>
                    Please select account type
                  </option>
                  <option value="Business Expenses">Business Expenses</option>
                  <option value="Business Income">Business Income</option>
                  <option value="Capital Outflow">Capital Outflow</option>
                  <option value="Capital Inflow">Capital Inflow</option>
                </select>
              </div>

              <label className="labels__global">Select Category</label>
              <div className="form-group">
                <Field
                  name="category"
                  component="select"
                  className={
                    errors["category"]
                      ? "form-control error__field_show"
                      : "form-control tab__select"
                  }
                >
                  <option selected disabled value>
                    Please select category
                  </option>
                  {accountType.map((o, i) => {
                    return (
                      <option key={i} value={o.title}>
                        {o.title}
                      </option>
                    );
                  })}
                </Field>
              </div>

              <label className="labels__global">Enter Name</label>
              <div className="form-group">
                <Field
                  placeholder="Enter name"
                  type="text"
                  name="accountName"
                  className={
                    errors["accountName"]
                      ? "form-control error__field_show"
                      : "form-control tab__select"
                  }
                />
              </div>

              <div className="save__cancel--btn">
                <div className="form-group">
                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="btn save__btn"
                  >
                    {drawerType === "new" ? "Add" : "Update"}
                  </button>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    disabled={isSubmitting}
                    className="btn cancel__btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Drawer>
    </>
  );
};

export default ChartOfAccount;

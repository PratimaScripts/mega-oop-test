import * as Yup from "yup";

const ChartOfAccountSchema = Yup.object().shape({
  accountType: Yup.string().required("Account type is Required!"),
  category: Yup.string().required("Category is Required!"),
  accountName: Yup.string().required("Account Name is Required!")
});

export default ChartOfAccountSchema;

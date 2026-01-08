import * as Yup from "yup";

const ProfessionSchema = Yup.object().shape({
  profession: Yup.string().required("Profession is Required!"),
  professionCustom: Yup.string().optional(),
  businessType: Yup.string().required("Business type is Required!"),
  UTR: Yup.string().required("UTR is Required!"),
  VAT: Yup.string().required("VAT is required!"),
  companyName: Yup.string().required("Company Name is required!"),
  startDate: Yup.date()
    .required("Start date is required!")
    .nullable()
});

export default { ProfessionSchema };

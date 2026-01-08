import * as Yup from "yup";

const ProfessionSchema = Yup.object().shape({
  profession: Yup.string().required("Profession is Required!"),
  professionCustom: Yup.string().optional(),

  jobType: Yup.string().required("Job type is Required!"),
  jobTitle: Yup.string().required("Job title is required!"),
  companyName: Yup.string().optional().nullable(),
  // companyWebsite: Yup.string()
  //   .url()
  //   .required("Company Website is required"),
  companyWebsite: Yup.string()
    .url()
    .optional().nullable(),
  companyTelephone: Yup.string()
    .required("Phone Number is required!")
    .min(10, "Too Short!"),
  startDate: Yup.date()
    .required("Start Date is required!")
    .nullable()
});

const AccrediationSchema = Yup.object().shape({
  organization: Yup.string().required("Organisation is Required!"),
  organizationCustom: Yup.string().optional(),

  documentNumber: Yup.string().required("Document Name is Required!"),
  startDate: Yup.date()
    .required("Start Date is required!")
    .nullable()
});

const ProfessionSchemaServicePro = Yup.object().shape({
  profession: Yup.string().required("Profession is Required!"),
  professionCustom: Yup.string().optional(),
  businessType: Yup.string().required("Business type is Required!"), // not
  UTR: Yup.string().optional().nullable(),
  VAT: Yup.string().optional().nullable(),
  // companyName: Yup.string().required("Company Name is required!"),
  companyName: Yup.string().optional().nullable(),
  startDate: Yup.date()
    .optional()
    .nullable()
});

const obj = {
  ProfessionSchema,
  AccrediationSchema,
  ProfessionSchemaServicePro
};
export default obj;
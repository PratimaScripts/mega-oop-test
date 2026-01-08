import * as Yup from "yup";

const AboutFormSchema = Yup.object().shape({
  firstName: Yup.string()
    .nullable()
    .required("First Name is Required!"),
  lastName: Yup.string().required("Last Name is Required!"),
  middleName: Yup.string()
    .optional()
    .nullable(),
  companyName: Yup.string()
    .optional()
    .nullable(),
  companyRegistrationNumber: Yup.string()
    .optional()
    .nullable(),
  phoneNumber: Yup.number()
    .required("Phone Number is required!")
    .min(10, "Too short!"),
  // dob: Yup.date()
  //   .required("Date of Birth is required!")
  //   .nullable(),
  dob: Yup.date()
    .optional()
    .nullable(),
  // nationality: Yup.string().required("Nationality is required!"),
  nationality: Yup.string().optional().nullable(),

  // gender: Yup.string().required("Gender is required!")
  gender: Yup.string().optional().nullable()
});

export default AboutFormSchema;

import * as Yup from "yup";

const EmailCheckSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please Enter a Valid Email!")
    .required("Please Enter a Valid Email!")
});

const PasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Too Short!")
    .required("Required")
});

const obj = { PasswordSchema, EmailCheckSchema };
export default obj;
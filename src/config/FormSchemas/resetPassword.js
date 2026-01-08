import * as Yup from "yup";

const PasswordResetSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .min(6, "Too Short!")
    .required("Old Password is Required!"),
  newPassword: Yup.string()
    .min(6, "Too Short!")
    .required("Password is required"),
  newPasswordConfirm: Yup.string()
    .oneOf([Yup.ref("newPassword"), null], "Passwords don't match")
    .required("Please enter the password again")
});

export default PasswordResetSchema;

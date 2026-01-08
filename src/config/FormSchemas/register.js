import * as Yup from "yup";

const RegistrationFormSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is Required!"),
  password: Yup.string()
    .min(8, "Too Short!")
    .required("Password is required").matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, 'Password must contain at least one letter and one number.'),
  comfirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords don't match")
    .required("Please enter the password again")
});

export default RegistrationFormSchema;

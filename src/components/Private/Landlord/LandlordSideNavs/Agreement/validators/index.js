import * as Yup from "yup";
import moment from "moment";

export const agreementTypeValidation = Yup.object({
  agreementType: Yup.string().required("Agreement type is required!"),
  templateType: Yup.string().when("agreementType", (agreementType) => {
    if (agreementType === "template") {
      return Yup.string().required("Template type is required!");
    }
  }),
});

export const generalInfoValidation = Yup.object({
  propertyId: Yup.string().required("Property is required!"),
  occupation: Yup.object({
    adults: Yup.number()
      .required("Adults must be between 1 and 9")
      .max(9, "Maximum 9 Adults allowed only!")
      .min(1, "There should be at least one adult!"),
    kids: Yup.number()
      .required("Kids must be between 0 and 9")
      .max(9, "Maximum 9 Kids allowed only!")
      .min(0),
    pets: Yup.number()
      .required("Pets must be between 0 and 9")
      .max(9, "Maximum 9 Pets allowed only!")
      .min(0),
  }),
});

export const renterTransactionValidation = Yup.object({
  hasAutoRecurring: Yup.boolean().required(),
  rate: Yup.number().required("Transaction rate is required!"),
  paymentScheduleType: Yup.string().required("Schedule payment type is required!"),
  paymentMethod: Yup.string().required("Payment method is required!"),
  paymentStartDate: Yup.date().transform(function(value,originalValue){       //custom validation function to validate dd-mm-yyyy formats instead of Date()
      if (this.isType(value)) return value;
      value = moment(originalValue, "DD-MM-YYYY");
      return value.isValid() ? value.toDate() : Yup.date.INVALID_DATE;
    }).notRequired(),
  invoiceAdvanceDays: Yup.string().notRequired(),
  deposit: Yup.object({
    hasSecurityDeposit: Yup.boolean().required(),
    amount: Yup.number().when("hasSecurityDeposit", {
      is: true,
      then: Yup.number().required("Deposit number must a number!"),
      otherwise: Yup.number().notRequired(),
    }),
    type: Yup.string().when("hasSecurityDeposit", {
      is: true,
      then: Yup.string().required("Deposit type must a string!"),
      otherwise: Yup.string().notRequired(),
    }),
  }),
  information: Yup.string().notRequired()
});

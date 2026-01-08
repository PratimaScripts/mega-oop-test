import * as Yup from "yup";

Yup.addMethod(Yup.object, "atLeastOneOf", function(list) {
  return this.test({
    name: "atLeastOneOf",
    // eslint-disable-next-line no-template-curly-in-string
    message: "${path} must have at least one of these keys: ${keys}",
    exclusive: true,
    params: { keys: list.join(", ") },
    test: value => value == null || list.some(f => value[f] != null)
  });
});

const RentalDetailsSchema = Yup.object().shape({
  monthlyRent: Yup.number().required("Monthly Rent is Required!"),
  deposit: Yup.number().required("Deposit is Required!"),

  minimumDurationInMonth: Yup.number().required("Deposit is Required!"),
  maxOccupancy: Yup.string().required(),
  furnishing: Yup.string().required(),
  parking: Yup.string().required(),
  EPCRating: Yup.string()
    .notRequired()
    .nullable(),
  reasonEPC: Yup.string()
    .notRequired()
    .nullable(),
  // description: Yup.string().required(),

  // preference: Yup.object()
  //   .shape({
  //     family: Yup.boolean(),
  //     student: Yup.boolean(),
  //     couple: Yup.boolean(),
  //     single: Yup.boolean(),
  //     smoker: Yup.boolean(),
  //     pets: Yup.boolean()
  //   })
  //   .atLeastOneOf(["family", "student", "couple", "single", "smoker", "pets"]),

  // features: Yup.object()
  //   .shape({
  //     garden: Yup.boolean(),
  //     billsIncluded: Yup.boolean(),
  //     disabledAccessability: Yup.boolean(),
  //     balconyPatio: Yup.boolean(),
  //     unsuitedBathroom: Yup.boolean(),
  //     laundryUtilityRoom: Yup.boolean()
  //   })
  //   .atLeastOneOf([
  //     "garden",
  //     "billsIncluded",
  //     "disabledAccessability",
  //     "balconyPatio",
  //     "unsuitedBathroom",
  //     "laundryUtilityRoom"
  //   ])
});

export default RentalDetailsSchema;

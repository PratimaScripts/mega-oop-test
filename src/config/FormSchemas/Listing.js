import * as Yup from "yup";

export const ListingScheduleSchema = Yup.object().shape({
    earliestMoveInDate: Yup.date().required("Earliest move-in date is required"),
    dayAvailability: Yup.string().required("Day Availability is required"),
    timeAvailability: Yup.string().required("Time Availability is required")
})


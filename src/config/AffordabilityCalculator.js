import get from "lodash/get";

const calculateAffordability = async data => {
  let affordability = 0;
  let jobType = data["jobType"];
  let salary = data["salary"];

  let aObj = {
    affordability,
    message: "",
    status: ""
  };

  //   For Full Time
  if (jobType === "Full-Time" || jobType === "Fixed-Term Contract") {
    let salaryDuration = get(salary, "duration", "yearly");

    if (salaryDuration === "yearly") {
      // Annual
      affordability = salary["amount"] / 12 / 2.5;
    }

    if (salaryDuration === "monthly") {
      // Monthly
      affordability = salary["amount"] / 2.5;
    }
  }
  //   For Full Time End

  //   For Temporary Contract
  if (jobType === "Temporary Contract") {
    let salaryDuration = get(salary, "duration", "daily");

    if (salaryDuration === "daily") {
      // Daily, requires workdays per week
      affordability = (salary["amount"] * 4 * data["workdaysPerWeek"]) / 2.5;
    }

    if (salaryDuration === "hourly") {
      // Hourly, requires hours per week
      affordability = (salary["amount"] * 4 * data["hoursPerWeek"]) / 2.5;
    }
  }
  //   For Temporary Contract End

  //   Check Final conditions and return object
  if (affordability > 300) {
    aObj["affordability"] = affordability;
    aObj["message"] = "Verified up to £2118.63 per month";
    aObj["status"] = "Pass";
  }
  if (affordability <= 300) {
    aObj["affordability"] = affordability;
    aObj["message"] = "Verified only up to £200 per month";
    aObj["status"] = "Caution";
  } else {
    aObj["affordability"] = affordability;
    aObj["message"] = "No earnings or income is unverified";
    aObj["status"] = "Caution";
  }

  return aObj;
};

export default calculateAffordability;

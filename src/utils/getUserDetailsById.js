import axios from "axios";
import showNotification from "config/Notification";

const BACKEND_SERVER = process.env.REACT_APP_SERVER;

const getUserDetailsById = async ({ userId: id, defaultRole: role }) => {
  try {
    const { data } = await axios({
      method: "POST",
      url: `${BACKEND_SERVER}/api/wise/paytype`,
      data: { id, role },
    });
    return data.details;
  } catch (error) {
    // console.log(error);
    showNotification("error", "An error occurred!")
  }
};

export default getUserDetailsById;

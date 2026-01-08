import { notification } from "antd";

const showNotification = (type, message, description) => {
  notification[type]({
    message,
    description,
    duration: 6
  });
};

export default showNotification;

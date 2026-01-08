import { message } from "antd";

const loadingMessage = text => {
  const hide = message.loading(text, 0);
  // Dismiss manually and asynchronously
  setTimeout(hide, 1500);
};

export default loadingMessage;

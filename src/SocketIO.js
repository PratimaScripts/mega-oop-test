import io from "socket.io-client";

// const ENV_TYPE = process.env.NODE_ENV; // development or production

const SOCKET_URL = process.env.REACT_APP_SERVER;

const socket = io(SOCKET_URL);

export default socket;


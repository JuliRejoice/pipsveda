import socketIOClient from "socket.io-client";
import { getCookie } from "../../cookie";


const localdata = getCookie("userToken");

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
// const SOCKET_URL = "https://259s7s89-6002.inc1.devtunnels.ms";
let socket = null;
if (localdata) {
  socket = socketIOClient(SOCKET_URL, {
    extraHeaders: {
      ["authorization"]: localdata,
      "ngrok-skip-browser-warning": "1234",
    },
  });
}

export const connectSocket = () => {
  if (localdata) {
    socket = socketIOClient(SOCKET_URL, {
      extraHeaders: {
        ["authorization"]: localdata,
        "ngrok-skip-browser-warning": "1234",
      },
    });
  }
};
export const getSocket = () => {
  return socket;
};
import * as io from "socket.io-client";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        // here we listen for an event to happen
        //here we are receiving a message FROM the server

        socket.on("welcome", (msg) => {
            // here i'm passing a variable to this callback function
            // this variable will have any data received from the server

            console.log("hopefully we see this: ", msg);
        });

        socket.on("messageSentWithIoEmit", (payload) => {
            console.log("payload from messageSentWithIoEmit: ", payload);
        });

        socket.on("broadcastEmitFun", (data) => {
            console.log("broadcastEmitFun data: ", data);
        });

        //sending a message to the server
        socket.emit("messageFromClient", [1, 2, 3]);
    }
};

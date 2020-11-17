import * as io from "socket.io-client";
// import {chatMessages, chatMessage} from "./actions"
// .....you will have to write this actions

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();
    }
    socket.on("chatHistory", (chatMsgs) => {
        console.log("last 10 chat msgs: ", chatMsgs);

        //what you want to do with this once it logs the actual chat history is:
        // dispatch an action that then adds the history to redux global state
    });
    socket.on("newMsgToAddToHistory", (newMsg) => {
        console.log("new message to add to chat: ", newMsg);
        //this will eventually be a new msg object we to:
        // dispatch an action to add the object to redux global state
    });
};

/*

IVANAS CODE
 // socket.on(
        //     "chatMessages", 
        //     msgs => store.dispatch(
        //         chatMessages(msgs)
        //     )
        // )

        // here we listen for an event to happen
        //here we are receiving a message FROM the server

        socket.on("welcome", (msg) => {
            // here i'm passing a variable to this callback function
            // this variable will have any data received from the server
            // console.log("hopefully we see this: ", msg);
        });

        socket.on("messageSentWithIoEmit", (payload) => {
            // console.log("payload from messageSentWithIoEmit: ", payload);
        });

        socket.on("broadcastEmitFun", (data) => {
            // console.log("broadcastEmitFun data: ", data);
        });

        //sending a message to the server
        socket.emit("messageFromClient", [1, 2, 3]);
        
        */

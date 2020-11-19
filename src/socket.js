import * as io from "socket.io-client";

import { chatMessages, chatMessage } from "./actions";
// .....you will have to write this actions

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("chatHistory", (messages) => {
            //what you want to do with this once it logs the actual chat history is:
            // dispatch an action that then adds the history to redux global state
            store.dispatch(chatMessages(messages));
            console.log({ messages });
        });

        socket.on("addNewMessage", (message) => {
            console.log({ message });
            //this will eventually be a new msg object we to:
            // dispatch an action to add the object to redux global state
            store.dispatch(chatMessage(message));
        });
    }
};

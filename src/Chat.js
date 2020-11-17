import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
//we will do some emitting of new messages from here: this is why my chat needs access to socket

import { useSelector } from "react-redux";

export default function Chat() {
    const chatMessages = useSelector((state) => state.chatMessages);
    console.log("chatMessages", chatMessages); //for now this will be undefined
    // !!!!! you need to:
    // 1. create a chatt table
    // 2. add a bit of dummy data
    // 3. complete the socket connection
    // 4. dispatch and action
    // 5. put the chat history in redux global state
    // ...and then this cont will have actual value

    const elemRef = useRef();

    useEffect(() => {
        // console.log("chat just mounted");
        // console.log("elemRef: ", elemRef);
        // console.log("scroll top: ", elemRef.current.scrollTop);
        // console.log("clientHeight: ", elemRef.current.clientHeight);
        // console.log("scrollHeight: ", elemRef.current.scrollHeight);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            // console.log("user wants to send message");
            e.preventDefault();
            console.log("value in textarea: ", e.target.value);

            //here we need to emit the msg ->
            socket.emit("My amazing new msg", e.target.value);

            // here we empty the text area again->
            e.target.value = "";
        }
    };

    return (
        <>
            <h1>I am the Chat Component</h1>
            <div className="chat-display-container">
                <p>Chat holaaaaaaaa</p>
                <p>Chat messageeeeeee</p>
                <p>Chat cómo estásss</p>
                <p>Chat yo reee bien jejejej</p>
                <p>Chat me alegrooo</p>
                <p>Chat saludosssss</p>
                <p>Chat graciassssss</p>
                <p>Chat messageeeeeee</p>
            </div>
            <textarea
                onKeyDown={keyCheck}
                placeholder="type whatever in hereeeee"
            />
        </>
    );
}

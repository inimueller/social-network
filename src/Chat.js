import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
//we will do some emitting of new messages from here: this is why my chat needs access to socket

import { useSelector } from "react-redux";

// !!!!! you need to:
// 1. create a chatt table
// 2. add a bit of dummy data
// 3. complete the socket connection
// 4. dispatch and action
// 5. put the chat history in redux global state
// ...and then this cont will have actual value

export default function Chat() {
    const chatMessages = useSelector((state) => state && state.chatMessages);
    const chatMessage = useSelector((state) => state && state.chatMessage);
    // console.log("chatMessages: ", chatMessages);

    const elemRef = useRef();

    // useEffect(() => {
    //     console.log("chat just mounted");
    //     ˀ;
    //     // console.log("elemRef: ", elemRef);
    //     // console.log("scroll top: ", elemRef.current.scrollTop);
    //     // console.log("clientHeight: ", elemRef.current.clientHeight);
    //     // console.log("scrollHeight: ", elemRef.current.scrollHeight);
    //     elemRef.current.scrollTop =
    //         elemRef.current.scrollHeight - elemRef.current.clientHeight;
    // }, []);

    const keyCheck = (evt) => {
        if (evt.key === "Enter") {
            // console.log("user wants to send message");
            evt.preventDefault();
            console.log("value in textarea: ", evt.target.value);
            socket.emit("newMessage", evt.target.value);
            evt.target.value = "";
        }
    };

    console.log("chatMessages: ", chatMessages);

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
                marginTop: "40px",
            }}
        >
            <div>
                <div>
                    <h1>Chat</h1>
                </div>
                <div
                    id="chat-container"
                    style={{
                        boxShadow: "0px 0px 50px rgba(0, 0, 0, 0.1)",
                        borderRadius: "10px",
                        width: "400px",
                        justifyContent: "center",
                    }}
                >
                    <div
                        id="chat-messages"
                        style={{
                            padding: "30px",
                            justifyContent: "right",
                        }}
                        ref={elemRef}
                    >
                        {chatMessages &&
                            chatMessages.map((each) => (
                                <div key={each.id}>
                                    <p>{each.message}</p>
                                    <p
                                        style={{
                                            color: "darkgoldenrod",
                                            fontSize: "12px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {each.first}
                                        &nbsp;
                                        {each.last}
                                    </p>
                                </div>
                            ))}
                    </div>

                    <div>
                        <textarea
                            style={{
                                fontFamily: "Dosis",
                                marginLeft: "30px",
                                width: "321px",
                                marginBottom: "24px",
                            }}
                            onKeyDown={keyCheck}
                            placeholder="Type here..."
                        />
                    </div>

                    {/* <button onClick={keyCheck}>Send</button> */}
                </div>
            </div>
        </div>
    );
}

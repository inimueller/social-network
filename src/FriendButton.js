import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherUserId }) {
    const [buttonText, setButtonText] = useState(""); // double check if empty string
    const [error, setError] = useState(false); //default -> false (Andrea said, but why?)

    useEffect(() => {
        axios
            .get(`/friendStatus/${otherUserId}`)
            .then(({ data }) => {
                // console.log({ data });
                setButtonText(data.buttonText);
            })
            .catch((err) => setError(err));
    }, []);

    function buttonClick() {
        // console.log("onClick working");
        axios
            .post(`/friendStatus/${buttonText}`, {
                id: otherUserId,
            })
            .then(({ data }) => {
                // console.log("data", data);

                setButtonText(data.buttonText);
            })
            .catch((err) => setError(err));
    }

    return (
        <>
            {error && <div>Oops, something went wrong!</div>}

            <button onClick={buttonClick}>{buttonText}</button>
        </>
    );
}

import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState(""); // double check if empty string
    const [error, setError] = useState(false); //default -> false (Andrea said)

    useEffect(() => {
        axios
            .get(`/friendship/${id}`)
            .then(({ data }) => {
                console.log({ data });
                setButtonText(data.message);
            })
            .catch((err) => setError(err));
    }, [buttonText]);

    function buttonClick() {
        axios
            .post(`/friendship/${buttonText}`, {
                id: otherUserId,
            })
            .then(({ data }) => {
                console.log("data", data);

                setButtonText();
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

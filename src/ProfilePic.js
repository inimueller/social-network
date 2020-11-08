import React from "react";

export default function ProfilePicture({
    imgUrl,
    first,
    last,
    toggleComponent,
}) {
    return (
        <>
            <img
                id="profilePic"
                src={
                    imgUrl ||
                    "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                }
                onClick={() => toggleComponent("uploaderIsVisible")}
            />
        </>
    );
}

import React from "react";

export default function Xmpl({ first, last, imgUrl }) {
    // console.log("props from App: ", props);
    return (
        <>
            <h2>I'm the exmaple component</h2>
            <h3>My name comes from App and it's {first}</h3>
            <img src={imgUrl || "/img/default.jpg"} />
            {/* u can do this in app */}
        </>
    );
}

import React, { useState, useEffect } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState([]);
    const [error, setError] = useState([]);

    // 1. investigar si api acá o en index o en ambos

    useEffect(() => {
        axios.get("/api/users").then((data) => {
            console.log(data);
            setUsers(data.rows);
        });
    }, []);

    useEffect(() => {
        axios.get(`/api/users/${search}`).then(({ data }) => {
            console.log(data);
            // conditionally sending error
            if (!data.success) {
                setError("error");
                setUsers([]);
            } else {
                setError(null);
                setUsers(data.rows);
            }
        });
    }, [search]);

    return (
        <div
            style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
            }}
        >
            <div
                id="container"
                style={{
                    width: "800px",
                }}
            >
                <div id="search-input">
                    <input
                        name="search"
                        autoComplete="off"
                        placeholder="Search"
                        onChange={(e) => setSearch(e.target.value)}
                        defaultValue={search}
                    ></input>
                </div>
                <div
                    style={{
                        display: "flex",
                        flexWrap: "wrap",
                    }}
                >
                    {users &&
                        users.map((user) => (
                            <div
                                key={user.id}
                                id="profile-container"
                                style={{
                                    width: "240px",
                                }}
                            >
                                <Link to={`/user/${user.id}`}>
                                    <div
                                        id="profile-pic-container"
                                        style={{
                                            height: "140px",
                                            overflow: "hidden",
                                        }}
                                    >
                                        <img
                                            style={{ width: "140px" }}
                                            src={
                                                user.url ||
                                                "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                                            }
                                        />
                                    </div>
                                    <div style={{ marginLeft: "30px" }}>
                                        <p>
                                            {user.first} {user.last}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    <div style={{ marginLeft: "0px" }}>
                        {error === "error" && <p>Oooops no user found!</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}

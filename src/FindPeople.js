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
        <>
            <div id="search-input">
                <input
                    name="search"
                    autoComplete="off"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                    defaultValue={search}
                ></input>
                {/* {error && <p>{error}</p>} */}
            </div>
            <div>
                {users &&
                    users.map((user) => (
                        <div key={user.id} className="profile-container">
                            <Link to={`/user/${user.id}`}>
                                <div id="profile-pic-container">
                                    <img
                                        src={
                                            user.url ||
                                            "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                                        }
                                    />
                                    <p>
                                        {user.first} {user.last}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}

                {error === "error" && <p>Oooops no user found!</p>}
            </div>
        </>
    );
}

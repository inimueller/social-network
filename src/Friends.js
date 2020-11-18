import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getList, acceptFriend, unfriend } from "./Actions";

export default function Friends() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getList());
    }, []);

    const friends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => user.accepted)
    );

    const wannabes = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((user) => !user.accepted)
    );

    // console.log("wannabes: ", wannabes);
    // console.log("friends: ", friends);

    return (
        <>
            <div
                style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <div>
                    <div
                        style={{
                            padding: "16px",
                        }}
                    >
                        <h2>Friends</h2>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            width: "800px",
                            flexWrap: "wrap",
                        }}
                    >
                        {friends &&
                            friends.map((user) => (
                                <div
                                    id="friend"
                                    style={{
                                        padding: "16px",
                                    }}
                                    key={user.id}
                                >
                                    <Link
                                        style={{ textDecoration: "none" }}
                                        to={`user/${user.id}`}
                                    >
                                        <h3>{user.first + " " + user.last}</h3>
                                        <img
                                            className="profile-pic-friends"
                                            src={
                                                user.url ||
                                                "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697.png"
                                            }
                                            alt={user.first + " " + user.last}
                                        />
                                    </Link>
                                    <div className="button-friends">
                                        <button
                                            onClick={() =>
                                                dispatch(unfriend(user.id))
                                            }
                                        >
                                            Unfriend
                                        </button>
                                    </div>
                                </div>
                            ))}
                        <div
                            style={{
                                padding: "16px",
                            }}
                        >
                            <h2>Friend Requests</h2>
                        </div>
                        <div
                            style={{
                                display: "flex",
                                width: "800px",
                                flexWrap: "wrap",
                            }}
                        >
                            {wannabes &&
                                wannabes.map((user) => (
                                    <div
                                        id="wannabes"
                                        style={{
                                            padding: "16px",
                                        }}
                                        key={user.id}
                                    >
                                        <Link
                                            style={{ textDecoration: "none" }}
                                            to={`user/${user.id}`}
                                        >
                                            <h3>
                                                {user.first + " " + user.last}
                                            </h3>
                                            <img
                                                className="profile-pic-friends"
                                                src={
                                                    user.url ||
                                                    "https://static.toiimg.com/photo/msid-67586673/67586673.jpg?3918697"
                                                }
                                                alt={
                                                    user.first + " " + user.last
                                                }
                                            />
                                        </Link>

                                        <div className="button-friends">
                                            <button
                                                onClick={() =>
                                                    dispatch(unfriend(user.id))
                                                }
                                            >
                                                Accept Friend Request
                                            </button>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

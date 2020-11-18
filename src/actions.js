// will contain all of our action creator functions
// action creator is just a function that returns an object
// the object that is returned is called ACTION
// every sigle action will return an object that has a type on it, like so:

// export function fn() {
//     return {
//         type: "UPDATE_STH",
//     };
// }

import axios from "./axios";

export function getList() {
    return axios.get("/getFriends").then(({ data }) => {
        return {
            type: "GET_LIST",
            friendsList: data.rows,
        };
    });
}

export function acceptFriend(id) {
    let buttonText = "Accept Friend Request";

    return axios
        .post(`/friendStatus/${buttonText}`, { id: id })
        .then(({ data }) => {
            return {
                type: "ACCEPT_FRIEND",
                id: data.id,
            };
        });
}

export function unfriend(id) {
    let buttonText = "Unfriend";

    return axios.post(`/friendStatus/${buttonText}`, { id: id }).then(() => {
        return {
            type: "UNFRIEND",
            id: id,
        };
    });
}

// ---> async await version:

// export async function getList() {
//     const { data } = await axios.get("api/getFriends");
//     return {
//         type: "GET_LIST",
//         friendsList: data.rows,
//     };
// }

// export async function acceptFriend(id) {
//     const { data } = await axios.post(`/friendStatus/acceptFriend`, {
//         id: id,
//     });
//     return {
//         type: "ACCEPT_FRIEND_REQUEST",
//         id: id,
//     };
// }

// export async function unfriend(id) {
//     const { data } = await axios.post(`/friendStatus/unfriend`, {
//         id: id,
//     });
//     return {
//         type: "UNFRIEND",
//         id: id,
//     };
// }

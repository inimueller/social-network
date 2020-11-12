import axios from "axios";
import { bindActionCreators } from "redux";

export async function receiveUsers() {
    const { data } = await axios.get("/users");
    return {
        type: "RECEIVE_USERS",
        users: data.users,
    };
}

export async function makeHot(id) {
    const { data } = await axios.post(`/hot/${id}`);
    // console.log("data in makeHotaction: ", data);

    if (data.success) {
        return {
            type: "MAKE_HOT",
            id: id,
        };
    }
}

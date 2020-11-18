// the reducer has two parameters
// 1. global state
// 2. action

export default function Reducer(state = {}, action) {
    if (action.type == "GET_LIST") {
        state = {
            ...state,
            friendsWannabes: action.friendsList,
        };
    }

    if (action.type == "ACCEPT_FRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((user) => {
                console.log("user, action.id: ", user, action.id);
                if (user.id == action.id) {
                    console.log("updating: ", user);
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.filter((user) => {
                if (user.id != action.id) {
                    return user;
                }
            }),
        };
    }

    return state;
}

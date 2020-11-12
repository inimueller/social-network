export default function (state = {}, action) {
    if (action.type == "RECEIVE_USERS") {
        state = Object.assign({}, state, {
            users: action.users,
        });
    }
    return state;
}

if (action.type == "RECEIVE_USERS") {
    status = Object.assign({}, state, {
        users: action.users,
    });
}

if (action.type == "MAKE_HOT") {
    state = {
        ...state,
        users: state.users.map((user) => {
            if (user.id == action.id) {
                return {
                    ...user,
                    hot: true,
                };
            } else {
                // for the ones that not match my id:
                return user;
            }
        }),
    };
}

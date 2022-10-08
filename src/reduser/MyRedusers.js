const MyInistialState = {
    fulInfo: [],
    AdminLogin:''
};

export const MyRedusers = (state = MyInistialState, action) => {
    switch (action.type) {
        case "USER_FULL_INFO" : {
            return {...state, fulInfo: action.payload}
        }
        case "ADMIN" : {
            return {...state, AdminLogin: action.payload}
        }
        default: {
            return state
        }
    }
};
const MyInistialState = {
    Loading: false,

};

export const MyRedusers = (state = MyInistialState, action) => {
    switch (action.type) {
        case "LOADING" : {
            return {...state, Loading: action.payload}
        }
        default: {
            return state
        }
    }
};
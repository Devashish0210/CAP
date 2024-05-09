import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type InitialState = {
    data: {
        name: string,
        status: string,
        comment: string
    }[], isLoading: boolean
}

const initialState: InitialState = {
    data: [{
        name: "Reporting Manager",
        status: "",
        comment: ""
    }, {
        name: "Finance",
        status: "",
        comment: ""
    }, {
        name: "Admin",
        status: "",
        comment: ""
    }, {
        name: "CIS",
        status: "",
        comment: ""
    }, {

        name: "HRSS",
        status: "",
        comment: ""
    }, {
        name: "Final Settlement",
        status: "",
        comment: "",
    }], isLoading: true
}

export const ndcSlice = createSlice({
    name: "ndc",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<InitialState>) => {
            return action.payload
        }
    }
})

export const { setState } = ndcSlice.actions;
export { initialState }
export default ndcSlice.reducer
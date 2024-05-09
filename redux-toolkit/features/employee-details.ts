import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type InitialState = {
    doj: string
    empID: string
    lwd: string
    name: string
    title: string
}

const initialState: InitialState = { "doj": "", "lwd": "", "name": "", "title": "", "empID": "" }

export const employeeDetailsSlice = createSlice({
    name: "employee_details",
    initialState: initialState,
    reducers: {
        setState: (state, action: PayloadAction<InitialState>) => {
            return action.payload
        }
    }
})

export const { setState } = employeeDetailsSlice.actions;
export { initialState }
export default employeeDetailsSlice.reducer
import axios from "axios";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import { InitialStateData as TicketStatusInitialStatus } from "@/redux-toolkit/features/ticket-status";
import handleLogout from '../../_api-helpers/LogOut'
import { AppDispatch } from "@/redux-toolkit/store";

type CreateTicket = {
    "ticket_category": string,
    "ticketTitle": string,
    "ticketDetails": string,
    "mobile": string,
    "attachment_filename": string,
    "attachment": string
}

type CreateTicket2 = {
    "ticket_category": string,
    "ticketTitle": string,
    "ticketDetails": string,
    "mobile": string
}

const createTickets = async (data: CreateTicket | CreateTicket2, employeeLoginState: InitialState, dispatch: AppDispatch, router: any): Promise<boolean> => {
    try {

        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/tickets/create-tickets", data, {
            headers: {
                'X-EMAIL': employeeLoginState.email,
                'X-ALUMNIOTP': employeeLoginState.otp,
                'X-EMPID': employeeLoginState.empID
            }
        });
        if (response.status === 403) {
            handleLogout(dispatch, router)
            return false
        }
        if (response.status < 200 || response.status >= 300) {
            return false
        }
        return true
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response && err.response.status === 403) {
                handleLogout(dispatch, router)
            } else {
                console.log(err)
            }
        } else {
            console.log(err)
        }
        return false;
    }
};

export default createTickets;

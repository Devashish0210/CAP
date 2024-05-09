import axios from "axios";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import { InitialStateData as TicketStatusInitialStatus } from "@/redux-toolkit/features/ticket-status";
import handleLogout from '../../_api-helpers/LogOut'
import { AppDispatch } from "@/redux-toolkit/store";

const getTickets = async (employeeLoginState: InitialState, dispatch: AppDispatch, router: any): Promise<TicketStatusInitialStatus> => {
    try {

        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/tickets/get-tickets", {}, {
            headers: {
                'X-EMAIL': employeeLoginState.email,
                'X-ALUMNIOTP': employeeLoginState.otp,
                'X-EMPID': employeeLoginState.empID
            }
        });
        if (response.status === 403) {
            handleLogout(dispatch, router)
            return []
        }
        if (response.status < 200 || response.status >= 300) {
            return []
        }
        return response.data["objTicketList"].map((value: any) => {
            return {
                "ticketDisplayNo": value["ticketDisplayNo"],
                "createdOn": value["createdOn"],
                "statusName": value["statusName"],
                "classificationName": value["classificationName"],
                "lastUpdatedOn": value["lastUpdatedOn"],
            }
        });
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
        return [];
    }
};

export default getTickets;

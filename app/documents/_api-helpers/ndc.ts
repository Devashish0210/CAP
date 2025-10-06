import axios from "axios";
import { InitialState } from "@/redux-toolkit/features/employee-login-state";
import handleLogout from "../../_api-helpers/LogOut";
import { AppDispatch } from "@/redux-toolkit/store";

export type NdcRecord = {
    cisNdcStatus?: string;
    cisNdcComment?: string;
};

export async function fetchNdc(): Promise<NdcRecord> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/ndc`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load NDC");
  const data = await res.json();

  // Adapt incoming shape to what the UI expects
  return {
    ...data,
    cisNdcStatus: data?.cis?.status ?? data?.cisStatus ?? "",
    cisNdcComment: data?.cis?.comment ?? data?.cisComment ?? "",
  };
}

const getNDC = async (employeeLoginState: InitialState, dispatch: AppDispatch, router: any) => {
    try {
        const response = await axios.post(process.env.NEXT_PUBLIC_BACKEND_BASE_URL + "/alumni/ndc-details", {}, {
            headers: {
                'X-EMAIL': employeeLoginState.email,
                'X-ALUMNIOTP': employeeLoginState.otp,
                'X-EMPID': employeeLoginState.empID
            }
        });
        if (response.status === 403) {
            handleLogout(dispatch, router)
            return {
                "hrss_ndc": "Failed To Fetch",
                "finance_ndc": "Failed To Fetch",
                "cis_ndc": "Failed To Fetch",
                "cis_comment": "Failed To Fetch",
                "admin_ndc": "Failed To Fetch",
                "rm_ndc": "Failed To Fetch",
                "payroll_ndc": "Failed To Fetch",
                "payroll_ndc_comment": "Failed To Fetch"
            }
        }
        if (response.status != 200) {
            return {
                "hrss_ndc": "Failed To Fetch",
                "finance_ndc": "Failed To Fetch",
                "cis_ndc": "Failed To Fetch",
                "cis_comment": "Failed To Fetch",
                "admin_ndc": "Failed To Fetch",
                "rm_ndc": "Failed To Fetch",
                "payroll_ndc": "Failed To Fetch",
                "payroll_ndc_comment": "Failed To Fetch"
            }
        }
        if (response.data) {
            return response.data;
        } else {
            return {
                "hrss_ndc": "No Information",
                "finance_ndc": "No Information",
                "cis_ndc": "No Information",
                "cis_comment": "No Information",
                "admin_ndc": "No Information",
                "rm_ndc": "No Information",
                "payroll_ndc": "No Information",
                "payroll_ndc_comment": "No Information"
            }
        }

    } catch (error) {
        // Handle error communicating with the server for sending the email
        if (axios.isAxiosError(error) && error.response && error.response.status === 403) {
            handleLogout(dispatch, router)
        }
        console.log("Error sending email to server:", error);
        return {
            "hrss_ndc": "Failed to Fetch",
            "finance_ndc": "Failed to Fetch",
            "cis_ndc": "Failed to Fetch",
            "cis_comment": "Failed to Fetch",
            "admin_ndc": "Failed to Fetch",
            "rm_ndc": "Failed to Fetch",
            "payroll_ndc": "Failed to Fetch",
            "payroll_ndc_comment": "Failed to Fetch"
        }
    }
};

export default getNDC;

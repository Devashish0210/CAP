import { toast } from "react-toastify";
import axios from "axios";
// import "reactjs-popup/dist/index.css";
//@ts-ignore
import Cookies from "js-cookie";
import logout from "./Logout";
("./Logout");
const sendVerificationToBackend = async (
  email: string,
  otp: string,
  employeeNumber: string,
  lastWorkingDay: Date,
  dispatch: any
) => {
  try {
    const dateList = lastWorkingDay.toLocaleDateString().split("/");
    const formattedDate = dateList[2] + "-" + dateList[0] + "-" + dateList[1];
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BGV_REQUEST_ENDPOINT}`,
      {
        employee_id: employeeNumber,
        last_working_day: formattedDate,
      },

      {
        headers: {
          "content-type": "application/json",
          "X-EMAIL": email,
          "X-OTP": otp,
        },
        validateStatus: function (status) {
          return (
            (status >= 200 && status < 300) ||
            status === 404 ||
            status === 418 ||
            status === 403
          );
        },
      }
    );
    console.log({
      employee_id: employeeNumber,
      last_working_day: formattedDate,
    });
    if (response.status === 403) {
      logout(dispatch);
      return response;
    }
    return response;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response && err.response.status === 403) {
        logout(dispatch);
      } else {
        console.log(err);
      }
    } else {
      console.log(err);
    }
    return { status: 500 };
  }
};

export default sendVerificationToBackend;

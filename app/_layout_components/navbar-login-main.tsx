"use client";
import { Navbar } from "@nextui-org/react";
import handleLogout from "../_api-helpers/LogOut";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { useRouter } from "next/navigation";
import Link from "next/link";
import getEmployeeDetails from "../_api-helpers/emp-details";
import { setState } from "@/redux-toolkit/features/employee-details";
import { useEffect } from "react";

export default function NavBar() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const heroState = useAppSelector((state) => state.employeeDetails);
  useEffect(() => {
    async function fetchMyAPI() {
      console.log(heroState);
      if (!heroState.name) {
        const response = await getEmployeeDetails(
          employeeLoginState,
          dispatch,
          router
        );
        const data = await response;
        dispatch(
          setState({
            doj: data["doj"],
            lwd: data["lwd"],
            name: data["name"],
            title: data["title"],
            empID: employeeLoginState.empID,
          })
        );
      }
    }

    fetchMyAPI();
  }, []);
  return (
    <>
      <div className="w-full">
        <Navbar
          className="shadow-md"
          classNames={{ wrapper: "px-0 max-w-full" }}
        >
          <div className="flex h-full w-full justify-between items-center  px-8">
            <div className="flex gap-4 items-center justify-start">
              <Link href="https://www.microland.com">
                <img
                  src="/microland-logo-main.png"
                  alt="Logo"
                  className="h-6 object-contain"
                />
              </Link>
              <p className="text-3xl font-thin">|</p>
              <Link href="/" className="text-black">
                <p className="font-semibold text-xl">Alumni Services</p>
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4">
              <Link href="https://www.microland.com/careers" target="_blank" className="text-black">
                <span className="cursor-pointer p-4">Careers</span>
              </Link>
              <p
                onClick={() => handleLogout(dispatch, router)}
                className="flex justify-center items-center cursor-pointer"
              >
                <span className="material-symbols-outlined">logout</span>Logout
              </p>
            </div>
          </div>
        </Navbar>
      </div>
    </>
  );
}
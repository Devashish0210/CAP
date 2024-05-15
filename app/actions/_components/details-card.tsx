"use client";
import { useAppSelector } from "@/redux-toolkit/hooks";

export default function DetailsCard() {
  const employeeDetails = useAppSelector((state) => state.employeeDetails);

  return (
    <>
      {employeeDetails.name ? (
        <>
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold">Hi {employeeDetails.name},</h1>
            <p>{employeeDetails.title}</p>
            <p>
              <span className="font-bold">Employee ID: </span>
              {employeeDetails.empID}
            </p>
            <p>
              <span className="font-bold">DOJ: </span>
              {employeeDetails.doj}
            </p>
            <p>
              <span className="font-bold">LWD: </span>
              {employeeDetails.lwd}
            </p>
          </div>
        </>
      ) : (
        <h1 className="text-3xl font-bold">Welcome</h1>
      )}
    </>
  );
}

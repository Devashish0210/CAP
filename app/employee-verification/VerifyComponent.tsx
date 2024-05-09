"use client";

import React, { useState } from "react";
import { useAppSelector } from "@/redux-toolkit/hooks";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RequestForm from "./_components/RequestForm";
import handleProceedClick from "./_api-helpers/ProceedClicked";
import MovingMessage from "../_components/MovingMessage";
import EmailComponentMobile from "./_components/LoginCard";
import OtpComponentMobile from "./_components/otp-auth";

export default function VerifyComponent() {
  //Usestate for OtpVerificationStatus.
  const isOtpVerified =
    useAppSelector((state) => state.employerLoginState.otp) != null;

  //Usestates for handling the CAPTCHA Component
  const [isCapctha, setIscaptcha] = useState(false);

  // const [otp, setOtp] = useState(initialotp);
  const [showOtp, setShowOtp] = useState(false);

  //Usestates for handling resend button, table data
  const [updateddisabled, setupdateddisabled] = useState(false);

  //Usestates for handling clickcout for resend button.
  const [clickCount, setClickCount] = useState(0);

  return (
    <div className="h-[90vh]">
      <div
        className="absolute h-full w-full blur-lg -z-40"
        style={{
          backgroundImage: "url('background-login.png')",
          backgroundSize: "100vw 90vh",
        }}
      />
      {/* To Display Toast Notifications */}
      <ToastContainer pauseOnHover={false} />

      <section>
        {/* Moving Message to be displayed in pre-login screens */}
        {/* {!isOtpVerified && (
          <div className="message">
            <MovingMessage>
              Welcome to Alumni Employment Verification Portal
            </MovingMessage>
          </div>
        )} */}

        {/* HeroMessage to be displayed in post-login screen */}
        {/* {isOtpVerified && (
          <div className="hero-message mt-4">
            <p style={{ margin: "0", padding: "0", fontSize: "small" }}>
              &#9432;&nbsp;To verify employment information, kindly input the{" "}
              <u>Employee ID</u> and the <u>last working date</u>. Upon
              successful validation, the details will be sent to your email
              address
            </p>
          </div>
        )} */}

        {/* Video to be displayed in pre-login first and second screen */}
        {!isOtpVerified && (
          <section className="h-[90vh] w-full flex flex-wrap items-center justify-evenly">
            <div className="text-[3rem]">
              <h1>Welcome to</h1>
              <h1>Employment</h1>
              <h1>Verification</h1>
              <h1>Services</h1>
            </div>
            {!showOtp ? (
              <EmailComponentMobile
                handleProceedClick={handleProceedClick}
                isCapctha={isCapctha}
                setShowOtp={setShowOtp}
                setIscaptcha={setIscaptcha}
              />
            ) : (
              <OtpComponentMobile
                // setTableData={setTableData}
                setShowOtp={setShowOtp}
                setClickCount={setClickCount}
                setupdateddisabled={setupdateddisabled}
                updateddisabled={updateddisabled}
                clickCount={clickCount}
              />
            )}
          </section>
        )}

        {/* RequestForm to be displayed in post-login screen */}
        {isOtpVerified && (
          <>
            <RequestForm></RequestForm>
          </>
        )}
      </section>
    </div>
  );
}

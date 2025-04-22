"use client";
import { Navbar } from "@nextui-org/react";
import Link from "next/link";

export default function NavBar() {
  return (
    <>
      <div className="w-full">
        <Navbar
          className="shadow-md"
          classNames={{
            wrapper: "px-0 max-w-full",
          }}
        >
          <div className="flex h-full w-full justify-between items-center px-4 sm:px-8">
            <div className="flex gap-2 sm:gap-4 items-center justify-start">
              <Link href="https://www.microland.com">
                <img
                  src="/microland-logo-main.png"
                  alt="Logo"
                  className="h-6 object-contain"
                />
              </Link>
              <p className="text-3xl font-thin hidden sm:block">|</p>
              <Link href="/" className="text-black">
                <p className="font-semibold text-xs sm:text-xl">Alumni Services</p>
              </Link>
            </div>
            <div className="flex items-center justify-end">
              <Link href="/employee-verification">
                <p className="font-bold text-xs sm:text-base">
                  Employment Verification Request
                </p>
              </Link>
            </div>
          </div>
        </Navbar>
      </div>
    </>
  );
}
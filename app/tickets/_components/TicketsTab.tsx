"use client";

import React, { useEffect, useState } from "react";
import { Tabs, Tab, Spinner, Button } from "@nextui-org/react";
import RequestForm from "./RequestForm";
import TableCustom from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import getTickets from "../_api-helpers/get-ticket";
import {
  setState,
  initialState as emptTicketStatusState,
} from "@/redux-toolkit/features/ticket-status";
import LoadingButton from "@/app/_components/LoadingButton";
import { motion } from "framer-motion";
// import Loading from "@/app/loading";
import { useRouter } from "next/navigation";

export default function DocumentsTab() {
  const ticketStatus = useAppSelector((state) => state.ticketStatus);
  const reloadLoading = useAppSelector((state) => state.ticketStatus.isLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const [activeTab, setActiveTab] = useState("create-ticket");
  const getDetails = async () => {
    const res = await getTickets(employeeLoginState, dispatch, router);
    const data = {
      isLoading: false,
      data: res,
    };
    dispatch(setState(data));
  };

  useEffect(() => {
    if (reloadLoading) {
      getDetails();
    }
  }, [reloadLoading]);

  const handleReloadClick = () => {
    dispatch(setState(emptTicketStatusState));
  };

  return (
    <div className="w-full">
      <Tabs
        aria-label="Options"
        color="danger"
        variant="underlined"
        selectedKey={activeTab} // Bind active tab state
        onSelectionChange={(key) => setActiveTab(key.toString())}
        classNames={{
          tabList:
            "gap-12 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
      >
        <Tab key="create-ticket" title="Create Ticket">
        <RequestForm onSuccess={() => setActiveTab("status-ticket")} />
        </Tab>

        <Tab
          key="status-ticket"
          title={
            <div className="flex justify-center items-center">
              <p>Status of Tickets </p>
            </div>
          }
        >
          <TableCustom items={ticketStatus} />
        </Tab>

        {/* New Tab for the reload icon */}
        <Tab
          key="reload"
          title={
            <div className="flex justify-center items-center">
              <p>Refresh</p>
              <div
                className="min-w-0 w-8 h-8 ml-2 rounded-full bg-white cursor-pointer flex justify-center items-center"
                onClick={
                  reloadLoading
                    ? () => {
                        console.log("disabled");
                      }
                    : handleReloadClick
                }
              >
                {reloadLoading ? (
                  <motion.span
                    className="material-symbols-outlined text-primary"
                    animate={{ rotate: -360 }}
                    transition={{
                      repeatType: "loop",
                      repeat: Infinity,
                      duration: 2,
                    }}
                  >
                    replay
                  </motion.span>
                ) : (
                  <span className="material-symbols-outlined text-primary">
                    refresh
                  </span>
                )}
              </div>
            </div>
          }
        />
      </Tabs>
    </div>
  );
}

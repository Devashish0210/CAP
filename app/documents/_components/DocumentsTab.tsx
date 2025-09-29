"use client";

import React, { useEffect } from "react";
import { Tabs, Tab, Spinner, Chip } from "@nextui-org/react";
import TableCustom from "./Table";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import getNDC from "../_api-helpers/ndc";
import {
  setState,
  initialState as emptyNDCSTate,
  InitialState as NDCType,
} from "@/redux-toolkit/features/ndc";
import { motion } from "framer-motion";
// import Loading from "@/app/loading";
import { useRouter } from "next/navigation";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "@/app/_components/link-tabs-data";
import NameComponent from "@/app/_components/name-component";

function toNdc(rows: { name: string; status: string; comment: string }[]) {
  const norm = (s?: string) => (s ?? "").trim().toLowerCase();
  const by = (label: string) => rows.find(r => norm(r.name) === norm(label)) ?? { status: "Pending", comment: "" };

  const pendingIfUnknown = (s?: string) => {
  const v = (s ?? "").trim().toLowerCase();
  return v === "unknown" || v === "na" || v === "not available" ? "" : (s ?? "").trim();
};

  const rm    = by("Reporting Manager");
  const fin   = by("Finance");
  const adm   = by("Admin");
  const cis   = by("CIS");
  const hrss  = by("HRSS");
  const pay   = by("Final Settlement");

  return {
    rmNdcStatus: rm.status,       rmNdcComment: rm.comment,
    financeNdcStatus: fin.status, financeNdcComment: fin.comment,
    adminNdcStatus: adm.status,   adminNdcComment: adm.comment,
    cisNdcStatus: cis.status,     cisNdcComment: cis.comment,
    hrssNdcStatus: hrss.status,   hrssNdcComment: hrss.comment,
    payrollNdcStatus: pay.status, payrollNdcComment: pay.comment,
  } as const;
}


export default function DocumentsTab({
  children,
}: {
  children: React.ReactNode;
}) {
  const ndc = useAppSelector((state) => state.ndc);
  const reloadLoading = useAppSelector((state) => state.ndc.isLoading);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const getDetails = async () => {
    const res = await getNDC(employeeLoginState, dispatch, router);
    console.log(res);
    const data = {
      isLoading: false,
      data: [
        {
          name: "Reporting Manager",
          status: res["rm_ndc"],
          comment: "",
        },
        {
          name: "Finance",
          status: res["finance_ndc"],
          comment: "",
        },
        {
          name: "Admin",
          status: res["admin_ndc"],
          comment: "",
        },
        {
          name: "CIS",
          status: res["cis_ndc"],
          comment: res["cis_comment"],
        },
        {
          name: "HRSS",
          status: res["hrss_ndc"],
          comment: "",
        },
        {
          name: "Final Settlement",
          status: res["payroll_ndc"],
          comment: res["payroll_ndc_comment"],
        },
      ],
    };
    dispatch(setState(data));
  };

  const isNdcStausFinished = (data: NDCType) => {
    console.log(
      "ndc",
      ndc.data,
      data.data.filter((val) => val.status !== "Completed")
    );
    return data.data.filter((val) => val.status !== "Completed").length === 0;
  };
  useEffect(() => {
    if (reloadLoading) {
      getDetails();
    }
  }, [reloadLoading]);

  const handleReloadClick = () => {
    dispatch(setState(emptyNDCSTate));
  };

console.log("[ndc] slice state", ndc);               // shape: { data: rows[], isLoading } 
console.log("[ndc] adapter input rows", ndc.data);   // rows for toNdc
console.log("[ndc] partial ndc", toNdc(ndc.data));   // keys that Table expects


  return (
    <div className="w-full">
      {ndc.isLoading ? (
        <div className="w-full h-[68vh] flex flex-col justify-center items-center">
          <h1 className="text-primary text-2xl mb-1">Loading</h1>
          <Spinner color="primary" size="md" />
        </div>
      ) : (
        <>
          <LinkTabs
            data={linkTabsData.data}
            style={linkTabsData.style}
            selected={0}
          />
          <br />
          <Tabs
            aria-label="Options"
            color="danger"
            variant="underlined"
            defaultSelectedKey={"ndc"}
            classNames={{
              tabList:
                "gap-12 w-full relative rounded-none p-0 border-b border-divider",
              cursor: "w-full bg-[#22d3ee]",
              tab: "max-w-fit px-0 h-12",
              tabContent: "group-data-[selected=true]:text-[#06b6d4]",
            }}
          >
            {!ndc.isLoading && !isNdcStausFinished(ndc) && (
              <Tab
                key="ndc"
                title={
                  <div className="flex justify-center items-center">
                    <p>My NDC Status </p>
                  </div>
                }
              >
                <TableCustom ndc={toNdc(ndc.data)} />
              </Tab>
            )}

              <Tab
              key="documents"
              title={
                <div className="flex items-center space-x-2">
                  <span>My Documents</span>
                </div>
              }
            >
              {children}
            </Tab>

            {/* New Tab for the reload icon */}
            {true && (
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
            )}
          </Tabs>
        </>
      )}
    </div>
  );
}

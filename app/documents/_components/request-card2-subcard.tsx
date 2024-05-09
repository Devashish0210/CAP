"use client";

import RequestDocument from "@/app/_api-helpers/request-documents";
import React, { MouseEventHandler, useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
} from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { doc_type_map, documents, document_types } from "./document";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { useRouter } from "next/navigation";
type CardProps = {
  header: string;
  buttonText: string;
  note: string | undefined;
};

export default function CardCustom({
  header,
  buttonText,
  note = "",
}: CardProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [documentResponseText, setDocumentResponseText] =
    useState(document_types);
  const handleButtonClick = async () => {
    setLoading(true);
    const wait = async () => {
      //@ts-ignore
      const res = await RequestDocument(
        doc_type_map[header],
        employeeLoginState,
        dispatch,
        router
      );
      setDocumentResponseText({
        ...documentResponseText,
        [header]: res
          ? `Request is processed, details are sent at your email address.`
          : `There is some problem processing your request, please try again later`, // Update specific property using name and value
      });
      setLoading(false);
    };
    wait();
  };
  return (
    <Card className="w-[22rem] bg-background-containerHigh shadow-none">
      <CardBody className="flex flex-col">
        <Button
          className="w-full bg-white flex items-center justify-start"
          style={{ textAlign: "left" }}
          onClick={handleButtonClick}
          isDisabled={loading}
        >
          {loading ? (
            <Spinner color="default" size="sm" />
          ) : (
            <p className="font-bold text-md text-blue-300">{header}</p>
          )}
        </Button>
        {note.length > 0 && (
          <p className="text-sm px-4">{note.length > 0 ? note : ""}</p>
        )}
        {documentResponseText[header] !== "" && (
          <p
            className={
              documentResponseText[header] ===
              "There is some problem processing your request, please try again later"
                ? "text-danger w-80 mt-2"
                : "text-success w-80 mt-2"
            }
          >
            {documentResponseText[header]}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

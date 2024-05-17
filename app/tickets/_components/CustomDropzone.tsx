"use client";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export default function MyDropzone({
  setFiles,
}: {
  setFiles: Dispatch<SetStateAction<File[]>>;
}) {
  const [filesName, setFileName] = useState("");
  const onDrop = useCallback((acceptedFiles: File[]) => {
    //@ts-ignore
    setFiles(acceptedFiles);
    setFileName(acceptedFiles[0].name);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-outlook": [".msg"],
      "application/zip": [".zip", ".zipx"],
      "application/x-rar-compressed": [".rar"],
      "image/jpeg": [".jpg", ".jpeg"],
      "text/plain": [".txt"],
      "application/vnd.ms-xpsdocument": [".xps"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
      "application/vnd.oasis.opendocument.text": [".odt"],
      "application/vnd.oasis.opendocument.spreadsheet": [".ods"],
      "message/rfc822": [".eml"],
      "application/x-7z-compressed": [".7z"],
      "application/vnd.oasis.opendocument.presentation": [".odp"],
    },
    maxFiles: 1,
  });

  const [isUploaded, setIsUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {loading ? (
        <div className="flex flex-col absolute z-20 h-full w-[100%] backdrop-blur-[1px] items-center justify-center">
          <Spinner />
          <p className="font-bold"> Uploading the file </p>
        </div>
      ) : (
        <></>
      )}
      <div
        {...getRootProps({
          className: isUploaded
            ? "border-solid border-3 h-9 bg-success p-5  text-white flex justify-center items-center rounded-lg bg-[#F4F4F5]"
            : "h-9 p-6 flex justify-start items-center bg-[#F4F4F5] w-full",
        })}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-start">
          {isUploaded ? (
            <p> File Uploaded</p>
          ) : isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p className="text-sm flex flex-col items-start">
              Drag 'n' drop some files here, or click to select files
            </p>
          )}
          <p>{filesName}</p>
        </div>
      </div>
    </>
  );
}

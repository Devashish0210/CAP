"use client";

import React, { useState, useRef } from "react";
import { Button, Input } from "@nextui-org/react";
import LinkTabs from "@/app/_components/link-tabs";
import { linkTabsData } from "./link-tabs-data";
import { getCookie, hasCookie } from "@/app/utils/cookieManager";
import { Download } from "lucide-react";


export default function PFUploaderTab() {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const fileInputRef = useRef(null);

  // Function to convert file to base64
  //@ts-ignore
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Extract the base64 string without the data URL prefix
        //@ts-ignore
        const base64String = reader.result.toString().split(',')[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Function to parse and validate CSV before upload
  //@ts-ignore
  const validateCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        const csvContent = reader.result;
        // Simple validation - check if content has expected headers and data
        //@ts-ignore
        const lines = csvContent.split('\n');
        if (lines.length < 2) {
          reject("CSV file appears to be empty or invalid");
          return;
        }

        const headers = lines[0].trim().split(',');
        if (headers.length < 6) {
          reject("CSV file doesn't contain all required columns");
          return;
        }

        resolve(true);
      };
      reader.onerror = (error) => reject("Error reading file: " + error);
    });
  };

  // Function to download sample CSV file
  const downloadSampleFile = () => {
    const sampleCSVContent = `Employee ID,UAN number,PF Account Number,PF Remittance Month,PF Remittance Amount,Overall PF Balance in Microland
22782,1.0072E+11,BGBNG0015197000000/33952,25-Feb-25,3810,250867
25261,1.01351E+11,BGBNG0015197000000/38231,25-Feb-25,4212,130156
28264,1.00332E+11,BGBNG0015197000000/41478,25-Feb-25,28830,44076
28201,1.01457E+11,BGBNG0015197000000/41422,25-Feb-25,2960,7605
904132,1.00595E+11,BGBNG0015197000000/41464,25-Feb-25,2960,4911`;

    const blob = new Blob([sampleCSVContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_pf_upload.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file upload and processing
  const handleUploadAndProcess = async () => {
    if (!file) {
      setMessage({ text: "Please select a CSV file first.", type: "error" });
      return;
    }

    setIsUploading(true);
    setMessage({ text: "", type: "" });

    try {
      // First validate the CSV
      try {
        await validateCSV(file);
      } catch (validationError) {
        //@ts-ignore
        setMessage({ text: validationError, type: "error" });
        setIsUploading(false);
        return;
      }

      // Convert file to base64
      const base64Data = await fileToBase64(file);
      console.log("File converted to base64");

      // Get user credentials from cookies
      const email = getCookie('userEmail');
      const otp = getCookie('userOtp');

      if (!email || !otp) {
        setMessage({
          text: "Authentication credentials not found or expired. Please login again.",
          type: "error"
        });
        setIsUploading(false);
        return;
      }

      // Upload file
      const response = await fetch('https://alumniapi.microland.com/adminui/upload-csv', {
        method: 'POST',
        headers: {
          'X-EMAIL': email,
          'X-OTP': otp,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ csv: base64Data })
      });

      let result;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        // Handle non-JSON response
        const text = await response.text();
        result = { message: text };
      }

      console.log("Result is: ", result);

      // Special handling for the "No records inserted" response
      if (Array.isArray(result) && result[0] === "No records inserted") {
        // This is actually a successful response, just with no new records
        setMessage({
          text: "Upload completed. No new records were inserted. This might be because the records already exist or there were validation issues with the data.",
          type: "warning"
        });
        setFile(null);
        if (fileInputRef.current) {
          //@ts-ignore
          fileInputRef.current.value = "";
        }
        return;
      }

      if (response.ok) {
        console.log("Upload successful:", result);
        setMessage({
          text: `Upload successful: ${JSON.stringify(result)}`,
          type: "success"
        });
        // Reset file input
        setFile(null);
        if (fileInputRef.current) {
          //@ts-ignore
          fileInputRef.current.value = "";
        }
      } else {
        console.error("Upload failed:", result);
        let errorMessage = "Failed to upload CSV file. Please try again.";

        // Extract meaningful error message if available
        if (Array.isArray(result)) {
          errorMessage = result.join(", ");
        } else if (result && result.message) {
          errorMessage = result.message;
        }

        setMessage({
          text: errorMessage,
          type: "error"
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setMessage({
        text: "An error occurred during the upload process. Please try again.",
        type: "error"
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      <LinkTabs
        data={linkTabsData.data}
        style={linkTabsData.style}
        selected={0}
      />
      <div className="p-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-medium mb-4">PF Uploader</h2>

          <p className="mb-6">
            Please upload the EPFO Notification CSV file here. Please note the notification will be sent on the 20<sup>th</sup> of every month automatically.
          </p>

          <div className="flex items-center gap-4 mb-6">
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={(e) => {
                //@ts-ignore
                setFile(e.target.files[0]);
                // Clear previous messages when a new file is selected
                setMessage({ text: "", type: "" });
              }}
              className="w-full"
              size="lg"
            />

            <Button
              color="danger"
              onClick={downloadSampleFile}
              size="lg"
              startContent={<Download size={18} color="white" />}
            >
              Download Sample
            </Button>

          </div>

          <Button
            color="danger"
            onClick={handleUploadAndProcess}
            isLoading={isUploading}
            disabled={isUploading}
            className="px-6"
            size="lg"
          >
            Upload & Process
          </Button>

          {message.text && (
            <div className={`mt-4 p-3 rounded ${message.type === "success" ? "bg-green-100 text-green-700" :
              message.type === "warning" ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              }`}>
              {message.text}
            </div>
          )}

          <div className="mt-8">
            <h3 className="font-medium mb-2">Notes:</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>The CSV file should contain Employee ID, UAN number, PF Account Number, PF Remittance Month, PF Remittance Amount, and Overall PF Balance</li>
              <li>The file will be processed immediately after upload</li>
              <li>If the CSV contains errors, no new rows will be uploaded</li>
              <li>Existing records with the same Employee ID will be updated</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
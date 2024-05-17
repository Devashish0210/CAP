"use client";

import * as React from "react"; // Import React and its hooks
import RequestDocument from "@/app/_api-helpers/request-documents";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
// import CardCustom from "../request-card";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import { DropzoneArea } from "mui-file-dropzone";
import { useDropzone } from "react-dropzone";
import LoadingButton from "./LoadingButton";
import getSMC from "../_api-helpers/smc-cat";
import { useRouter } from "next/navigation";
import { setState } from "@/redux-toolkit/features/create-ticket";
import createTickets from "../_api-helpers/create-ticket";
import DropdownCustom from "./Dropdown";
import MyDropzone from "./CustomDropzone";

// Define the RequestForm component
export default function RequestForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set(["-- Please Select --"])
  );
  const [files, setFiles] = React.useState<File[]>([]);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = React.useState("");
  const title = "Alumni Services Ticket";
  const [createTicketLoading, setCreateTicketLoading] = React.useState(false);
  const [createTicketMessage, setCreateTicketMessage] = React.useState(2);
  const [description, setDescription] = React.useState("");
  const [modalMessage, setModalMessage] = React.useState("");
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const ticketData = useAppSelector((state) => state.ticketCreate);
  const formLoading = useAppSelector((state) => state.ticketCreate.isLoading);
  let selectedCategory: string = "";
  selectedKeys.forEach((element) => {
    selectedCategory = element;
  });
  const getBase64 = async (file: File) => {
    return new Promise((resolve) => {
      let fileInfo;
      let baseURL: string | ArrayBuffer | null = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
  const router = useRouter();
  React.useEffect(() => {
    const wait = async () => {
      const res = await getSMC(employeeLoginState, dispatch, router);
      dispatch(setState({ isLoading: false, data: res }));
    };
    wait();
  }, []);
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateTicketLoading(true);
    const handleVerifyRequest = async () => {
      let category;
      selectedKeys.forEach((element) => {
        category = element;
      });
      if (title.length < 3) {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Title should be atleast 3 characters long.");
        return;
      }
      if (category === "-- Please Select --") {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Please Select a category");
        return;
      }

      let dataCreateTicket;
      if (
        category &&
        ticketData.data[category]["attachment_mandatory"] !== "False" &&
        files.length < 1
      ) {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
        setCreateTicketLoading(false);
        setErrorMessage("Please add the Attachment as its mandatory");
        return;
      }
      if (files.length > 0) {
        //@ts-ignore
        const attachment = (await getBase64(files[0])).split("base64,")[1];
        dataCreateTicket = {
          attachment_filename: files[0].name,
          attachment: attachment,
          ticket_category: category,
          ticketTitle: title,
          ticketDetails: description,
        };
      } else {
        dataCreateTicket = {
          ticket_category: category,
          ticketTitle: title,
          ticketDetails: description,
        };
      }
      console.log(dataCreateTicket);
      //@ts-ignore
      const d = await createTickets(
        //@ts-ignore
        dataCreateTicket,
        employeeLoginState,
        dispatch,
        router
      );
      if (d) {
        setCreateTicketMessage(0);
        setModalMessage("Ticket created successfully");
      } else {
        setCreateTicketMessage(1);
        setModalMessage("Ticket Creation Failed");
      }
      setCreateTicketLoading(false);
      onOpen();
    };
    handleVerifyRequest();
  };

  return formLoading ? (
    <div className="flex justify-center items-center w-auto flex-col gap-2 py-32">
      <h1 className="text-primary text-xl">Alumni Services</h1>
      <Spinner />
    </div>
  ) : Object.keys(ticketData["data"]).length > 0 ? (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Alumni Services Ticket
              </ModalHeader>
              <ModalBody>
                <p>{modalMessage}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <form
        className="flex flex-wrap gap-4 justify-center items-center"
        onSubmit={handleFormSubmit}
      >
        <div className={"flex w-full rounded-sm p-4"}>
          {/* @ts-ignore */}
          <p>
            <span className="font-bold">Ticket Category</span>
          </p>
          <DropdownCustom
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            options={Object.keys(ticketData.data)}
          />
        </div>

        <div className={"flex w-full rounded-sm p-4"}>
          {/* @ts-ignore */}
          <p>
            <span className="font-bold pr-4">Description</span>
          </p>
          <div className="w-full">
            <Textarea
              size="sm"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
              className="bg-[#F4F4F5] ml-1 mt-1 min-h-2 text-sm w-full"
              //@ts-ignore
              wrapperClassName="h-2"
              labelClassName="mb-1"
              type="text"
              placeholder="Enter a brief description of your request"
            />
            <div className="flex flex-col">
              <p className="text-sm mt-2">
                <span className="font-bold">Note:</span>{" "}
                <span className="italic">
                Refer the FAQs. Please initiate the PF Transfer process on the EPFO portal, attach the signed and scanned Form 13. and It will take 15 working days to complete the PF Transfer process.
                </span>
              </p>
            </div>
          </div>
        </div>
        {/* @ts-ignore */}
        <div
          className={
            selectedCategory === "-- Please Select --" ||
            selectedCategory === "" ||
            selectedCategory === null ||
            typeof selectedCategory === "undefined"
              ? "hidden"
              : //@ts-ignore
              ticketData.data[selectedCategory]["attachment_message"] === "" ||
                //@ts-ignore
                ticketData.data[selectedCategory]["attachment_message"] ===
                  null ||
                //@ts-ignore
                typeof ticketData.data[selectedCategory][
                  "attachment_message"
                ] === "undefined"
              ? "hidden"
              : "w-full bg-gray-200 rounded-sm flex flex-col justify-center items-center"
          }
        >
          {/* @ts-ignore */}
          <p className="m-4">
            <span className="font-bold">Additional Instructions:</span>{" "}
            {selectedCategory === "-- Please Select --" ||
            selectedCategory === "" ||
            selectedCategory === null ||
            typeof selectedCategory === "undefined"
              ? ""
              : //@ts-ignore
                ticketData.data[selectedCategory]["attachment_message"]}
          </p>
        </div>
        <div className={"flex w-full rounded-sm p-4"}>
          {/* @ts-ignore */}
          <p>
            <span className="font-bold pr-4">Attachment</span>
          </p>
          {/* @ts-ignore */}
          {/* <DropzoneArea
            size="sm"
            Icon={"AttachFileIcon"}
            acceptedFiles={[
              ".doc",
              ".docx",
              ".xls",
              ".xlsx",
              ".msg",
              ".zip",
              ".rar",
              ".jpg",
              ".jpeg",
              ".txt",
              ".zipx",
              ".xps",
              ".png",
              ".pdf",
              ".odt",
              ".ods",
              ".eml",
              ".7z",
              ".odp",
            ]}
            dropzoneText="Upload"
            showFileNames
            onChange={(filesReceived) => {
              setFiles(filesReceived);
            }}
            filesLimit={1}
          /> */}
          <MyDropzone setFiles={setFiles} />
        </div>
        <div className="w-full">
          <LoadingButton
            loading={createTicketLoading}
            message={createTicketMessage}
            setMessage={setCreateTicketMessage}
            text="Create Ticket"
            isDisabled={false}
            type="submit"
            buttonColor="primary"
            onClick={() => {
              console.log("raised a ticket");
            }}
            spinnerColor="white"
          />
        </div>
        <p className="text-danger">{errorMessage}</p>
      </form>
    </>
  ) : (
    <div>
      <p>Some Error Occured</p>
    </div>
  );
}

// Array of documents for Autocomplete options

"use client"

import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Skeleton, Spinner } from "@nextui-org/react";
import { InitialState as Items } from "@/redux-toolkit/features/ticket-status"

export default function TableCustom({ items }: { items: Items }) {
    const convertDate = (dateString: string) => {
        // Create a new Date object from the string
        const date = new Date(dateString);

        // Get the year, month, and day components
        const year = date.getFullYear();
        const month = date.getMonth() + 1; // Months are zero-indexed in JavaScript
        const day = date.getDate();
        const hours = date.getHours()
        const minutes = date.getMinutes()

        // Format the date in a human-readable way
        const formattedDate = `${day}/${month}/${year}, ${hours}:${minutes}`;

        return formattedDate;
    }
    return (items.isLoading ? <div className="flex justify-center items-center w-auto flex-col gap-2 py-32">
        <h1 className="text-primary text-xl">Alumni Services</h1>
        <Spinner />
    </div> : (items.data.length > 0 ?
        <Table aria-label="TICKET STATUS TABLE">
            <TableHeader>
                <TableColumn>Ticket No</TableColumn>
                <TableColumn>Category</TableColumn>
                <TableColumn>Created On</TableColumn>
                <TableColumn>Last Updated On</TableColumn>
                <TableColumn>Current Status</TableColumn>
            </TableHeader>
            <TableBody>
                {items["data"].map((val, index) => {
                    return (<TableRow key={index}>
                        <TableCell><p>{val.ticketDisplayNo}</p></TableCell>
                        <TableCell><p>{val.classificationName}</p></TableCell>
                        <TableCell><p>{convertDate(val.createdOn)}</p></TableCell>
                        <TableCell><p>{convertDate(val.lastUpdatedOn)}</p></TableCell>
                        <TableCell><p>{val.statusName}</p></TableCell>
                    </TableRow>)
                })}
            </TableBody>
        </Table> : <div><p>No Tickets History</p><p>Please Create a Ticket if you have any Query</p></div>)
    );
}

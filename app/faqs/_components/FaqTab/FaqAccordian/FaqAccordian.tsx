"use client";

import React, { useState } from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import Link from "next/link";
import CustomCSSAccordian from "./CustomCSSAccordian";
import { Selection } from "@nextui-org/react";

type faqsFiles = {
  filename: string;
  filepath: string;
}[];
type Items = {
  items: {
    ariaLabel: string;
    title: React.ReactNode;
    content: React.ReactNode;
    files: faqsFiles;
  }[];
};

export default function FaqAccordian({ items }: Items) {
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(
    new Set([])
  );
  return (
    <div className="w-[89%] mx-auto">
      <Accordion
        selectedKeys={selectedKeys}
        onSelectionChange={(keys) => setSelectedKeys(keys)}
        isCompact
        selectionMode="multiple"
        variant="bordered"
        className="border-none"
      >
        {items.map((value, index) => {
          //@ts-ignore
          return (
            <AccordionItem
              key={index}
              aria-label={value.ariaLabel}
              title={value.title}
              classNames={{
                //@ts-ignore
                heading: selectedKeys.has(index.toString())
                  ? "font-bold"
                  : "font-semibold",
                base: index % 2 === 0 ? "bg-[#F7F8F8] px-4" : "px-4",
                indicator: "text-primary text-lg",
              }}
            >
              <CustomCSSAccordian>
                {/* <GlobalStyles styles={{ ul: { listStyle: "disc", margin: "1rem 1rem 1rem 2rem" }, ol: { listStyle: "decimal", margin: "1rem 1rem 1rem 2rem" }, a: { color: "#78206E", textDecoration: "underline" } }} /> */}
                {value.content}
                <div
                  className={
                    value.files.length > 0
                      ? "flex mx-4 mt-8 justify-center items-center"
                      : "hidden"
                  }
                >
                  <div className="flex-1 bg-primary h-[0.1rem]" />
                  <p className="mx-4 text-primary">Attachments</p>
                  <div className="flex-1 bg-primary h-[0.1rem]" />
                </div>
                <div className="gap-4 ml-2 flex flex-wrap justify-start items-center">
                  {value.files.map((val, indexLink) => {
                    return (
                      <Link
                        key={indexLink}
                        href={val.filepath}
                        className="m-2 flex flex-col justify-center items-center text-primary"
                        target="_blank"
                      >
                        <span className="material-symbols-outlined">draft</span>
                        <p className="mb-2 underline">{val.filename}</p>
                      </Link>
                    );
                  })}
                </div>
              </CustomCSSAccordian>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

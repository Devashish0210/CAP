"use client";

import { useEffect, useState } from "react";
import faqrequest from "../../_api-helpers/faq-request";
import { useAppDispatch, useAppSelector } from "@/redux-toolkit/hooks";
import { setState as setFaqs } from "@/redux-toolkit/features/faqs";
import FaqAccordian from "./FaqAccordian/FaqAccordian";
import { Button, Spinner } from "@nextui-org/react";
import { colorsForFaqsCategory } from "../data";
import { useRouter } from "next/navigation";
import React from "react";

type faqsFiles = {
  filename: string;
  filepath: string;
}[];

type Faqs = {
  id: number;
  questions: string;
  answers: string;
  tags: string;
  category: string;
  files: faqsFiles;
}[];

export default function FaqTab() {
  const faqs = useAppSelector((state) => state.faqs);
  const [loading, setLoading] = useState(true);
  const [selectedKey, setSelectedKey] = React.useState<string>("");
  const categoryBasedSortingInitial: {
    [id: string]: Faqs;
  } = {};
  faqs.forEach((value: any) => {
    if (categoryBasedSortingInitial[value.category]) {
      categoryBasedSortingInitial[value.category].push(value);
    } else {
      categoryBasedSortingInitial[value.category] = [];
      categoryBasedSortingInitial[value.category].push(value);
    }
  });
  const [categorizedFaqs, setCategorizedFaqs] = useState<{
    [id: string]: Faqs;
  }>(JSON.parse(JSON.stringify(categoryBasedSortingInitial)));
  const employeeLoginState = useAppSelector(
    (state) => state.employeeLoginState
  );
  const dispatch = useAppDispatch();
  const router = useRouter();
  useEffect(() => {
    const updateFaqs = async () => {
      if (faqs && faqs.length === 0) {
        const res: Faqs = await faqrequest(
          employeeLoginState,
          dispatch,
          router
        );
        const categoryBasedSorting: {
          [id: string]: Faqs;
        } = {};
        res.forEach((value) => {
          if (categoryBasedSorting[value.category]) {
            categoryBasedSorting[value.category].push(value);
          } else {
            categoryBasedSorting[value.category] = [];
            categoryBasedSorting[value.category].push(value);
          }
        });
        setCategorizedFaqs(JSON.parse(JSON.stringify(categoryBasedSorting)));
        dispatch(setFaqs(res));
      }
      setLoading(false);
    };
    updateFaqs();
  }, []);
  return loading ? (
    <div className="w-full h-72 flex justify-center items-center">
      {" "}
      <h1 className="text-primary text-2xl mb-1">Fetching Data</h1>{" "}
      <Spinner color="primary" size="lg" />
    </div>
  ) : (
    <div className="w-full">
      <div className="flex flex-wrap justify-evenly items-center">
        {Object.keys(categorizedFaqs).map((key, index) => (
          <div
            key={index}
            className={
              selectedKey === key
                ? `w-[20rem] m-4 mb-8 border-b-5 border-primary`
                : "w-[20rem] m-4 mb-8"
            }
          >
            <Button
              onClick={() => {
                if (selectedKey === key) {
                  setSelectedKey("");
                } else {
                  setSelectedKey(key);
                }
              }}
              className={`rounded-none whitespace-normal min-h-24 w-80 text-[#003A69] font-bold text-lg items-center justify-center flex bg-[#E7E8E8]`}
            >
              {key}
            </Button>
          </div>
        ))}
      </div>
      {categorizedFaqs[selectedKey] ? (
        <FaqAccordian
          items={categorizedFaqs[selectedKey].map((value) => {
            return {
              content: (
                <div
                  className="m-4"
                  dangerouslySetInnerHTML={{ __html: value.answers }}
                ></div>
              ),
              title: <p className="text-md">{value.questions}</p>,
              ariaLabel: value.questions,
              files: value.files,
              // content: <div className="m-4" dangerouslySetInnerHTML={{ __html: parse(value.answers) }}></div>, title: <p className="font-bold text-md">{value.questions}</p>, ariaLabel: value.questions, files: value.files
            };
          })}
        />
      ) : (
        <></>
      )}
    </div>
  );
}

import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
} from "@nextui-org/react";

export default function CardLink({
  headerText,
  bodyText,
  href,
  className = null,
  icon,
}: {
  headerText: string;
  bodyText: string;
  href: string;
  className: null | string;
  icon: string;
}) {
  return (
    <Link href={href}>
      <Card
        className={className ? className : `bg-content1 w-[25rem] h-[25rem]`}
      >
        <CardHeader className="flex justify-center items-center">
          <p className="text-3xl">{headerText}</p>
        </CardHeader>
        <CardBody className="flex justify-evenly items-center">
          <p className="text-md">{bodyText}</p>
          <img src={icon} />
        </CardBody>
        <Divider />
      </Card>
    </Link>
  );
}

"use client";

import { usePathname } from "next/navigation";
import PageAuthenticatorBGV from "./page-authentication-bgv";
import PageAuthenticatorMain from "./page-authenticator-main";
import { useEffect, useState } from "react";
import Loading from "../loading";
import { useRouter } from "next/navigation";
import checkServerStatus from "../_api-helpers/check-server";

export default function PageContainer({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactNode {
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    const wait = async () => {
      const res = await checkServerStatus();
      if (res) {
        setLoading(false);
      } else {
        router.push("/service-down");
      }
    };
    if (path === "/service-down") {
      setLoading(false);
    } else {
      wait();
    }
  }, [path]);

  const [loading, setLoading] = useState(true);
  return loading ? (
    <Loading />
  ) : path === "/employee-verification" ? (
    <PageAuthenticatorBGV>{children}</PageAuthenticatorBGV>
  ) : (
    <PageAuthenticatorMain path={path}>{children}</PageAuthenticatorMain>
  );
}

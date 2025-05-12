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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bypassRoutes = ["/adminui/login", "/adminui/main", "/service-down"];

    if (bypassRoutes.includes(path)) {
      setLoading(false);
      return;
    }

    const wait = async () => {
      const res = await checkServerStatus();
      if (res) {
        setLoading(false);
      } else {
        router.push("/service-down");
      }
    };

    wait();
  }, [path]);

  if (loading) return <Loading />;

  if (
    path === "/adminui/login" ||
    path === "/adminui/main" ||
    "/adminui/remove-ndc"
  ) {
    return <>{children}</>; // No wrapper for these routes
  }

  return path === "/employee-verification" ? (
    <PageAuthenticatorBGV>{children}</PageAuthenticatorBGV>
  ) : (
    <PageAuthenticatorMain path={path}>{children}</PageAuthenticatorMain>
  );
}

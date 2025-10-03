// App/_layout_components/page-container.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import PageAuthenticatorBGV from "./page-authentication-bgv";     // EV wrapper/navbar
import PageAuthenticatorMain from "./page-authenticator-main";     // Alumni wrapper/navbar
import Loading from "../loading";
import checkServerStatus from "../_api-helpers/check-server";
import EmployeeBootstrap from "../_components/EmployeeBootstrap";  // NEW: hydrates greeting

export default function PageContainer({
  children,
}: Readonly<{ children: React.ReactNode }>): React.ReactNode {
  const path = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bypassRoutes = ["/adminui/login", "/adminui/main", "/service-down"];

    if (bypassRoutes.includes(path)) {
      setLoading(false);
      return;
    }

    (async () => {
      const ok = await checkServerStatus();
      if (ok) setLoading(false);
      else router.push("/service-down");
    })();
  }, [path, router]);

  if (loading) return <Loading />;

  // Admin UI section: match 3 routes precisely (the previous code always returned true)
  if (
    path === "/adminui/login" ||
    path === "/adminui/main" ||
    path === "/adminui/remove-ndc"
  ) {
    return <>{children}</>;
  }

  // Employee Verification section: treat all EV subpaths as EV
  const isEV =
    path === "/employee-verification" ||
    path.startsWith("/employee-verification/");

  if (isEV) {
    return <PageAuthenticatorBGV>{children}</PageAuthenticatorBGV>;
  }

  // Alumni section (default): hydrate employee details for greeting + alumni navbar
  return (
    <PageAuthenticatorMain path={path}>
      <EmployeeBootstrap />       {/* ensures greeting state is loaded */}
      {children}
    </PageAuthenticatorMain>
  );
}

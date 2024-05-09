import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "@/app/globalicon.css";
import { Providers } from "@/providers/nextui";
import { ReduxProvider } from "@/providers/redux";
import HtmlComponent from "./_components/htmlcomponent";
import NavBar from "./_layout_components/navbar";
import Footer from "./_layout_components/footer";
import PageContainer from "./_layout_components/page-container";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "HR rewrite policy",
  description:
    "Extracts the texts from the doc and rewrites it accoridng to the promt given",
  icons: {
    icon: "https://www.microland.com/assets/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReduxProvider>
      <HtmlComponent>
        <body className={poppins.className}>
          <Providers>
            <PageContainer>
              <div className="min-h-[72vh]">{children}</div>
            </PageContainer>
          </Providers>
        </body>
      </HtmlComponent>
    </ReduxProvider>
  );
}

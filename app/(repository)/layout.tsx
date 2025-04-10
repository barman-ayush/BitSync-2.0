import SecondaryNavbar from "@/components/secondary-navbar.component";
import { Fragment } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <div className="root-wrapper bg-black text-white min-h-screen">
        <SecondaryNavbar heading="dashboard"/>
        {children}
      </div>
    </Fragment>
  );
}

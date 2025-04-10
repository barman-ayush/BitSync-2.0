import Navbar from "@/components/Navbar.component";
import { Fragment } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Fragment>
      <div className="root-wrapper">
        <Navbar />
        {children}
      </div>
    </Fragment>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import Logger from "@/components/logger.component";
import { FlashProvider } from "@/components/Flash.component";
import { UserWrapper } from "@/context/userContext";
import { UploadedStreamWrapper } from "@/context/fileContext";
import { BreadcrumbWrapper } from "@/context/breadCrumbContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <UserWrapper>
        <UploadedStreamWrapper>
          <BreadcrumbWrapper>
            <html lang="en" suppressHydrationWarning>
              <body className={`antialiased`}>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <FlashProvider>
                    <div className="child-wrapper">
                      <Logger />
                      {children}
                    </div>
                  </FlashProvider>
                </ThemeProvider>
              </body>
            </html>
          </BreadcrumbWrapper>
        </UploadedStreamWrapper>
      </UserWrapper>
    </ClerkProvider>
  );
}

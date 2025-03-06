import { Onest } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/store/storeProvider";

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin"],
});

export const metadata = {
  title: "Tic-Tac-Toe",
  description: "Tic-Tac-Toe game, where the User can play with the Computer",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${onest.variable} font-onest min-h-screen flex items-center justify-center antialiased`}
      >
        <StoreProvider>
          <div className="mx-4 flex flex-col items-center">{children}</div>
        </StoreProvider>
      </body>
    </html>
  );
}

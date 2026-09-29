import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { MobileMenuProvider } from "./context/MobileMenuContext";
import { AuthModalProvider } from "./context/AuthModalContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { MobileMenuSidebar } from "./components/Mobile/MobileMenuSidebar";
import { PageWrapper } from "./components/Mobile/PageWrapper";
import { AuthModal } from "./components/Modal/AuthModal";
import { Toaster } from "sonner";
import { SocketProvider } from "@/app/context/SocketContext";
import OfflineBanner from "@/app/components/ui/OfflineBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Plus Jakarta Sans powers the whole UI (see DESIGN.md). Legacy font-inter /
// font-lato / font-outfit utilities are mapped to it in globals.css.
const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Koolbuy — Solar freezers, cold storage & more",
  description: "Koolbuy is Nigeria's marketplace for solar-powered freezers, cold storage and flexible payment plans.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // Allow zooming for accessibility, but 16px font prevents auto-zoom
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full font-inter">
        <Toaster richColors closeButton position="bottom-right" />
        <SocketProvider>
          <OfflineBanner />
          <AuthModalProvider>
            <CartProvider>
              <WishlistProvider>
                <MobileMenuProvider>
                  <MobileMenuSidebar />
                  <PageWrapper>
                    {children}
                  </PageWrapper>
                </MobileMenuProvider>
              </WishlistProvider>
            </CartProvider>
            <AuthModal />
          </AuthModalProvider>
        </SocketProvider>
      </body>
    </html>
  );
}

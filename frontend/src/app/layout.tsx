import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ThemeProvider } from "@/components/ui/theme-provider"
import Web3Provider from "@/components/web3/Web3Provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CapyMinter",
  description: "Mint and collect awesome Capybara NFTs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <Web3Provider>
            <Header />
            {children}
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}


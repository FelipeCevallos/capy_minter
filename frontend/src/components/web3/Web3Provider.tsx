"use client";

import { WagmiProvider, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { http } from 'viem'
import { injected, walletConnect } from 'wagmi/connectors'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'
import { flowEvmTestnet } from '@/lib/chains'

// Create a client
const queryClient = new QueryClient()

// Get projectId
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'e7d5c576f0b1a007d72dc08d89309590'

// Create wagmi config with ConnectKit
const config = createConfig(
  getDefaultConfig({
    appName: 'CapyMinter',
    walletConnectProjectId: projectId,
    // Set Flow EVM testnet as the only chain
    chains: [flowEvmTestnet],
    transports: {
      [flowEvmTestnet.id]: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL || 'https://flow-testnet.g.alchemy.com/v2/xFnKwKEtyR6uS7CZ2KO_SRt28lVJU9YC'),
    },
  })
)

export default function Web3Provider({ children }: { children: ReactNode }) {
  // This approach prevents hydration mismatch while still ensuring
  // wallet connection only happens on the client
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider
          customTheme={{
            "--ck-accent-color": "#8b5cf6",
            "--ck-accent-text-color": "#ffffff",
            "--ck-connectbutton-background": "#111827",
            "--ck-connectbutton-hover-background": "#1f2937",
          }}
          mode="dark"
          options={{
            // Fix for empty href issue
            walletConnectCTA: "both",
            // Disable empty links
            embedGoogleFonts: true,
            // Avoid issues with navigation
            disableSiweRedirect: true,
            // Set initial chain to Flow EVM testnet
            initialChainId: flowEvmTestnet.id,
            // Enforce the correct chain
            enforceSupportedChains: true,
            // Avoid href issues
            hideNoWalletCTA: true,
            hideTooltips: true,
          }}
        >
          {/* We always render children, but wallet features won't work until mounted */}
          <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s' }}>
            {children}
          </div>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
} 
import { Chain } from 'wagmi/chains'

export const flowEvmTestnet: Chain = {
  id: 545,
  name: 'Flow EVM Testnet',
  nativeCurrency: {
    name: 'FLOW',
    symbol: 'FLOW',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL || 'https://flow-testnet.g.alchemy.com/v2/xFnKwKEtyR6uS7CZ2KO_SRt28lVJU9YC'],
    },
    public: {
      http: [process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL || 'https://flow-testnet.g.alchemy.com/v2/xFnKwKEtyR6uS7CZ2KO_SRt28lVJU9YC'],
    },
  },
  blockExplorers: {
    default: {
      name: 'FlowScan',
      url: 'https://evm-testnet.flowscan.io',
    },
  },
  testnet: true,
} 
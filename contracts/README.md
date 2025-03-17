# CreateNFT Contract

A simple NFT contract that allows users to mint NFTs for 0.01 ETH each, with a maximum supply of 5 NFTs and a limit of one NFT per wallet.

## Features

- ERC721 NFT contract
- Maximum supply of 5 NFTs
- Price of 0.01 ETH per NFT
- One NFT per wallet limit
- Owner can withdraw accumulated ETH
- Metadata stored on IPFS

## Development

This project uses [Foundry](https://book.getfoundry.sh/) for development and testing.

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   forge install
   ```
3. Copy the `.env.example` file to `.env` and fill in your values:
   ```bash
   cp .env.example .env
   ```

### Testing

Run the tests:

```bash
forge test
```

Run tests with gas reporting:

```bash
forge test --gas-report
```

## Deployment

### Local Deployment

To deploy to a local Anvil instance:

1. Start Anvil:
   ```bash
   anvil
   ```

2. Deploy the contract:
   ```bash
   forge script script/DeployCreateNFT.s.sol --rpc-url http://localhost:8545 --private-key 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 --broadcast
   ```

### Testnet Deployment

To deploy to a testnet (e.g., Sepolia):

1. Make sure your `.env` file is set up with your private key and RPC URL.

2. Deploy the contract:
   ```bash
   source .env
   forge script script/DeployCreateNFT.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast --verify --etherscan-api-key $ETHERSCAN_API_KEY
   ```

## Contract Interaction

After deployment, you can interact with the contract using the following commands:

### Mint an NFT

```bash
cast send <CONTRACT_ADDRESS> "mint()" --value 0.01ether --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

### Check NFT Ownership

```bash
cast call <CONTRACT_ADDRESS> "ownerOf(uint256)" 0 --rpc-url $SEPOLIA_RPC_URL
```

### Check Total Supply

```bash
cast call <CONTRACT_ADDRESS> "totalSupply()" --rpc-url $SEPOLIA_RPC_URL
```

### Withdraw Funds (Owner Only)

```bash
cast send <CONTRACT_ADDRESS> "withdraw()" --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

## Frontend Integration

The contract can be integrated with a frontend using ethers.js or viem. See the frontend directory for implementation details. 
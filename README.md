---
title: Building an NFT Minter Web App
description: Create a vaporwave-themed NFT minting dApp with Solidity and Next.js.
sidebar_position: 5
keywords:
  - NFT
  - ERC721
  - Flow EVM
  - Next.js
  - Webapp
---

# Building an NFT Minter Web App

In this tutorial, you'll learn how to build a complete NFT minting webapp called CapyMinter. We'll create a Solidity smart contract that implements the ERC-721 standard and a React frontend that allows users to connect their wallets, mint NFTs, and view their collection. We will also be using [v0.dev](https://v0.dev/) for a quick frontend that we can quickly edit to integrate to the smart contract layer. 

## Objectives

After completing this guide, you'll be able to:

- Implement an ERC-721 NFT smart contract using the OpenZeppelin library
- Deploy a smart contract to the Flow EVM testnet
- Store and retrieve NFT metadata using IPFS
- Create a React frontend that connects to a blockchain wallet
- Build functionality for minting NFTs through a web interface


## Prerequisites

### Next.js and Modern Frontend Development

This tutorial uses [Next.js]. You don't need to be an expert, but it's helpful to be comfortable with development using a current React framework. You'll be on your own to select and use a package manager, manage Node versions, and other frontend environment tasks. If you don't have your own preference, you can just follow along with us and use [npm].


### Tools and Accounts

You'll need:
- A code editor ([Cursor](https://www.cursor.com/) recommended)
- [Foundry](https://book.getfoundry.sh/) for smart contract development
- [MetaMask](https://metamask.io/) wallet
- [WalletConnect](https://cloud.walletconnect.com/sign-in) for the wallet provider
- An [Alchemy](https://www.alchemy.com/) account for RPC access
- A [Fleek](https://fleek.xyz/) account for IPFS storage

## Part 1: Smart Contract Development

In this section, we'll create an ERC-721 NFT contract with specific parameters for our CapyMinter project.

### Setting Up the Development Environment

First, we'll create a project structure that supports both smart contract development and frontend integration:

1. Create a new project folder to host both the smart contract and frontend
2. Inside this folder, create a `contracts` directory for the smart contract
3. Set up Foundry as our smart contract development environment
4. Install the [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master) library for ERC-721 implementation
```CLI
forge install https://github.com/OpenZeppelin/openzeppelin-contracts.git --no-commit
```
5. Configure the foundry.toml file with the correct remappings for OpenZeppelin and forge-std libraries

### Creating the NFT Smart Contract

Next, we'll implement our NFT contract with the following specifications:

1. Create a `CapyMinter.sol` file in the src folder
2. Import the necessary contracts from OpenZeppelin:
   - ERC721 (base NFT functionality)
   - Ownable (access control)
   - ERC721URIStorage (metadata management)
3. Set up state variables:
   - Token ID counter
   - Max supply (5 NFTs)
   - Mint price (0.01 FLOW)
   - Base token URI for metadata
4. Implement the mint function with requirements:
   - Check that max supply hasn't been reached
   - Limit to 1 NFT per wallet
   - Verify correct payment amount
5. Add owner-only functions:
   - Set token URI
   - Withdraw funds
6. Include helper functions:
   - Convert uint to string
   - Get total supply

### Testing the Smart Contract

To ensure our contract works as expected:

1. Create a `CapyMinter.t.sol` file for unit tests
2. Import test utilities from forge-std
3. Test all core functionality:
   - Minting an NFT
   - Checking max supply
   - Verifying the one-per-wallet restriction
   - Testing owner-only functions

### Deployment

Finally, we'll prepare for deployment:

1. Create a `DeployCapyMinter.s.sol` script
2. Set up environment variables:
   - Flow EVM testnet RPC URL from Alchemy
   - Private keys for deployment
   - Base URI for NFT metadata
   - Flow EVM testnet API URL for block explorer verification
3. Deploy the contract to the Flow EVM testnet
4. Set the base URI for the NFT collection

## Part 2: NFT Metadata Preparation

Before building the frontend, we need to prepare the metadata for our NFTs.

### Creating NFT Assets

1. Generate 5 capybara images with a vaporwave theme
2. Create a metadata folder in the frontend's src directory
3. Create JSON files for each NFT with:
   - Name
   - Description
   - Image placeholder
   - Attributes

### Uploading to IPFS

1. Upload the capybara images to IPFS using Fleek
2. Get the IPFS URLs for each image
3. Update the metadata JSON files with the corresponding image URLs
4. Upload the entire metadata folder to IPFS
5. Save the base CID for use in the smart contract and frontend

## Part 3: Frontend Development

Now we'll build a React frontend to interact with our smart contract.

### Setting Up the Project

1. Create a `frontend` folder in the project root
2. Initialize a Next.js project with the necessary dependencies:
   - Next.js 15
   - React
   - Tailwind CSS 3.4
   - Shad CN
   - Lucid React
3. Install Web3 libraries:
   - viem (version 2.14.13+)
   - wagmi (version 2.23.10+)
   - Connect Kit (version 1.8.2+)

### Project Structure Setup

Organize the frontend with the following structure:

1. `/src/components`: UI components and Web3 integrations
2. `/src/app`: Page layouts and routing
3. `/src/lib`: Contract interfaces and chain configuration

### Implementing Web3 Connectivity

In the components folder, create a `web3` subfolder with:

1. `WebThreeProvider.tsx`: Set up the wallet connection providers
2. `ConnectWallet.tsx`: Component for wallet connection
3. `MintNFT.tsx`: Component for minting functionality
4. `CollectionInfo.tsx`: Component for displaying owned NFTs

### Creating the UI

1. `Header.tsx`: Navigation and wallet connection button
2. UI components in `/src/components/ui`:
   - Buttons
   - Cards
   - Tabs
   - Theme provider

### Building the Pages

1. Home page: Landing page with hero section and project information
2. Mint page: Interface for users to mint NFTs
3. Collection page: Display of user's owned NFTs

### Contract Integration

1. Create `contractABI.json` in the lib folder
2. Create `contractABI.ts` with contract details:
   - ABI
   - Contract address
   - Network information
   - Chain ID
3. Create `chains.ts` to configure the Flow EVM testnet:
   - Chain ID (545)
   - RPC URL
   - Native currency (FLOW)
   - Block explorer

### Environment Configuration

Set up a `.env.local` file with:
1. WalletConnect Project ID
2. Flow EVM testnet RPC URL from Alchemy

## Part 4: Testing and Verification

### Local Testing

1. Run the frontend with `npm run dev`
2. Test the home page, mint page, and collection page
3. Verify wallet connection works properly
4. Confirm the correct testnet is being used

### Testing the Minting Process

1. Connect MetaMask wallet to the Flow EVM testnet
2. Fund the wallet with testnet FLOW tokens from the faucet
3. Test the mint function through the UI
4. Verify the NFT appears in the collection page after minting
5. Confirm all requirements are enforced:
   - One NFT per wallet
   - Correct payment amount
   - Max supply limit

## Conclusion

In this tutorial, you learned how to build a complete NFT minting webapp. You implemented a Solidity smart contract using the ERC-721 standard, prepared NFT metadata and stored it on IPFS, and created a React frontend that allows users to connect their wallets, mint NFTs, and view their collection.

Now that you have completed the tutorial, you should be able to:

- Implement an ERC-721 NFT smart contract using the OpenZeppelin library
- Deploy a smart contract to the Flow EVM testnet
- Store and retrieve NFT metadata using IPFS
- Create a React frontend that connects to a blockchain wallet
- Build functionality for minting NFTs through a web interface

Now that you've completed this tutorial, you're ready to expand on your dApp by adding more features such as secondary market functionality, rarity systems, integrating with other blockchain services, or providing various collections of NFTs to mint.

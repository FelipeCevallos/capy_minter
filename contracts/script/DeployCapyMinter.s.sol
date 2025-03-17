// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {CapyMinter} from "../src/CapyMinter.sol";

contract DeployCapyMinter is Script {
    function run() external returns (CapyMinter) {
        // Get the private key from environment variable
        uint256 deployerPrivateKey = vm.envUint("DEV_ADMIN_PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        
        console.log("Deploying with address:", deployerAddress);
        
        // Start broadcasting transactions
        vm.startBroadcast(deployerPrivateKey);
        
        // Deploy the NFT contract
        // The deployerAddress will be the owner of the contract
        CapyMinter nft = new CapyMinter(deployerAddress);
        
        // Set the base URI for the NFTs
        string memory baseURI = vm.envString("BASE_URI");
        console.log("Setting base URI:", baseURI);
        nft.setBaseURI(baseURI);
        
        // Stop broadcasting transactions
        vm.stopBroadcast();
        
        // Log the contract address
        console.log("CapyMinter deployed at:", address(nft));
        console.log("Owner address:", deployerAddress);
        
        return nft;
    }
} 
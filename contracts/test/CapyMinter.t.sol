// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {CapyMinter} from "../src/CapyMinter.sol";

contract CapyMinterTest is Test {
    CapyMinter public nft;
    address public owner;
    address public user1;
    address public user2;

    // Setup test environment before each test
    function setUp() public {
        // Use a regular address for owner, not the test contract
        owner = makeAddr("owner");
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");

        // Deploy the NFT contract with the owner address
        vm.prank(owner);
        nft = new CapyMinter(owner);

        // Give some ETH to test users and owner
        vm.deal(owner, 1 ether);
        vm.deal(user1, 1 ether);
        vm.deal(user2, 1 ether);
    }

    // Test basic deployment state
    function testInitialState() public view {
        assertEq(nft.totalSupply(), 0);
        assertEq(nft.name(), "CapyMinter");
        assertEq(nft.symbol(), "CAPY");
        assertEq(nft.owner(), owner);
    }

    // Test minting an NFT
    function testMint() public {
        // Mint as user1
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Check results
        assertEq(nft.totalSupply(), 1);
        assertEq(nft.ownerOf(0), user1);
        assertEq(address(nft).balance, 0.01 ether);
    }

    // Test minting with incorrect price
    function testMintWithIncorrectPrice() public {
        // Try to mint with incorrect price
        vm.prank(user1);
        vm.expectRevert("Incorrect ETH amount sent");
        nft.mint{value: 0.005 ether}();

        // Try to mint with no ETH
        vm.prank(user1);
        vm.expectRevert("Incorrect ETH amount sent");
        nft.mint();
    }

    // Test that a user can't mint more than one NFT
    function testCannotMintTwice() public {
        // First mint should succeed
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Second mint should fail
        vm.prank(user1);
        vm.expectRevert("Each wallet can only mint one NFT");
        nft.mint{value: 0.01 ether}();
    }

    // Test max supply limit
    function testMaxSupply() public {
        // Mint 5 NFTs with different users
        for (uint256 i = 0; i < 5; i++) {
            address user = makeAddr(string(abi.encodePacked("user", i + 1)));
            vm.deal(user, 0.01 ether);
            vm.prank(user);
            nft.mint{value: 0.01 ether}();
        }

        // Verify total supply
        assertEq(nft.totalSupply(), 5);

        // Try to mint one more, should fail
        address extraUser = makeAddr("extraUser");
        vm.deal(extraUser, 0.01 ether);
        vm.prank(extraUser);
        vm.expectRevert("All NFTs have been minted");
        nft.mint{value: 0.01 ether}();
    }

    // Test setting base URI
    function testSetBaseURI() public {
        string memory baseURI = "https://ipfs.io/ipfs/QmHash/";

        // Set base URI as owner
        vm.prank(owner);
        nft.setBaseURI(baseURI);

        // Mint an NFT
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Check token URI
        assertEq(nft.tokenURI(0), string(abi.encodePacked(baseURI, "0.json")));
    }

    // Test setting individual token URI
    function testSetTokenURI() public {
        // Mint an NFT
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Set specific token URI as owner
        string memory specificURI = "https://example.com/special.json";
        vm.prank(owner);
        nft.setTokenURI(0, specificURI);

        // Check token URI
        assertEq(nft.tokenURI(0), specificURI);
    }

    // Test that only owner can set base URI
    function testOnlyOwnerCanSetBaseURI() public {
        vm.prank(user1);
        vm.expectRevert();
        nft.setBaseURI("https://example.com/");
    }

    // Test that only owner can set token URI
    function testOnlyOwnerCanSetTokenURI() public {
        // Mint an NFT
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Try to set token URI as non-owner
        vm.prank(user1);
        vm.expectRevert();
        nft.setTokenURI(0, "https://example.com/special.json");
    }

    // Test withdrawing funds
    function testWithdraw() public {
        // Mint an NFT to add funds to contract
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Check contract balance
        assertEq(address(nft).balance, 0.01 ether);

        // Record owner's balance before withdrawal
        uint256 ownerBalanceBefore = address(owner).balance;

        // Withdraw funds as owner
        vm.prank(owner);
        nft.withdraw();

        // Check balances after withdrawal
        assertEq(address(nft).balance, 0);
        assertEq(address(owner).balance, ownerBalanceBefore + 0.01 ether);
    }

    // Test that only owner can withdraw
    function testOnlyOwnerCanWithdraw() public {
        // Mint an NFT to add funds to contract
        vm.prank(user1);
        nft.mint{value: 0.01 ether}();

        // Try to withdraw as non-owner
        vm.prank(user1);
        vm.expectRevert();
        nft.withdraw();
    }

    // Test that withdraw fails if no funds
    function testWithdrawWithNoFunds() public {
        vm.prank(owner);
        vm.expectRevert("No ETH to withdraw");
        nft.withdraw();
    }
}

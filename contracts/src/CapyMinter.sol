// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CapyMinter is ERC721, ERC721URIStorage, Ownable {
    uint256 private _tokenIdCounter;

    uint256 public constant MAX_SUPPLY = 5;
    uint256 public constant MINT_PRICE = 0.01 ether;

    // Base URI for metadata
    string private _baseTokenURI;

    mapping(address => bool) private _hasMinted;

    constructor(address initialOwner) ERC721("CapyMinter", "CAPY") Ownable(initialOwner) {}

    function mint() public payable {
        // Check if all NFTs have been minted
        require(_tokenIdCounter < MAX_SUPPLY, "All NFTs have been minted");

        // Check if sender has already minted
        require(!_hasMinted[msg.sender], "Each wallet can only mint one NFT");

        // Check if sender has sent enough ETH
        require(msg.value == MINT_PRICE, "Incorrect ETH amount sent");

        // Mint NFT
        uint256 tokenId = _tokenIdCounter;
        _tokenIdCounter++;
        _hasMinted[msg.sender] = true;
        _safeMint(msg.sender, tokenId);

        // Set token URI if base URI is set
        if (bytes(_baseTokenURI).length > 0) {
            _setTokenURI(tokenId, string(abi.encodePacked(_toString(tokenId), ".json")));
        }
    }

    // Function to set token URI for a specific token
    function setTokenURI(uint256 tokenId, string memory uri) public onlyOwner {
        require(_exists(tokenId), "URI set of nonexistent token");
        _setTokenURI(tokenId, uri);
    }

    // Function to set base URI for all tokens
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Override the baseURI function
    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }

    // Helper function to convert uint256 to string
    function _toString(uint256 value) internal pure returns (string memory) {
        // This is just a simple implementation for small numbers
        if (value == 0) {
            return "0";
        }

        uint256 temp = value;
        uint256 digits;

        while (temp != 0) {
            digits++;
            temp /= 10;
        }

        bytes memory buffer = new bytes(digits);

        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }

        return string(buffer);
    }

    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        (bool success,) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // The following functions are overrides required by Solidity

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    // Check if a token exists
    function _exists(uint256 tokenId) internal view returns (bool) {
        return tokenId < _tokenIdCounter && tokenId >= 0;
    }
}

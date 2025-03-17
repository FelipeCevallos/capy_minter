"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import MintNFT from "@/components/web3/MintNFT"
import CollectionInfo from "@/components/web3/CollectionInfo"
import { useAccount, useReadContract } from "wagmi"
import { contractABI, contractAddress, contractChainId } from "@/lib/contractABI"
import { Sparkles } from "lucide-react"
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"
import { flowEvmTestnet } from "@/lib/chains"

// IPFS Gateway URLs
const IPFS_GATEWAY = "https://ipfs.io/ipfs/"

// The base CID for the metadata folder
const METADATA_CID = "bafybeibqerz6c7rt76iqdvxidci44nl56k5k2u4l7kbfsheox5vrlzu7f4"

// Type for NFT metadata
type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
}

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const [mintedNFT, setMintedNFT] = useState<number | null>(null)
  const [showCongrats, setShowCongrats] = useState(false)
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata[]>([])
  const [loading, setLoading] = useState(true)

  // Check if user has minted
  const { data: balance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  // Fetch metadata for all NFTs
  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      try {
        const metadata: NFTMetadata[] = [];
        
        // Fetch metadata for all 5 NFTs
        for (let i = 0; i < 5; i++) {
          const metadataUrl = `${IPFS_GATEWAY}${METADATA_CID}/${i}.json`;
          const response = await fetch(metadataUrl);
          
          if (response.ok) {
            const data = await response.json();
            metadata.push(data);
          } else {
            console.error(`Failed to fetch metadata for token ${i}`);
          }
        }
        
        setNftMetadata(metadata);
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetadata();
  }, []);

  // Get user's NFT if they have one
  useEffect(() => {
    const checkUserNFT = async () => {
      if (isConnected && address && balance && Number(balance) > 0) {
        try {
          // Since we don't have tokenOfOwnerByIndex, we'll check each token ID
          const maxTokens = 5; // Default to 5 if maxSupply is not available
          
          for (let tokenId = 0; tokenId < maxTokens; tokenId++) {
            try {
              // Check if the current user owns this token
              const ownerResponse = await fetch(`/api/ownerOf?tokenId=${tokenId}`)
                .then(res => res.json())
                .catch(() => ({ owner: null }))

              if (ownerResponse.owner && ownerResponse.owner.toLowerCase() === address.toLowerCase()) {
                setMintedNFT(tokenId)
                break
              }
            } catch (error) {
              console.log(`Token ${tokenId} check failed:`, error)
            }
          }
        } catch (error) {
          console.error("Error checking user NFT:", error)
        }
      }
    }

    checkUserNFT()
  }, [isConnected, address, balance])

  // Helper function to get image URL from IPFS or use placeholder
  const getImageUrl = (imageUrl: string) => {
    if (!imageUrl) return "/placeholder.svg";
    
    // If it's already a valid URL, use it
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it's an IPFS URI, convert it to a gateway URL
    if (imageUrl.startsWith('ipfs://')) {
      return imageUrl.replace('ipfs://', IPFS_GATEWAY);
    }
    
    return "/placeholder.svg";
  };

  // Simplified collection data
  const nftCollection = {
    name: "Vaporwave Capybaras",
    image: nftMetadata[2]?.image 
      ? getImageUrl(nftMetadata[2].image) 
      : "/placeholder.svg",
  }

  // NFT preview images from metadata
  const nftPreviews = nftMetadata.map((metadata, index) => ({
    id: index,
    name: metadata.name || `#00${index + 1}`,
    image: getImageUrl(metadata.image),
    description: metadata.description || ""
  }));

  // Get the latest token ID from the contract
  const getLatestTokenId = async () => {
    try {
      const publicClient = createPublicClient({
        chain: flowEvmTestnet,
        transport: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL || 'https://flow-testnet.g.alchemy.com/v2/xFnKwKEtyR6uS7CZ2KO_SRt28lVJU9YC'),
      });

      const totalSupply = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'totalSupply',
      });

      return Number(totalSupply) - 1;
    } catch (error) {
      console.error("Error getting latest token ID:", error);
      return null;
    }
  };

  // Handle successful mint
  const onMintSuccess = async (tokenId?: number) => {
    if (tokenId !== undefined) {
      setMintedNFT(tokenId);
    } else {
      // Try to get the latest token ID
      const latestTokenId = await getLatestTokenId();
      if (latestTokenId !== null) {
        setMintedNFT(latestTokenId);
      }
    }
    setShowCongrats(true);
  };

  // Get total supply
  const { data: totalSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'totalSupply',
  });

  // Check if all NFTs are minted
  const allMinted = totalSupply ? Number(totalSupply) >= 5 : false;

  // Scroll to top when congrats is shown
  useEffect(() => {
    if (showCongrats) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [totalSupply, showCongrats, mintedNFT]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-indigo-900 py-16 px-4">
      {/* Grid background */}
      <div
        className="absolute inset-0 z-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating elements */}
      <div className="absolute top-40 left-20 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-40 right-20 w-40 h-40 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 blur-xl opacity-30 animate-pulse" />

      <div className="container relative z-10 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300">
            Mint Your NFT
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Mint one of our exclusive Vaporwave Capybara NFTs to add to your digital collection
          </p>
        </div>

        {/* Centered minting card */}
        <div className="w-full mx-auto">
          <Card className="bg-black/40 backdrop-blur-sm border-cyan-500/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
                {nftCollection.name}
              </CardTitle>
              <CardDescription>Limited collection of unique NFTs on Flow EVM testnet</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <CollectionInfo />

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <p className="text-yellow-300 text-sm">
                  Each Vaporwave Capybara NFT is unique and randomly generated from our collection. Connect your wallet and mint now!
                </p>
              </div>
            </CardContent>

            <CardFooter className="flex justify-center">
              <div className="w-full max-w-xs">
                <MintNFT onMintSuccess={onMintSuccess} />
              </div>
            </CardFooter>
          </Card>
          
          {/* Show success message if minted */}
          {showCongrats && (
            <div className="mt-6 p-4 bg-gradient-to-r from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 rounded-lg text-center">
              <Sparkles className="inline-block mr-2 h-5 w-5 text-cyan-400" />
              <span className="font-bold text-white">Congrats! You minted a Capy!</span>
            </div>
          )}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-block rounded-lg bg-black/30 backdrop-blur-sm px-4 py-2 mb-4 border border-cyan-400/30">
            <p className="text-cyan-300 font-medium">Preview All Capybaras</p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {nftPreviews.map((nft) => (
                <div key={nft.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-cyan-400/50 transform hover:-translate-y-1 transition-all duration-300">
                  <Image
                    src={nft.image}
                    alt={nft.name}
                    fill
                    className="object-cover"
                    unoptimized={true} // Skip optimization for IPFS images
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="text-white font-bold">{nft.name}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 max-w-2xl mx-auto">
            <p className="text-white/70 text-sm">
              Each of these 5 Vaporwave Capybaras is a unique piece of digital art. Once minted, you'll randomly receive
              one of these awesome NFTs to add to your collection!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


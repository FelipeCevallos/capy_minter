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

export default function MintPage() {
  const { address, isConnected } = useAccount()
  const [mintedNFT, setMintedNFT] = useState<number | null>(null)
  const [showCongrats, setShowCongrats] = useState(false)

  // Check if user has minted
  const { data: balance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

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

  // Simplified collection data
  const nftCollection = {
    name: "Vaporwave Capybaras",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.57.03%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wears%20stylish%20retro-futuristic%20sungla-4t4zmrYBCQDRKtBBNX8LWkeNQiIt4d.png",
  }

  // NFT preview images
  const nftPreviews = [
    {
      id: 0,
      name: "#001 Hoverboard Legend",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.53.57%20-%20A%20futuristic%20capybara%20in%20a%20vaporwave%20style%2C%20sitting%20on%20a%20hoverboard%20with%20neon%20underglow%2C%20wearing%20a%20metallic%20jacket%20and%20holographic%20visor.%20Background%20f-x2hyLehXKRw2B0NuoJmxRjo2UitahB.png"
    },
    {
      id: 1,
      name: "#002 So Chill",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.52.25%20-%20A%20futuristic%20capybara%20in%20a%20vaporwave%20vibe%2C%20wearing%20neon%20sunglasses%20and%20a%20cybernetic%20headset%2C%20surrounded%20by%20glowing%20palm%20trees%2C%20purple%20and%20pink%20neon%20li-bsLBY0OJgxLUllMTVNXxfrMdAyrI3F.png"
    },
    {
      id: 2,
      name: "#003 Desert Wanderer",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.57.03%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wears%20stylish%20retro-futuristic%20sungla-4t4zmrYBCQDRKtBBNX8LWkeNQiIt4d.png"
    },
    {
      id: 3,
      name: "#004 DJ Capybara",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.54.07%20-%20A%20futuristic%20capybara%20DJ%20in%20a%20vaporwave%20club%2C%20wearing%20neon%20headphones%20and%20spinning%20a%20holographic%20record.%20Surrounded%20by%20glowing%20pink%20and%20blue%20lights%2C%20w-vbWYtwdrY7mUwvl1uW3Hski4hKzJ1r.png"
    },
    {
      id: 4,
      name: "#005 Mate Mystic",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.58.17%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape%2C%20drinking%20mate%20%28Argentinian%20tea%29.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wear-xvnncOBk6lrkV7jwPHJAD2vAkn9Hc8.png"
    }
  ]

  // Get the latest token ID from the contract
  const getLatestTokenId = async () => {
    try {
      const publicClient = createPublicClient({
        chain: flowEvmTestnet,
        transport: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL),
      });
      
      // Get total supply to determine the latest token ID
      const totalSupply = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'totalSupply',
      });
      
      // In most NFT contracts, token IDs start from 0, so the latest is totalSupply - 1
      const latestTokenId = Number(totalSupply) - 1;
      
      // Verify this token belongs to the user
      const owner = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'ownerOf',
        args: [BigInt(latestTokenId)],
      }) as `0x${string}`;
      
      if (owner && address && owner.toLowerCase() === address.toLowerCase()) {
        return latestTokenId;
      }
      
      return null;
    } catch (error) {
      console.error("Error getting latest token ID:", error);
      return null;
    }
  };

  // Listen for mint success from MintNFT component
  const onMintSuccess = async () => {
    setShowCongrats(true);
    
    // Try to get the latest token ID immediately
    const latestTokenId = await getLatestTokenId();
    if (latestTokenId !== null) {
      setMintedNFT(latestTokenId);
    } else {
      // Fallback to checking all tokens
      checkUserNFT();
    }
    
    // Double-check after a delay to ensure blockchain data is updated
    setTimeout(async () => {
      if (isConnected && address) {
        const delayedTokenId = await getLatestTokenId();
        if (delayedTokenId !== null) {
          setMintedNFT(delayedTokenId);
        } else {
          checkUserNFT();
        }
      }
    }, 3000);
  };

  // Function to check user's NFT
  const checkUserNFT = async () => {
    if (isConnected && address) {
      try {
        const maxTokens = 5;
        
        for (let tokenId = 0; tokenId < maxTokens; tokenId++) {
          try {
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

  // Get the total supply to determine the latest token ID
  const { data: totalSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'totalSupply',
  });

  // When total supply changes, check if we need to update the minted NFT
  useEffect(() => {
    if (totalSupply && showCongrats && mintedNFT === null) {
      // If we're showing congrats but don't have a minted NFT yet, try to get it
      getLatestTokenId().then(tokenId => {
        if (tokenId !== null) {
          setMintedNFT(tokenId);
        }
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {nftPreviews.map((nft) => (
              <div key={nft.id} className="relative aspect-square rounded-lg overflow-hidden border-2 border-cyan-400/50 transform hover:-translate-y-1 transition-all duration-300">
                <Image
                  src={nft.image}
                  alt={nft.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-bold">{nft.name}</p>
                </div>
              </div>
            ))}
          </div>

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


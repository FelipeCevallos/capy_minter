"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Info, Frown, AlertCircle } from "lucide-react"
import { useAccount, useReadContract } from "wagmi"
import { ConnectKitButton } from "connectkit"
import { contractABI, contractAddress, contractChainId } from "@/lib/contractABI"
import { createPublicClient, http } from "viem"
import { flowEvmTestnet } from "@/lib/chains"

// NFT type definition
type NFT = {
  id: number
  name: string
  description: string
  image: string
  traits: { trait_type: string; value: string }[]
}

export default function CollectionPage() {
  const { address, isConnected, chainId } = useAccount()
  const [userNFTs, setUserNFTs] = useState<NFT[]>([])
  const [loading, setLoading] = useState(true)
  const isWrongNetwork = isConnected && chainId !== contractChainId

  // Get user's balance
  const { data: balance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  })

  // Get max supply
  const { data: maxSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'MAX_SUPPLY',
  })

  // Fetch NFT data
  useEffect(() => {
    const fetchUserNFTs = async () => {
      if (!isConnected || !address || isWrongNetwork) {
        setUserNFTs([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching NFTs for address:", address);
        console.log("Using RPC URL:", process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL);
        console.log("Contract address:", contractAddress);
        console.log("Chain ID:", chainId, "Expected chain ID:", contractChainId);
        
        const maxTokens = Number(maxSupply) || 5;
        const userTokens: NFT[] = [];

        // Create a client for the Flow EVM testnet
        const publicClient = createPublicClient({
          chain: flowEvmTestnet,
          transport: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL || 'https://flow-testnet.g.alchemy.com/v2/xFnKwKEtyR6uS7CZ2KO_SRt28lVJU9YC'),
        });

        // First, try to get the user's balance directly
        try {
          console.log("Fetching balance for address:", address);
          
          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const balance = await publicClient.readContract({
            address: contractAddress as `0x${string}`,
            abi: contractABI,
            functionName: 'balanceOf',
            args: [address],
          });

          console.log('User balance:', Number(balance));
          
          // If balance is 0, no need to check for tokens
          if (Number(balance) === 0) {
            setUserNFTs([]);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }

        // Check each token ID to see if the user owns it
        console.log("Checking token ownership for user:", address);
        
        for (let tokenId = 0; tokenId < maxTokens; tokenId++) {
          try {
            // Add a small delay between requests to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 300));
            
            console.log(`Checking ownership of token ${tokenId}...`);
            
            // Check if the current user owns this token
            const owner = await publicClient.readContract({
              address: contractAddress as `0x${string}`,
              abi: contractABI,
              functionName: 'ownerOf',
              args: [BigInt(tokenId)],
            });

            console.log(`Token ${tokenId} owner:`, owner);

            if (owner && owner.toString().toLowerCase() === address.toLowerCase()) {
              console.log(`User owns token ${tokenId}`);
              
              // For this demo, we'll use mock data instead of fetching from IPFS
              const nft: NFT = {
                id: tokenId,
                name: `Vaporwave Capybara #${tokenId + 1}`,
                description: "A unique Vaporwave Capybara NFT from the CapyMinter collection",
                image: getNftImage(tokenId),
                traits: [
                  { trait_type: "Collection", value: "Vaporwave Capybaras" },
                  { trait_type: "Rarity", value: "Rare" },
                ],
              };

              userTokens.push(nft);
            }
          } catch (error) {
            console.log(`Token ${tokenId} check failed:`, error);
          }
        }

        console.log('Found user NFTs:', userTokens);
        setUserNFTs(userTokens);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
        setLoading(false);
      }
    }

    fetchUserNFTs()
  }, [isConnected, address, balance, maxSupply, isWrongNetwork, chainId])

  // Helper function to get NFT image based on token ID
  const getNftImage = (tokenId: number) => {
    const images = [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.53.57%20-%20A%20futuristic%20capybara%20in%20a%20vaporwave%20style%2C%20sitting%20on%20a%20hoverboard%20with%20neon%20underglow%2C%20wearing%20a%20metallic%20jacket%20and%20holographic%20visor.%20Background%20f-x2hyLehXKRw2B0NuoJmxRjo2UitahB.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.52.25%20-%20A%20futuristic%20capybara%20in%20a%20vaporwave%20vibe%2C%20wearing%20neon%20sunglasses%20and%20a%20cybernetic%20headset%2C%20surrounded%20by%20glowing%20palm%20trees%2C%20purple%20and%20pink%20neon%20li-bsLBY0OJgxLUllMTVNXxfrMdAyrI3F.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.57.03%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wears%20stylish%20retro-futuristic%20sungla-4t4zmrYBCQDRKtBBNX8LWkeNQiIt4d.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.54.07%20-%20A%20futuristic%20capybara%20DJ%20in%20a%20vaporwave%20club%2C%20wearing%20neon%20headphones%20and%20spinning%20a%20holographic%20record.%20Surrounded%20by%20glowing%20pink%20and%20blue%20lights%2C%20w-vbWYtwdrY7mUwvl1uW3Hski4hKzJ1r.png",
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.58.17%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape%2C%20drinking%20mate%20%28Argentinian%20tea%29.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wear-xvnncOBk6lrkV7jwPHJAD2vAkn9Hc8.png",
    ]
    return images[tokenId % images.length]
  }

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

      <div className="container relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300">
            Your NFT Collection
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            View and manage your Vaporwave Capybara NFTs
          </p>
        </div>

        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
            <div className="w-20 h-20 rounded-full bg-black/50 flex items-center justify-center mb-6">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22 9H2M14 17H18M6 17H10M2 7.8L2 16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27977 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3H6.8C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27977 2 6.11984 2 7.8Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Connect Your Wallet</h2>
            <p className="text-white/70 mb-8 text-center max-w-md">
              Connect your wallet to view your NFT collection and manage your digital assets
            </p>
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button
                  onClick={show}
                  className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 h-12 px-8"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2"
                  >
                    <path
                      d="M22 9H2M14 17H18M6 17H10M2 7.8L2 16.2C2 17.8802 2 18.7202 2.32698 19.362C2.6146 19.9265 3.07354 20.3854 3.63803 20.673C4.27976 21 5.11984 21 6.8 21H17.2C18.8802 21 19.7202 21 20.362 20.673C20.9265 20.3854 21.3854 19.9265 21.673 19.362C22 18.7202 22 17.8802 22 16.2V7.8C22 6.11984 22 5.27977 21.673 4.63803C21.3854 4.07354 20.9265 3.6146 20.362 3.32698C19.7202 3 18.8802 3 17.2 3H6.8C5.11984 3 4.27976 3 3.63803 3.32698C3.07354 3.6146 2.6146 4.07354 2.32698 4.63803C2 5.27977 2 6.11984 2 7.8Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Connect Wallet
                </Button>
              )}
            </ConnectKitButton.Custom>
          </div>
        ) : isWrongNetwork ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-black/30 backdrop-blur-sm rounded-xl border border-yellow-500/20">
            <div className="w-20 h-20 rounded-full bg-yellow-500/20 flex items-center justify-center mb-6">
              <AlertCircle className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-white">Wrong Network</h2>
            <p className="text-white/70 mb-8 text-center max-w-md">
              Please switch to the Flow EVM Testnet to view your NFT collection
            </p>
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button
                  onClick={show}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white border-0 h-12 px-8"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Switch Network
                </Button>
              )}
            </ConnectKitButton.Custom>
          </div>
        ) : loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : userNFTs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 bg-black/30 backdrop-blur-sm rounded-xl border border-cyan-500/20">
            <Frown className="w-16 h-16 text-pink-400 mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-white">No NFTs yet, sucks to suck</h2>
            <p className="text-white/70 mb-8 text-center max-w-md">
              Head over to the Mint page to get your first NFT
            </p>
            <Button
              onClick={() => window.location.href = '/mint'}
              className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 h-12 px-8"
            >
              <ArrowRight className="mr-2 h-5 w-5" />
              Mint Your First NFT
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
            {userNFTs.map((nft) => (
              <NftCard key={nft.id} nft={nft} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NftCard({ nft }: { nft: NFT }) {
  const [showDetails, setShowDetails] = useState(false)
  const [imgError, setImgError] = useState(false)

  // Process image URL to ensure it's compatible with next/image
  const getImageUrl = () => {
    if (imgError || !nft.image) return "/placeholder.svg"
    
    // If it's already a valid URL, use it
    if (nft.image.startsWith('http')) {
      return nft.image
    }
    
    // If it's an IPFS URI, convert it to a gateway URL
    if (nft.image.startsWith('ipfs://')) {
      return nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
    }
    
    return "/placeholder.svg"
  }

  return (
    <Card className="overflow-hidden bg-black/40 backdrop-blur-sm border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-300">
      <div className="grid md:grid-cols-2 h-full">
        {/* Image container - takes full height on all screens */}
        <div className="relative h-[350px] md:h-[450px]">
          <Image 
            src={getImageUrl()} 
            alt={nft.name} 
            fill 
            className="object-cover" 
            onError={() => setImgError(true)}
            unoptimized={nft.image.includes('ipfs')} // Skip optimization for IPFS images
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>
        
        {/* Details container - matches height of image */}
        <div className="p-6 flex flex-col justify-between h-full">
          <div>
            <h3 className="font-bold text-xl text-white mb-2">{nft.name}</h3>
            <p className="text-white/70 text-sm mb-6">{nft.description}</p>
          
            <div className="mb-6">
              <h4 className="font-semibold text-cyan-400 mb-2">Traits</h4>
              <div className="space-y-2">
                {nft.traits.map((trait, index) => (
                  <div key={index} className="flex justify-between bg-white/5 p-2 rounded">
                    <span className="text-white/70">{trait.trait_type}</span>
                    <span className="font-medium text-white">{trait.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <Button
              variant="ghost"
              className="text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/30 self-start"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? "Hide Details" : "View Details"}
              <ArrowRight className={`ml-1 h-4 w-4 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </Button>
            
            {showDetails && (
              <div className="mt-4 p-3 bg-black/30 rounded-lg border border-cyan-500/20">
                <div className="flex justify-between mb-2">
                  <span className="text-white/70">Token ID</span>
                  <span className="font-medium text-white">#{nft.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Contract</span>
                  <a
                    href={`https://evm-testnet.flowscan.io/token/${contractAddress}?a=${nft.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline text-sm truncate max-w-[150px]"
                  >
                    View on FlowScan
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}


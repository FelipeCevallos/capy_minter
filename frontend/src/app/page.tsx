"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// IPFS Gateway URL
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

// Featured NFT component
function FeaturedNFT({ tokenId }: { tokenId: number }) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const metadataUrl = `${IPFS_GATEWAY}${METADATA_CID}/${tokenId}.json`;
        const response = await fetch(metadataUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }
        
        const data = await response.json();
        setMetadata(data);
      } catch (err) {
        console.error(`Error fetching metadata for token ${tokenId}:`, err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMetadata();
  }, [tokenId]);

  if (loading) {
    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-purple-500/20 flex items-center justify-center bg-black/40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-purple-500/20 flex items-center justify-center bg-black/40">
        <p className="text-white">Failed to load NFT</p>
      </div>
    );
  }

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-purple-500/20 transform hover:-translate-y-2 transition-all duration-300">
      <Image
        src={getImageUrl(metadata.image)}
        alt={metadata.name}
        fill
        className="object-cover"
        unoptimized={true} // Skip optimization for IPFS images
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <p className="text-white font-bold">{metadata.name}</p>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-purple-900 via-pink-800 to-indigo-900">
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
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-pink-400 to-yellow-300 blur-xl opacity-30 animate-pulse" />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-300 tracking-tight">
            MINT NOW!!!
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-white/80 max-w-2xl mx-auto">
            Discover and collect extraordinary Capybara NFTs from the coolest digital artists on the planet
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/mint">
              <Button
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 text-lg px-8 py-6 rounded-xl shadow-lg shadow-purple-500/30"
              >
                Mint NFTs
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/collection">
              <Button
                size="lg"
                variant="outline"
                className="bg-black/30 backdrop-blur-sm border-cyan-400/50 text-white hover:bg-black/40 hover:text-cyan-300 text-lg px-8 py-6 rounded-xl"
              >
                View Collection
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured NFTs */}
        <div className="mt-20 flex flex-wrap gap-6 justify-center">
          <FeaturedNFT tokenId={2} />
          <FeaturedNFT tokenId={3} />
          <FeaturedNFT tokenId={4} />
        </div>

        {/* Collection Info */}
        <div className="mt-24 max-w-4xl mx-auto text-center">
          <div className="inline-block rounded-lg bg-black/30 backdrop-blur-sm px-4 py-2 mb-6 border border-cyan-400/30">
            <p className="text-cyan-300 font-medium">Limited Edition Capybara Collection</p>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400">
            The Coolest Capybaras in Web3
          </h2>
          <p className="text-white/70 mb-8">
            Each Capybara NFT is unique with different traits, accessories, and vaporwave backgrounds. Join the
            community of collectors and secure your piece of digital art history!
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-pink-500/30">
              <p className="text-2xl font-bold text-white">5</p>
              <p className="text-pink-300 text-sm">Total Supply</p>
            </div>
            <div className="bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-cyan-500/30">
              <p className="text-2xl font-bold text-white">0.01 ETH</p>
              <p className="text-cyan-300 text-sm">Mint Price</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


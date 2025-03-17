"use client"

import { useState, useEffect } from "react"
import Image from "next/image"

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
export default function FeaturedNFT({ tokenId }: { tokenId: number }) {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
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
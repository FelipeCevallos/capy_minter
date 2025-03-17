"use client";

import { useEffect, useState } from 'react';
import { useReadContract } from 'wagmi';
import { contractABI, contractAddress, contractNetwork } from '@/lib/contractABI';
import { createPublicClient, http } from 'viem';
import { flowEvmTestnet } from '@/lib/chains';

export default function CollectionInfo() {
  const [manualTotalSupply, setManualTotalSupply] = useState<number | null>(null);
  const [manualMaxSupply, setManualMaxSupply] = useState<number | null>(null);
  const [manualName, setManualName] = useState<string | null>(null);
  const [manualSymbol, setManualSymbol] = useState<string | null>(null);

  // Get total supply
  const { data: totalSupply, refetch: refetchTotalSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'totalSupply',
  });

  // Get max supply
  const { data: maxSupply } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'MAX_SUPPLY',
  });

  // Get name
  const { data: name } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'name',
  });

  // Get symbol
  const { data: symbol } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'symbol',
  });

  // Manual fetch of contract data as a backup
  const fetchContractData = async () => {
    try {
      console.log("Fetching contract data manually...");
      console.log("Using RPC URL:", process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL);
      console.log("Contract address:", contractAddress);
      
      const publicClient = createPublicClient({
        chain: flowEvmTestnet,
        transport: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL),
      });
      
      // Get total supply
      console.log("Fetching total supply...");
      const supply = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'totalSupply',
      });
      
      console.log("Total supply:", Number(supply));
      setManualTotalSupply(Number(supply));
      
      // Get max supply
      console.log("Fetching max supply...");
      const max = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'MAX_SUPPLY',
      });
      
      console.log("Max supply:", Number(max));
      setManualMaxSupply(Number(max));
      
      // Get name
      console.log("Fetching name...");
      const contractName = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'name',
      });
      
      console.log("Name:", contractName);
      setManualName(contractName as string);
      
      // Get symbol
      console.log("Fetching symbol...");
      const contractSymbol = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'symbol',
      });
      
      console.log("Symbol:", contractSymbol);
      setManualSymbol(contractSymbol as string);
    } catch (error) {
      console.error('Error fetching contract data manually:', error);
    }
  };

  // Periodically refresh the total supply
  useEffect(() => {
    // Refresh immediately
    refetchTotalSupply();
    fetchContractData();
    
    // Then refresh every 5 seconds
    const interval = setInterval(() => {
      refetchTotalSupply();
      fetchContractData();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refetchTotalSupply]);

  // Use manual data as fallback if wagmi hooks don't return data
  const effectiveTotalSupply = totalSupply !== undefined ? Number(totalSupply) : manualTotalSupply;
  const effectiveMaxSupply = maxSupply !== undefined ? Number(maxSupply) : manualMaxSupply;
  const effectiveName = name !== undefined ? name as string : manualName;
  const effectiveSymbol = symbol !== undefined ? symbol as string : manualSymbol;

  // Convert data to strings to avoid type errors
  const nameStr = effectiveName || 'NFT_Minter';
  const symbolStr = effectiveSymbol || 'NFTM';
  const totalSupplyStr = effectiveTotalSupply !== null ? effectiveTotalSupply.toString() : '0';
  const maxSupplyStr = effectiveMaxSupply !== null ? effectiveMaxSupply.toString() : '5';

  return (
    <div className="p-4 rounded-lg bg-black/30 space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-white/70">Collection</span>
        <span className="font-medium text-white">{nameStr}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-white/70">Symbol</span>
        <span className="font-medium text-white">{symbolStr}</span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-white/70">Minted</span>
        <span className="font-medium text-white">
          {totalSupplyStr} / {maxSupplyStr}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-white/70">Contract</span>
        <a
          href={`https://evm-testnet.flowscan.io/address/${contractAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-400 hover:underline text-sm truncate max-w-[200px]"
        >
          {contractAddress.substring(0, 10)}...{contractAddress.substring(contractAddress.length - 4)}
        </a>
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-white/70">Network</span>
        <span className="font-medium text-white">Flow EVM Testnet</span>
      </div>
    </div>
  );
} 
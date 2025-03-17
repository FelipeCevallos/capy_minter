"use client";

import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, AlertCircle, Check } from 'lucide-react';
import { contractABI, contractAddress, contractChainId } from '@/lib/contractABI';
import { ConnectKitButton } from 'connectkit';
import { createPublicClient, http } from 'viem';
import { flowEvmTestnet } from '@/lib/chains';

interface MintNFTProps {
  onMintSuccess?: () => void;
}

export default function MintNFT({ onMintSuccess }: MintNFTProps) {
  const [isMinting, setIsMinting] = useState(false);
  const [hasMintedLocally, setHasMintedLocally] = useState(false);
  const [manualTotalSupply, setManualTotalSupply] = useState<number | null>(null);
  const [manualBalance, setManualBalance] = useState<number | null>(null);
  const { address, isConnected, chainId } = useAccount();

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

  // Check if user has already minted
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: contractAddress as `0x${string}`,
    abi: contractABI,
    functionName: 'balanceOf',
    args: [address || '0x0000000000000000000000000000000000000000'],
  });

  // Mint NFT
  const { writeContract, data: hash, isPending: isMintLoading, isError: isMintError, error: mintError } = useWriteContract();

  // Wait for transaction
  const { isLoading: isTransactionLoading, isSuccess: isTransactionSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Manual fetch of contract data as a backup
  const fetchContractData = async () => {
    if (!isConnected || !address) return;
    
    try {
      console.log("Fetching contract data manually in MintNFT...");
      console.log("Using RPC URL:", process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL);
      console.log("Contract address:", contractAddress);
      console.log("Chain ID:", chainId, "Expected chain ID:", contractChainId);
      
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
      
      // Get user balance
      console.log("Fetching balance for address:", address);
      const balance = await publicClient.readContract({
        address: contractAddress as `0x${string}`,
        abi: contractABI,
        functionName: 'balanceOf',
        args: [address],
      });
      
      console.log("User balance:", Number(balance));
      setManualBalance(Number(balance));
    } catch (error) {
      console.error('Error fetching contract data manually:', error);
    }
  };

  // Periodically refresh the balance and total supply
  useEffect(() => {
    if (isConnected && address) {
      // Refresh immediately
      refetchBalance();
      refetchTotalSupply();
      fetchContractData();
      
      // Then refresh every 5 seconds
      const interval = setInterval(() => {
        refetchBalance();
        refetchTotalSupply();
        fetchContractData();
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected, address, refetchBalance, refetchTotalSupply]);

  // Handle successful transaction
  useEffect(() => {
    if (isTransactionSuccess) {
      setIsMinting(false);
      setHasMintedLocally(true);
      
      // Refetch balance and total supply to update the UI
      refetchBalance();
      refetchTotalSupply();
      fetchContractData();
      
      // Call the onMintSuccess callback if provided
      if (onMintSuccess) {
        onMintSuccess();
      }
      
      // Double-check after a delay to ensure blockchain data is updated
      setTimeout(() => {
        refetchBalance();
        refetchTotalSupply();
        fetchContractData();
      }, 3000);
    }
  }, [isTransactionSuccess, onMintSuccess, refetchBalance, refetchTotalSupply]);

  // Reset local state when wallet changes
  useEffect(() => {
    setHasMintedLocally(false);
  }, [address]);

  const handleMint = () => {
    if (!isConnected || chainId !== contractChainId) {
      return;
    }

    setIsMinting(true);
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'mint',
      value: parseEther('0.01'),
    });
  };

  // Use manual data as fallback if wagmi hooks don't return data
  const effectiveTotalSupply = totalSupply !== undefined ? Number(totalSupply) : manualTotalSupply;
  const effectiveBalance = balanceData !== undefined ? Number(balanceData) : manualBalance;

  const isSoldOut = effectiveTotalSupply !== null && maxSupply ? effectiveTotalSupply >= Number(maxSupply) : false;
  const userHasMinted = (effectiveBalance !== null && effectiveBalance > 0) || hasMintedLocally;
  const buttonDisabled = Boolean(
    !isConnected || isMinting || isMintLoading || isTransactionLoading || isSoldOut || userHasMinted || isTransactionSuccess
  );
  const isWrongNetwork = isConnected && chainId !== contractChainId;

  let buttonText = 'Mint Now';
  let buttonIcon = <Sparkles className="mr-2 h-5 w-5" />;
  let buttonClass = "w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 h-12 text-lg disabled:opacity-70";

  if (!isConnected) {
    return (
      <ConnectKitButton.Custom>
        {({ show }) => (
          <Button
            onClick={show}
            className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white border-0 h-12 text-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Connect Wallet to Mint
          </Button>
        )}
      </ConnectKitButton.Custom>
    );
  } else if (isWrongNetwork) {
    return (
      <ConnectKitButton.Custom>
        {({ show }) => (
          <Button
            onClick={show}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white border-0 h-12 text-lg"
          >
            <AlertCircle className="mr-2 h-5 w-5" />
            Switch to Flow EVM Testnet
          </Button>
        )}
      </ConnectKitButton.Custom>
    );
  } else if (isMinting || isMintLoading || isTransactionLoading) {
    buttonText = 'Minting...';
    buttonIcon = <Loader2 className="mr-2 h-5 w-5 animate-spin" />;
  } else if (isTransactionSuccess || userHasMinted) {
    buttonText = 'Already Minted NFT';
    buttonIcon = <Check className="mr-2 h-5 w-5" />;
    buttonClass = "w-full bg-gray-600 text-white border-0 h-12 text-lg cursor-not-allowed opacity-70";
  } else if (isSoldOut) {
    buttonText = 'Sold Out';
    buttonIcon = <AlertCircle className="mr-2 h-5 w-5" />;
    buttonClass = "w-full bg-gray-600 text-white border-0 h-12 text-lg cursor-not-allowed opacity-70";
  }

  return (
    <div>
      <Button
        onClick={handleMint}
        disabled={buttonDisabled}
        className={buttonClass}
      >
        {buttonIcon}
        {buttonText}
      </Button>

      {isMintError && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
          <p>Error: {mintError?.message || 'Failed to mint. Please try again.'}</p>
        </div>
      )}

      {isTransactionSuccess && (
        <div className="mt-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-300 text-sm">
          <p>Successfully minted your NFT!</p>
          <a 
            href={`https://evm-testnet.flowscan.io/tx/${hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-cyan-400 hover:underline mt-1 inline-block"
          >
            View on FlowScan
          </a>
        </div>
      )}
    </div>
  );
} 
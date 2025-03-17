import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { contractABI, contractAddress } from '@/lib/contractABI';
import { flowEvmTestnet } from '@/lib/chains';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tokenId = searchParams.get('tokenId');

  if (!tokenId) {
    return NextResponse.json({ error: 'Missing tokenId parameter' }, { status: 400 });
  }

  try {
    const publicClient = createPublicClient({
      chain: flowEvmTestnet,
      transport: http(process.env.NEXT_PUBLIC_FLOW_EVM_TESTNET_RPC_URL),
    });

    const uri = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    // Convert IPFS URI to HTTP gateway URL if needed
    let formattedUri = uri as string;
    if (formattedUri.startsWith('ipfs://')) {
      formattedUri = formattedUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
    }

    return NextResponse.json({ uri: formattedUri });
  } catch (error) {
    console.error('Error fetching tokenURI:', error);
    return NextResponse.json({ error: 'Failed to fetch token URI' }, { status: 500 });
  }
} 
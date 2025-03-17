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

    const owner = await publicClient.readContract({
      address: contractAddress as `0x${string}`,
      abi: contractABI,
      functionName: 'ownerOf',
      args: [BigInt(tokenId)],
    });

    return NextResponse.json({ owner });
  } catch (error) {
    console.error('Error fetching ownerOf:', error);
    // Return null instead of error for non-existent tokens
    // This allows the collection page to gracefully handle tokens that don't exist
    return NextResponse.json({ owner: null });
  }
} 
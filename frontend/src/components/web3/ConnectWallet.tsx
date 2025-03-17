"use client";

import { ConnectKitButton } from 'connectkit';
import { useAccount } from 'wagmi';

export default function ConnectWallet() {
  const { isConnected } = useAccount();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, hide, address, ensName }) => {
        return (
          <button
            onClick={show}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              isConnected
                ? "bg-black/30 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
                : "bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white"
            }`}
          >
            {isConnected ? (
              <>
                <span className="text-sm hidden md:inline">
                  {ensName || `${address?.slice(0, 6)}...${address?.slice(-4)}`}
                </span>
                <span className="md:hidden">Connected</span>
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
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
              </>
            )}
          </button>
        );
      }}
    </ConnectKitButton.Custom>
  );
} 
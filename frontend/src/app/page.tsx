import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

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
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-purple-500/20 transform hover:-translate-y-2 transition-all duration-300">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.57.03%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wears%20stylish%20retro-futuristic%20sungla-4t4zmrYBCQDRKtBBNX8LWkeNQiIt4d.png"
              alt="Vaporwave Capybara with Sunglasses"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold">Desert Wanderer #003</p>
              <p className="text-cyan-300 text-sm">Desert Collection</p>
            </div>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-purple-500/20 transform hover:-translate-y-2 transition-all duration-300">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.54.07%20-%20A%20futuristic%20capybara%20DJ%20in%20a%20vaporwave%20club%2C%20wearing%20neon%20headphones%20and%20spinning%20a%20holographic%20record.%20Surrounded%20by%20glowing%20pink%20and%20blue%20lights%2C%20w-vbWYtwdrY7mUwvl1uW3Hski4hKzJ1r.png"
              alt="DJ Capybara"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold">DJ Capyvara #04</p>
              <p className="text-cyan-300 text-sm">Music Collection</p>
            </div>
          </div>

          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-lg overflow-hidden border-2 border-cyan-400/50 shadow-lg shadow-purple-500/20 transform hover:-translate-y-2 transition-all duration-300">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DALL%C2%B7E%202025-03-13%2011.58.17%20-%20A%20futuristic%20vaporwave%20capybara%20in%20a%20desert%20landscape%2C%20drinking%20mate%20%28Argentinian%20tea%29.%20The%20capybara%20has%20neon-colored%20cybernetic%20enhancements%20and%20wear-xvnncOBk6lrkV7jwPHJAD2vAkn9Hc8.png"
              alt="Mate Capybara"
              fill
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white font-bold">Mate Mystic #05</p>
              <p className="text-cyan-300 text-sm">Chill Collection</p>
            </div>
          </div>
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


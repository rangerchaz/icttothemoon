"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900">
      <div className="text-center space-y-8 p-8">
        <h1 className="text-6xl font-bold text-white mb-4">
          Wichita to the Moon
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Join the first lunar colonization mission from Wichita, Kansas.
          Explore landmarks, meet AI crew members, and build humanity's first moonbase.
        </p>
        <div className="space-y-4 mt-8">
          <button
            onClick={() => router.push("/game")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-xl font-bold rounded-lg transition-colors"
          >
            Start Mission
          </button>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push("/instructions")}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              How to Play
            </button>
            <button
              onClick={() => router.push("/technical")}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Technical Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

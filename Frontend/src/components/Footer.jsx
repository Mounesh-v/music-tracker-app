import { Headphones } from "lucide-react";

export default function Footer() {
  return (
    <footer className="py-8 md:py-12 px-4 md:px-6 lg:px-8 border-t border-white/[0.06] mt-6 md:mt-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#5FD0B3] flex items-center justify-center">
              <Headphones className="w-5 h-5 text-[#080D12]" />
            </div>
            <div>
              <p className="font-display text-base font-bold">
                <span className="text-white">Vibe</span>
                <span className="text-[#5FD0B3]">Tune</span>
              </p>
              <p className="text-[11px] text-[#5C6370]">Vibe with Your Favorite Songs</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 md:gap-8 text-sm">
            <div className="space-y-2">
              <p className="font-semibold text-white text-xs">Product</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Features</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Premium</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Download</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white text-xs">Company</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">About</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Careers</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Press</p>
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-white text-xs">Legal</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Privacy</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Terms</p>
              <p className="text-[#9CA3AF] hover:text-[#5FD0B3] cursor-pointer transition-colors">Support</p>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-10 pt-5 md:pt-6 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#5C6370]">
            &copy; 2026 VibeTune. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <button className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#5FD0B3] text-[#080D12] hover:brightness-110 active:scale-95 transition-all duration-150">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from 'react';
import { Waves } from 'lucide-react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-12 h-12 group">
        {/* Multiple flowing waves with different animations */}
        <Waves 
          className="absolute w-full h-full text-blue-400/30 animate-[flow_4s_ease-in-out_infinite] scale-x-[-1]" 
          strokeWidth={1.5}
        />
        <Waves 
          className="absolute w-full h-full text-blue-500/40 animate-[flow_3s_ease-in-out_infinite_0.5s]" 
          strokeWidth={1.5}
        />
        
        {/* Minimalist infinity-inspired symbol representing continuous learning */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-7 h-3 group-hover:scale-110 transition-transform">
            <div className="absolute w-3 h-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full left-0 animate-[orbit_2s_linear_infinite]" />
            <div className="absolute w-3 h-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full right-0 animate-[orbit_2s_linear_infinite_1s]" />
          </div>
        </div>
      </div>
      
      {/* Text with enhanced gradient */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-transparent bg-clip-text">
          Pravah
        </span>
        <span className="text-xs text-gray-500 tracking-wider">
            Where Code Meets Flow
        </span>
      </div>
    </div>
  );
}
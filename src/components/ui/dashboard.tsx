// components/DashboardHero.tsx
'use client';

import { useState } from 'react';
import { Package, Gift, ShoppingCart, ArrowRight } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const BOX_TYPES = [
  { 
    id: 'shipper', 
    label: 'The Custom Shipper', 
    icon: Package, 
    color: 'linear-gradient(135deg, #c3a683 0%, #a4845a 100%)',
    textColor: 'text-foreground/80',
    tagline: 'Cardboard • Tier 1',
    dimensions: { w: 240, h: 140, d: 200 }
  },
  { 
    id: 'care', 
    label: 'Supplier / Care Box', 
    icon: Gift, 
    color: 'linear-gradient(135deg, #445544 0%, #2a332a 100%)',
    textColor: 'text-white/90',
    tagline: 'Semi-Gloss • Tier 2',
    dimensions: { w: 300, h: 100, d: 240 }
  },
  { 
    id: 'keepsake', 
    label: 'Bespoke Keepsake', 
    icon: ShoppingCart, 
    color: 'linear-gradient(135deg, #f3f4f6 0%, #d1d5db 100%)',
    textColor: 'text-primary',
    tagline: '3D Printed • Tier 3',
    dimensions: { w: 150, h: 150, d: 150 }
  },
];

export default function DashboardHero() {
  const [boxType, setBoxType] = useState('shipper');
  const activeBox = BOX_TYPES.find(b => b.id === boxType) || BOX_TYPES[0];
  const { w, h, d } = activeBox.dimensions;

  return (
    <div className="w-full max-w-[1400px] items-center mx-auto bg-gradient-to-br from-secondary/50 to-background rounded-2xl p-4 sm:p-6 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.1)] relative overflow-hidden border">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Content Grid */}
      <div className="flex flex-col gap-6 md:gap-8 w-full max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
              Live Preview
            </h2>
            <p className="text-sm text-muted-foreground">
              Select a package tier to see the physical profile.
            </p>
          </div>
          
          <div className="flex flex-col gap-2 w-full sm:w-auto">
            <label className="text-[10px] font-bold uppercase text-muted-foreground ml-1">Package Type</label>
            <Select value={boxType} onValueChange={setBoxType}>
              <SelectTrigger className="w-full sm:w-[240px] bg-background/50 backdrop-blur-sm border-primary/20 h-11">
                <SelectValue placeholder="Select box type" />
              </SelectTrigger>
              <SelectContent>
                {BOX_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    <div className="flex items-center gap-2">
                      <type.icon className="h-4 w-4 text-primary" />
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-xs">{type.label}</span>
                        <span className="text-[9px] text-muted-foreground">{type.tagline}</span>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-secondary/10 rounded-2xl p-6 md:p-8 border relative group">
          <div className="bg-secondary/30 rounded-xl p-6 md:p-10 flex flex-col items-center justify-center min-h-[350px] md:min-h-[450px] relative overflow-hidden border shadow-inner transition-colors duration-500">
            {/* Pulsing glow effect */}
            <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            
            {/* Dynamic CSS 3D Box */}
            <div className="preview-box border-none bg-transparent mb-8">
              <div className="box-3d" style={{ width: w, height: h }}>
                {/* Front */}
                <div 
                  className="box-face box-front flex items-center justify-center" 
                  style={{ background: activeBox.color, width: w, height: h, transform: `translateZ(${d/2}px)` }}
                >
                   <span className={cn("font-sans font-extrabold text-sm opacity-20 uppercase tracking-tighter", activeBox.textColor)}>Front</span>
                </div>
                {/* Back */}
                <div 
                  className="box-face box-back" 
                  style={{ background: activeBox.color, width: w, height: h, transform: `rotateY(180deg) translateZ(${d/2}px)` }}
                />
                {/* Right */}
                <div 
                  className="box-face box-right" 
                  style={{ background: activeBox.color, width: d, height: h, transform: `rotateY(90deg) translateZ(${w/2}px)` }}
                />
                {/* Left */}
                <div 
                  className="box-face box-left" 
                  style={{ background: activeBox.color, width: d, height: h, transform: `rotateY(-90deg) translateZ(${w/2}px)` }}
                />
                {/* Top */}
                <div 
                  className="box-face box-top flex items-center justify-center" 
                  style={{ background: activeBox.color, width: w, height: d, transform: `rotateX(90deg) translateZ(${h/2}px)` }}
                >
                  <span className={cn("font-sans font-extrabold text-xl xs:text-2xl sm:text-5xl", activeBox.textColor)}>
                    {activeBox.id === 'shipper' ? 'moura.' : activeBox.id === 'care' ? 'CARE.' : 'KEEPSAKE.'}
                  </span>
                </div>
                {/* Bottom */}
                <div 
                  className="box-face box-bottom" 
                  style={{ background: activeBox.color, width: w, height: d, transform: `rotateX(-90deg) translateZ(${h/2}px)` }}
                />
              </div>
            </div>

            {/* CTA Overlay */}
            <div className="z-10 mt-4 text-center">
              <Button asChild size="lg" className="rounded-full px-8 h-12 shadow-xl shadow-primary/20 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <Link href={`/creator?tier=${activeBox.id}`}>
                  Customize This {activeBox.id === 'keepsake' ? 'Keepsake' : 'Box'} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

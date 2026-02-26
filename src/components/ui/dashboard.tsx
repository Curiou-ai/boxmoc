// components/DashboardHero.tsx
'use client';

import { useState } from 'react';
import { Box, Upload, Type, Shapes, Edit, Sparkles, Save, Share2 } from 'lucide-react';

interface ToolItem {
  id: string;
  icon: React.ReactNode;
  label: string;
}

const tools: ToolItem[] = [
  { id: 'ai', icon: <Sparkles className="w-5 h-5" />, label: 'Generate with AI' },
  { id: 'upload', icon: <Upload className="w-5 h-5" />, label: 'Upload' },
  { id: 'text', icon: <Type className="w-5 h-5" />, label: 'Text' },
  { id: 'shapes', icon: <Shapes className="w-5 h-5" />, label: 'Shapes' },
  { id: 'edit', icon: <Edit className="w-5 h-5" />, label: 'Edit' },
  { id: 'save', icon: <Save className="w-5 h-5" />, label: 'Save' },
  { id: 'share', icon: <Share2 className="w-5 h-5" />, label: 'Share' },
];

export default function DashboardHero() {
  const [activeTool, setActiveTool] = useState('ai');

  return (
    <div className="w-full max-w-[1400px] items-center mx-auto bg-gradient-to-br from-secondary/50 to-background rounded-2xl p-4 sm:p-6 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.1)] relative overflow-hidden border">
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Content Grid */}
      <div className="grid grid-cols-1 justify-self-center mx-auto gap-6 md:gap-8 w-full">
        {/* 3D Preview Panel - mobile*/}
        <div className="block sm:hidden rounded-2xl">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Preview
            </h2>
            <p className="text-sm text-muted-foreground">
              A real-time preview of your design.
            </p>
          </div>
          <div className="bg-secondary/20 rounded-xl flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden">
            {/* Pulsing glow effect */}
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            
            {/* 3D Box */}
            <div className="preview-box border-none bg-transparent">
              <div className="box-3d">
                <div className="box-face box-front"></div>
                <div className="box-face box-back"></div>
                <div className="box-face box-right"></div>
                <div className="box-face box-left"></div>
                <div className="box-face box-top flex items-center justify-center">
                  <span className="font-sans text-5xl font-bold text-foreground/80">moura.</span>
                </div>
                <div className="box-face box-bottom"></div>
              </div>
            </div>
          </div>
        </div>
        {/* 3D Preview Panel -desktop*/}
        <div className="hidden sm:block bg-secondary/10 rounded-2xl p-6 md:p-8 border">
          <div className="mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              Preview
            </h2>
            <p className="text-sm text-muted-foreground">
              A real-time preview of your design.
            </p>
          </div>
          <div className="bg-secondary/30 rounded-xl p-6 md:p-10 flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden border shadow-inner">
            {/* Pulsing glow effect */}
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-primary/20 rounded-full blur-3xl animate-pulse" />
            
            {/* 3D Box */}
            <div className="preview-box border-none bg-transparent">
              <div className="box-3d">
                <div className="box-face box-front"></div>
                <div className="box-face box-back"></div>
                <div className="box-face box-right"></div>
                <div className="box-face box-left"></div>
                <div className="box-face box-top flex items-center justify-center">
                  <span className="font-sans text-5xl font-bold text-foreground/80">moura.</span>
                </div>
                <div className="box-face box-bottom"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

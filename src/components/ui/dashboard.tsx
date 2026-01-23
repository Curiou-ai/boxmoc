

// components/DashboardHero.tsx
'use client';

import { useState } from 'react';
import { Box, Upload, Type, Shapes, Edit, Sparkles } from 'lucide-react';

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
];

export default function DashboardHero() {
  const [activeTool, setActiveTool] = useState('ai');

  return (
    // <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1400px] bg-gradient-to-br from-[#1a2742] to-[#0f1a2e] rounded-xl p-6 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold text-white">Boxmoc</span>
          </div>
          <div className="flex gap-3">
            <button className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-all duration-300">
              Share
            </button>
            <button className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] transition-all duration-300">
              Save
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_1fr] gap-6 md:gap-8">
          {/* Sidebar */}
          <div className="bg-[#0f1a2e]/50 rounded-2xl p-6 border border-white/5">
            <h3 className="text-xs md:text-sm text-white/50 mb-4 uppercase tracking-wider">
              Tools
            </h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`w-full p-4 rounded-lg flex items-center gap-3 transition-all duration-200 ${
                    activeTool === tool.id
                      ? 'bg-blue-400/15 border-l-4 border-blue-400 text-white'
                      : 'text-white/70 hover:bg-blue-400/10 hover:text-white'
                  }`}
                >
                  {tool.icon}
                  <span className="font-medium">{tool.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Preview Panel */}
          <div className="bg-[#0f1a2e]/30 rounded-2xl p-6 md:p-8 border border-white/5">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                3D Preview
              </h2>
              <p className="text-sm text-white/60">
                A real-time preview of your design.
              </p>
            </div>
            <div className="bg-[#0f1a2e] rounded-xl p-8 md:p-12 flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden">
              {/* Pulsing glow effect */}
              <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
              
              {/* 3D Box */}
              {/* <div className="relative perspective-1000"> */}
                {/* <div className="w-[200px] h-[200px] md:w-[280px] md:h-[280px] animate-rotate-3d preserve-3d"> */}
                  {/* Front */}
                  {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 opacity-80 border-2 border-white/20 translate-z-[100px] md:translate-z-[140px]" /> */}
                  {/* Back */}
                  {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-600 to-blue-700 opacity-80 border-2 border-white/20 -translate-z-[100px] md:-translate-z-[140px] rotate-y-180" /> */}
                  {/* Right */}
                  {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-80 border-2 border-white/20 rotate-y-90 translate-z-[100px] md:translate-z-[140px]" /> */}
                  {/* Left */}
                  {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-80 border-2 border-white/20 -rotate-y-90 translate-z-[100px] md:translate-z-[140px]" /> */}
                  {/* Top */}
                  {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-300 to-blue-400 opacity-80 border-2 border-white/20 rotate-x-90 translate-z-[100px] md:translate-z-[140px]" /> */}
                  {/* Bottom */}
                  {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-700 to-blue-800 opacity-80 border-2 border-white/20 -rotate-x-90 translate-z-[100px] md:translate-z-[140px]" /> */}
                {/* </div> */}
              {/* </div> */}
              <div className="preview-box">
                  <div className="box-3d">
                      <div className="box-face box-front"></div>
                      <div className="box-face box-back"></div>
                      <div className="box-face box-right"></div>
                      <div className="box-face box-left"></div>
                      <div className="box-face box-top"></div>
                      <div className="box-face box-bottom"></div>
                  </div>
              </div>
            </div>
          </div>

          {/* AI Generated Design Panel */}
          <div className="bg-[#0f1a2e]/30 rounded-2xl p-6 md:p-8 border border-white/5">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                AI Generated Design
              </h2>
              <p className="text-sm text-white/60">
                The image and description from the AI.
              </p>
            </div>
            <div className="bg-[#0f1a2e] rounded-xl p-8 md:p-12 flex flex-col items-center justify-center min-h-[300px] md:min-h-[400px] text-center">
              <div className="w-20 h-20 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-blue-400/30">
                <Shapes className="w-10 h-10 text-blue-400" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
                Your generated design will appear here.
              </h3>
              <p className="text-sm text-white/50">
                The AI's description of the design will be shown here.
              </p>
            </div>
          </div>
        </div>
      </div>
    // </div>
  );
}



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
    // <div className="min-h-screen bg-[#0a1628] flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1400px] bg-gradient-to-br from-[#1a2742] to-[#0f1a2e] rounded-2xl p-3 sm:p-6 md:p-12 shadow-[0_40px_120px_rgba(0,0,0,0.5)] relative overflow-hidden">
        {/* Top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent" />

        {/* Top Bar */}
        <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
              <Box className="w-5 h-5 text-white" />
            </div>
            {/* <span className="text-xl md:text-2xl font-bold text-white">Boxmoc</span> */}
          </div>
          {/* <div className="flex gap-3">
            <button className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg bg-white/10 text-white font-semibold hover:bg-white/15 transition-all duration-300">
              Share
            </button>
            <button className="px-4 md:px-6 py-2.5 md:py-3 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(59,130,246,0.4)] transition-all duration-300">
              Save
            </button>
          </div> */}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_2fr] gap-6 md:gap-8 w-full">
          {/* Sidebar */}
          <div className="bg-[#0f1a2e]/50 rounded-2xl p-6 border border-white/5 hidden sm:block">
            {/* <h3 className="text-xs md:text-sm text-white/50 mb-4 uppercase tracking-wider">
              Tools
            </h3> */}
            <div className="space-y-2 flex lg:flex-col flex-row mx-auto gap-2 overflow-y-auto">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  title={tool.id}
                  onClick={() => setActiveTool(tool.id)}
                  className={`group relative w-full p-3 lg:p-4 rounded-lg flex items-center justify-center lg:gap-3 lg:justify-start transition-all duration-200 ${
                    activeTool === tool.id
                      ? 'bg-blue-400/15 border-b-2 border-blue-400 text-white'
                      : 'text-white/70 hover:bg-blue-400/10 hover:text-white'
                  }`}
                >
                  {tool.icon}
                  <span className="font-medium hidden lg:flex">{tool.label}</span>
                  {/* <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 lg:hidden">
                    {tool.label}
                  </span> */}
                </button>
              ))}
            </div>
          </div>
          
          <div className="block sm:hidden rounded-2xl">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Preview
              </h2>
              <p className="text-sm text-white/60">
                A real-time preview of your design.
              </p>
            </div>
            <div className="bg-[#0f1a2e] rounded-xl flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden">
              {/* Pulsing glow effect */}
              <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
              
              {/* 3D Box */}
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
          {/* 3D Preview Panel -desktop*/}
          <div className="hidden sm:block bg-[#0f1a2e]/30 rounded-2xl p-6 md:p-8 border border-white/5">
            <div className="mb-6">
              <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                Preview
              </h2>
              <p className="text-sm text-white/60">
                A real-time preview of your design.
              </p>
            </div>
            <div className="bg-[#0f1a2e] rounded-xl p-6 md:p-10 flex items-center justify-center min-h-[300px] md:min-h-[400px] relative overflow-hidden">
              {/* Pulsing glow effect */}
              <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
              
              {/* 3D Box */}
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
              
              {/* 3D Box with Product Design */}
                {/* 3D Product Box */}
                {/* <div className="relative perspective-1000"> */}
                  {/* <div className="w-[200px] h-[280px] md:w-[240px] md:h-[340px] animate-rotate-3d preserve-3d"> */}
                    {/* Front Face */}
                    {/* <div className="absolute w-full h-full bg-white border border-gray-200 shadow-xl translate-z-[80px] md:translate-z-[100px] flex flex-col items-center justify-between p-6">
                      <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Box className="w-6 h-6 md:w-8 md:h-8 text-white" />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-800">BOXMOC</h3>
                          <p className="text-xs text-gray-500 mt-1">Premium Package</p>
                        </div>
                      </div>
                      <div className="w-full border-t border-gray-200 pt-3">
                        <p className="text-[10px] text-gray-400 text-center">Design Studio Pro</p>
                      </div>
                    </div> */}
                    
                    {/* Back Face */}
                    {/* <div className="absolute w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 shadow-xl -translate-z-[80px] md:-translate-z-[100px] rotate-y-180 flex items-center justify-center p-6">
                      <div className="text-center">
                        <div className="grid grid-cols-2 gap-2 mb-4">
                          <div className="bg-white p-2 rounded shadow-sm">
                            <p className="text-[8px] text-gray-400">Weight</p>
                            <p className="text-xs font-semibold text-gray-700">2.5kg</p>
                          </div>
                          <div className="bg-white p-2 rounded shadow-sm">
                            <p className="text-[8px] text-gray-400">Size</p>
                            <p className="text-xs font-semibold text-gray-700">M</p>
                          </div>
                        </div>
                        <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-white p-2 rounded">
                          <div className="w-full h-full bg-gray-900 flex items-center justify-center text-white text-[8px]">
                            <div className="text-center leading-tight">
                              <div>QR</div>
                              <div>CODE</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    
                    {/* Right Face */}
                    {/* <div className="absolute w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 border border-blue-400 shadow-xl rotate-y-90 translate-z-[80px] md:translate-z-[100px] flex items-center justify-center p-4">
                      <div className="text-white text-center transform -rotate-90">
                        <p className="text-xs md:text-sm font-bold tracking-widest">BOXMOC</p>
                        <p className="text-[8px] md:text-[10px] mt-1 opacity-80">PREMIUM</p>
                      </div>
                    </div> */}
                    
                    {/* Left Face */}
                    {/* <div className="absolute w-full h-full bg-gradient-to-br from-purple-500 to-purple-600 border border-purple-400 shadow-xl -rotate-y-90 translate-z-[80px] md:translate-z-[100px] flex items-center justify-center p-4">
                      <div className="text-white text-center transform rotate-90">
                        <p className="text-xs md:text-sm font-bold tracking-widest">EST. 2024</p>
                        <div className="flex gap-1 mt-2 justify-center">
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                          <div className="w-1 h-1 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div> */}
                    
                    {/* Top Face */}
                    {/* <div className="absolute w-full h-full bg-white border border-gray-300 shadow-xl rotate-x-90 translate-z-[80px] md:translate-z-[100px] flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-[10px] md:text-xs font-bold text-gray-600 tracking-wide">HANDLE WITH CARE</p>
                        <div className="flex gap-2 mt-2 justify-center">
                          <div className="w-4 h-4 border-2 border-gray-400 rounded flex items-center justify-center">
                            <span className="text-[8px] text-gray-600">↑</span>
                          </div>
                        </div>
                      </div>
                    </div> */}
                    
                    {/* Bottom Face */}
                    {/* <div className="absolute w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 shadow-xl -rotate-x-90 translate-z-[80px] md:translate-z-[100px] flex items-center justify-center p-4">
                      <div className="grid grid-cols-3 gap-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className="w-3 h-3 md:w-4 md:h-4 bg-gray-300 rounded-sm"></div>
                        ))}
                      </div>
                    </div> */}
                  {/* </div> */}
            </div>
          </div>

          {/* AI Generated Design Panel */}
          {/* <div className="bg-[#0f1a2e]/30 rounded-2xl p-6 md:p-8 border border-white/5">
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
          </div> */}
        </div>
      </div>
    // </div>
  );
}

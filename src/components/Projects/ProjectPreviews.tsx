import React from 'react';
import { Project } from '../../types/portfolio';

export const ProjectPreviewGraphic: React.FC<{ project: Project }> = ({ project }) => {
  if (project.imageUrl) {
    return (
      <div className="w-full h-44 bg-plum-950 relative overflow-hidden rounded-t-xl select-none flex items-center justify-center">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum-950/70 via-transparent to-transparent pointer-events-none" />
      </div>
    );
  }

  switch (project.previewType) {
    case 'wordle':
      return (
        <div className="w-full h-44 bg-bordeaux-900 flex flex-col items-center justify-center p-3 relative overflow-hidden rounded-t-xl select-none">
          {/* Top banner: LIVE DUEL */}
          <div className="absolute top-2 left-3 flex items-center space-x-1.5 text-[10px] font-mono text-butter-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <span>MATCHMAKING: 2 PLAYERS</span>
          </div>
          <div className="absolute top-2 right-3 text-[10px] font-mono text-pistachio-300">
            TIME: 00:42
          </div>

          {/* Wordle Rows */}
          <div className="space-y-1.5 my-auto">
            {/* Row 1 */}
            <div className="flex space-x-1.5">
              {['S', 'P', 'A', 'R', 'K'].map((l, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono font-bold text-xs sm:text-sm rounded border ${
                    i === 0 || i === 3
                      ? 'bg-[#538D4E] text-ivory-100 border-[#3A6B36]'
                      : i === 1
                      ? 'bg-[#B59F3B] text-ivory-100 border-[#8F7D2B]'
                      : 'bg-plum-800 text-ivory-200 border-plum-700'
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
            {/* Row 2: Target Guess "R U S H Y" */}
            <div className="flex space-x-1.5">
              {['W', 'O', 'R', 'D', 'S'].map((l, i) => (
                <div
                  key={i}
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono font-bold text-xs sm:text-sm rounded border ${
                    i === 0 || i === 2 || i === 4
                      ? 'bg-[#538D4E] text-ivory-100 border-[#3A6B36]'
                      : 'bg-[#3A3A3C] text-ivory-300 border-[#2A2A2C]'
                  }`}
                >
                  {l}
                </div>
              ))}
            </div>
            {/* Row 3: Winning Guess "S I R I !" */}
            <div className="flex space-x-1.5">
              {['S', 'I', 'R', 'I', 'S'].map((l, i) => (
                <div
                  key={i}
                  className="w-7 h-7 sm:w-8 sm:h-8 bg-[#538D4E] text-ivory-100 border border-[#3A6B36] flex items-center justify-center font-mono font-bold text-xs sm:text-sm rounded shadow-sm"
                >
                  {l}
                </div>
              ))}
            </div>
          </div>

          {/* Mini opponent score bar */}
          <div className="w-full flex items-center justify-between text-[10px] font-mono text-ivory-300/80 pt-1 border-t border-plum-800">
            <span>YOU: 3 GUESSES (WON)</span>
            <span>OPPONENT: 4 GUESSES</span>
          </div>
        </div>
      );

    case 'pacman':
      return (
        <div className="w-full h-44 bg-plum-900 relative overflow-hidden rounded-t-xl p-3 flex flex-col justify-between select-none">
          {/* Maze Grid lines & HUD */}
          <div className="flex justify-between items-center text-[10px] font-mono text-butter-400">
            <span>GESTURE: [UP-RIGHT]</span>
            <span className="text-raspberry-400">CONF: 98.4%</span>
            <span>SCORE: 04280</span>
          </div>

          {/* Maze corridor & Pac-Man with Ghost */}
          <div className="relative my-auto w-full h-20 border-y-2 border-cobalt-600/70 bg-plum-950 flex items-center px-4 justify-between">
            {/* Dot trail */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 flex justify-around">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-butter-300 opacity-70" />
              ))}
            </div>

            {/* Ghost 1 - Blinky (Red) */}
            <div className="relative z-10 w-7 h-7 bg-raspberry-500 rounded-t-full border border-plum-900 flex items-center justify-center">
              <div className="flex space-x-1">
                <div className="w-1.5 h-1.5 bg-ivory-100 rounded-full flex items-center justify-start">
                  <div className="w-0.5 h-0.5 bg-cobalt-700 rounded-full"></div>
                </div>
                <div className="w-1.5 h-1.5 bg-ivory-100 rounded-full flex items-center justify-start">
                  <div className="w-0.5 h-0.5 bg-cobalt-700 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Pac-Man eating */}
            <div className="relative z-10 w-9 h-9 bg-butter-400 rounded-full border border-plum-900 flex items-center justify-center">
              <div
                className="w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-plum-950 translate-x-2"
              />
            </div>

            {/* Optical Hand Skeleton Wireframe Overlay */}
            <div className="absolute right-4 bottom-1 w-12 h-14 border border-dashed border-pistachio-400/60 rounded bg-plum-900/80 p-1 flex flex-col justify-between">
              <div className="flex justify-between">
                <span className="w-1.5 h-1.5 rounded-full bg-pistachio-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-pistachio-400"></span>
              </div>
              <div className="flex justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-butter-400"></span>
              </div>
              <div className="flex justify-around">
                <span className="w-1 h-1 bg-ivory-100 rounded-full"></span>
                <span className="w-1 h-1 bg-ivory-100 rounded-full"></span>
              </div>
              <span className="text-[7px] font-mono text-pistachio-300 text-center leading-none">21-PTS</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ivory-300 flex justify-between">
            <span>ENGINE: OPENCV + PYGAME</span>
            <span>FPS: 60</span>
          </div>
        </div>
      );

    case 'camera':
      return (
        <div className="w-full h-44 bg-cobalt-900 relative overflow-hidden rounded-t-xl p-3 flex flex-col justify-between select-none">
          {/* Studio HUD */}
          <div className="flex justify-between items-center text-[10px] font-mono text-ivory-200">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              CAMERA STREAM ACTIVE
            </span>
            <span className="text-butter-300">MEDIAPIPE WEBCAM</span>
          </div>

          {/* Interactive Optical Canvas Simulation */}
          <div className="relative my-auto w-full h-24 border border-cobalt-600 rounded-lg bg-cobalt-950/80 flex items-center justify-center overflow-hidden">
            {/* Optical Ring */}
            <div className="w-20 h-20 rounded-full border border-dashed border-pistachio-400/50 flex items-center justify-center animate-spin" style={{ animationDuration: '14s' }}>
              <div className="w-12 h-12 rounded-full border border-butter-300/60"></div>
            </div>
            {/* Gesture Hand Pin Nodes */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-28 h-20">
                <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-raspberry-400 animate-pulse"></div>
                <div className="absolute top-0 left-12 w-2 h-2 rounded-full bg-butter-400"></div>
                <div className="absolute top-4 left-18 w-2 h-2 rounded-full bg-pistachio-400"></div>
                <div className="absolute top-10 left-22 w-2 h-2 rounded-full bg-butter-300"></div>
                <div className="absolute bottom-2 left-10 w-3 h-3 rounded-full bg-ivory-100 border border-plum-900"></div>
                {/* Connecting lines */}
                <svg className="absolute inset-0 w-full h-full stroke-butter-300/60" strokeWidth="1.5">
                  <line x1="24" y1="12" x2="48" y2="4" />
                  <line x1="48" y1="4" x2="72" y2="20" />
                  <line x1="40" y1="65" x2="48" y2="4" />
                </svg>
              </div>
            </div>
            <div className="absolute bottom-1 right-2 text-[9px] font-mono text-pistachio-300 bg-plum-900/80 px-1.5 py-0.5 rounded">
              PINCH TRIGGER [ZOOM]
            </div>
          </div>

          <div className="text-[10px] font-mono text-ivory-300 flex justify-between">
            <span>CLIENT-SIDE GPU INFERENCE</span>
            <span>LATENCY: 12ms</span>
          </div>
        </div>
      );

    case 'vault':
      return (
        <div className="w-full h-44 bg-plum-950 relative overflow-hidden rounded-t-xl p-3 flex flex-col justify-between select-none">
          <div className="flex justify-between items-center text-[10px] font-mono text-butter-400">
            <span>AES-256-GCM ZERO KNOWLEDGE</span>
            <span className="text-pistachio-300">PBKDF2 600K</span>
          </div>

          <div className="relative my-auto w-full h-22 border border-plum-800 rounded-lg bg-plum-900/60 p-2.5 flex items-center justify-between">
            {/* Vault Dial */}
            <div className="w-14 h-14 rounded-full bg-plum-800 border-2 border-butter-400 flex items-center justify-center shadow-card relative">
              <div className="w-8 h-8 rounded-full border border-dashed border-ivory-200 flex items-center justify-center">
                <div className="w-1 h-3 bg-butter-400 rounded-full translate-y-[-4px]"></div>
              </div>
            </div>

            {/* Ciphertext Stream Display */}
            <div className="space-y-1 font-mono text-[9px] text-ivory-300/80 text-right">
              <div className="text-butter-300 font-bold">CLIENT DECRYPTION: LOCAL</div>
              <div className="bg-plum-950 px-2 py-0.5 rounded text-plum-300 border border-plum-800/80">
                IV: 9e4a..b12c [96-BIT]
              </div>
              <div className="bg-plum-950 px-2 py-0.5 rounded text-pistachio-400 border border-plum-800/80">
                CIPHER: a89f..03e8 [PASS]
              </div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ivory-400 flex justify-between">
            <span>SUPABASE RLS ENFORCED</span>
            <span>0% PLAIN-TEXT LEAK</span>
          </div>
        </div>
      );

    case 'inventory':
      return (
        <div className="w-full h-44 bg-bordeaux-950 relative overflow-hidden rounded-t-xl p-3 flex flex-col justify-between select-none">
          <div className="flex justify-between items-center text-[10px] font-mono text-ivory-200">
            <span className="text-pistachio-400">REDIS PUB/SUB LIVE</span>
            <span>OCC ISOLATION</span>
          </div>

          <div className="relative my-auto grid grid-cols-3 gap-2 w-full">
            <div className="bg-bordeaux-900/80 border border-bordeaux-700 p-2 rounded text-center">
              <div className="text-[9px] font-mono text-ivory-300">WAREHOUSE A</div>
              <div className="text-base font-mono font-bold text-butter-300">1,420</div>
              <div className="text-[8px] font-mono text-pistachio-400">99.8% IN STOCK</div>
            </div>
            <div className="bg-bordeaux-900/80 border border-bordeaux-700 p-2 rounded text-center">
              <div className="text-[9px] font-mono text-ivory-300">SKU LOCKS</div>
              <div className="text-base font-mono font-bold text-raspberry-400">0 COLL</div>
              <div className="text-[8px] font-mono text-ivory-400">POSTGRES v16</div>
            </div>
            <div className="bg-bordeaux-900/80 border border-bordeaux-700 p-2 rounded text-center">
              <div className="text-[9px] font-mono text-ivory-300">TX LATENCY</div>
              <div className="text-base font-mono font-bold text-pistachio-300">4.2ms</div>
              <div className="text-[8px] font-mono text-butter-300">DOCKER PROD</div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ivory-400 flex justify-between">
            <span>APPEND-ONLY AUDIT TRAIL</span>
            <span>GO + REDIS + POSTGRES</span>
          </div>
        </div>
      );

    case 'similarity':
      return (
        <div className="w-full h-44 bg-magenta-700 relative overflow-hidden rounded-t-xl p-3 flex flex-col justify-between select-none">
          <div className="flex justify-between items-center text-[10px] font-mono text-ivory-100">
            <span>SENTENCE-TRANSFORMERS</span>
            <span className="text-butter-300">384-DIM VECTORS</span>
          </div>

          <div className="relative my-auto flex items-center justify-around w-full px-2">
            {/* Doc A */}
            <div className="w-20 h-22 bg-ivory-100 border border-plum-900 rounded p-1.5 shadow-sm text-plum-900 font-mono text-[7px] space-y-1">
              <div className="font-bold border-b border-plum-300 pb-0.5">DOC_01.TXT</div>
              <div className="h-1 bg-plum-400 rounded w-full"></div>
              <div className="h-1 bg-plum-300 rounded w-3/4"></div>
              <div className="h-1 bg-plum-300 rounded w-5/6"></div>
            </div>

            {/* Metric Link */}
            <div className="flex flex-col items-center">
              <div className="px-2 py-0.5 bg-butter-300 border border-plum-900 rounded font-mono text-[9px] font-bold text-plum-900 shadow-sm">
                COS: 0.94
              </div>
              <span className="text-[8px] font-mono text-ivory-100 uppercase tracking-wider mt-0.5">CLUSTERING</span>
            </div>

            {/* Doc B */}
            <div className="w-20 h-22 bg-ivory-100 border border-plum-900 rounded p-1.5 shadow-sm text-plum-900 font-mono text-[7px] space-y-1">
              <div className="font-bold border-b border-plum-300 pb-0.5">DOC_02.TXT</div>
              <div className="h-1 bg-plum-400 rounded w-full"></div>
              <div className="h-1 bg-plum-300 rounded w-4/5"></div>
              <div className="h-1 bg-plum-300 rounded w-2/3"></div>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ivory-200 flex justify-between">
            <span>HIERARCHICAL DENDROGRAM</span>
            <span>FASTAPI INFERENCE</span>
          </div>
        </div>
      );

    case 'feedback':
      return (
        <div className="w-full h-44 bg-raspberry-600 relative overflow-hidden rounded-t-xl p-3 flex flex-col justify-between select-none">
          <div className="flex justify-between items-center text-[10px] font-mono text-ivory-100">
            <span>GEMINI MULTIMODAL PIPELINE</span>
            <span className="text-butter-300">SENTIMENT: +84%</span>
          </div>

          <div className="relative my-auto space-y-1.5 w-full">
            <div className="bg-ivory-100 border border-plum-900 p-1.5 rounded flex items-center justify-between text-[9px] font-mono text-plum-900">
              <span className="font-bold">#1 [UI] Spatial Gesture Drift</span>
              <span className="px-1.5 bg-red-100 text-red-700 rounded border border-red-300">P0 URGENT</span>
            </div>
            <div className="bg-ivory-100 border border-plum-900 p-1.5 rounded flex items-center justify-between text-[9px] font-mono text-plum-900">
              <span className="font-bold">#2 [FEATURE] Sound Synthesis Pack</span>
              <span className="px-1.5 bg-pistachio-300 text-plum-900 rounded border border-pistachio-600">P1 HIGH</span>
            </div>
          </div>

          <div className="text-[10px] font-mono text-ivory-200 flex justify-between">
            <span>STRUCTURED ROADMAP JSON</span>
            <span>LANGCHAIN ORCHESTRATION</span>
          </div>
        </div>
      );

    default:
      return (
        <div className="w-full h-44 bg-plum-900 flex items-center justify-center text-ivory-100 font-mono text-xs">
          PREVIEW AVAILABLE
        </div>
      );
  }
};

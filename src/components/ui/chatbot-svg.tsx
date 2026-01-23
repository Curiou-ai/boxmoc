import * as React from "react";

type ChatbotSVGProps = {
  width?: number;
  height?: number;
  className?: string;
};

export default function ChatbotSVG({
  width = 380,
  height = 640,
  className,
}: ChatbotSVGProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 380 640"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Boxmoc Assistant UI preview"
    >
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
      </defs>

      {/* Container */}
      <rect width="380" height="640" rx="20" fill="url(#bg)" />

      {/* Header */}
      <rect x="16" y="16" width="348" height="56" rx="14" fill="#020617" />
      <circle cx="44" cy="44" r="14" fill="#1e293b" />
      <rect x="36" y="38" width="16" height="12" rx="2" fill="#e5e7eb" />
      <rect x="40" y="34" width="8" height="6" rx="2" fill="#e5e7eb" />

      <text
        x="72"
        y="48"
        fill="#e5e7eb"
        fontSize="16"
        fontWeight="600"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        Boxmoc Assistant
      </text>

      {/* Message Bubble */}
      <rect x="24" y="96" width="300" height="72" rx="16" fill="#020617" />
      <text
        x="40"
        y="124"
        fill="#e5e7eb"
        fontSize="14"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        Hello! How can I help you with your
      </text>
      <text
        x="40"
        y="144"
        fill="#e5e7eb"
        fontSize="14"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        design needs today?
      </text>

      {/* Action Buttons */}
      <rect x="230" y="200" width="120" height="34" rx="17" fill="#020617" />
      <text
        x="290"
        y="222"
        textAnchor="middle"
        fill="#e5e7eb"
        fontSize="13"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        Services
      </text>

      <rect x="230" y="244" width="120" height="34" rx="17" fill="#020617" />
      <text
        x="290"
        y="266"
        textAnchor="middle"
        fill="#e5e7eb"
        fontSize="13"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        FAQs
      </text>

      <rect x="230" y="288" width="120" height="34" rx="17" fill="#1e293b" />
      <text
        x="290"
        y="310"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="13"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        Get Help
      </text>

      {/* Input */}
      <rect x="16" y="572" width="292" height="44" rx="22" fill="#020617" />
      <text
        x="32"
        y="600"
        fill="#64748b"
        fontSize="13"
        fontFamily="Inter, system-ui, -apple-system, sans-serif"
      >
        Ask a question...
      </text>

      {/* Send Button */}
      <rect x="316" y="572" width="44" height="44" rx="14" fill="#6366f1" />
      <polygon points="332,586 350,594 332,602" fill="white" />
    </svg>
  );
}

import { motion } from "framer-motion";

interface ScoreGaugeProps {
  score: number;
  maxScore: number;
  label: string;
  color?: string;
  size?: number;
}

export function ScoreGauge({ score, maxScore, label, color = "primary", size = 160 }: ScoreGaugeProps) {
  const percentage = (score / maxScore) * 100;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference * 0.75; // 270 degree arc

  const colorMap: Record<string, string> = {
    primary: "hsl(199, 89%, 48%)",
    "neon-emerald": "hsl(160, 84%, 39%)",
    "neon-amber": "hsl(38, 92%, 50%)",
    destructive: "hsl(0, 72%, 51%)",
    "neon-violet": "hsl(258, 60%, 55%)",
  };

  const strokeColor = colorMap[color] || colorMap.primary;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${strokeColor})` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <span className="stat-value text-foreground">{score}</span>
        <span className="text-xs text-muted-foreground mt-1">{label}</span>
      </div>
    </div>
  );
}

"use client"

import { motion } from "framer-motion"

interface AnimatedLineProps {
  startX: number
  startY: number
  endX: number
  endY: number
  delay?: number
}

export function AnimatedLine({ startX, startY, endX, endY, delay = 0 }: AnimatedLineProps) {
  // Calculate control points for cubic bezier curve
  const controlX1 = startX + (endX - startX) * 0.3
  const controlY1 = startY
  const controlX2 = startX + (endX - startX) * 0.7
  const controlY2 = endY

  const pathD = `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`

  return (
    <g>
      <defs>
        <linearGradient id={`line-gradient-${startX}-${startY}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <motion.path
        d={pathD}
        stroke={`url(#line-gradient-${startX}-${startY})`}
        strokeWidth="1.5"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{
          delay: delay,
          duration: 1.2,
          ease: "easeInOut",
        }}
      />

      {[0, 1, 2].map((particleIndex) => (
        <motion.circle
          key={`particle-${particleIndex}`}
          r="2"
          fill="#ffffff"
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            delay: delay + 0.5 + particleIndex * 2,
            duration: 6,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <animateMotion dur="6s" repeatCount="indefinite" begin={`${delay + 0.5 + particleIndex * 2}s`}>
            <mpath href={`#path-${startX}-${startY}`} />
          </animateMotion>
        </motion.circle>
      ))}

      <path id={`path-${startX}-${startY}`} d={pathD} style={{ display: "none" }} />
    </g>
  )
}

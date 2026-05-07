"use client"

import { motion } from "framer-motion"

/**
 * Decorative SVG: 8-point Islamic star (Khatam Sulaymani)
 */
function StarShape({ size = 60 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
        >
            <path d="M50 5 L60 30 L85 25 L75 50 L95 65 L70 70 L75 95 L50 80 L25 95 L30 70 L5 65 L25 50 L15 25 L40 30 Z" />
            <circle cx="50" cy="50" r="18" />
            <path d="M50 32 L58 50 L50 68 L42 50 Z" opacity="0.6" />
            <path d="M32 50 L50 42 L68 50 L50 58 Z" opacity="0.6" />
        </svg>
    )
}

/**
 * Decorative SVG: Islamic geometric circle pattern
 */
function CirclePattern({ size = 80 }: { size?: number }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            aria-hidden="true"
        >
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="30" opacity="0.6" />
            <circle cx="50" cy="50" r="15" opacity="0.4" />
            {/* Petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <ellipse
                    key={angle}
                    cx="50"
                    cy="20"
                    rx="6"
                    ry="15"
                    transform={`rotate(${angle} 50 50)`}
                    opacity="0.5"
                />
            ))}
        </svg>
    )
}

/**
 * HeroDecorations - All animated background elements for the hero section
 */
export function HeroDecorations() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {/* Animated geometric pattern background */}
            <motion.div
                className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]"
                animate={{
                    backgroundPosition: ["0px 0px", "120px 120px"],
                }}
                transition={{
                    duration: 60,
                    repeat: Infinity,
                    ease: "linear",
                }}
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120' viewBox='0 0 120 120'%3E%3Cg fill='none' stroke='%23035d44' stroke-width='1'%3E%3Cpath d='M60 10 L70 35 L95 30 L85 55 L110 70 L85 75 L95 100 L70 90 L60 115 L50 90 L25 100 L35 75 L10 70 L35 55 L25 30 L50 35 Z'/%3E%3Ccircle cx='60' cy='65' r='20'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "120px 120px",
                }}
            />

            {/* Top right - large gradient blob */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-primary/15 to-transparent rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />

            {/* Bottom left - secondary gradient blob */}
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-secondary/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/3" />

            {/* Center radial accent */}
            <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

            {/* Floating Islamic Star - top left */}
            <motion.div
                className="absolute top-20 left-[8%] text-primary/20 hidden md:block"
                animate={{
                    y: [0, -20, 0],
                    rotate: [0, 360],
                }}
                transition={{
                    y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 40, repeat: Infinity, ease: "linear" },
                }}
            >
                <StarShape size={70} />
            </motion.div>

            {/* Floating Circle Pattern - top right */}
            <motion.div
                className="absolute top-32 right-[15%] text-secondary/25 hidden md:block"
                animate={{
                    y: [0, 15, 0],
                    rotate: [0, -360],
                }}
                transition={{
                    y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 50, repeat: Infinity, ease: "linear" },
                }}
            >
                <CirclePattern size={90} />
            </motion.div>

            {/* Small star - middle left */}
            <motion.div
                className="absolute top-[55%] left-[5%] text-secondary/30 hidden lg:block"
                animate={{
                    y: [0, -15, 0],
                    rotate: [0, 180, 360],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 7,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            >
                <StarShape size={45} />
            </motion.div>

            {/* Floating shape - bottom right */}
            <motion.div
                className="absolute bottom-20 right-[8%] text-primary/15 hidden md:block"
                animate={{
                    y: [0, 20, 0],
                    rotate: [0, -180, -360],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2,
                }}
            >
                <CirclePattern size={70} />
            </motion.div>

            {/* Small dots/sparkles scattered */}
            {[
                { top: "15%", left: "30%", delay: 0, size: 4 },
                { top: "70%", left: "70%", delay: 1.5, size: 6 },
                { top: "40%", right: "30%", delay: 0.5, size: 3 },
                { top: "85%", left: "40%", delay: 2, size: 4 },
                { top: "25%", right: "5%", delay: 1, size: 5 },
            ].map((dot, i) => (
                <motion.div
                    key={i}
                    className="absolute bg-secondary rounded-full hidden md:block"
                    style={{
                        top: dot.top,
                        left: dot.left,
                        right: dot.right,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                    }}
                    animate={{
                        opacity: [0.2, 0.8, 0.2],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: dot.delay,
                    }}
                />
            ))}

            {/* Decorative arch frame - bottom center */}
            <svg
                className="absolute bottom-0 left-1/2 -translate-x-1/2 text-primary/5 hidden lg:block"
                width="600"
                height="200"
                viewBox="0 0 600 200"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M0 200 L0 100 Q0 0 300 0 Q600 0 600 100 L600 200 Z" />
            </svg>
        </div>
    )
}

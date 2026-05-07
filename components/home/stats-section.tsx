"use client"

import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion"
import { useEffect, useRef } from "react"
import { BookOpen, Mic, FileText, GraduationCap, Video } from "lucide-react"

interface StatsSectionProps {
    stats: {
        lessons: number
        sermons: number
        articles: number
        books: number
        videos: number
    }
}

interface CounterProps {
    from: number
    to: number
    duration?: number
}

function Counter({ from, to, duration = 2 }: CounterProps) {
    const count = useMotionValue(from)
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString("ar-EG"))
    const ref = useRef<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "-50px" })

    useEffect(() => {
        if (inView) {
            const controls = animate(count, to, { duration, ease: "easeOut" })
            return () => controls.stop()
        }
    }, [count, to, duration, inView])

    return <motion.span ref={ref}>{rounded}</motion.span>
}

const statItems = [
    {
        key: "lessons" as const,
        label: "درس علمي",
        icon: GraduationCap,
        color: "text-amber-600 dark:text-amber-400",
        bg: "from-amber-500/10 to-amber-500/5",
        border: "border-amber-500/20",
    },
    {
        key: "sermons" as const,
        label: "خطبة",
        icon: Mic,
        color: "text-primary",
        bg: "from-primary/10 to-primary/5",
        border: "border-primary/20",
    },
    {
        key: "articles" as const,
        label: "مقالة",
        icon: FileText,
        color: "text-blue-600 dark:text-blue-400",
        bg: "from-blue-500/10 to-blue-500/5",
        border: "border-blue-500/20",
    },
    {
        key: "books" as const,
        label: "كتاب",
        icon: BookOpen,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "from-emerald-500/10 to-emerald-500/5",
        border: "border-emerald-500/20",
    },
    {
        key: "videos" as const,
        label: "مرئي",
        icon: Video,
        color: "text-red-600 dark:text-red-400",
        bg: "from-red-500/10 to-red-500/5",
        border: "border-red-500/20",
    },
]

export function StatsSection({ stats }: StatsSectionProps) {
    return (
        <section className="relative py-12 lg:py-16 bg-surface overflow-hidden">
            {/* Decorative background pattern */}
            <div
                className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23035d44' stroke-width='1'%3E%3Cpath d='M30 5 L35 20 L50 17 L42 30 L55 38 L42 42 L50 55 L35 47 L30 60 L25 47 L10 55 L18 42 L5 38 L18 30 L10 17 L25 20 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px",
                }}
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {statItems.map((item, index) => {
                        const Icon = item.icon
                        const value = stats[item.key] || 0
                        return (
                            <motion.div
                                key={item.key}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className={`relative group bg-gradient-to-br ${item.bg} backdrop-blur-sm border ${item.border} rounded-2xl p-5 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 overflow-hidden`}
                            >
                                {/* Decorative corner */}
                                <div
                                    className={`absolute -top-4 -left-4 w-16 h-16 rounded-full bg-gradient-to-br ${item.bg} blur-xl opacity-50 group-hover:opacity-100 transition-opacity`}
                                    aria-hidden="true"
                                />

                                <div className="relative flex items-center gap-3">
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-card border ${item.border} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shrink-0`}
                                    >
                                        <Icon className={`w-6 h-6 ${item.color}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-2xl lg:text-3xl font-black ${item.color} font-serif leading-tight`}>
                                            <Counter from={0} to={value} />
                                            <span className="text-base mr-1 opacity-60">+</span>
                                        </div>
                                        <p className="text-xs lg:text-sm text-muted-foreground font-medium">{item.label}</p>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}

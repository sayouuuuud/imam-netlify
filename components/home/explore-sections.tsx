"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MonitorPlay, BookOpen, GraduationCap, FileText, Mic, ArrowLeft, Sparkles } from "lucide-react"

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const,
        },
    }),
}

export function ExploreSections() {
    return (
        <section className="py-20 bg-muted/30 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60' viewBox='0 0 60 60'%3E%3Cg fill='none' stroke='%23035d44' stroke-width='1'%3E%3Cpath d='M30 5 L35 20 L50 17 L42 30 L55 38 L42 42 L50 55 L35 47 L30 60 L25 47 L10 55 L18 42 L5 38 L18 30 L10 17 L25 20 Z'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: "60px 60px",
                }}
                aria-hidden="true"
            />

            {/* Floating decorative elements */}
            <motion.div
                className="absolute top-10 right-10 text-primary/10 hidden lg:block pointer-events-none"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                aria-hidden="true"
            >
                <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
                    <path d="M50 5 L60 30 L85 25 L75 50 L95 65 L70 70 L75 95 L50 80 L25 95 L30 70 L5 65 L25 50 L15 25 L40 30 Z" />
                    <circle cx="50" cy="50" r="20" />
                </svg>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header with decorative elements */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Top label */}
                    <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-1.5 rounded-full text-xs font-bold mb-4 border border-secondary/20">
                        <Sparkles className="w-3.5 h-3.5" />
                        أقسام الموقع
                    </div>

                    {/* Title with decoration */}
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-secondary/50 hidden sm:block" />
                        <h2 className="text-4xl lg:text-5xl font-bold font-serif text-foreground">استكشف العلم أكثر</h2>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-secondary/50 hidden sm:block" />
                    </div>

                    <p className="text-muted-foreground max-w-xl mx-auto text-base lg:text-lg">
                        تصفح أقسام الموقع المتنوعة للوصول إلى المحتوى العلمي
                    </p>
                </motion.div>

                {/* Bento Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Khutba Card - Large featured (1/3 width) */}
                    <motion.div
                        className="lg:col-span-1"
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        custom={0}
                    >
                        <Link
                            href="/khutba"
                            className="relative h-full bg-gradient-to-br from-primary via-primary to-primary-hover rounded-3xl p-8 overflow-hidden group flex flex-col justify-between text-center min-h-[280px] lg:min-h-[420px] shadow-xl hover:shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-1"
                        >
                            {/* Animated geometric pattern overlay */}
                            <div
                                className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-700"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Cg fill='none' stroke='white' stroke-width='1'%3E%3Cpath d='M40 5 L50 25 L70 22 L62 40 L75 55 L58 58 L62 75 L40 65 L18 75 L22 58 L5 55 L18 40 L10 22 L30 25 Z'/%3E%3Ccircle cx='40' cy='40' r='15'/%3E%3C/g%3E%3C/svg%3E")`,
                                    backgroundSize: "80px 80px",
                                }}
                                aria-hidden="true"
                            />

                            {/* Decorative corner stars */}
                            <div className="absolute top-6 right-6 text-secondary/40 group-hover:text-secondary/60 transition-colors">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                    <path d="M12 0 L14 9 L23 12 L14 15 L12 24 L10 15 L1 12 L10 9 Z" />
                                </svg>
                            </div>

                            {/* Icon with glow */}
                            <div className="relative z-10 flex flex-col items-center">
                                <div className="relative w-20 h-20 mb-6">
                                    <div className="absolute inset-0 bg-secondary/30 rounded-full blur-xl group-hover:blur-2xl transition-all" />
                                    <div className="relative w-20 h-20 bg-white/15 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                        <Mic className="h-10 w-10 text-white" />
                                    </div>
                                </div>

                                <h3 className="text-3xl font-bold text-white mb-4 font-serif">الخطب المنبرية</h3>
                                <p className="text-white/80 mb-8 leading-relaxed text-sm max-w-xs">
                                    استمع إلى خطب الجمعة والأعياد والمناسبات الدينية، مرتبة ومؤرشفة للرجوع إليها في أي وقت.
                                </p>
                            </div>

                            <span className="relative z-10 inline-flex items-center justify-center gap-2 text-sm font-bold bg-secondary text-secondary-foreground px-6 py-3.5 rounded-xl group-hover:bg-secondary-hover transition-all w-full overflow-hidden">
                                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                                <span className="relative">استمع الآن</span>
                                <ArrowLeft className="relative h-4 w-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </motion.div>

                    {/* Stacked Cards (2/3 width) */}
                    <div className="lg:col-span-2 grid grid-cols-1 gap-6">
                        {/* Dars - Full Width */}
                        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}>
                            <Link
                                href="/dars"
                                className="relative group bg-card rounded-2xl p-6 shadow-sm border border-border hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-500 flex items-center justify-between overflow-hidden hover:-translate-y-1"
                            >
                                {/* Hover gradient */}
                                <div className="absolute inset-0 bg-gradient-to-l from-amber-50/0 via-amber-50/50 to-amber-50/0 dark:from-amber-900/0 dark:via-amber-900/10 dark:to-amber-900/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded-md">
                                            تعليم
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 font-serif text-right group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                                        الدروس العلمية
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-right">
                                        سلاسل علمية متكاملة في الفقه والعقيدة والسيرة.
                                    </p>
                                </div>
                                <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-800/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-amber-200/50 dark:border-amber-700/30">
                                    <GraduationCap className="h-7 w-7 text-amber-600 dark:text-amber-400" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Articles - Full Width */}
                        <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={2}>
                            <Link
                                href="/articles"
                                className="relative group bg-card rounded-2xl p-6 shadow-sm border border-border hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 flex items-center justify-between overflow-hidden hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-l from-blue-50/0 via-blue-50/50 to-blue-50/0 dark:from-blue-900/0 dark:via-blue-900/10 dark:to-blue-900/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                <div className="flex-1 relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                                            قراءة
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold text-foreground mb-2 font-serif text-right group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        المقالات والبحوث
                                    </h3>
                                    <p className="text-sm text-muted-foreground text-right">
                                        كتابات دورية تناقش القضايا المعاصرة برؤية شرعية.
                                    </p>
                                </div>
                                <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-blue-200/50 dark:border-blue-700/30">
                                    <FileText className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                </div>
                            </Link>
                        </motion.div>

                        {/* Videos & Books - 2 Columns */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Videos */}
                            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={3}>
                                <Link
                                    href="/videos"
                                    className="relative group bg-card rounded-2xl p-6 shadow-sm border border-border hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 flex items-center justify-between overflow-hidden hover:-translate-y-1 h-full"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-l from-red-50/0 via-red-50/50 to-red-50/0 dark:from-red-900/0 dark:via-red-900/10 dark:to-red-900/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    <div className="flex-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-2 py-0.5 rounded-md">
                                                مرئي
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2 font-serif text-right group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                            المرئيات
                                        </h3>
                                        <p className="text-sm text-muted-foreground text-right">مقاطع مرئية قصيرة.</p>
                                    </div>
                                    <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/20 rounded-2xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-red-200/50 dark:border-red-700/30">
                                        <MonitorPlay className="h-7 w-7 text-red-600 dark:text-red-400" />
                                    </div>
                                </Link>
                            </motion.div>

                            {/* Books */}
                            <motion.div variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={4}>
                                <Link
                                    href="/books"
                                    className="relative group bg-card rounded-2xl p-6 shadow-sm border border-border hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 flex items-center justify-between overflow-hidden hover:-translate-y-1 h-full"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-l from-emerald-50/0 via-emerald-50/50 to-emerald-50/0 dark:from-emerald-900/0 dark:via-emerald-900/10 dark:to-emerald-900/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    <div className="flex-1 relative z-10">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md">
                                                مكتبة
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold text-foreground mb-2 font-serif text-right group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                            المكتبة المقروءة
                                        </h3>
                                        <p className="text-sm text-muted-foreground text-right">مؤلفات الشيخ وكتب.</p>
                                    </div>
                                    <div className="relative z-10 w-14 h-14 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 rounded-2xl flex items-center justify-center mr-4 shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-emerald-200/50 dark:border-emerald-700/30">
                                        <BookOpen className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                </Link>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

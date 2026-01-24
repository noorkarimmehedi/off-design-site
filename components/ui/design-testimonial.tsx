"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"

const testimonials = [
    {
        quote: "Transformed our entire creative process overnight.",
        author: "Sarah Chen",
        role: "Design Director",
        company: "Linear",
    },
    {
        quote: "The most elegant solution we've ever implemented.",
        author: "Marcus Webb",
        role: "Creative Lead",
        company: "Vercel",
    },
    {
        quote: "Pure craftsmanship in every single detail.",
        author: "Elena Frost",
        role: "Head of Product",
        company: "Stripe",
    },
]

export function Testimonial() {
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    // Mouse position for magnetic effect
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    const springConfig = { damping: 25, stiffness: 200 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    // Transform for parallax on the large number
    const numberX = useTransform(x, [-200, 200], [-20, 20])
    const numberY = useTransform(y, [-200, 200], [-10, 10])

    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (rect) {
            const centerX = rect.left + rect.width / 2
            const centerY = rect.top + rect.height / 2
            mouseX.set(e.clientX - centerX)
            mouseY.set(e.clientY - centerY)
        }
    }

    const goNext = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
    const goPrev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

    useEffect(() => {
        const timer = setInterval(goNext, 6000)
        return () => clearInterval(timer)
    }, [])

    const current = testimonials[activeIndex]

    return (
        <div className="flex items-center justify-center py-1 overflow-hidden w-full">
            <div ref={containerRef} className="relative w-full px-1" onMouseMove={handleMouseMove}>
                {/* Oversized index number - shifted right and smaller for sidebar */}
                <motion.div
                    className="absolute -right-2 top-1/2 -translate-y-1/2 text-[8rem] font-bold text-foreground/[0.012] select-none pointer-events-none leading-none tracking-tighter"
                    style={{ x: numberX, y: numberY }}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={activeIndex}
                            initial={{ opacity: 0, scale: 0.8, filter: "blur(8px)" }}
                            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(8px)" }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="block"
                        >
                            {String(activeIndex + 1).padStart(2, "0")}
                        </motion.span>
                    </AnimatePresence>
                </motion.div>

                {/* Main content - simplified for sidebar */}
                <div className="relative flex flex-col gap-2">
                    {/* Header - vertical indicator + company */}
                    <div className="flex items-start gap-2">
                        <div className="flex flex-col items-center border-r border-border pr-2">
                            <motion.span
                                className="text-[8px] font-mono text-muted-foreground tracking-widest uppercase"
                                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Info
                            </motion.span>
                            <div className="relative h-6 w-px bg-border mt-1">
                                <motion.div
                                    className="absolute top-0 left-0 w-full bg-foreground origin-top"
                                    animate={{
                                        height: `${((activeIndex + 1) / testimonials.length) * 100}%`,
                                    }}
                                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                />
                            </div>
                        </div>

                        <div className="flex-1">
                            {/* Company badge */}
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeIndex}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    <span className="inline-flex items-center gap-1 text-[8px] font-mono text-muted-foreground border border-border rounded-full px-1 py-0">
                                        <span className="w-1 h-1 rounded-full bg-accent" />
                                        {current.company}
                                    </span>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Quote */}
                    <div className="relative min-h-[60px]">
                        <AnimatePresence mode="wait">
                            <motion.blockquote
                                key={activeIndex}
                                className="text-base font-light text-foreground leading-tight tracking-tight"
                                initial="hidden"
                                animate="visible"
                                exit="exit"
                            >
                                {current.quote.split(" ").map((word, i) => (
                                    <motion.span
                                        key={i}
                                        className="inline-block mr-[0.2em]"
                                        variants={{
                                            hidden: { opacity: 0, y: 5, rotateX: 90 },
                                            visible: {
                                                opacity: 1,
                                                y: 0,
                                                rotateX: 0,
                                                transition: {
                                                    duration: 0.5,
                                                    delay: i * 0.03,
                                                    ease: [0.22, 1, 0.36, 1],
                                                },
                                            },
                                            exit: {
                                                opacity: 0,
                                                y: -3,
                                                transition: { duration: 0.2, delay: i * 0.02 },
                                            },
                                        }}
                                    >
                                        {word}
                                    </motion.span>
                                ))}
                            </motion.blockquote>
                        </AnimatePresence>
                    </div>

                    {/* Author row */}
                    <div className="flex items-center justify-between border-t border-border pt-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -5 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="flex items-center gap-2"
                            >
                                <motion.div
                                    className="w-2 h-px bg-foreground"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    style={{ originX: 0 }}
                                />
                                <div>
                                    <p className="text-[9px] font-medium text-foreground">{current.author}</p>
                                    <p className="text-[8px] text-muted-foreground">{current.role}</p>
                                </div>
                            </motion.div>
                        </AnimatePresence>

                        {/* Navigation */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={goPrev}
                                className="w-5 h-5 rounded-full border border-border flex items-center justify-center hover:bg-neutral-100 transition-colors"
                            >
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                    <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <button
                                onClick={goNext}
                                className="w-5 h-5 rounded-full border border-border flex items-center justify-center hover:bg-neutral-100 transition-colors"
                            >
                                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                                    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

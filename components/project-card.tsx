"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import RevealOnView from "@/components/reveal-on-view"
import { useEffect, useRef, useState } from "react"

type Props = {
  title?: string
  subtitle?: string
  imageSrc?: string
  isVideo?: boolean
  tags?: string[]
  href?: string
  priority?: boolean
  gradientFrom?: string
  gradientTo?: string
  imageContainerClassName?: string
  containerClassName?: string
  revealDelay?: number
  indicatorText?: string
}

export default function ProjectCard({
  title = "Project title",
  subtitle = "Project subtitle",
  imageSrc = "/placeholder.svg?height=720&width=1280",
  isVideo = false,
  tags = ["Design", "Web"],
  href = "#",
  priority = false,
  gradientFrom = "#0f172a",
  gradientTo = "#6d28d9",
  imageContainerClassName,
  containerClassName,
  revealDelay = 0,
  indicatorText,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoError, setVideoError] = useState(false);
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const isExternal = href?.startsWith("http");

  // Intersection Observer for lazy loading videos
  useEffect(() => {
    if (!isVideo || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVideoVisible(true);
            // Load video source when visible
            if (videoRef.current && !isVideoLoaded) {
              videoRef.current.load();
            }
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before entering viewport
        threshold: 0.1,
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVideo, isVideoLoaded]);

  // Play video when it's visible and loaded
  useEffect(() => {
    if (isVideo && videoRef.current && isVideoVisible && isVideoLoaded) {
      const playPromise = videoRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setVideoError(false);
          })
          .catch((error) => {
            console.error('Error playing video:', error);
            setVideoError(true);
          });
      }
    }
  }, [isVideo, isVideoVisible, isVideoLoaded]);

  return (
    <article className={cn("group relative", containerClassName)}>
      <RevealOnView
        delay={revealDelay}
        className="border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <div className={cn(
          "relative overflow-hidden lg:h-full",
          imageSrc === "/Bg_01.webp" || isVideo ? "bg-white" : "bg-black"
        )}>
          {/* Image/Video Container */}
          <div
            ref={containerRef}
            className={cn(
              "relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full",
              imageContainerClassName,
              imageSrc === "/Gtf-9FWWAAEL1s.webp" ? "aspect-[1/1] sm:aspect-[16/9]" : "",
              imageSrc === "/Bg_01.webp" ? "aspect-[16/9] sm:aspect-[16/9]" : ""
            )}
          >
            {/* Clickable overlay for external links */}
            {isExternal && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={title}
                className="absolute inset-0 z-[2]"
              />
            )}
            {isVideo ? (
              <>
                {!isVideoVisible && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                    <div className="text-neutral-400 text-xs">Loading...</div>
                  </div>
                )}
                <video
                  ref={videoRef}
                  autoPlay={isVideoVisible && isVideoLoaded}
                  loop={true}
                  muted={true}
                  playsInline={true}
                  controls={false}
                  preload="none"
                  className="absolute inset-0 h-full w-full object-contain"
                  style={{ objectFit: 'contain', opacity: isVideoLoaded ? 1 : 0 }}
                  onLoadedData={() => {
                    setIsVideoLoaded(true);
                    setVideoError(false);
                  }}
                  onError={(e) => {
                    console.error('Video error:', e);
                    console.error('Video src:', imageSrc);
                    setVideoError(true);
                  }}
                >
                  {isVideoVisible && (
                    <source 
                      src={encodeURI(imageSrc)} 
                      type={imageSrc?.endsWith('.mov') ? 'video/quicktime' : 'video/mp4'} 
                    />
                  )}
                  Your browser does not support the video tag.
                </video>
                {videoError && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <p className="text-white text-sm px-4 text-center">
                      Video format not supported. Please convert to MP4 format.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority={priority}
                className={`${
                  imageSrc === "/Gtf-9FWWAAEL1s.webp" ? "object-contain sm:object-cover" :
                  imageSrc === "/Bg_01.webp" ? "object-contain" :
                  "object-cover"
                }`}
              />
            )}
            {/* Subtle vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30" />

            {/* Indicator badge - Swiss Grid Style */}
            {indicatorText && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[50]">
                <div className="grid grid-cols-12 gap-0 px-4 sm:px-6 pb-4 sm:pb-6">
                  <div className="col-span-12 sm:col-start-2 sm:col-span-10 lg:col-start-3 lg:col-span-8">
                    <div className="border-t border-white/20 pt-3 sm:pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="h-px w-8 sm:w-12 bg-white/40"></div>
                          <span className="select-none font-departuremono text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-white/90 font-normal leading-none">
                            {indicatorText}
                          </span>
                          <div className="h-px flex-1 bg-white/40"></div>
                        </div>
                        <div className="ml-4 sm:ml-6">
                          <div className="h-1 w-1 bg-white/60"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tags removed globally */}

          {/* Bottom content removed: titles/subtitles and Case study hidden for all */}
        </div>
      </RevealOnView>
    </article>
  )
}

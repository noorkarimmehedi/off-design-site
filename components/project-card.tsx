"use client";

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import RevealOnView from "@/components/reveal-on-view"
import { useEffect, useRef } from "react"

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
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isVideo && videoRef.current) {
      console.log('Video props:', {
        src: imageSrc,
        isVideo,
        videoElement: videoRef.current
      });
      
      // Try to play the video
      videoRef.current.play().catch(error => {
        console.error('Error playing video:', error);
      });
    }
  }, [isVideo, imageSrc]);

  return (
    <article className={cn("group relative", containerClassName)}>
      <RevealOnView
        delay={revealDelay}
        className="border border-white/10 p-1 shadow-[0_10px_60px_-10px_rgba(0,0,0,0.6)] lg:h-full"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        }}
      >
        <div className="relative overflow-hidden bg-black lg:h-full">
          {/* Image/Video Container */}
          <div
            className={cn(
              "relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-auto lg:h-full",
              imageContainerClassName,
              imageSrc === "/Gtf-9FWWAAEL1s.webp" ? "aspect-[1/1] sm:aspect-[16/9]" : ""
            )}
          >
            {isVideo ? (
              <video
                ref={videoRef}
                autoPlay={true}
                loop={true}
                muted={true}
                playsInline={true}
                controls={false}
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover"
                style={{ objectFit: 'cover' }}
                onLoadedData={() => console.log('Video loaded successfully')}
                onError={(e) => console.error('Video error:', e)}
              >
                <source src={imageSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={title}
                fill
                sizes="(min-width: 1024px) 66vw, 100vw"
                priority={priority}
                className={`${imageSrc === "/Gtf-9FWWAAEL1s.webp" ? "object-contain sm:object-cover" : "object-cover"}`}
              />
            )}
            {/* Subtle vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/30" />
          </div>

          {/* Tags removed globally */}

          {/* Bottom content removed: titles/subtitles and Case study hidden for all */}
        </div>
      </RevealOnView>
    </article>
  )
}

"use client"

interface HeroBookImageProps {
  imageUrl: string
  title: string
  customText: string
}

export function HeroBookImage({ imageUrl, title, customText }: HeroBookImageProps) {
  return (
    <div className="relative w-[280px] sm:w-[320px] h-[400px] sm:h-[460px] rounded-xl overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={title || "غلاف الكتاب"}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        onError={(e) => {
          const target = e.currentTarget
          target.style.display = "none"
          const fallback = target.nextElementSibling as HTMLElement
          if (fallback) fallback.style.display = "flex"
        }}
      />
      {/* Fallback when image fails */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-primary to-primary-hover flex flex-col items-center justify-center text-center p-8 border-[8px] border-primary-hover/50"
        style={{ display: "none" }}
      >
        <div className="absolute inset-4 border border-secondary/30 rounded-lg pointer-events-none"></div>
        <span className="text-secondary text-xs font-medium tracking-widest mb-4 uppercase">{customText}</span>
        <h2 className="text-primary-foreground text-3xl font-serif font-bold mb-2 line-clamp-3">{title || "الكتاب"}</h2>
        <div className="w-16 h-0.5 bg-secondary mt-4"></div>
      </div>
    </div>
  )
}

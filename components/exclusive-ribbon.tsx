import { cn } from "@/lib/utils"

interface ExclusiveRibbonProps {
  label?: string
  className?: string
}

export function ExclusiveRibbon({ label = "Site Exclusive", className }: ExclusiveRibbonProps) {
  return (
    <div
      className={cn(
        "absolute top-5 -right-10 z-20 pointer-events-none",
        "w-40 h-7 flex items-center justify-center",
        "rotate-45 origin-center",
        className
      )}
      aria-label={label}
    >
      <div
        className={cn(
          "relative w-full h-full",
          "bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600",
          "backdrop-blur-md",
          "rounded-full",
          "shadow-lg shadow-purple-900/50",
          "ring-1 ring-white/10",
          "flex items-center justify-center",
          "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-white/10 before:to-transparent before:pointer-events-none"
        )}
      >
        <span className="text-[10px] font-semibold text-white uppercase tracking-wider leading-none relative z-10 drop-shadow-sm">
          {label}
        </span>
      </div>
    </div>
  )
}


import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="ds-page">
      <div className="ds-container py-10 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-16 md:space-y-20">
          <div className="mx-auto max-w-4xl text-center">
            <Skeleton className="mx-auto mb-4 h-12 w-80 max-w-full" />
            <Skeleton className="mx-auto h-6 w-[36rem] max-w-full" />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="ds-surface p-8">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-6" />
                <div className="space-y-3">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </div>
                <Skeleton className="h-10 w-32 mt-6" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

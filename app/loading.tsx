/**
 * Global loading UI for instant page transitions
 * Shows while Next.js is loading new routes
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-primary rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-foreground animate-pulse">
            Loading...
          </p>
          <p className="text-sm text-muted-foreground">
            Preparing your experience
          </p>
        </div>
      </div>
    </div>
  )
}

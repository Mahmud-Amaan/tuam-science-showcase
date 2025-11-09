/**
 * Performance monitoring utilities for Next.js
 * Tracks Core Web Vitals and custom metrics
 */

export interface PerformanceMetric {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
  navigationType?: string
}

// Core Web Vitals thresholds
const THRESHOLDS = {
  FCP: { good: 1800, poor: 3000 },  // First Contentful Paint
  LCP: { good: 2500, poor: 4000 },  // Largest Contentful Paint
  FID: { good: 100, poor: 300 },    // First Input Delay
  CLS: { good: 0.1, poor: 0.25 },   // Cumulative Layout Shift
  TTFB: { good: 800, poor: 1800 },  // Time to First Byte
  INP: { good: 200, poor: 500 },    // Interaction to Next Paint
}

function getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
  const threshold = THRESHOLDS[name as keyof typeof THRESHOLDS]
  if (!threshold) return 'good'
  
  if (value <= threshold.good) return 'good'
  if (value <= threshold.poor) return 'needs-improvement'
  return 'poor'
}

/**
 * Report Web Vitals to console in development
 * In production, send to analytics service
 */
export function reportWebVitals(metric: PerformanceMetric) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Performance] ${metric.name}:`, {
      value: `${Math.round(metric.value)}ms`,
      rating: metric.rating,
    })
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    // Send to your analytics service
    // Example: sendToAnalytics(metric)
    
    // Vercel Analytics automatically captures Web Vitals
    // No additional code needed if using @vercel/analytics
  }
}

/**
 * Measure custom performance metrics
 */
export function measurePerformance(metricName: string, startMark: string, endMark?: string) {
  if (typeof window === 'undefined' || !window.performance) return

  try {
    if (endMark) {
      performance.measure(metricName, startMark, endMark)
    } else {
      performance.measure(metricName, startMark)
    }

    const measure = performance.getEntriesByName(metricName)[0]
    if (measure) {
      console.log(`[Custom Metric] ${metricName}: ${Math.round(measure.duration)}ms`)
    }
  } catch (error) {
    console.warn('Performance measurement failed:', error)
  }
}

/**
 * Mark a performance point
 */
export function markPerformance(markName: string) {
  if (typeof window === 'undefined' || !window.performance) return
  
  try {
    performance.mark(markName)
  } catch (error) {
    console.warn('Performance mark failed:', error)
  }
}

/**
 * Get navigation timing metrics
 */
export function getNavigationTiming() {
  if (typeof window === 'undefined' || !window.performance) return null

  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
  if (!navigation) return null

  return {
    dns: Math.round(navigation.domainLookupEnd - navigation.domainLookupStart),
    tcp: Math.round(navigation.connectEnd - navigation.connectStart),
    ttfb: Math.round(navigation.responseStart - navigation.requestStart),
    download: Math.round(navigation.responseEnd - navigation.responseStart),
    domInteractive: Math.round(navigation.domInteractive - navigation.fetchStart),
    domComplete: Math.round(navigation.domComplete - navigation.fetchStart),
    loadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
  }
}

/**
 * Log all performance metrics for debugging
 */
export function logPerformanceMetrics() {
  if (typeof window === 'undefined') return

  console.group('🚀 Performance Metrics')
  
  // Navigation Timing
  const timing = getNavigationTiming()
  if (timing) {
    console.log('Navigation Timing:', timing)
  }

  // Resource Timing
  const resources = performance.getEntriesByType('resource')
  const totalSize = resources.reduce((acc: number, resource: any) => {
    return acc + (resource.transferSize || 0)
  }, 0)
  console.log(`Resources: ${resources.length} files, ${(totalSize / 1024 / 1024).toFixed(2)} MB`)

  // Memory (if available)
  const memory = (performance as any).memory
  if (memory) {
    console.log('Memory:', {
      used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
      limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
    })
  }

  console.groupEnd()
}

/**
 * Preload critical resources
 */
export function preloadResource(href: string, as: string, type?: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  if (type) link.type = type
  document.head.appendChild(link)
}

/**
 * Prefetch route for faster navigation
 */
export function prefetchRoute(href: string) {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = href
  document.head.appendChild(link)
}

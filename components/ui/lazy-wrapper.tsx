"use client"

import { Suspense, lazy, ComponentType } from "react"
import LoadingSpinner from "./loading-spinner"

interface LazyWrapperProps {
  fallback?: React.ComponentType<any>
  children: React.ReactNode
}

export function LazyWrapper({ fallback: Fallback, children }: LazyWrapperProps) {
  return (
    <Suspense fallback={Fallback ? <Fallback /> : <LoadingSpinner />}>
      {children}
    </Suspense>
  )
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: React.ComponentType<any>
) {
  const LazyComponent = lazy(importFn)

  return function LazyWrappedComponent(props: React.ComponentProps<T>) {
    return (
      <LazyWrapper fallback={fallback}>
        <LazyComponent {...props} />
      </LazyWrapper>
    )
  }
}
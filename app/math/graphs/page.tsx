"use client"
import { createLazyComponent } from "@/components/ui/lazy-wrapper"

const MathSimulator = createLazyComponent(
  () => import("@/components/maths/components/math-simulator")
)

export default function GraphsPage() {
  return <MathSimulator />
}

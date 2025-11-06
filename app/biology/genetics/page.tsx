"use client"

import ModelLayout from "@/components/model-layout"
import { createLazyComponent } from "@/components/ui/lazy-wrapper"

const ModelViewer = createLazyComponent(
  () => import("@/components/model-viewer")
)

export default function GeneticsPage() {
  return (
    <ModelLayout
      title="Genetics & DNA"
      description="Explore chromosome structure in 3D"
    >
      <ModelViewer
        src="https://sketchfab.com/models/cc33bb1ebe6141b08d0d06f1bbebc2b7/embed"
        title="Chromosome Structure on Sketchfab"
      />
    </ModelLayout>
  )
}
"use client"

import ModelLayout from "@/components/model-layout"
import { createLazyComponent } from "@/components/ui/lazy-wrapper"

const ModelViewer = createLazyComponent(
  () => import("@/components/model-viewer")
)

export default function CellsPage() {
  return (
    <ModelLayout
      title="Cell Biology"
      description="Interactive 3D models of cells and organelles"
    >
      <ModelViewer
        src="https://sketchfab.com/playlists/embed?collection=2f8a198ed4b8453d90708741c6848acb"
        title="Cells Collection on Sketchfab"
      />
    </ModelLayout>
  )
}
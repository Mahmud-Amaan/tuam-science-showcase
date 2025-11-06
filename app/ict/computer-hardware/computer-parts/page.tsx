"use client"

import ModelLayout from "@/components/model-layout"
import { createLazyComponent } from "@/components/ui/lazy-wrapper"

const ModelViewer = createLazyComponent(
  () => import("@/components/model-viewer")
)

export default function ComputerPartsPage() {
  return (
    <ModelLayout
      title="Computer Parts"
      description="Interactive 3D models of computer components and their assembly"
    >
      <ModelViewer
        src="https://sketchfab.com/models/bd6fb0ed93f3475b890a099fedecf351/embed?autostart=1&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=1&ui_watermark=1&ui_watermark_link=1"
        title="Computer Parts 3D Model"
      />
    </ModelLayout>
  )
}
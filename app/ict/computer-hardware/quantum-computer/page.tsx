"use client"

import ModelLayout from "@/components/model-layout"
import { createLazyComponent } from "@/components/ui/lazy-wrapper"

const ModelViewer = createLazyComponent(
  () => import("@/components/model-viewer")
)

export default function QuantumComputerPage() {
  return (
    <ModelLayout
      title="Quantum Computer"
      description="Interactive 3D model of quantum computing technology"
    >
      <ModelViewer
        src="https://sketchfab.com/models/82006aac41744663a161ab844264ac2a/embed?autostart=1&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=1&ui_watermark=1&ui_watermark_link=1"
        title="Quantum Computer 3D Model"
      />
    </ModelLayout>
  )
}
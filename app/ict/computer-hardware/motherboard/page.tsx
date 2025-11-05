"use client"

import ModelViewer from "@/components/model-viewer"
import ModelLayout from "@/components/model-layout"

export default function MotherboardPage() {
  return (
    <ModelLayout
      title="Motherboard"
      description="Interactive 3D model of motherboard and its components"
    >
      <ModelViewer 
        src="https://sketchfab.com/models/bfcaf54d2a604e9b9319611adab8a589/embed?autostart=1&ui_controls=1&ui_infos=1&ui_inspector=1&ui_stop=1&ui_watermark=1&ui_watermark_link=1"
        title="Motherboard 3D Model"
      />
    </ModelLayout>
  )
}
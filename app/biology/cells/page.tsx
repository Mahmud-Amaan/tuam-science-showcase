"use client"

import ModelViewer from "@/components/model-viewer"
import ModelLayout from "@/components/model-layout"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cell Biology - 3D Models | TUAM Science",
  description: "Interactive 3D models of cells and organelles. Explore cellular structures in detail with our interactive 3D visualization.",
}

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
"use client"

import ModelViewer from "@/components/model-viewer"
import ModelLayout from "@/components/model-layout"


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
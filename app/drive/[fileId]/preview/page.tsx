"use client"

import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share, MessageSquare, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import { Navbar } from "@/components/navbar"

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black">
      <Navbar />

      <div className="flex items-center justify-between p-4 bg-gray-900 text-white">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-lg font-medium">Plans Facade - v2.3.dwg</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="text-white hover:bg-gray-800" disabled>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-gray-800" disabled>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-gray-800" disabled>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-gray-800" disabled>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-gray-800" disabled>
            <Share className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-gray-800"
            onClick={() => router.push(`/drive/${params.fileId}/annotate`)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center h-[calc(100vh-140px)] p-8">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full h-full flex items-center justify-center">
          <img
            src="/placeholder.svg?height=600&width=800&text=DWG+Preview"
            alt="Document preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
    </div>
  )
}

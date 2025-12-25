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

      <div className="flex items-center justify-between p-4 md:p-6 bg-black border-b-2 border-white/10">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => router.back()} className="text-white hover:bg-white/10 rounded-none border-2 border-white/20 hover:border-white transition-all">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-lg md:text-xl font-black tracking-tighter text-white">Plans Facade - v2.3.dwg</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none border-2 border-white/20 hover:border-white transition-all" disabled>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none border-2 border-white/20 hover:border-white transition-all" disabled>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none border-2 border-white/20 hover:border-white transition-all" disabled>
            <RotateCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none border-2 border-white/20 hover:border-white transition-all" disabled>
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10 rounded-none border-2 border-white/20 hover:border-white transition-all" disabled>
            <Share className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            className="text-white hover:bg-white hover:text-black rounded-none border-2 border-white/20 hover:border-white transition-all font-medium tracking-wide"
            onClick={() => router.push(`/drive/${params.fileId}/annotate`)}
          >
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-center h-[calc(100vh-140px)] p-8">
        <div className="bg-white border-2 border-white/20 max-w-4xl w-full h-full flex items-center justify-center">
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

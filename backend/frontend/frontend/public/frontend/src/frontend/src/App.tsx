import React, { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import ResultDisplay from './components/ResultDisplay'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'

interface AnalysisResult {
  hasFault: boolean
  faultType?: string
  confidence?: number
  description?: string
}

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const handleImageUpload = (f: File, url: string) => {
    setFile(f)
    setPreviewUrl(url)
    setResult(null)
  }

  const detectFaults = async () => {
    if (!file) return
    setIsProcessing(true)
    const form = new FormData()
    form.append('image', file)
    try {
      const res = await fetch('/api/analyze-solar-panel', { method: 'POST', body: form })
      const data = await res.json()
      setResult(data)
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    }
    setIsProcessing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center">Solar Panel Fault Detector</h1>
        <ImageUploader onImageUpload={handleImageUpload} />
        <div className="flex justify-center">
          <Button onClick={detectFaults} disabled={!previewUrl || isProcessing}>
            {isProcessing ? 'Processing...' : 'Detect Faults'}
          </Button>
        </div>
        <ResultDisplay previewUrl={previewUrl} isProcessing={isProcessing} result={result} />
      </div>
    </div>
  )
}

export default App

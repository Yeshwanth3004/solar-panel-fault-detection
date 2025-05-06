import React from 'react'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Bug } from 'lucide-react'

interface Props {
  previewUrl: string | null
  isProcessing: boolean
  result: { hasFault: boolean, faultType?: string, confidence?: number, description?: string } | null
}

const ResultDisplay: React.FC<Props> = ({ previewUrl, isProcessing, result }) => {
  if (!previewUrl) return <div className="p-6 bg-white rounded shadow text-center">Upload an image</div>
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Analysis Results</h2>
      <img src={previewUrl} alt="preview" className="w-full object-contain mb-4" />
      {isProcessing ? (
        <p>Processing...</p>
      ) : result ? (
        <>
          {result.hasFault ? (
            <Alert variant="destructive" className="mb-4">
              <Bug className="mr-2" />
              <AlertTitle>{result.faultType}</AlertTitle>
              <AlertDescription>{result.description}</AlertDescription>
            </Alert>
          ) : (
            <Alert className="mb-4">
              <AlertTitle>No Faults Detected</AlertTitle>
              <AlertDescription>{result.description}</AlertDescription>
            </Alert>
          )}
          {result.confidence !== undefined && (
            <div>
              <p>Confidence: {result.confidence}%</p>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className={`h-2 rounded ${result.confidence>80?'bg-green-500':result.confidence>60?'bg-yellow-500':'bg-red-500'}`} style={{width: `${result.confidence}%`}} />
              </div>
            </div>
          )}
        </>
      ) : ( <p>Click "Detect Faults"</p> )}
    </div>
  )
}

export default ResultDisplay

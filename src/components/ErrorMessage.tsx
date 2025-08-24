import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { AlertCircle, RefreshCw, RotateCcw, Mail, Phone } from 'lucide-react'

interface ErrorMessageProps {
  error: string
  onRetry: () => void
  onReset: () => void
}

export function ErrorMessage({ error, onRetry, onReset }: ErrorMessageProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="text-center py-12">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-red-800 mb-4">
          Application Submission Failed
        </h2>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium mb-2">Error Details:</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>

        <p className="text-gray-600 mb-8">
          We apologize for the inconvenience. Please try submitting your application again, 
          or contact our admissions office if the problem persists.
        </p>

        <div className="space-y-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={onRetry}
              className="bg-green-800 hover:bg-green-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            
            <Button 
              variant="outline"
              onClick={onReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Start Over
            </Button>
          </div>
        </div>

        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-800 mb-4">Need Help?</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email: admissions@royalafricancollege.edu</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>Phone: +265 1 234 5678</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
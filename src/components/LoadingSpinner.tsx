import React from 'react'
import { Card, CardContent } from './ui/card'
import { Loader2, Mail, Database, Send } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="text-center py-12">
        <div className="mb-6">
          <Loader2 className="w-16 h-16 text-green-600 mx-auto animate-spin" />
        </div>
        
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Submitting Your Application
        </h2>
        
        <p className="text-gray-600 mb-8">
          Please wait while we process your application and send your admission letter...
        </p>

        <div className="space-y-4 text-left max-w-md mx-auto">
          <div className="flex items-center space-x-3 text-gray-600">
            <Database className="w-5 h-5 text-green-600" />
            <span>Saving application data...</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Send className="w-5 h-5 text-green-600" />
            <span>Generating admission letter...</span>
          </div>
          <div className="flex items-center space-x-3 text-gray-600">
            <Mail className="w-5 h-5 text-green-600" />
            <span>Sending email confirmation...</span>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>This process may take a few moments. Please do not close this window.</p>
        </div>
      </CardContent>
    </Card>
  )
}
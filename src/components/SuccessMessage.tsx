import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import { CheckCircle, Mail, RefreshCw, Copy, ExternalLink } from 'lucide-react'

interface SuccessMessageProps {
  studentId: string | null
  email: string
  onNewApplication: () => void
}

export function SuccessMessage({ studentId, email, onNewApplication }: SuccessMessageProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardContent className="text-center py-12">
        <div className="mb-6">
          <CheckCircle className="w-24 h-24 text-green-600 mx-auto mb-4" />
        </div>
        
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          🎉 Congratulations! Application Submitted Successfully!
        </h2>
        
        <div className="space-y-4 text-gray-600 mb-8">
          <p className="text-lg">
            Thank you for your interest in Royal African College. Your application has been received and processed.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Mail className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">Admission Letter Sent!</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>• Your official admission letter has been sent to <strong>{email}</strong></p>
              <p>• Please check your email inbox (and spam folder if needed)</p>
              <p>• The letter contains important payment and enrollment information</p>
            </div>
          </div>
          
          {studentId && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-2">Your Application Details</p>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <span className="font-mono font-bold text-lg">{studentId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(studentId)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <p className="text-xs">Student ID (keep this for your records)</p>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-700 space-y-2">
              <p className="font-medium">Next Steps:</p>
              <div className="text-left space-y-1">
                <p>1. Check your email for the official admission letter</p>
                <p>2. Review the payment instructions (K35,000 application fee)</p>
                <p>3. Complete payment using the provided bank details</p>
                <p>4. Use your Student ID as the payment reference</p>
                <p>5. Keep your receipt for enrollment confirmation</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onNewApplication}
            className="bg-green-800 hover:bg-green-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Submit Another Application
          </Button>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>For questions about your application or payment:</p>
            <div className="flex items-center justify-center space-x-4">
              <a 
                href="mailto:admissions@royalafricancollege.edu"
                className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-800"
              >
                <Mail className="w-3 h-3" />
                <span>admissions@royalafricancollege.edu</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p>Phone: +265 1 234 5678</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
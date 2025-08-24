import React from 'react'
import { CheckCircle } from 'lucide-react'

interface ProgressStepsProps {
  steps: string[]
  currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="relative flex justify-between items-center mb-8">
      {/* Progress line */}
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0">
        <div 
          className="h-full bg-green-600 transition-all duration-300 ease-in-out"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />
      </div>
      
      {steps.map((step, index) => (
        <div key={index} className="flex flex-col items-center relative z-10">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              index < currentStep
                ? 'bg-green-600 text-white'
                : index === currentStep
                ? 'bg-yellow-500 text-black'
                : 'bg-gray-200 text-gray-500'
            }`}
          >
            {index < currentStep ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              index + 1
            )}
          </div>
          <p className={`mt-2 text-sm font-medium ${
            index <= currentStep ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {step}
          </p>
        </div>
      ))}
    </div>
  )
}
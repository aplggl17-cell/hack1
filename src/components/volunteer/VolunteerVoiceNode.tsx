'use client'

import { useState, useEffect, useRef } from 'react'
import { createBrowserSupabaseClient } from '@/lib/supabase/clients'

export function VolunteerVoiceNode() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [statusText, setStatusText] = useState('Standby for Command')
  const recognitionRef = useRef<any>(null)
  const supabase = createBrowserSupabaseClient()

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setStatusText('Speech API Not Supported')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event: any) => {
      let currentTranscript = ''
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript
        }
      }
      
      if (currentTranscript) {
        setTranscript(prev => prev + ' ' + currentTranscript)
        checkWakeWord(currentTranscript.trim().toLowerCase())
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error)
      setIsListening(false)
      setStatusText('Error: ' + event.error)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const checkWakeWord = async (text: string) => {
    if (text.includes('command code alpha')) {
      setStatusText('Wake Word Detected! Processing...')
      if (recognitionRef.current) {
        recognitionRef.current.stop()
        setIsListening(false)
      }
      
      try {
        await supabase.from('event_logs').insert({
          event_type: 'VOICE_COMMAND',
          raw_payload: { command: text, role: 'VOLUNTEER' },
          timestamp: new Date().toISOString()
        })
        setStatusText('Command Executed & Logged')
      } catch (err) {
        console.error('Failed to log voice command', err)
        setStatusText('Network Error on Execution')
      }
    }
  }

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      setStatusText('Standby for Command')
    } else {
      setTranscript('')
      recognitionRef.current?.start()
      setIsListening(true)
      setStatusText('Listening for "Command Code Alpha"...')
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${isListening ? 'bg-emerald-500 animate-pulse shadow-[0_0_15px_var(--color-density-green)]' : 'bg-slate-800'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 ${isListening ? 'text-white' : 'text-slate-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-100">Voice Node</h2>
          <p className={`text-sm mt-1 font-mono ${isListening ? 'text-emerald-500' : 'text-slate-400'}`}>
            {statusText}
          </p>
        </div>
        {transcript && (
          <div className="w-full bg-slate-950 p-3 rounded-lg border border-slate-800 text-left h-24 overflow-y-auto">
            <p className="text-xs font-mono text-slate-300 break-words">{transcript}</p>
          </div>
        )}
        <button 
          onClick={toggleListening}
          className={`w-full py-3 rounded-xl font-bold transition-colors ${isListening ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-emerald-600 text-white hover:bg-emerald-500'}`}
        >
          {isListening ? 'Stop Listening' : 'Activate Voice Comm'}
        </button>
      </div>
    </div>
  )
}

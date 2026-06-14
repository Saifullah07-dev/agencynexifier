import { useState, useRef, useEffect } from 'react'

// Generate a simple session ID
function generateSessionId() {
  return 'web_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

function getOrCreateSessionId() {
  let id = sessionStorage.getItem('reliefnow_session_id')
  if (!id) {
    id = generateSessionId()
    sessionStorage.setItem('reliefnow_session_id', id)
  }
  return id
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: "👋 Hi! Welcome to ReliefNow Chiropractic. I'm your AI care assistant. Are you experiencing any pain today? Select an option below to get started:", options: [
      { label: '💥 Back Pain', value: 'back' },
      { label: '🧣 Neck Pain', value: 'neck' },
      { label: '💆 Tension Headaches', value: 'headache' },
      { label: '🧍 Posture Issues', value: 'posture' },
    ]},
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen])

  // Initialize session on first open
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true)
      const sessionId = getOrCreateSessionId()
      // Send empty message to get welcome prompt from server
      fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: 'hi' }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessages([{
              role: 'bot',
              text: data.text || "Welcome to ReliefNow Chiropractic! How can I help you today?",
              options: data.options || undefined,
            }])
          }
        })
        .catch(() => {
          // Fallback if server is unavailable
        })
    }
  }, [isOpen, isInitialized])

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return

    const userMsg = { role: 'user', text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInputText('')
    setIsLoading(true)

    const sessionId = getOrCreateSessionId()

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, message: text.trim() }),
      })
      const data = await res.json()

      if (data.success) {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: data.text || 'Got it! Let me process that...',
          options: data.options || undefined,
        }])
      } else {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: 'Sorry, I had trouble processing that. Could you try again?',
        }])
      }
    } catch {
      setMessages((prev) => [...prev, {
        role: 'bot',
        text: 'Unable to connect. Please try booking via phone or WhatsApp.',
      }])
    }

    setIsLoading(false)
  }

  const handleOptionClick = (value, label) => {
    sendMessage(value)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputText)
    }
  }

  return (
    <>
      {/* Chat trigger button */}
      <button
        id="chat-widget-trigger"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 hover:scale-105 ${
          isOpen ? 'bg-teal-dark rotate-45' : 'bg-teal-light'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Chat with us'}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] sm:h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden chat-message-enter">
          {/* Header */}
          <div className="bg-teal-dark text-white px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 bg-teal-light rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">RN</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">ReliefNow Chiropractic</p>
              <p className="text-xs text-teal-light">Online • Reply in &lt; 5 min</p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-xs text-gray-300">Live</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className="chat-message-enter">
                {msg.role === 'bot' ? (
                  <div className="flex gap-2.5">
                    <div className="w-8 h-8 bg-teal-light rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white font-bold text-[10px]">RN</span>
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm max-w-[85%]">
                      <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{msg.text}</p>
                      {msg.options && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {msg.options.map((opt, oi) => (
                            <button
                              key={oi}
                              onClick={() => handleOptionClick(opt.value, opt.label)}
                              className="text-xs font-medium bg-teal-lighter text-teal-dark hover:bg-teal-light hover:text-white px-3.5 py-2 rounded-full border border-teal-light/20 transition-all"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <div className="bg-teal-dark text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-[80%] shadow-sm">
                      <p className="text-sm leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-2.5 chat-message-enter">
                <div className="w-8 h-8 bg-teal-light rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white font-bold text-[10px]">RN</span>
                </div>
                <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                    <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                    <span className="typing-dot w-2 h-2 bg-gray-400 rounded-full inline-block"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 px-4 py-3 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-light/40 focus:border-teal-light bg-gray-50 disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage(inputText)}
                disabled={!inputText.trim() || isLoading}
                className="bg-teal-light hover:bg-teal-mid text-white rounded-xl px-4 py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
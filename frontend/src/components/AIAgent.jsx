import React, { useState, useEffect, useRef } from 'react';
import Vapi from './Vapi';

function AIAgent() {
  const [messages, setMessages] = useState([]);
  const [showFeatures, setShowFeatures] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const conversationRef = useRef(null);

  // Auto-scroll to the bottom of conversation when new messages arrive
  useEffect(() => {
    if (conversationRef.current) {
      conversationRef.current.scrollTop = conversationRef.current.scrollHeight;
    }
  }, [messages]);

  // Toggle chat interface
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-600">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4 bg-red-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path>
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">BloodConnect AI Assistant</h1>
              <p className="text-gray-600">Your virtual guide for blood donation</p>
            </div>
          </div>
          
          <a href="/" className="inline-flex items-center px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Return to Dashboard
          </a>
        </div>
        
        {/* AI Assistant Information Section */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-red-500 to-red-700">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.587c-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                  </svg>
                </div>
              </div>
            </div>
            
            <div className="pt-16 px-6 pb-6 text-center">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">Your Lifesaving Assistant</h2>
              <p className="max-w-2xl mx-auto text-gray-600 mb-6">
                Our BloodConnect AI assistant is here to help answer your questions about blood donation, 
                donation eligibility, finding donation centers, scheduling appointments, and connecting donors with recipients.
              </p>
            </div>
          </div>
        </div>
        
        {/* Chat Interface */}
        {isChatOpen && (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="bg-red-600 text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  <h3 className="text-lg font-bold">Chat with BloodConnect Assistant</h3>
                </div>
                <button onClick={toggleChat} className="text-white hover:text-red-200">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <div 
                ref={conversationRef}
                className="mb-4 h-64 overflow-y-auto bg-gray-50 rounded-lg p-4"
              >
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-2 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Your conversation will appear here. Start chatting!</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className="mb-2">
                      <div className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                        <div 
                          className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md ${
                            msg.isUser 
                              ? 'bg-red-600 text-white' 
                              : 'bg-gray-200 text-gray-800'
                          }`}
                        >
                          {msg.text}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Vapi Component */}
      <Vapi onNewMessage={(msg) => {
        setMessages(prevMessages => [...prevMessages, msg]);
      }} />
      
      {/* Chat/Call Button */}
      <div className="fixed bottom-8 right-8">
        <button 
          onClick={toggleChat}
          className="bg-red-600 text-white rounded-full p-4 shadow-lg flex items-center justify-center hover:bg-red-700 transition-all transform hover:scale-105"
        >
          {isChatOpen ? (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Footer */}
      <div className="text-center text-gray-600 text-sm mt-8 mb-2">
        <p>BloodConnect AI Assistant v1.0 | Helping connect donors with recipients</p>
        <p className="mt-1">© 2025 BloodConnect. All rights reserved.</p>
      </div>
    </div>
  );
}

export default AIAgent;
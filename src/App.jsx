"use client"

import axios from "axios"
import { useState } from "react"

export default function App() {
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")

  // Handle file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files)
    const validFiles = files.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.type === "application/msword" ||
        file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

    const newFiles = validFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toLocaleString(),
    }))

    // Upload each valid file one by one
  for (const file of validFiles) {
    const formData = new FormData();
    formData.append("file", file);
    console.log(file)
    try {
      const resp = await axios.post("https://docchat-production-67c0.up.railway.app/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          withCredentials: true,
        },
      });

      console.log("Response from server:", resp.data);
      if (resp.data.success) {
        setUploadedFiles((prev) => [...prev, ...newFiles]);
        event.target.value = ""; // Reset input
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  }
    
  }

  // Remove uploaded file
  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  // Handle chat message send
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (inputMessage.trim()) {
      const newMessage = {
        id: Date.now(),
        text: inputMessage,
        sender: "user",
        timestamp: new Date().toLocaleString(),
      }
      setMessages((prev) => [...prev, newMessage])
      setInputMessage("")

     const data = await axios.post("https://docchat-production-67c0.up.railway.app/chat", {query:inputMessage}, 
        {headers:{
          "Content-Type": "application/json",
          withCredentials: true,
        }}

      )
      console.log(data)
      const msg= {
        id: Date.now() + 1,
        text: data.data.message,
        sender: "Rag",
        timestamp: new Date().toLocaleString(),
      }
      setMessages((prev)=>[ ...prev, msg ])
      // Simulate bot response
      // setTimeout(() => {
      //   const botMessage = {
      //     id: Date.now() + 1,
      //     text: `I received your message: "${inputMessage}". How can I help you with your uploaded files?`,
      //     sender: "bot",
      //     timestamp: new Date().toLocaleString(),
      //   }
      //   setMessages((prev) => [...prev, botMessage])
      // }, 1000)
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {" "}
      {/* Changed to a darker, more uniform background */}
      {/* Top Navigation Bar */}
      <div className="bg-black/20 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">DocuChat Pro</h1>
                <p className="text-sm text-slate-400">Professional Document Analysis Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">
                ● Online
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-screen">
        {/* Left Panel - Document Management */}
        <div className="w-2/5 bg-gray-900/50 backdrop-blur-xl border-r border-gray-700/50 flex flex-col">
          {" "}
          {/* Adjusted background and border */}
          {/* Panel Header */}
          <div className="px-6 py-2 border-b border-gray-800/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Document Library</h2>
                  <p className="text-sm text-slate-400">Manage your files</p>
                </div>
              </div>
              {/* Moved FILES text to match screenshot */}
              <div className="text-right">
                <div className="text-xs text-slate-400 uppercase tracking-wide">FILES</div>
              </div>
            </div>
          </div>
          {/* Upload Zone */}
          <div className="p-6 mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
              <div className="flex items-center justify-center relative border-2 border-dashed border-gray-700 rounded-3xl p-3 text-center hover:border-violet-400/50 transition-all duration-300 bg-gray-900/30 backdrop-blur-sm">
                {" "}
                {/* Adjusted border and background */}
                <div className="mb-3">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-r from-violet-500 to-purple-600 rounded-3xl flex items-center justify-center mb-4 shadow-2xl">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <span className="text-md font-semibold text-white mb-2 block">Drop files here</span>
                  <span className="text-sm text-slate-400 block mb-4">or click to browse</span>
                  <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-xl text-sm text-slate-300 border border-white/20">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    Choose Files
                  </div>
                  <p className="text-xs text-slate-500 mt-3">PDF, DOC, DOCX • Max 25MB</p>
                </label>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
          </div>
          {/* Files List */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {" "}
            {/* Removed max-h to allow flex-1 to manage scrolling */}
            {uploadedFiles.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-900/20 rounded-3xl flex items-center justify-center mb-6 border border-gray-800/50">
                  <svg className="w-12 h-12 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">No documents yet</h3>
                <p className="text-sm text-slate-400">Upload your first document to get started with AI analysis</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={file.id}
                    className="group relative bg-gray-200 rounded-2xl p-4 border border-gray-300 hover:bg-gray-300 transition-all duration-200" /* Changed to light gray background */
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        {file.type === "application/pdf" ? (
                          <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate text-sm">{file.name}</h4>{" "}
                        {/* Changed text color */}
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-xs text-gray-600">{formatFileSize(file.size)}</span>{" "}
                          {/* Changed text color */}
                          <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                          <span className="text-xs text-gray-600">{file.uploadedAt}</span> {/* Changed text color */}
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="flex-1 bg-gray-300 rounded-full h-1">
                            {" "}
                            {/* Changed progress bar background */}
                            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 h-1 rounded-full w-full"></div>
                          </div>
                          <span className="text-xs text-emerald-600 font-medium">Processed</span>{" "}
                          {/* Adjusted text color */}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - AI Chat */}
        <div className="flex-1 bg-gray-900/50 backdrop-blur-xl flex flex-col">
          {" "}
          {/* Adjusted background and border */}
          {/* Chat Header */}
          <div className="p-6 border-b border-gray-800/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-900"></div>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">AI Assistant</h2>
                  <p className="text-sm text-slate-400">Powered by advanced document analysis</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-medium border border-emerald-500/30">
                  Ready
                </div>
              </div>
            </div>
          </div>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Ready to analyze your documents</h3>
                <p className="text-slate-400 max-w-md mx-auto">
                  Upload documents and start asking questions. I can help you extract insights, summarize content, and
                  answer specific questions about your files.
                </p>
                <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-left">
                    <div className="text-sm font-medium text-white mb-1">Quick Analysis</div>
                    <div className="text-xs text-slate-400">Get instant summaries</div>
                  </div>
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-left">
                    <div className="text-sm font-medium text-white mb-1">Smart Search</div>
                    <div className="text-xs text-slate-400">Find specific information</div>
                  </div>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex items-start space-x-3 max-w-md ${message.sender === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                        message.sender === "user" ? "bg-gradient-to-r from-blue-500 to-cyan-500" : "bg-gray-200" // Changed AI avatar background to light gray
                      }`}
                    >
                      {message.sender === "user" ? (
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {" "}
                          {/* Changed AI avatar icon color */}
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                          />
                        </svg>
                      )}
                    </div>
                    <div
                      className={`px-4 py-3 rounded-2xl shadow-lg ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white"
                          : "bg-gray-200 text-gray-900 border border-gray-300" // Changed AI message bubble to light gray
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <p className={`text-xs mt-2 ${message.sender === "user" ? "text-blue-100" : "text-gray-600"}`}>
                        {" "}
                        {/* Adjusted AI message timestamp color */}
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Message Input */}
          <div className="p-6 border-t border-gray-800/50">
            <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask me anything about your documents..."
                  className="w-full bg-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-4 py-3 pr-12 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={!inputMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-2xl hover:from-violet-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg font-medium"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

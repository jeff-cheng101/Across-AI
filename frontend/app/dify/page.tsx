"use client"

import { useState } from "react"

export default function DifyPage() {
  const [iframeUrl] = useState("")

  return (
    <div className="h-[calc(100vh-73px)] w-full flex flex-col">
      {/* iframe Container */}
      <div className="flex-1 relative">
        {iframeUrl ? (
          <iframe
            src={iframeUrl}
            className="w-full h-full border-0"
            title="Dify Content"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-slate-400 text-lg mb-2">準備嵌入文件</div>
              <div className="text-slate-500 text-sm">iframe 區域已就緒，可以嵌入外部內容</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

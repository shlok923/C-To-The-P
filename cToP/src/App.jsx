import React, { useState, useRef } from "react";
import { Loader2 } from "lucide-react";

const App = () => {
  const [cCode, setCCode] = useState(`//Default Code
    
#include <stdio.h>
int main() {
   // printf() displays the string inside quotation
   printf("Hello, World!");
   return 0;
}
`);
  const [promelaCode, setPromelaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  const handleConvert = async () => {
    setLoading(true);
    setError("");
    setPromelaCode("");

    try {
      const response = await fetch("http://localhost:3000/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: cCode }),
      });

      if (!response.ok) {
        throw new Error("Failed to convert code");
      }

      const data = await response.json();
      const cleaned = data.promela
        .split("\n")
        .filter((line) => !line.trim().startsWith("```"))
        .join("\n");

      setPromelaCode(cleaned);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle tab key press to insert 4 spaces
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      
      const newValue = cCode.substring(0, start) + "    " + cCode.substring(end);
      setCCode(newValue);
      
      // Move cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 4;
      }, 0);
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-zinc-100 flex flex-col font-sans">
      {/* Header */}
      <div className="bg-zinc-800 py-4 shadow-md border-b border-zinc-700">
        <h1 className="text-2xl font-serif text-center text-zinc-100">
          C to Promela Converter
        </h1>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col p-6">
        {/* Input/Output Panels */}
        <div className="flex w-full h-4/5 max-w-7xl mx-auto border border-zinc-700 rounded shadow-lg overflow-hidden">
          {/* Left Panel - C Code Input */}
          <div className="w-1/2 flex flex-col bg-zinc-800 h-full">
            <div className="bg-zinc-700 px-4 py-2 border-b border-zinc-600">
              <h2 className="text-sm font-medium text-zinc-200">C Code</h2>
            </div>
            <textarea
              ref={textareaRef}
              className="w-full flex-1 p-4 bg-zinc-800 text-zinc-100 outline-none resize-none font-mono text-sm border-0"
              placeholder="Write your C code here..."
              value={cCode}
              onChange={(e) => setCCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              style={{ minHeight: "400px" }}
            />
          </div>

          {/* Right Panel - Promela Code Output */}
          <div className="w-1/2 flex flex-col border-l border-zinc-700 h-full">
            <div className="bg-zinc-700 px-4 py-2 border-b border-zinc-600">
              <h2 className="text-sm font-medium text-zinc-200">Promela Code</h2>
            </div>
            <div
              className="w-full flex-1 p-4 bg-zinc-800 text-emerald-400 font-mono text-sm overflow-y-auto"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", minHeight: "400px" }}
            >
              {promelaCode}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-center gap-6">
          <button
            className={`px-6 py-3 rounded border font-medium text-sm transition duration-200 flex items-center justify-center w-32 shadow-md ${
              loading
                ? "bg-zinc-700 text-zinc-500 border-zinc-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-zinc-100 border-blue-700"
            }`}
            onClick={handleConvert}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Converting
              </>
            ) : (
              "Convert"
            )}
          </button>
          <button
            className={`px-6 py-3 rounded border font-medium text-sm transition duration-200 w-32 shadow-md ${
              loading
                ? "bg-zinc-700 text-zinc-500 border-zinc-600 cursor-not-allowed"
                : "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border-zinc-600"
            }`}
            onClick={() => {
              setCCode("");
              setPromelaCode("");
            }}
            disabled={loading}
          >
            Clear
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-red-400 mt-4 text-center text-sm">{error}</p>
        )}
      </div>

      {/* Footer */}
      <div className="bg-zinc-800 py-2 border-t border-zinc-700">
        <p className="text-center text-zinc-400 text-xs">
          C to Promela Code Conversion Tool
        </p>
      </div>
    </div>
  );
};

export default App;
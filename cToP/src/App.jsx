import React, { useState } from "react";

const App = () => {
  const [cCode, setCCode] = useState("");
  const [promelaCode, setPromelaCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // setPromelaCode(data.promela);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-black text-white flex flex-col">
      {/* Title */}
      <h1 className="text-2xl font-semibold text-center py-4 text-gray-300">
        C to Promela Converter
      </h1>

      {/* Input/Output Panels */}
      <div className="flex flex-grow w-full max-w-7xl mx-auto border border-gray-700 rounded-lg overflow-hidden">
        {/* Left Panel - C Code Input */}
        <div className="w-1/2 flex flex-col p-3">
          <h2 className="text-sm font-medium text-gray-400">C Code</h2>
          <textarea
            className="w-full flex-1 p-3 mt-1 bg-gray-900 text-white border border-gray-700 rounded-md outline-none resize-none font-mono text-sm"
            placeholder="Write your C code here..."
            value={cCode}
            onChange={(e) => setCCode(e.target.value)}
          />
        </div>

        {/* Right Panel - Promela Code Output */}
        <div className="w-1/2 flex flex-col p-3 border-l border-gray-700">
          <h2 className="text-sm font-medium text-gray-400">Promela Code</h2>
          <div
            className="w-full flex-1 p-3 mt-1 bg-gray-900 text-green-400 border border-gray-700 rounded-md font-mono text-sm overflow-y-auto"
            style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {promelaCode}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-3 flex justify-center gap-4 py-5">
        <button
          className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md font-medium text-sm transition duration-200"
          onClick={handleConvert}
          disabled={loading}
        >
          {loading ? "Converting..." : "Convert"}
        </button>
        <button
          className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-md font-medium text-sm transition duration-200"
          onClick={() => {
            setCCode("");
            setPromelaCode("");
          }}
        >
          Clear
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-500 mt-3 text-center text-sm">{error}</p>
      )}
    </div>
  );
};

export default App;

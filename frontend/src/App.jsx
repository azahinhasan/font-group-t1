import "./App.css";
import { useState } from "react";
import FontManager from "./pages/font-manager/FontManager";
import FontGroupManager from "./pages/font-group-manage/FontGroupManager";

function App() {
  const [activeTab, setActiveTab] = useState("fonts");

  return (
    <div className="p-4">
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setActiveTab("fonts")}
          className={`px-4 py-2 rounded ${
            activeTab === "fonts" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Font Manager
        </button>
        <button
          onClick={() => setActiveTab("groups")}
          className={`px-4 py-2 rounded ${
            activeTab === "groups" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Font Group Manager
        </button>
      </div>
      <hr className="border-t border-white-300 my-4" />

      {activeTab === "fonts" ? <FontManager /> : <FontGroupManager />}
    </div>
  );
}

export default App;

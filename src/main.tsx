import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import "./styles/index.css";
import { communes } from "@/data/communes";
import { initializeSearchEngine } from "@/utils/communeSearch";

// Initialize search engine with communes data
initializeSearchEngine(communes);

createRoot(document.getElementById("root")!).render(<App />);
  
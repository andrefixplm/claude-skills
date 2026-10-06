import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { ExperiencePage } from "./ExperiencePage";

/** Deep linking (DOC 08): cada nível possui URL própria. */
export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ExperiencePage />} />
      <Route path="/solutions/:ecosystem" element={<ExperiencePage />} />
      <Route path="/solutions/:ecosystem/:domain" element={<ExperiencePage />} />
      <Route path="/solutions/:ecosystem/:domain/:product" element={<ExperiencePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

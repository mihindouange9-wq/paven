import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@fontsource-variable/manrope/wght.css";
import "@fontsource-variable/dm-sans/wght.css";
import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import Landing from "./pages/Landing";

const Shell = lazy(() => import("./app/Shell"));

const router = createBrowserRouter([
  { path: "/", element: <Landing /> },
  {
    path: "/app",
    element: (
      <Suspense fallback={<div className="app-loading" aria-live="polite">Chargement de l'espace PAVEN…</div>}>
        <Shell />
      </Suspense>
    ),
    children: [
      { index: true, lazy: () => import("./app/pages/Overview") },
      { path: "decouvrir", lazy: () => import("./app/pages/Discover") },
      { path: "compatibilites", lazy: () => import("./app/pages/Matches") },
      { path: "compatibilites/:id", lazy: () => import("./app/pages/MatchDetail") },
      { path: "entreprises", lazy: () => import("./app/pages/Companies") },
      { path: "entreprises/:id", lazy: () => import("./app/pages/CompanyProfile") },
      { path: "opportunites", lazy: () => import("./app/pages/Opportunities") },
      { path: "messages", lazy: () => import("./app/pages/Messages") },
      { path: "deal-rooms", lazy: () => import("./app/pages/DealRooms") },
      { path: "deal-rooms/:id", lazy: () => import("./app/pages/DealRoomDetail") },
      { path: "expansion", lazy: () => import("./app/pages/Expansion") },
      { path: "partenariats", lazy: () => import("./app/pages/Pipeline") },
      { path: "analytique", lazy: () => import("./app/pages/Analytics") },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);

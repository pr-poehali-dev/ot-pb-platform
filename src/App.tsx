
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import DictionaryDetail from "./pages/DictionaryDetail";
import Hierarchy from "./pages/Hierarchy";
import EntityLinks from "./pages/EntityLinks";
import EntityCard from "./pages/EntityCard";
import NotFound from "./pages/NotFound";
import { EntityStoreProvider } from "./context/EntityStoreContext";
import { DictionaryStoreProvider } from "./context/DictionaryStoreContext";
import { initAuditEventBridge } from "@/core";

// Единая точка подключения Audit Log к Event Bus для всей платформы.
initAuditEventBridge();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <EntityStoreProvider>
        <DictionaryStoreProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/directories" element={<DictionaryDetail />} />
              <Route path="/directories/:id" element={<DictionaryDetail />} />
              <Route path="/hierarchy" element={<Hierarchy />} />
              <Route path="/entity-links" element={<EntityLinks />} />
              <Route path="/entity/:id" element={<EntityCard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </DictionaryStoreProvider>
      </EntityStoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
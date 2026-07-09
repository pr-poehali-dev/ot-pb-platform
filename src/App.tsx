
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import DictionaryDetail from "./pages/DictionaryDetail";
import Hierarchy from "./pages/Hierarchy";
import EntityLinks from "./pages/EntityLinks";
import EntityCard from "./pages/EntityCard";
import PersonnelClearanceIndex from "./pages/personnel-clearance/PersonnelClearanceIndex";
import PersonnelClearanceWorkers from "./pages/personnel-clearance/PersonnelClearanceWorkers";
import PersonnelClearancePackages from "./pages/personnel-clearance/PersonnelClearancePackages";
import PersonnelClearanceRequirementMatrices from "./pages/personnel-clearance/PersonnelClearanceRequirementMatrices";
import PersonnelClearanceApprovalRoutes from "./pages/personnel-clearance/PersonnelClearanceApprovalRoutes";
import PersonnelClearanceDocumentVerification from "./pages/personnel-clearance/PersonnelClearanceDocumentVerification";
import PersonnelClearanceSecurityService from "./pages/personnel-clearance/PersonnelClearanceSecurityService";
import PersonnelClearanceHistory from "./pages/personnel-clearance/PersonnelClearanceHistory";
import PersonnelClearanceSettings from "./pages/personnel-clearance/PersonnelClearanceSettings";
import NotFound from "./pages/NotFound";
import { EntityStoreProvider } from "./context/EntityStoreContext";
import { DictionaryStoreProvider } from "./context/DictionaryStoreContext";
import { initAuditEventBridge, aiCore, businessRulesService } from "@/core";
import { registerAllDomainRules } from "@/core/business-rules/domain-rules";
import { registerDemoTranslations } from "@/i18n/registerDemoTranslations";
import { seedTranslationDictionary } from "@/i18n/dictionary-seed";

// Единая точка подключения Audit Log к Event Bus для всей платформы.
initAuditEventBridge();
// Единая точка инициализации AI Engine: регистрация встроенных провайдеров
// (API пока не подключены) + мост Event Bus → AI Action Log.
aiCore.initAICore();
// Единая точка инициализации Business Rules Engine: мост Event Bus → Rule Audit Log.
businessRulesService.initBusinessRulesEngine();
// Регистрация доменных библиотек правил (допуск техники и т.д.) в ruleRegistry.
registerAllDomainRules();
// Демонстрационные переводы для Language Engine (меню, кнопки, заголовки).
registerDemoTranslations();
// Базовый словарь Translation Management (~1000 терминов HSE-платформы).
seedTranslationDictionary();

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
              <Route path="/login" element={<Login />} />
              <Route path="/directories" element={<DictionaryDetail />} />
              <Route path="/directories/:id" element={<DictionaryDetail />} />
              <Route path="/hierarchy" element={<Hierarchy />} />
              <Route path="/entity-links" element={<EntityLinks />} />
              <Route path="/entity/:id" element={<EntityCard />} />
              <Route path="/personnel-clearance" element={<PersonnelClearanceIndex />} />
              <Route path="/personnel-clearance/workers" element={<PersonnelClearanceWorkers />} />
              <Route path="/personnel-clearance/clearance-packages" element={<PersonnelClearancePackages />} />
              <Route path="/personnel-clearance/requirement-matrices" element={<PersonnelClearanceRequirementMatrices />} />
              <Route path="/personnel-clearance/approval-routes" element={<PersonnelClearanceApprovalRoutes />} />
              <Route path="/personnel-clearance/document-verification" element={<PersonnelClearanceDocumentVerification />} />
              <Route path="/personnel-clearance/security-service" element={<PersonnelClearanceSecurityService />} />
              <Route path="/personnel-clearance/history" element={<PersonnelClearanceHistory />} />
              <Route path="/personnel-clearance/settings" element={<PersonnelClearanceSettings />} />
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
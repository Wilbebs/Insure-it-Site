import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomeAdvanced from "@/pages/home-advanced";
import About from "@/pages/about";
import AutoInsurance from "@/pages/auto-insurance";
import HomeInsurance from "@/pages/home-insurance";
import LifeInsurance from "@/pages/life-insurance";
import HealthInsurance from "@/pages/health-insurance";
import CommercialInsurance from "@/pages/commercial-insurance";
import PlansPage from "@/pages/plans";
import NotFound from "@/pages/not-found";
import ChatBot from "@/components/chatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeAdvanced} />
      <Route path="/about" component={About} />
      <Route path="/auto-insurance" component={AutoInsurance} />
      <Route path="/home-insurance" component={HomeInsurance} />
      <Route path="/life-insurance" component={LifeInsurance} />
      <Route path="/health-insurance" component={HealthInsurance} />
      <Route path="/commercial-insurance" component={CommercialInsurance} />
      <Route path="/plans" component={PlansPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatBot />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

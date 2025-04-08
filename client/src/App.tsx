import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "./pages/Home";
import VirtualAssistant from "./pages/VirtualAssistant";
import Assessment from "./pages/Assessment";
import Help from "./pages/Help";
import Navbar from './components/Navbar';
import React from 'react';

// Wrapper components for pages with Navbar
const VirtualAssistantPage = () => {
  const [, navigate] = useLocation();
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar onNewChat={() => navigate('/')} />
      <div className="flex-1 overflow-hidden">
        <VirtualAssistant />
      </div>
    </div>
  );
};

const AssessmentPage = () => {
  const [, navigate] = useLocation();
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar onNewChat={() => navigate('/')} />
      <div className="flex-1 overflow-hidden">
        <Assessment />
      </div>
    </div>
  );
};

const HelpPage = () => {
  const [, navigate] = useLocation();
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar onNewChat={() => navigate('/')} />
      <div className="flex-1 overflow-hidden">
        <Help />
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  const [, navigate] = useLocation();
  return (
    <div className="h-screen flex flex-col bg-black text-white">
      <Navbar onNewChat={() => navigate('/')} />
      <div className="flex-1 overflow-hidden">
        <NotFound />
      </div>
    </div>
  );
};

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat/:id" component={Home} />
      <Route path="/virtual-assistant" component={VirtualAssistantPage} />
      <Route path="/assessment" component={AssessmentPage} />
      <Route path="/help" component={HelpPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;

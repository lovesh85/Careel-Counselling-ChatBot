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

function Router() {
  const [, navigate] = useLocation();
  
  // Function to navigate to home page for a new chat
  const handleNewChat = () => {
    navigate('/');
  };
  
  return (
    <Switch>
      <Route path="/">
        {() => <Home />}
      </Route>
      <Route path="/chat/:id">
        {({params}) => <Home />}
      </Route>
      <Route path="/virtual-assistant">
        {() => (
          <div className="h-screen flex flex-col bg-black text-white">
            <Navbar onNewChat={handleNewChat} />
            <div className="flex-1 overflow-hidden">
              <VirtualAssistant />
            </div>
          </div>
        )}
      </Route>
      <Route path="/assessment">
        {() => (
          <div className="h-screen flex flex-col bg-black text-white">
            <Navbar onNewChat={handleNewChat} />
            <div className="flex-1 overflow-hidden">
              <Assessment />
            </div>
          </div>
        )}
      </Route>
      <Route path="/help">
        {() => (
          <div className="h-screen flex flex-col bg-black text-white">
            <Navbar onNewChat={handleNewChat} />
            <div className="flex-1 overflow-hidden">
              <Help />
            </div>
          </div>
        )}
      </Route>
      <Route>
        {() => (
          <div className="h-screen flex flex-col bg-black text-white">
            <Navbar onNewChat={handleNewChat} />
            <div className="flex-1 overflow-hidden">
              <NotFound />
            </div>
          </div>
        )}
      </Route>
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

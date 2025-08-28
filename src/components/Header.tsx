import { Activity, Navigation, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import smartAssistLogo from "@/assets/smart-assist-logo.jpg";

export const Header = () => {
  return (
    <header className="tech-panel p-6 mb-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img 
            src={smartAssistLogo} 
            alt="Smart Assist Logo" 
            className="w-12 h-12 rounded-lg"
          />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Smart Assist
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              AI-Powered Navigation System
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4 text-success" />
            <span>System Active</span>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Navigation className="w-4 h-4" />
            Calibrate
          </Button>
          <Button variant="default" size="sm" className="gap-2 bg-primary hover:bg-primary-dark">
            <Zap className="w-4 h-4" />
            Emergency Stop
          </Button>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
        <p className="text-sm text-foreground">
          <span className="font-medium text-primary">Real-time mapping</span> • 
          <span className="font-medium text-primary ml-2">Obstacle detection</span> • 
          <span className="font-medium text-primary ml-2">Voice-guided assistance</span>
        </p>
      </div>
    </header>
  );
};
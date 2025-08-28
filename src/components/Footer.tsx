import { Github, ExternalLink, Mail, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="tech-panel p-6 mt-8">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="text-center lg:text-left">
          <h4 className="text-lg font-semibold text-primary mb-2">Smart Assist Project</h4>
          <p className="text-sm text-muted-foreground max-w-md">
            Advanced AI-powered navigation system integrating STELLA-VSLAM for real-time mapping, 
            YOLOv8 for object detection, and intelligent voice assistance.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2">
            <Github className="w-4 h-4" />
            GitHub
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Code className="w-4 h-4" />
            Documentation
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Mail className="w-4 h-4" />
            Contact
          </Button>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-border flex flex-col lg:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>© 2024 Smart Assist Project</span>
          <span>•</span>
          <span>Built with React + STELLA-VSLAM + YOLOv8</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
            <span>System Online</span>
          </div>
          <span>•</span>
          <span>v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};
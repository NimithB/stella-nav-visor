import { Header } from "@/components/Header";
import { CameraFeed } from "@/components/CameraFeed";
import { SLAMVisualization } from "@/components/SLAMVisualization";
import { VoiceAssistant } from "@/components/VoiceAssistant";
import { SystemStatus } from "@/components/SystemStatus";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Header Section */}
        <Header />
        
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Camera Feed */}
            <CameraFeed />
            
            {/* Voice Assistant */}
            <VoiceAssistant />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            {/* STELLA-VSLAM 3D Mapping */}
            <SLAMVisualization />
            
            {/* System Status */}
            <SystemStatus />
          </div>
        </div>
        
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default Index;

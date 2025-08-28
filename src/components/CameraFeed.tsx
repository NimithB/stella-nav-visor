import { useState, useEffect, useRef } from "react";
import { Camera, Eye, EyeOff, Target, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DetectedObject {
  id: string;
  label: string;
  confidence: number;
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export const CameraFeed = () => {
  const [detectionEnabled, setDetectionEnabled] = useState(true);
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate object detection
  useEffect(() => {
    if (!detectionEnabled) return;

    const interval = setInterval(() => {
      const mockObjects: DetectedObject[] = [
        {
          id: "1",
          label: "Chair",
          confidence: 0.87,
          bbox: { x: 150, y: 200, width: 120, height: 80 }
        },
        {
          id: "2",
          label: "Table",
          confidence: 0.92,
          bbox: { x: 300, y: 180, width: 150, height: 100 }
        },
        {
          id: "3",
          label: "Person",
          confidence: 0.95,
          bbox: { x: 50, y: 100, width: 80, height: 160 }
        }
      ];
      setDetectedObjects(mockObjects);
    }, 2000);

    return () => clearInterval(interval);
  }, [detectionEnabled]);

  const drawBoundingBoxes = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!detectionEnabled) return;

    // Draw bounding boxes
    detectedObjects.forEach((obj) => {
      const { x, y, width, height } = obj.bbox;
      
      // Draw bounding box
      ctx.strokeStyle = '#4F9CF9';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      // Draw label background
      ctx.fillStyle = '#4F9CF9';
      ctx.fillRect(x, y - 25, width, 25);
      
      // Draw label text
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.fillText(`${obj.label} ${(obj.confidence * 100).toFixed(0)}%`, x + 5, y - 8);
    });
  };

  useEffect(() => {
    drawBoundingBoxes();
  }, [detectedObjects, detectionEnabled]);

  return (
    <div className="tech-panel p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Live Camera Feed</h3>
          <div className="status-indicator status-online"></div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="gap-1">
            <Target className="w-3 h-3" />
            {detectedObjects.length} Objects
          </Badge>
          <Button
            variant={detectionEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setDetectionEnabled(!detectionEnabled)}
            className="gap-2"
          >
            {detectionEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {detectionEnabled ? "Detection ON" : "Detection OFF"}
          </Button>
        </div>
      </div>
      
      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden glow-border">
        {/* Simulated camera feed */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Camera Feed Simulation</p>
            <p className="text-xs mt-1">Real camera integration required</p>
          </div>
        </div>
        
        {/* Overlay canvas for bounding boxes */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          width={640}
          height={360}
        />
        
        {/* Detection status overlay */}
        {detectionEnabled && (
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-xs font-medium">YOLOv8 Active</span>
            </div>
          </div>
        )}
        
        {/* Warning when detection is off */}
        {!detectionEnabled && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-2 bg-warning/20 backdrop-blur-sm px-3 py-1 rounded-full border border-warning/30">
              <AlertTriangle className="w-3 h-3 text-warning" />
              <span className="text-xs font-medium text-warning">Detection Disabled</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Detected objects list */}
      {detectionEnabled && detectedObjects.length > 0 && (
        <div className="mt-4 space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground">Detected Objects</h4>
          <div className="flex flex-wrap gap-2">
            {detectedObjects.map((obj) => (
              <Badge key={obj.id} variant="outline" className="text-xs">
                {obj.label} ({(obj.confidence * 100).toFixed(0)}%)
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
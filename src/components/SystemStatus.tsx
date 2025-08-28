import { useState, useEffect } from "react";
import { Battery, Cpu, HardDrive, Wifi, AlertTriangle, CheckCircle2, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface SystemMetrics {
  battery: number;
  cpu: number;
  memory: number;
  slamStatus: 'tracking' | 'lost' | 're-localizing';
  obstacleCount: number;
  networkStatus: 'connected' | 'disconnected' | 'weak';
}

export const SystemStatus = () => {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    battery: 87,
    cpu: 34,
    memory: 56,
    slamStatus: 'tracking',
    obstacleCount: 3,
    networkStatus: 'connected'
  });

  const [performanceData, setPerformanceData] = useState([
    { time: '10:00', cpu: 25, memory: 45 },
    { time: '10:01', cpu: 30, memory: 48 },
    { time: '10:02', cpu: 28, memory: 52 },
    { time: '10:03', cpu: 35, memory: 49 },
    { time: '10:04', cpu: 32, memory: 55 },
    { time: '10:05', cpu: 34, memory: 56 },
  ]);

  // Simulate real-time system updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        battery: Math.max(20, prev.battery - 0.1),
        cpu: Math.max(10, Math.min(90, prev.cpu + (Math.random() - 0.5) * 10)),
        memory: Math.max(20, Math.min(85, prev.memory + (Math.random() - 0.5) * 8)),
        obstacleCount: Math.floor(Math.random() * 6),
        slamStatus: ['tracking', 'tracking', 'tracking', 'lost', 're-localizing'][
          Math.floor(Math.random() * 5)
        ] as typeof prev.slamStatus,
        networkStatus: ['connected', 'connected', 'weak'][
          Math.floor(Math.random() * 3)
        ] as typeof prev.networkStatus
      }));

      // Update performance graph
      setPerformanceData(prev => {
        const newTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newData = [
          ...prev.slice(-5),
          {
            time: newTime,
            cpu: metrics.cpu,
            memory: metrics.memory
          }
        ];
        return newData;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [metrics.cpu, metrics.memory]);

  const getBatteryColor = (level: number) => {
    if (level > 60) return 'text-success';
    if (level > 30) return 'text-warning';
    return 'text-destructive';
  };

  const getBatteryVariant = (level: number): "default" | "secondary" | "destructive" => {
    if (level > 60) return 'default';
    if (level > 30) return 'secondary';
    return 'destructive';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'tracking':
      case 'connected':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'lost':
      case 'disconnected':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'tracking':
      case 'connected':
        return 'text-success';
      case 'lost':
      case 'disconnected':
        return 'text-destructive';
      default:
        return 'text-warning';
    }
  };

  return (
    <div className="tech-panel p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">System Status</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Real-time Monitoring
          </Badge>
        </div>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Battery */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Battery className={`w-4 h-4 ${getBatteryColor(metrics.battery)}`} />
              <span className="text-sm font-medium">Battery</span>
            </div>
            <Badge variant={getBatteryVariant(metrics.battery)} className="text-xs">
              {metrics.battery.toFixed(0)}%
            </Badge>
          </div>
          <Progress value={metrics.battery} className="h-2" />
        </div>

        {/* CPU Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">CPU</span>
            </div>
            <span className="text-xs text-muted-foreground">{metrics.cpu.toFixed(0)}%</span>
          </div>
          <Progress value={metrics.cpu} className="h-2" />
        </div>

        {/* Memory Usage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Memory</span>
            </div>
            <span className="text-xs text-muted-foreground">{metrics.memory.toFixed(0)}%</span>
          </div>
          <Progress value={metrics.memory} className="h-2" />
        </div>

        {/* Network Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Network</span>
            </div>
            {getStatusIcon(metrics.networkStatus)}
          </div>
          <div className={`text-xs capitalize font-medium ${getStatusColor(metrics.networkStatus)}`}>
            {metrics.networkStatus}
          </div>
        </div>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">STELLA-VSLAM</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(metrics.slamStatus)}
            <span className={`text-sm capitalize font-medium ${getStatusColor(metrics.slamStatus)}`}>
              {metrics.slamStatus}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Obstacles Detected</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {metrics.obstacleCount} Objects
            </Badge>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-muted-foreground">Performance Trends</h4>
        <div className="h-32 w-full bg-muted/10 rounded-lg p-2 glow-border">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="time" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="hsl(var(--primary-glow))" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span>CPU Usage</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-primary-glow rounded-full"></div>
            <span>Memory Usage</span>
          </div>
        </div>
      </div>
    </div>
  );
};
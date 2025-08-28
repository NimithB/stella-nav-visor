import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text, Sphere } from "@react-three/drei";
import { Map, RotateCw, Save, Upload, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import * as THREE from "three";

// Point cloud component
const PointCloud = ({ points }: { points: THREE.Vector3[] }) => {
  const meshRef = useRef<THREE.Points>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(points.length * 3);
  const colors = new Float32Array(points.length * 3);

  points.forEach((point, i) => {
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
    
    // Color points based on distance from origin
    const distance = point.distanceTo(new THREE.Vector3(0, 0, 0));
    colors[i * 3] = 0.3 + (distance * 0.1);     // R
    colors[i * 3 + 1] = 0.6 + (distance * 0.1); // G
    colors[i * 3 + 2] = 1.0;                     // B
  });

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial size={0.05} vertexColors sizeAttenuation />
    </points>
  );
};

// Current position marker
const CurrentPosition = ({ position }: { position: THREE.Vector3 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.05;
    }
  });

  return (
    <group position={position}>
      <Sphere ref={meshRef} args={[0.1]} position={[0, 0.1, 0]}>
        <meshStandardMaterial color="#4F9CF9" emissive="#4F9CF9" emissiveIntensity={0.3} />
      </Sphere>
      <Text
        position={[0, 0.3, 0]}
        fontSize={0.1}
        color="#4F9CF9"
        anchorX="center"
        anchorY="middle"
      >
        Current Position
      </Text>
    </group>
  );
};

// Keyframe markers
const Keyframes = ({ keyframes }: { keyframes: THREE.Vector3[] }) => {
  return (
    <group>
      {keyframes.map((pos, index) => (
        <Sphere key={index} args={[0.03]} position={pos}>
          <meshStandardMaterial color="#10B981" />
        </Sphere>
      ))}
    </group>
  );
};

export const SLAMVisualization = () => {
  const [trackingStatus, setTrackingStatus] = useState<'tracking' | 'lost' | 're-localizing'>('tracking');
  const [keyframeCount, setKeyframeCount] = useState(0);
  const [mapPoints, setMapPoints] = useState<THREE.Vector3[]>([]);
  const [currentPos, setCurrentPos] = useState(new THREE.Vector3(0, 0, 0));
  const [keyframes, setKeyframes] = useState<THREE.Vector3[]>([]);

  // Generate mock SLAM data
  useEffect(() => {
    const generateMockData = () => {
      // Generate random point cloud
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 500; i++) {
        points.push(new THREE.Vector3(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 3,
          (Math.random() - 0.5) * 10
        ));
      }
      setMapPoints(points);

      // Generate keyframes
      const kf: THREE.Vector3[] = [];
      for (let i = 0; i < 20; i++) {
        kf.push(new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          0,
          (Math.random() - 0.5) * 8
        ));
      }
      setKeyframes(kf);
      setKeyframeCount(kf.length);
    };

    generateMockData();

    // Simulate position updates
    const interval = setInterval(() => {
      setCurrentPos(prev => new THREE.Vector3(
        prev.x + (Math.random() - 0.5) * 0.1,
        0,
        prev.z + (Math.random() - 0.5) * 0.1
      ));

      // Randomly change tracking status
      const statuses: typeof trackingStatus[] = ['tracking', 'tracking', 'tracking', 'lost', 're-localizing'];
      setTrackingStatus(statuses[Math.floor(Math.random() * statuses.length)]);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (trackingStatus) {
      case 'tracking': return 'text-success';
      case 'lost': return 'text-destructive';
      case 're-localizing': return 'text-warning';
    }
  };

  const getStatusBadgeVariant = () => {
    switch (trackingStatus) {
      case 'tracking': return 'default';
      case 'lost': return 'destructive';
      case 're-localizing': return 'secondary';
    }
  };

  return (
    <div className="tech-panel p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">STELLA-VSLAM 3D Mapping</h3>
          <Badge variant={getStatusBadgeVariant()} className="capitalize">
            {trackingStatus}
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {keyframeCount} Keyframes
          </Badge>
          <Button variant="outline" size="sm" className="gap-1">
            <Save className="w-3 h-3" />
            Save Map
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Upload className="w-3 h-3" />
            Load Map
          </Button>
          <Button variant="outline" size="sm">
            <Maximize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="aspect-video bg-muted/20 rounded-lg overflow-hidden glow-border relative">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 60 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={0.8} />
          
          {/* Grid floor */}
          <gridHelper args={[20, 20, '#4F9CF9', '#374151']} position={[0, -1, 0]} />
          
          {/* Point cloud */}
          <PointCloud points={mapPoints} />
          
          {/* Current position */}
          <CurrentPosition position={currentPos} />
          
          {/* Keyframes */}
          <Keyframes keyframes={keyframes} />
          
          <OrbitControls enablePan enableZoom enableRotate />
        </Canvas>

        {/* Status overlay */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="bg-background/90 backdrop-blur-sm px-3 py-2 rounded-lg text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                trackingStatus === 'tracking' ? 'bg-success' :
                trackingStatus === 'lost' ? 'bg-destructive' : 'bg-warning'
              } animate-pulse`}></div>
              <span className={`font-medium capitalize ${getStatusColor()}`}>
                {trackingStatus}
              </span>
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              Position: ({currentPos.x.toFixed(2)}, {currentPos.z.toFixed(2)})
            </div>
          </div>
        </div>

        {/* Controls overlay */}
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur-sm px-2 py-1 rounded">
          <RotateCw className="w-3 h-3 inline mr-1" />
          Drag to rotate • Scroll to zoom
        </div>
      </div>

      {/* Map statistics */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{mapPoints.length}</div>
          <div className="text-xs text-muted-foreground">Map Points</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">{keyframeCount}</div>
          <div className="text-xs text-muted-foreground">Keyframes</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-primary">
            {Math.sqrt(currentPos.x ** 2 + currentPos.z ** 2).toFixed(1)}m
          </div>
          <div className="text-xs text-muted-foreground">Distance Traveled</div>
        </div>
      </div>
    </div>
  );
};
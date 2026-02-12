"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface WireframeDottedGlobeProps {
  className?: string;
  size?: number;
  dotColor?: string;
  dotSize?: number;
  rotationSpeed?: number;
  variant?: "default" | "dark" | "light";
}

export function WireframeDottedGlobe({
  className,
  size = 200,
  dotColor = "#ff5533",
  dotSize = 1.2,
  rotationSpeed = 0.003,
  variant = "default",
}: WireframeDottedGlobeProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number | undefined>(undefined);
  const rotationRef = React.useRef(0);

  // Color schemes based on variant
  const colors = {
    default: { dot: "30, 31, 38", marker: "255, 85, 51", dotOpacity: 0.15 },
    dark: { dot: "30, 31, 38", marker: "30, 31, 38", dotOpacity: 0.15 },
    light: { dot: "255, 255, 255", marker: "255, 255, 255", dotOpacity: 0.4 },
  };
  const colorScheme = colors[variant];

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size with device pixel ratio for crisp rendering
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    // Generate sphere points using fibonacci sphere algorithm
    const numPoints = 800;
    const points: [number, number, number][] = [];
    const phi = Math.PI * (3 - Math.sqrt(5)); // golden angle

    for (let i = 0; i < numPoints; i++) {
      const y = 1 - (i / (numPoints - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = phi * i;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      points.push([x, y, z]);
    }

    // Datacenter locations (lat, lon) converted to 3D
    const datacenters = [
      { lat: 40.7128, lon: -74.006, name: "US East" },
      { lat: 37.7749, lon: -122.4194, name: "US West" },
      { lat: 51.5074, lon: -0.1278, name: "EU West" },
      { lat: 50.1109, lon: 8.6821, name: "EU Central" },
      { lat: 35.6762, lon: 139.6503, name: "Asia" },
      { lat: 1.3521, lon: 103.8198, name: "Singapore" },
      { lat: -33.8688, lon: 151.2093, name: "Australia" },
      { lat: -23.5505, lon: -46.6333, name: "Brazil" },
    ];

    const datacenterPoints = datacenters.map((dc) => {
      const latRad = (dc.lat * Math.PI) / 180;
      const lonRad = (dc.lon * Math.PI) / 180;
      return {
        x: Math.cos(latRad) * Math.cos(lonRad),
        y: Math.sin(latRad),
        z: Math.cos(latRad) * Math.sin(lonRad),
        name: dc.name,
      };
    });

    const animate = () => {
      ctx.clearRect(0, 0, size, size);
      
      const centerX = size / 2;
      const centerY = size / 2;
      const radius = size * 0.4;
      
      rotationRef.current += rotationSpeed;
      const rotation = rotationRef.current;

      // Rotate and project points
      const projectedPoints: { x: number; y: number; z: number; isDatacenter?: boolean; name?: string }[] = [];

      // Regular sphere points
      points.forEach(([x, y, z]) => {
        // Rotate around Y axis
        const rotatedX = x * Math.cos(rotation) - z * Math.sin(rotation);
        const rotatedZ = x * Math.sin(rotation) + z * Math.cos(rotation);
        
        // Only show front-facing points
        if (rotatedZ > -0.2) {
          projectedPoints.push({
            x: centerX + rotatedX * radius,
            y: centerY - y * radius,
            z: rotatedZ,
          });
        }
      });

      // Datacenter points
      datacenterPoints.forEach((dc) => {
        const rotatedX = dc.x * Math.cos(rotation) - dc.z * Math.sin(rotation);
        const rotatedZ = dc.x * Math.sin(rotation) + dc.z * Math.cos(rotation);
        
        if (rotatedZ > -0.1) {
          projectedPoints.push({
            x: centerX + rotatedX * radius,
            y: centerY - dc.y * radius,
            z: rotatedZ,
            isDatacenter: true,
            name: dc.name,
          });
        }
      });

      // Sort by z for proper depth rendering
      projectedPoints.sort((a, b) => a.z - b.z);

      // Draw points
      projectedPoints.forEach((point) => {
        // Calculate opacity based on z position (front = more visible)
        const opacity = Math.max(0.1, Math.min(1, (point.z + 0.2) / 1.2));
        
        if (point.isDatacenter) {
          // Draw datacenter marker with pulse effect
          const pulseScale = 1 + Math.sin(Date.now() * 0.003) * 0.3;
          
          // Outer glow
          ctx.beginPath();
          ctx.arc(point.x, point.y, 6 * pulseScale, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorScheme.marker}, ${opacity * 0.3})`;
          ctx.fill();
          
          // Inner dot
          ctx.beginPath();
          ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorScheme.marker}, ${opacity})`;
          ctx.fill();
        } else {
          // Regular sphere dot
          ctx.beginPath();
          ctx.arc(point.x, point.y, dotSize * (0.5 + point.z * 0.5), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${colorScheme.dot}, ${opacity * colorScheme.dotOpacity})`;
          ctx.fill();
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size, dotColor, dotSize, rotationSpeed]);

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <canvas
        ref={canvasRef}
        className="opacity-90"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

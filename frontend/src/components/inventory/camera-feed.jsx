"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Maximize2, Minimize2, VideoOff, Video } from "lucide-react";

export default function CameraFeed() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const containerRef = useRef(null);

  // Fullscreen toggle handler
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch(err => console.error('Error entering fullscreen:', err));
    } else {
      document.exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch(err => console.error('Error exiting fullscreen:', err));
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const startCamera = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
        }

        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        
        if (!isMounted || !isCameraOn) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsLoading(false);
      } catch (error) {
        if (!isMounted) return;
        console.error("Camera error:", error);
        setHasError(true);
        setIsLoading(false);
        setIsCameraOn(false);
      }
    };

    if (isCameraOn) {
      startCamera();
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    }

    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, [isCameraOn]);

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col space-y-1.5">
          <CardTitle className="text-lg flex items-center">
            <Camera className="mr-2 h-5 w-5" />
            Real-Time Camera Feed
          </CardTitle>
          <CardDescription>AI-powered inventory monitoring</CardDescription>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCameraOn((prev) => !prev)}
          >
            {isCameraOn ? (
              <VideoOff className="h-4 w-4 text-red-500" />
            ) : (
              <Video className="h-4 w-4 text-green-500" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div 
          ref={containerRef}
          className="relative aspect-video bg-muted rounded-md overflow-hidden"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
            </div>
          )}
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-red-500">
              Camera access required. Please check permissions.
            </div>
          )}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm font-medium">Items Detected</div>
            <div className="text-2xl font-bold">24</div>
          </div>
          <div className="bg-muted/50 p-3 rounded-md">
            <div className="text-sm font-medium">Low Stock Items</div>
            <div className="text-2xl font-bold text-amber-500">6</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 
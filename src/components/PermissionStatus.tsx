import React, { useState, useEffect } from 'react';
import { Camera, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface PermissionStatusProps {
  onPermissionGranted: () => void;
}

export const PermissionStatus: React.FC<PermissionStatusProps> = ({ onPermissionGranted }) => {
  const [permissionState, setPermissionState] = useState<'pending' | 'granted' | 'denied' | 'checking'>('checking');

  useEffect(() => {
    checkCameraPermission();
  }, []);

  const checkCameraPermission = async () => {
    try {
      const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
      setPermissionState(result.state as 'granted' | 'denied');
      
      if (result.state === 'granted') {
        onPermissionGranted();
      }

      result.onchange = () => {
        setPermissionState(result.state as 'granted' | 'denied');
        if (result.state === 'granted') {
          onPermissionGranted();
        }
      };
    } catch (error) {
      // Fallback: try to access camera directly
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setPermissionState('granted');
        onPermissionGranted();
      } catch (e) {
        setPermissionState('denied');
      }
    }
  };

  const requestPermission = async () => {
    setPermissionState('pending');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      onPermissionGranted();
    } catch (error) {
      setPermissionState('denied');
    }
  };

  const getStatusIcon = () => {
    switch (permissionState) {
      case 'granted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'denied':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-amber-500 animate-pulse" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    switch (permissionState) {
      case 'granted':
        return 'Camera access granted ✓';
      case 'denied':
        return 'Camera access denied. Please enable camera permissions.';
      case 'pending':
        return 'Requesting camera access...';
      case 'checking':
        return 'Checking camera permissions...';
      default:
        return 'Camera status unknown';
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-3 mb-3">
        {getStatusIcon()}
        <span className="text-sm font-medium text-gray-700">
          {getStatusText()}
        </span>
      </div>

      {permissionState === 'denied' && (
        <button
          onClick={requestPermission}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
        >
          <Camera className="w-4 h-4" />
          Request Camera Access
        </button>
      )}
    </div>
  );
};
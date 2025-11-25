// 
import React, { useRef, useState, useEffect } from 'react';
import { Camera as CameraIcon, Loader, Video } from 'lucide-react';
import axios from 'axios';
import { API_ENDPOINTS, CONFIDENCE_THRESHOLD } from '../config';

function Camera({ onItemScanned }) {
  const videoRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  
  // Device management states
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');
  const [showDeviceList, setShowDeviceList] = useState(false);

  // Get available camera devices
  const getDevices = async () => {
    try {
      const deviceList = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = deviceList.filter(device => device.kind === 'videoinput');
      
      console.log('Available cameras:', videoDevices);
      setDevices(videoDevices);
      
      // Auto-select external camera if found
      const externalCam = videoDevices.find(d => 
        d.label.toLowerCase().includes('usb') ||
        d.label.toLowerCase().includes('external') ||
        d.label.toLowerCase().includes('webcam')
      );
      
      if (externalCam) {
        setSelectedDevice(externalCam.deviceId);
        console.log('External camera detected:', externalCam.label);
      } else if (videoDevices.length > 0) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
      
      return videoDevices;
    } catch (error) {
      console.error('Error getting devices:', error);
      return [];
    }
  };

  // Simple start camera function
  const startCamera = async () => {
    try {
      console.log('Starting camera...');
      
      // Get devices first if not already loaded
      if (devices.length === 0) {
        await getDevices();
      }
      
      // Stop any existing stream
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      
      // Build constraints
      const constraints = selectedDevice 
        ? { video: { deviceId: { exact: selectedDevice } }, audio: false }
        : { video: true, audio: false };
      
      console.log('Using constraints:', constraints);
      
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Got stream:', stream);
      
      // Assign stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
        
        // Log which camera is being used
        const videoTrack = stream.getVideoTracks()[0];
        console.log('Using camera:', videoTrack.label);
      }
      
    } catch (error) {
      console.error('Camera error:', error);
      
      if (error.name === 'NotAllowedError') {
        alert('Please allow camera access and try again.');
      } else if (error.name === 'NotFoundError') {
        alert('No camera found. Please connect a webcam.');
      } else if (error.name === 'OverconstrainedError') {
        alert('Selected camera not available. Trying default camera...');
        setSelectedDevice('');
        setTimeout(startCamera, 500);
      } else {
        alert('Camera error: ' + error.message);
      }
    }
  };

  // Change camera device
  const changeCamera = (deviceId) => {
    console.log('Switching to camera:', deviceId);
    setSelectedDevice(deviceId);
    setShowDeviceList(false);
    
    // If camera is already active, restart with new device
    if (cameraActive) {
      stopCamera();
      setTimeout(() => {
        startCamera();
      }, 500);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
      console.log('Camera stopped');
    }
  };

  // Scan item
  const scanItem = async () => {
    if (!videoRef.current) {
      alert('Camera not ready!');
      return;
    }
    
    setScanning(true);
    console.log('Scanning...');
    
    try {
      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Convert to base64
      const imageData = canvas.toDataURL('image/jpeg');
      
      console.log('Sending to backend...');
      
      // Send to backend
      const response = await axios.post('http://localhost:5000/api/predict', {
        image: imageData
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        const result = response.data;
        
        if (result.confidence >= CONFIDENCE_THRESHOLD) {
          setLastResult(result);
          
          if (onItemScanned && result.product) {
            onItemScanned({
              name: result.prediction,
              price: result.product.price,
              confidence: result.confidence,
              product: result.product
            });
          }
        } else {
          alert(`Low confidence: ${(result.confidence * 100).toFixed(1)}%`);
        }
      }
    } catch (error) {
      console.error('Scan error:', error);
      alert('Error: ' + error.message);
    } finally {
      setScanning(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    // Get available devices when component mounts
    getDevices();
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="camera-container">
      <div className="camera-header">
        <h2>📹 Scan Your Produce</h2>
        
        {/* Camera Selector Button - Only show if multiple cameras */}
        {devices.length > 1 && (
          <button 
            className="btn-camera-select"
            onClick={() => setShowDeviceList(!showDeviceList)}
          >
            <Video size={18} />
            <span className="selected-camera-name">
              {devices.find(d => d.deviceId === selectedDevice)?.label.substring(0, 30) || 'Select Camera'}
            </span>
          </button>
        )}
      </div>

      {/* Available Devices Dropdown */}
      {showDeviceList && devices.length > 1 && (
        <div className="available-devices">
          <h4>📹 Available Cameras ({devices.length})</h4>
          <div className="device-list">
            {devices.map((device, index) => (
              <button
                key={device.deviceId}
                className={`device-item ${device.deviceId === selectedDevice ? 'selected' : ''}`}
                onClick={() => changeCamera(device.deviceId)}
              >
                <Video size={16} />
                <span className="device-label">
                  {device.label || `Camera ${index + 1}`}
                </span>
                {device.deviceId === selectedDevice && (
                  <span className="check-icon">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="camera-viewport">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video"
        />
        {!cameraActive && (
          <div className="camera-placeholder">
            <CameraIcon size={80} />
            <p>Camera Inactive</p>
          </div>
        )}
      </div>

      <div className="camera-controls">
        {!cameraActive ? (
          <button 
            onClick={startCamera} 
            className="btn btn-primary btn-large"
          >
            <CameraIcon size={20} />
            Start Camera
          </button>
        ) : (
          <>
            <button 
              onClick={scanItem} 
              disabled={scanning}
              className="btn btn-success btn-large"
            >
              {scanning ? (
                <>
                  <Loader className="spinning" size={20} />
                  Scanning...
                </>
              ) : (
                'Scan Item'
              )}
            </button>
            <button 
              onClick={stopCamera}
              className="btn btn-danger"
            >
              Stop
            </button>
          </>
        )}
      </div>

      {lastResult && (
        <div className="scan-result">
          <div className="result-content">
            <span className="result-emoji">{lastResult.product?.image}</span>
            <div className="result-details">
              <strong>{lastResult.product?.name}</strong>
              <span>${lastResult.product?.price}</span>
              <small>{(lastResult.confidence * 100).toFixed(1)}% confident</small>
            </div>
          </div>
        </div>
      )}
      
      {/* Show current camera info when active */}
      {cameraActive && devices.length > 0 && (
        <div className="current-camera-info">
          <small>
            ✅ Using: {devices.find(d => d.deviceId === selectedDevice)?.label || 'Default Camera'}
          </small>
        </div>
      )}
    </div>
  );
}

export default Camera;
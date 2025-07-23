import React, { useRef, useEffect, useState } from "react";
import { Camera, Download, Share2, RefreshCw } from "lucide-react";

interface CameraCaptureProps {
	onCapture: (imageData: string) => void;
	capturedImage: string | null;
	onRetake: () => void;
	selectedMovie: string;
	overlayImage?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
	onCapture,
	capturedImage,
	onRetake,
	selectedMovie,
	overlayImage,
}) => {
	const videoRef = useRef<HTMLVideoElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
	const [stream, setStream] = useState<MediaStream | null>(null);
	const [isCapturing, setIsCapturing] = useState(false);
	const [overlayImgElement, setOverlayImgElement] =
		useState<HTMLImageElement | null>(null);

	useEffect(() => {
		if (!capturedImage) {
			startCamera();
		}

		return () => {
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
			}
		};
	}, [capturedImage]);

	// Load overlay image when component mounts or selectedMovie/overlayImage changes
	useEffect(() => {
		if (!overlayImage) {
			setOverlayImgElement(null);
			return;
		}
		const img = new Image();
		img.crossOrigin = "anonymous";
		img.onload = () => {
			setOverlayImgElement(img);
		};
		img.onerror = () => {
			console.error("Failed to load overlay image");
			setOverlayImgElement(null);
		};
		img.src = overlayImage;
	}, [selectedMovie, overlayImage]);
	const startCamera = async () => {
		try {
			const mediaStream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
			});
			setStream(mediaStream);
			if (videoRef.current) {
				videoRef.current.srcObject = mediaStream;
			}
		} catch (error) {
			console.error("Error accessing camera:", error);
		}
	};

	// Create composite image with overlay applied
	const createCompositeImage = (): string | null => {
		if (!overlayCanvasRef.current || !overlayImgElement) return null;

		const canvas = overlayCanvasRef.current;
		const context = canvas.getContext("2d");
		if (!context) return null;

		// Set canvas to 9:16 aspect ratio (e.g., 720x1280)
		const width = 720;
		const height = 1280;
		canvas.width = width;
		canvas.height = height;

		// Fill with white background
		context.fillStyle = "#ffffff";
		context.fillRect(0, 0, width, height);

		if (capturedImage) {
			// Draw the captured selfie
			const img = new Image();
			img.onload = () => {
				// Calculate dimensions to fit the selfie in the upper portion
				const selfieHeight = height * 0.7; // Use 70% of canvas height for selfie
				const selfieWidth = (img.width / img.height) * selfieHeight;
				const selfieX = (width - selfieWidth) / 2;
				const selfieY = 0;

				context.drawImage(img, selfieX, selfieY, selfieWidth, selfieHeight);

				// Draw overlay image in the bottom portion
				const overlayHeight = height * 0.3; // Use 30% of canvas height for overlay
				const overlayWidth =
					(overlayImgElement.width / overlayImgElement.height) * overlayHeight;
				const overlayX = (width - overlayWidth) / 2;
				const overlayY = height - overlayHeight;

				context.drawImage(
					overlayImgElement,
					overlayX,
					overlayY,
					overlayWidth,
					overlayHeight
				);
			};
			img.src = capturedImage;
		}

		return canvas.toDataURL("image/png");
	};
	const capturePhoto = () => {
		if (!videoRef.current || !canvasRef.current) return;

		setIsCapturing(true);
		const canvas = canvasRef.current;
		const context = canvas.getContext("2d");
		const video = videoRef.current;

		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		if (context) {
			// Flip the image horizontally for selfie effect
			context.scale(-1, 1);
			context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
			context.scale(-1, 1);

			const imageData = canvas.toDataURL("image/png");
			onCapture(imageData);

			// Stop camera stream
			if (stream) {
				stream.getTracks().forEach((track) => track.stop());
				setStream(null);
			}
		}

		setTimeout(() => setIsCapturing(false), 300);
	};

	const handleRetake = () => {
		onRetake();
		startCamera();
	};

	// Expose composite image creation function
	// (Removed useImperativeHandle as it's not needed for this component)
	return (
		<div className="relative">
			<div className="bg-gray-900 rounded-2xl overflow-hidden aspect-[3/4] w-full max-w-sm mx-auto relative">
				{capturedImage ? (
					<div className="relative w-full h-full">
						<img
							src={capturedImage}
							alt="Captured selfie"
							className="w-full h-full object-cover"
						/>
						{/* Overlay the movie title image */}
						{overlayImgElement && (
							<div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
								<img
									src={overlayImgElement.src}
									alt={selectedMovie}
									className="max-w-[80%] h-auto opacity-90"
								/>
							</div>
						)}
					</div>
				) : (
					<div className="relative w-full h-full">
						<video
							ref={videoRef}
							autoPlay
							playsInline
							muted
							className="w-full h-full object-cover scale-x-[-1]"
						/>
						{/* Show overlay preview during camera view */}
						{overlayImgElement && (
							<div className="absolute bottom-0 left-0 right-0 flex justify-center pb-4">
								<img
									src={overlayImgElement.src}
									alt={selectedMovie}
									className="max-w-[80%] h-auto opacity-70"
								/>
							</div>
						)}
					</div>
				)}

				{/* Capture/Retake Button */}
				<div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
					{capturedImage ? (
						<button
							onClick={handleRetake}
							className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white transition-all hover:scale-105">
							<RefreshCw className="w-6 h-6 text-gray-800" />
						</button>
					) : (
						<button
							onClick={capturePhoto}
							disabled={isCapturing}
							className={`bg-white rounded-full p-4 shadow-lg transition-all ${
								isCapturing
									? "scale-95 bg-gray-200"
									: "hover:scale-105 hover:shadow-xl"
							}`}>
							<Camera
								className={`w-8 h-8 text-gray-800 ${
									isCapturing ? "animate-pulse" : ""
								}`}
							/>
						</button>
					)}
				</div>
			</div>

			<canvas ref={canvasRef} className="hidden" />
			<canvas ref={overlayCanvasRef} className="hidden" />
		</div>
	);
};

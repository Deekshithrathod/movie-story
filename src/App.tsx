import React, { useState } from "react";
import { movieOverlays } from "./overlays";
import { CameraCapture } from "./components/CameraCapture";
import { ShareButtons } from "./components/ShareButtons";
import { PermissionStatus } from "./components/PermissionStatus";
import { MovieSelector } from "./components/MovieSelector";

function App() {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);
	const [selectedMovie, setSelectedMovie] = useState("TheMatrix");
	const [permissionGranted, setPermissionGranted] = useState(false);

	// Get overlay image path for selected movie
	const overlayImage = movieOverlays[selectedMovie];

	const handleCapture = (imageData: string) => {
		setCapturedImage(imageData);
	};

	const handleRetake = () => {
		setCapturedImage(null);
	};

	const handlePermissionGranted = () => {
		setPermissionGranted(true);
	};

	const handleGetCompositeImage = () => {
		// This will be handled by the ShareButtons component
		return null;
	};
	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
			{/* macOS-style header */}
			<div className="bg-white border-b border-gray-200 px-6 py-4">
				<div className="flex items-center gap-2">
					<div className="w-3 h-3 rounded-full bg-red-500"></div>
					<div className="w-3 h-3 rounded-full bg-amber-500"></div>
					<div className="w-3 h-3 rounded-full bg-green-500"></div>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8">
				<div className="max-w-6xl mx-auto">
					<div className="text-center mb-8">
						<h1 className="text-4xl font-bold text-gray-800 mb-2">
							Movie Selfie Studio
						</h1>
						<p className="text-gray-600">
							Capture your selfie with your favorite movie title overlay
						</p>
					</div>

					{/* Permission Status - Mobile Top Position */}
					<div className="lg:hidden mb-6">
						<PermissionStatus onPermissionGranted={handlePermissionGranted} />
					</div>

					<div className="grid lg:grid-cols-2 gap-8 items-start">
						{/* Left side - Camera and capture */}
						<div className="space-y-6">
							<CameraCapture
								key={selectedMovie}
								onCapture={handleCapture}
								capturedImage={capturedImage}
								onRetake={handleRetake}
								selectedMovie={selectedMovie}
								overlayImage={overlayImage}
							/>
						</div>

						{/* Right side - Controls and sharing */}
						<div className="space-y-6">
							{/* Permission Status - Desktop Position */}
							<div className="hidden lg:block">
								<PermissionStatus
									onPermissionGranted={handlePermissionGranted}
								/>
							</div>

							<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
								<h3 className="text-lg font-semibold text-gray-800 mb-4">
									Select Movie Title
								</h3>
								<MovieSelector
									selectedMovie={selectedMovie}
									onMovieChange={setSelectedMovie}
								/>
							</div>

							{capturedImage && (
								<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
									<ShareButtons
										imageData={capturedImage}
										onGetCompositeImage={handleGetCompositeImage}
										selectedMovie={selectedMovie}
										overlayImage={overlayImage}
									/>
								</div>
							)}

							{!capturedImage && permissionGranted && (
								<div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
									<h3 className="text-lg font-semibold mb-2">
										Ready to Capture!
									</h3>
									<p className="text-blue-100">
										Position yourself in the camera view and click the capture
										button to take your movie selfie.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;

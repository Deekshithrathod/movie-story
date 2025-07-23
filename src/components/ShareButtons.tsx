import React from "react";
import { Download, Share2, MessageCircle } from "lucide-react";

interface ShareButtonsProps {
	imageData: string | null;
	onGetCompositeImage: () => string | null;
	selectedMovie: string;
	overlayImage?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({
	imageData,
	onGetCompositeImage,
	selectedMovie,
	overlayImage,
}) => {
	// Create composite image with overlay for download/sharing
	const createCompositeImageForSharing = async (): Promise<string | null> => {
		if (!imageData) return null;

		return new Promise((resolve) => {
			const canvas = document.createElement("canvas");
			const context = canvas.getContext("2d");
			if (!context) {
				resolve(null);
				return;
			}

			// Set canvas to 9:16 aspect ratio
			const width = 720;
			const height = 1280;
			canvas.width = width;
			canvas.height = height;

			// Fill with white background
			context.fillStyle = "#ffffff";
			context.fillRect(0, 0, width, height);

			const selfieImg = new Image();
			selfieImg.onload = () => {
				// Draw the selfie in the upper 70% of the canvas
				const selfieHeight = height * 0.7;
				const selfieWidth = (selfieImg.width / selfieImg.height) * selfieHeight;
				const selfieX = (width - selfieWidth) / 2;
				const selfieY = 0;

				context.drawImage(
					selfieImg,
					selfieX,
					selfieY,
					selfieWidth,
					selfieHeight
				);

				// Load and draw overlay image
				if (overlayImage) {
					const overlayImg = new Image();
					overlayImg.crossOrigin = "anonymous";
					overlayImg.onload = () => {
						// Draw overlay in the bottom 30% of the canvas
						const overlayHeight = height * 0.3;
						const overlayWidth =
							(overlayImg.width / overlayImg.height) * overlayHeight;
						const overlayX = (width - overlayWidth) / 2;
						const overlayY = height - overlayHeight;

						context.drawImage(
							overlayImg,
							overlayX,
							overlayY,
							overlayWidth,
							overlayHeight
						);

						// Return the composite image
						resolve(canvas.toDataURL("image/png"));
					};
					overlayImg.onerror = () => {
						// If overlay fails to load, just return the selfie
						resolve(canvas.toDataURL("image/png"));
					};
					overlayImg.src = overlayImage;
				} else {
					// No overlay image, just return the selfie
					resolve(canvas.toDataURL("image/png"));
				}
			};
			selfieImg.src = imageData;
		});
	};
	const downloadImage = async () => {
		if (!imageData) return;

		// Get the composite image with overlay
		const compositeImage = await createCompositeImageForSharing();
		if (!compositeImage) return;

		const link = document.createElement("a");
		link.download = `${selectedMovie
			.toLowerCase()
			.replace(/\s+/g, "-")}-selfie.png`;
		link.href = compositeImage;
		link.click();
	};

	const shareToWhatsApp = async () => {
		if (!imageData) return;

		// Get the composite image with overlay
		const compositeImage = await createCompositeImageForSharing();
		if (!compositeImage) {
			fallbackWhatsAppShare();
			return;
		}

		// Convert composite image to blob and create a shareable file
		fetch(compositeImage)
			.then((response) => response.blob())
			.then((blob) => {
				const fileName = `${selectedMovie
					.toLowerCase()
					.replace(/\s+/g, "-")}-selfie.png`;
				const file = new File([blob], fileName, { type: "image/png" });

				// Check if Web Share API is available and supports files
				if (
					navigator.share &&
					navigator.canShare &&
					navigator.canShare({ files: [file] })
				) {
					navigator
						.share({
							title: `My ${selectedMovie} Selfie`,
							text: `Check out my ${selectedMovie} selfie! 🎬📸`,
							files: [file],
						})
						.catch((error) => {
							console.error("Error sharing:", error);
							// Fallback to text-only WhatsApp sharing
							fallbackWhatsAppShare();
						});
				} else {
					// Fallback: download image and open WhatsApp with text
					downloadAndShareToWhatsApp(file);
				}
			})
			.catch((error) => {
				console.error("Error processing image:", error);
				fallbackWhatsAppShare();
			});
	};

	const fallbackWhatsAppShare = () => {
		const text = `Check out my ${selectedMovie} selfie! 🎬📸`;
		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
		window.open(whatsappUrl, "_blank");
	};

	const downloadAndShareToWhatsApp = (file: File) => {
		// Create a temporary download link
		const url = URL.createObjectURL(file);
		const link = document.createElement("a");
		link.href = url;
		link.download = file.name;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);

		// Open WhatsApp with message
		setTimeout(() => {
			const text = `Check out my ${selectedMovie} selfie! 🎬📸 (Image downloaded to your device)`;
			const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
			window.open(whatsappUrl, "_blank");
		}, 500);
	};

	const shareToTwitter = () => {
		if (!imageData) return;

		const text = `Just created my ${selectedMovie} selfie! 🎬📸 #MovieSelfie #${selectedMovie.replace(
			/\s+/g,
			""
		)} #Cinema`;
		const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
			text
		)}`;
		window.open(twitterUrl, "_blank");
	};

	const nativeShare = async () => {
		if (!imageData || !navigator.share) {
			return;
		}

		try {
			// Get the composite image with overlay
			const compositeImage = await createCompositeImageForSharing();
			if (!compositeImage) return;

			// Convert composite image to blob
			const response = await fetch(compositeImage);
			const blob = await response.blob();
			const fileName = `${selectedMovie
				.toLowerCase()
				.replace(/\s+/g, "-")}-selfie.png`;
			const file = new File([blob], fileName, { type: "image/png" });

			await navigator.share({
				title: `My ${selectedMovie} Selfie`,
				text: `Check out my ${selectedMovie} selfie! 🎬📸`,
				files: [file],
			});
		} catch (error) {
			console.error("Error sharing:", error);
		}
	};

	if (!imageData) return null;

	return (
		<div className="flex flex-col gap-3">
			<h3 className="text-lg font-semibold text-gray-800 mb-2">
				Share Your {selectedMovie} Selfie
			</h3>

			<button
				onClick={downloadImage}
				className="flex items-center gap-3 bg-green-500 text-white px-4 py-3 rounded-xl hover:bg-green-600 transition-all hover:scale-105 shadow-lg">
				<Download className="w-5 h-5" />
				<span className="font-medium">Download Image</span>
			</button>

			<button
				onClick={shareToWhatsApp}
				className="flex items-center gap-3 bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition-all hover:scale-105 shadow-lg">
				<MessageCircle className="w-5 h-5" />
				<span className="font-medium">Share on WhatsApp</span>
			</button>

			<button
				onClick={shareToTwitter}
				className="flex items-center gap-3 bg-blue-500 text-white px-4 py-3 rounded-xl hover:bg-blue-600 transition-all hover:scale-105 shadow-lg">
				<Share2 className="w-5 h-5" />
				<span className="font-medium">Share on Twitter</span>
			</button>

			{typeof navigator.share === "function" && (
				<button
					onClick={nativeShare}
					className="flex items-center gap-3 bg-gray-800 text-white px-4 py-3 rounded-xl hover:bg-gray-900 transition-all hover:scale-105 shadow-lg">
					<Share2 className="w-5 h-5" />
					<span className="font-medium">Share</span>
				</button>
			)}
		</div>
	);
};

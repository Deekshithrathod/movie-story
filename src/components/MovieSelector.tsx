import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface MovieSelectorProps {
	selectedMovie: string;
	onMovieChange: (movie: string) => void;
}

const movieOptions = ["Salaar", "StarWars", "TheMatrix"];

export const MovieSelector: React.FC<MovieSelectorProps> = ({
	selectedMovie,
	onMovieChange,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="relative">
			<button
				onClick={() => setIsOpen(!isOpen)}
				className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-left flex items-center justify-between hover:border-gray-400 transition-colors shadow-sm">
				<span className="font-medium text-gray-700">{selectedMovie}</span>
				<ChevronDown
					className={`w-5 h-5 text-gray-500 transition-transform ${
						isOpen ? "rotate-180" : ""
					}`}
				/>
			</button>

			{isOpen && (
				<div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
					{movieOptions.map((movie) => (
						<button
							key={movie}
							onClick={() => {
								onMovieChange(movie);
								setIsOpen(false);
							}}
							className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
								selectedMovie === movie
									? "bg-blue-50 text-blue-600 font-medium"
									: "text-gray-700"
							}`}>
							{movie}
						</button>
					))}
				</div>
			)}
		</div>
	);
};

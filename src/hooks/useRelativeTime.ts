/**
 * Formats a date as relative time (e.g., "1h ago", "2 days ago")
 * @param date - The date to format (string or Date object)
 * @returns Formatted relative time string
 */
const useRelativeTime = () => {
	return (date: Date) => {
		const now = new Date();
		const targetDate = typeof date === "string" ? new Date(date) : date;
		const diffInMs = now.getTime() - targetDate.getTime();
		const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
		const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
		const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
		const diffInWeeks = Math.floor(diffInDays / 7);
		const diffInMonths = Math.floor(diffInDays / 30);
		const diffInYears = Math.floor(diffInDays / 365);

		// If the date is in the future, return translation for "now"
		if (diffInMs < 0) {
			return "sada";
		}

		// Less than 1 minute ago
		if (diffInMinutes < 1) {
			return "sada";
		}

		// Less than 1 hour ago
		if (diffInMinutes < 60) {
			return `prije ${diffInMinutes} min`;
		}

		// Less than 24 hours ago
		if (diffInHours < 24) {
			return `prije ${diffInHours} h`;
		}

		// Less than 7 days ago
		if (diffInDays < 7) {
			return diffInDays === 1 ? "prije 1 dan" : `prije ${diffInDays} dana`;
		}

		// Less than 4 weeks ago
		if (diffInWeeks < 4) {
			return diffInWeeks === 1
				? "prije 1 tjedan"
				: `prije ${diffInWeeks} tjedana`;
		}

		// Less than 12 months ago
		if (diffInMonths < 12) {
			return diffInMonths === 1
				? "prije 1 mjesec"
				: `prije ${diffInMonths} mjeseci`;
		}

		// 1 year or more ago
		return diffInYears === 1 ? "prije 1 godine" : `prije ${diffInYears} godina`;
	};
};

export { useRelativeTime };

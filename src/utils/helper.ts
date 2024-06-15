function convertTimestampToTimeAgo(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const intervals: {
        [key: string]: number;
    } = {
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        month: 2592000000,
    };

    for (const interval in intervals) {
        const value = Math.floor(diff / intervals[interval]);
        if (value > 0) {
            return `${value} ${interval}(s) ago`;
        }
    }

    return "just now";
}

export { convertTimestampToTimeAgo };

export type YouTubeResource = {
    type: 'video' | 'channel';
    id: string;
};
export declare function parseYouTubeLink(link: string): YouTubeResource | null;
export interface ThumbnailResult {
    linkAnalyzed: string;
    thumbnails: string[];
}
export declare function fetchLatestThumbnails(link: string, apiKey: string, maxResults?: number): Promise<ThumbnailResult>;

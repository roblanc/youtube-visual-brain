"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYouTubeLink = parseYouTubeLink;
exports.fetchLatestThumbnails = fetchLatestThumbnails;
function parseYouTubeLink(link) {
    if (!link)
        return null;
    // Patterns for standard YouTube URLs
    const videoMatch = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/.exec(link);
    if (videoMatch) {
        return { type: 'video', id: videoMatch[1] };
    }
    const channelMatch = /(?:youtube\.com\/(?:c\/|channel\/|@))([\w-]+)/.exec(link);
    if (channelMatch) {
        return { type: 'channel', id: channelMatch[1] };
    }
    return null;
}
const node_fetch_1 = __importDefault(require("node-fetch"));
function fetchLatestThumbnails(link_1, apiKey_1) {
    return __awaiter(this, arguments, void 0, function* (link, apiKey, maxResults = 5) {
        const parsed = parseYouTubeLink(link);
        if (!parsed)
            throw new Error('Invalid YouTube link');
        if (!apiKey)
            throw new Error('Missing YouTube API key');
        let urls = [];
        if (parsed.type === 'video') {
            const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${parsed.id}&key=${apiKey}`;
            const res = yield (0, node_fetch_1.default)(apiUrl);
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            const data = yield res.json();
            urls = data.items.map((item) => { var _a; return ((_a = item.snippet.thumbnails.high) === null || _a === void 0 ? void 0 : _a.url) || item.snippet.thumbnails.default.url; });
        }
        else {
            // fetch latest videos from the channel
            const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${parsed.id}&maxResults=${maxResults}&order=date&type=video&key=${apiKey}`;
            const res = yield (0, node_fetch_1.default)(apiUrl);
            if (!res.ok)
                throw new Error(`API error ${res.status}`);
            const data = yield res.json();
            urls = data.items.map((item) => { var _a; return ((_a = item.snippet.thumbnails.high) === null || _a === void 0 ? void 0 : _a.url) || item.snippet.thumbnails.default.url; });
        }
        return { linkAnalyzed: link, thumbnails: urls };
    });
}

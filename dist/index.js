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
Object.defineProperty(exports, "__esModule", { value: true });
const youtube_1 = require("./youtube");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const link = process.argv[2];
        const apiKey = process.env.YOUTUBE_API_KEY || '';
        if (!link) {
            console.error('Usage: node dist/index.js <youtube_link>');
            process.exit(1);
        }
        try {
            const result = yield (0, youtube_1.fetchLatestThumbnails)(link, apiKey);
            console.log(result);
        }
        catch (err) {
            console.error(err);
        }
    });
}
run();

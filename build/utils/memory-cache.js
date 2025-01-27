var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import LruCache from 'lru-cache';
/**
 * A cache using local memory.
 */
export class MemoryCache {
    /**
     * @param timeToLiveInSeconds time-to-live for every key-value pair set in the cache
     */
    constructor(timeToLiveInSeconds) {
        this.timeToLiveInSeconds = timeToLiveInSeconds;
        this.cache = new LruCache({
            max: 100000,
            ttl: timeToLiveInSeconds * 1000
        });
    }
    set(key, value) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.cache.set(key, value);
            }
            catch (_a) {
                // let the code continue as this is a non-fatal error
            }
        });
    }
    get(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cache.get(key);
        });
    }
}
const didCache = new MemoryCache(600);
export const memoryDIDCache = (parsed, resolve) => __awaiter(void 0, void 0, void 0, function* () {
    if (parsed.params && parsed.params['no-cache'] === 'true')
        return yield resolve();
    const cached = didCache.get(parsed.didUrl);
    if (cached !== undefined)
        return cached;
    const doc = yield resolve();
    didCache.set(parsed.didUrl, doc);
    return doc;
});

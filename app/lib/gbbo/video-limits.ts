/** Base64 keeps each stored chunk under 1 MB, which is the smallest Redis request limit we might be on. */
export const VIDEO_CHUNK_BYTES = 600_000;
/**
 * Accept limit for Crimewatch uploads from phones. iPhone/Android clips are often 20–50 MB
 * even when short; we compress after upload so Redis does not keep the original size.
 */
export const VIDEO_MAX_BYTES = 60 * 1024 * 1024;
export const VIDEO_MAX_CHUNKS = Math.ceil(VIDEO_MAX_BYTES / VIDEO_CHUNK_BYTES);
export const VIDEO_MAX_LABEL = `${Math.round(VIDEO_MAX_BYTES / (1024 * 1024))} MB`;
/** Skip re-encoding when the upload is already small enough for Redis. */
export const VIDEO_COMPRESS_MIN_BYTES = 2 * 1024 * 1024;

/** Base64 keeps each stored chunk under 1 MB, which is the smallest Redis request limit we might be on. */
export const VIDEO_CHUNK_BYTES = 600_000;
/**
 * Hard cap for Crimewatch uploads. Kept deliberately low: Upstash free Redis is 250 MB and
 * base64 storage inflates every byte by ~33%, so a handful of phone videos fill the database.
 */
export const VIDEO_MAX_BYTES = 12 * 1024 * 1024;
export const VIDEO_MAX_CHUNKS = Math.ceil(VIDEO_MAX_BYTES / VIDEO_CHUNK_BYTES);
export const VIDEO_MAX_LABEL = `${Math.round(VIDEO_MAX_BYTES / (1024 * 1024))} MB`;

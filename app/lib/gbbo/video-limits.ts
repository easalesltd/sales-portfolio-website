/** Base64 keeps each stored chunk under 1 MB, which is the smallest Redis request limit we might be on. */
export const VIDEO_CHUNK_BYTES = 600_000;
/** Room for a 30 second 1080p phone selfie, including Android's larger H.264 files. */
export const VIDEO_MAX_BYTES = 60 * 1024 * 1024;
export const VIDEO_MAX_CHUNKS = Math.ceil(VIDEO_MAX_BYTES / VIDEO_CHUNK_BYTES);
export const VIDEO_MAX_LABEL = `${Math.round(VIDEO_MAX_BYTES / (1024 * 1024))} MB`;

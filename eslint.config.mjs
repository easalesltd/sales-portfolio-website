import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // `eslint-config-next@14.x` doesn't provide `next/typescript`.
  // Keep the core Next.js rules enabled without breaking lint execution.
  ...compat.extends("next/core-web-vitals"),
];

export default eslintConfig;

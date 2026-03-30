# East Anglian Sales LTD Website - Deployment Package

## Deployment Instructions

1. Upload all files and directories to your hosting server via SFTP
2. On the server, navigate to the uploaded directory and run:
   ```bash
   npm install --production
   ```
3. Start the production server:
   ```bash
   npm run prod
   ```

## Directory Structure
- `.next/` - Built application files
- `public/` - Static assets
- `package.json` - Production dependencies
- `next.config.js` - Next.js configuration

## Environment Requirements
- Node.js 18.x or later
- NPM 8.x or later
- For a **global** Sales Agent Dash leaderboard: set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` (Upstash Redis REST API), or legacy `KV_REST_API_URL` / `KV_REST_API_TOKEN` if migrated from Vercel KV. Redeploy after changing env vars.

## Important Notes
- The server must have Node.js installed
- Make sure to set up proper environment variables if required
- The site will run on port 3000 by default
- Configure your web server (nginx/apache) to proxy requests to the Node.js process

## Support
For any issues, contact: dave@easalesltd.co.uk 
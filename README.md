# East Anglian Sales LTD Website

A modern, responsive website built with Next.js for East Anglian Sales LTD, showcasing their services and portfolio.

## Features

- Responsive design optimized for all devices
- Dynamic image slideshow with custom transitions
- Interactive contact forms with email integration
- Modern navigation with mobile-friendly menu
- Photo grid gallery
- Request Agent Visit functionality
- Optimized image loading and performance

## Tech Stack

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- EmailJS for form handling
- React Icons

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables (see `.env.example`):
```env
# EmailJS configuration (browser forms)
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**Request an Agent Visit — confirm-by-email:**  
**Easiest path:** set only Resend + 4 variables — see **`CONFIRM_EMAIL_SIMPLE.md`** (no EmailJS private key). **Advanced:** EmailJS server keys + optional extra template — see `.env.example`. If env is incomplete, the form falls back to immediate browser EmailJS.

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the website

## Build and Deployment

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

## Project Structure

- `/app` - Next.js application pages and components
- `/public` - Static assets including images
- `/components` - Reusable React components
- `/styles` - Global styles and Tailwind CSS configuration

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

All rights reserved - East Anglian Sales LTD

<!-- Trigger redeploy: 2024-05-25  -->

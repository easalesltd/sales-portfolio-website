import { SITE_URL } from '@/app/data/business-entity';

export const SITE_OG_IMAGE_PATH = '/images/showcase/showcase1.jpeg';
export const SITE_OG_IMAGE_URL = `${SITE_URL}${SITE_OG_IMAGE_PATH}`;

const DEFAULT_OG_ALT = 'Greeting cards and gifts on a wholesale retailer display';

export function siteOpenGraphImage(alt = DEFAULT_OG_ALT) {
  return {
    url: SITE_OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt,
  };
}

export function pageSocialFields({
  title,
  description,
  path,
  imageUrl,
  imageAlt,
}: {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  imageAlt?: string;
}) {
  const url = path === '/' ? SITE_URL : `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  const image = {
    url: imageUrl ?? SITE_OG_IMAGE_URL,
    width: 1200,
    height: 630,
    alt: imageAlt ?? DEFAULT_OG_ALT,
  };

  return {
    openGraph: {
      title,
      description,
      url,
      type: 'website' as const,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title,
      description,
      images: [image.url],
    },
    alternates: {
      canonical: url,
    },
  };
}

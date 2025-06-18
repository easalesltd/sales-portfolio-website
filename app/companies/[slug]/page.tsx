import { Metadata } from 'next'
import Image from 'next/image'
import { companies } from '../../data/companies'
import OrderForm from './OrderForm'
import VideoBackground from '../../components/VideoBackground'
import ImageGallery from '../../components/ImageGallery'
import { Company } from '@/app/lib/types'

// Add shuffle function at the top level
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const company = companies.find(c => c.slug === params.slug);
  if (!company) {
    return {
      title: 'Company Not Found',
      description: 'The requested company page could not be found.'
    };
  }

  // Special cases for each company
  const companyMetadata = {
    'museums-and-galleries': {
      title: 'Museums and Galleries Greeting Cards | Art & Design-led Cards Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'museums and galleries sales agent',
        'museums and galleries agent',
        'museums and galleries supplier',
        'museums and galleries East Anglia',
        'museums and galleries Hertfordshire',
        'museums and galleries Cambridgeshire',
        'museums and galleries cards',
        'museums and galleries gifts',
        'museums and galleries stationery',
        'art cards supplier',
        'design-led cards supplier',
        'licensed art cards',
        'gift stationery supplier',
        'East Anglia museums and galleries agent',
        'Hertfordshire museums and galleries agent',
        'Cambridgeshire museums and galleries agent',
        'Suffolk museums and galleries supplier',
        'Norfolk museums and galleries agent',
        'Essex museums and galleries supplier',
        'museum Christmas cards wholesale',
        'gallery Christmas cards supplier',
        'art Christmas cards East Anglia',
        'licensed Christmas cards wholesale',
        'charity Christmas cards supplier',
        'museum charity cards wholesale',
        'gallery charity cards supplier',
        'art charity cards East Anglia',
        'licensed charity cards wholesale',
        'Christmas card wholesale supplier',
        'charity card wholesale supplier',
        'museum Christmas card collection',
        'gallery Christmas card range',
        'art Christmas card selection',
        'licensed Christmas card assortment',
        'charity Christmas card variety',
        'museum charity card collection',
        'gallery charity card range',
        'art charity card selection',
        'licensed charity card assortment',
        'Christmas card trade supplier',
        'charity card trade supplier',
        'museum Christmas card distributor',
        'gallery Christmas card distributor',
        'art Christmas card distributor',
        'licensed Christmas card distributor',
        'charity Christmas card distributor',
        'museum charity card distributor',
        'gallery charity card distributor',
        'art charity card distributor',
        'licensed charity card distributor',
        'charity card distributor',
        'Christmas card distributor',
        'museum Christmas card agent',
        'gallery Christmas card agent',
        'art Christmas card agent',
        'licensed Christmas card agent',
        'charity Christmas card agent',
        'museum charity card agent',
        'gallery charity card agent',
        'art charity card agent',
        'licensed charity card agent',
        'charity card agent',
        'Christmas card agent',
        'art greeting cards',
        'design-led greeting cards',
        'museum greeting cards',
        'gallery greeting cards',
        'licensed greeting cards',
        'contemporary greeting cards',
        'modern greeting cards',
        'artistic greeting cards',
        'designer greeting cards',
        'premium greeting cards',
        'luxury greeting cards',
        'high-end greeting cards',
        'quality greeting cards',
        'unique greeting cards',
        'exclusive greeting cards',
        'specialist greeting cards',
        'boutique greeting cards',
        'independent greeting cards',
        'artisan greeting cards',
        'craft greeting cards',
        'handcrafted greeting cards',
        'bespoke greeting cards',
        'custom greeting cards',
        'personalized greeting cards',
        'tailored greeting cards',
        'East Anglia greeting cards',
        'Hertfordshire greeting cards',
        'Cambridgeshire greeting cards',
        'Suffolk greeting cards',
        'Norfolk greeting cards',
        'Essex greeting cards',
        'East Anglia art cards',
        'Hertfordshire art cards',
        'Cambridgeshire art cards',
        'Suffolk art cards',
        'Norfolk art cards',
        'Essex art cards',
        'birthday greeting cards',
        'anniversary greeting cards',
        'wedding greeting cards',
        'sympathy greeting cards',
        'thank you greeting cards',
        'congratulations greeting cards',
        'get well greeting cards',
        'new baby greeting cards',
        'graduation greeting cards',
        'retirement greeting cards',
        'housewarming greeting cards',
        'moving greeting cards',
        'holiday greeting cards',
        'seasonal greeting cards',
        'Christmas greeting cards',
        'Easter greeting cards',
        'Mother\'s Day greeting cards',
        'Father\'s Day greeting cards',
        'Valentine\'s Day greeting cards'
      ]
    },
    'paper-salad': {
      title: 'Paper Salad Greeting Cards | Contemporary Design-led Cards in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'paper salad sales agent',
        'paper salad agent',
        'paper salad supplier',
        'paper salad East Anglia',
        'paper salad Hertfordshire',
        'paper salad Cambridgeshire',
        'paper salad cards',
        'paper salad gifts',
        'paper salad stationery',
        'greeting cards supplier',
        'design-led cards supplier',
        'East Anglia paper salad agent',
        'Hertfordshire paper salad agent',
        'Cambridgeshire paper salad agent',
        'Suffolk paper salad supplier',
        'Norfolk paper salad agent',
        'Essex paper salad supplier',
        'contemporary greeting cards',
        'design-led greeting cards',
        'modern greeting cards',
        'unique greeting cards',
        'creative greeting cards',
        'innovative greeting cards',
        'stylish greeting cards',
        'trendy greeting cards',
        'fashionable greeting cards',
        'designer greeting cards',
        'boutique greeting cards',
        'independent greeting cards',
        'artisan greeting cards',
        'craft greeting cards',
        'handcrafted greeting cards',
        'bespoke greeting cards',
        'custom greeting cards',
        'personalized greeting cards',
        'tailored greeting cards',
        'East Anglia greeting cards',
        'Hertfordshire greeting cards',
        'Cambridgeshire greeting cards',
        'Suffolk greeting cards',
        'Norfolk greeting cards',
        'Essex greeting cards',
        'birthday greeting cards',
        'anniversary greeting cards',
        'wedding greeting cards',
        'sympathy greeting cards',
        'thank you greeting cards',
        'congratulations greeting cards',
        'get well greeting cards',
        'new baby greeting cards',
        'graduation greeting cards',
        'retirement greeting cards',
        'housewarming greeting cards',
        'moving greeting cards',
        'holiday greeting cards',
        'seasonal greeting cards',
        'Christmas greeting cards',
        'Easter greeting cards',
        'Mother\'s Day greeting cards',
        'Father\'s Day greeting cards',
        'Valentine\'s Day greeting cards'
      ]
    },
    'ohh-deer-wholesale': {
      title: 'Ohh Deer Greeting Cards | Illustrated Cards & Stationery in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'ohh deer sales agent',
        'ohh deer agent',
        'ohh deer supplier',
        'ohh deer East Anglia',
        'ohh deer Hertfordshire',
        'ohh deer Cambridgeshire',
        'ohh deer cards',
        'ohh deer gifts',
        'ohh deer stationery',
        'cath kidston cards',
        'laura ashley cards',
        'art cards supplier',
        'design cards supplier',
        'illustrated cards supplier',
        'greeting cards supplier',
        'stationery supplier',
        'gift wrap supplier',
        'East Anglia ohh deer agent',
        'Hertfordshire ohh deer agent',
        'Cambridgeshire ohh deer agent',
        'Suffolk ohh deer supplier',
        'Norfolk ohh deer agent',
        'Essex ohh deer supplier',
        'ohh deer cath kidston',
        'ohh deer laura ashley',
        'ohh deer illustrated cards',
        'ohh deer stationery range',
        'ohh deer gift wrap',
        'ohh deer notebooks',
        'ohh deer planners',
        'ohh deer art cards',
        'ohh deer design cards',
        'ohh deer greeting cards',
        'ohh deer gift bags',
        'ohh deer wrapping paper',
        'illustrated greeting cards',
        'funny greeting cards',
        'humorous greeting cards',
        'quirky greeting cards',
        'playful greeting cards',
        'whimsical greeting cards',
        'cute greeting cards',
        'adorable greeting cards',
        'sweet greeting cards',
        'lovely greeting cards',
        'charming greeting cards',
        'delightful greeting cards',
        'cheerful greeting cards',
        'joyful greeting cards',
        'happy greeting cards',
        'fun greeting cards',
        'entertaining greeting cards',
        'amusing greeting cards',
        'comical greeting cards',
        'witty greeting cards',
        'clever greeting cards',
        'smart greeting cards',
        'intelligent greeting cards',
        'creative greeting cards',
        'innovative greeting cards',
        'unique greeting cards',
        'original greeting cards',
        'distinctive greeting cards',
        'special greeting cards',
        'exclusive greeting cards',
        'premium greeting cards',
        'quality greeting cards',
        'high-end greeting cards',
        'luxury greeting cards',
        'designer greeting cards',
        'boutique greeting cards',
        'independent greeting cards',
        'artisan greeting cards',
        'craft greeting cards',
        'handcrafted greeting cards',
        'bespoke greeting cards',
        'custom greeting cards',
        'personalized greeting cards',
        'tailored greeting cards',
        'cath kidston greeting cards',
        'laura ashley greeting cards',
        'cath kidston illustrated cards',
        'laura ashley illustrated cards',
        'cath kidston floral cards',
        'laura ashley floral cards',
        'cath kidston vintage cards',
        'laura ashley vintage cards',
        'cath kidston classic cards',
        'laura ashley classic cards',
        'cath kidston traditional cards',
        'laura ashley traditional cards',
        'cath kidston modern cards',
        'laura ashley modern cards',
        'cath kidston contemporary cards',
        'laura ashley contemporary cards',
        'East Anglia greeting cards',
        'Hertfordshire greeting cards',
        'Cambridgeshire greeting cards',
        'Suffolk greeting cards',
        'Norfolk greeting cards',
        'Essex greeting cards',
        'birthday greeting cards',
        'anniversary greeting cards',
        'wedding greeting cards',
        'sympathy greeting cards',
        'thank you greeting cards',
        'congratulations greeting cards',
        'get well greeting cards',
        'new baby greeting cards',
        'graduation greeting cards',
        'retirement greeting cards',
        'housewarming greeting cards',
        'moving greeting cards',
        'holiday greeting cards',
        'seasonal greeting cards',
        'Christmas greeting cards',
        'Easter greeting cards',
        'Mother\'s Day greeting cards',
        'Father\'s Day greeting cards',
        'Valentine\'s Day greeting cards'
      ]
    },
    'gnaw-chocolate': {
      title: 'Gnaw Chocolate Sales Agent | Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'gnaw chocolate sales agent',
        'gnaw chocolate agent',
        'gnaw chocolate supplier',
        'gnaw chocolate East Anglia',
        'gnaw chocolate Hertfordshire',
        'gnaw chocolate Cambridgeshire',
        'artisanal chocolate supplier',
        'norfolk chocolate supplier',
        'chocolate gifts supplier',
        'sweet treats supplier',
        'East Anglia gnaw chocolate agent',
        'Hertfordshire gnaw chocolate agent',
        'Cambridgeshire gnaw chocolate agent',
        'Suffolk gnaw chocolate supplier',
        'Norfolk gnaw chocolate agent',
        'Essex gnaw chocolate supplier'
      ]
    },
    'mint-publishing': {
      title: 'Mint Publishing Greeting Cards | Funny & Captioned Cards in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        // Katie Abey SEO
        'Katie Abey Greeting Cards',
        'Buy Katie Abey Greeting Cards',
        'Katie Abey Cards',
        'Katie Abey Cards Supplier',
        'Katie Abey Cards Agent',
        'Katie Abey Cards East Anglia',
        'Katie Abey Cards Hertfordshire',
        'Katie Abey Cards Cambridgeshire',
        'Katie Abey Cards Suffolk',
        'Katie Abey Cards Norfolk',
        'Katie Abey Cards Essex',
        'Katie Abey Cards Wholesale',
        'Katie Abey Cards Trade',
        'Katie Abey Cards Retail',
        'Katie Abey Cards Business',
        'Katie Abey Cards Distributor',
        'Katie Abey Cards UK',
        // Existing keywords
        'mint publishing sales agent',
        'mint publishing agent',
        'mint publishing supplier',
        'mint publishing East Anglia',
        'mint publishing Hertfordshire',
        'mint publishing Cambridgeshire',
        'mint publishing cards',
        'funny cards supplier',
        'birthday cards supplier',
        'blank cards supplier',
        'East Anglia mint publishing agent',
        'Hertfordshire mint publishing agent',
        'Cambridgeshire mint publishing agent',
        'Suffolk mint publishing supplier',
        'Norfolk mint publishing agent',
        'Essex mint publishing supplier',
        'funny greeting cards',
        'humorous greeting cards',
        'comical greeting cards',
        'witty greeting cards',
        'clever greeting cards',
        'smart greeting cards',
        'intelligent greeting cards',
        'amusing greeting cards',
        'entertaining greeting cards',
        'hilarious greeting cards',
        'laugh-out-loud greeting cards',
        'side-splitting greeting cards',
        'rib-tickling greeting cards',
        'knee-slapping greeting cards',
        'belly-laugh greeting cards',
        'chuckle-inducing greeting cards',
        'giggle-worthy greeting cards',
        'smile-provoking greeting cards',
        'joy-bringing greeting cards',
        'cheer-spreading greeting cards',
        'mood-lifting greeting cards',
        'spirit-raising greeting cards',
        'heart-warming greeting cards',
        'soul-touching greeting cards',
        'emotion-evoking greeting cards',
        'feeling-expressing greeting cards',
        'sentiment-conveying greeting cards',
        'message-delivering greeting cards',
        'communication-enhancing greeting cards',
        'connection-fostering greeting cards',
        'relationship-strengthening greeting cards',
        'bond-deepening greeting cards',
        'friendship-celebrating greeting cards',
        'love-expressing greeting cards',
        'care-showing greeting cards',
        'appreciation-demonstrating greeting cards',
        'gratitude-expressing greeting cards',
        'thanks-giving greeting cards',
        'congratulation-offering greeting cards',
        'celebration-marking greeting cards',
        'achievement-recognizing greeting cards',
        'success-acknowledging greeting cards',
        'milestone-commemorating greeting cards',
        'memory-creating greeting cards',
        'moment-capturing greeting cards',
        'East Anglia greeting cards',
        'Hertfordshire greeting cards',
        'Cambridgeshire greeting cards',
        'Suffolk greeting cards',
        'Norfolk greeting cards',
        'Essex greeting cards',
        'birthday greeting cards',
        'anniversary greeting cards',
        'wedding greeting cards',
        'sympathy greeting cards',
        'thank you greeting cards',
        'congratulations greeting cards',
        'get well greeting cards',
        'new baby greeting cards',
        'graduation greeting cards',
        'retirement greeting cards',
        'housewarming greeting cards',
        'moving greeting cards',
        'holiday greeting cards',
        'seasonal greeting cards',
        'Christmas greeting cards',
        'Easter greeting cards',
        'Mother\'s Day greeting cards',
        'Father\'s Day greeting cards',
        'Valentine\'s Day greeting cards'
      ]
    },
    'wpl-gifts': {
      title: 'WPL Gifts Sales Agent | Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'wpl gifts sales agent',
        'wpl sales agent',
        'wpl gifts agent',
        'wpl gifts supplier',
        'wpl gifts East Anglia',
        'wpl gifts Hertfordshire',
        'wpl gifts Cambridgeshire',
        'wpl gifts supplier',
        'giftware supplier',
        'retail gifts supplier',
        'East Anglia wpl gifts agent',
        'Hertfordshire wpl gifts agent',
        'Cambridgeshire wpl gifts agent',
        'Suffolk wpl gifts supplier',
        'Norfolk wpl gifts agent',
        'Essex wpl gifts supplier'
      ]
    },
    'global-journey-gifts': {
      title: 'Global Journey Sales Agent | Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'global journey sales agent',
        'global journey agent',
        'global journey supplier',
        'global journey East Anglia',
        'global journey Hertfordshire',
        'global journey Cambridgeshire',
        'global journey gifts',
        'tourist gifts supplier',
        'museum gifts supplier',
        'visitor centre gifts',
        'East Anglia global journey agent',
        'Hertfordshire global journey agent',
        'Cambridgeshire global journey agent',
        'Suffolk global journey supplier',
        'Norfolk global journey agent',
        'Essex global journey supplier'
      ]
    },
    'david-fischhoff': {
      title: 'David Fischhoff Sales Agent | Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'david fischhoff sales agent',
        'david fischhoff agent',
        'david fischhoff supplier',
        'david fischhoff East Anglia',
        'david fischhoff Hertfordshire',
        'david fischhoff Cambridgeshire',
        'david fischhoff cards',
        'art cards supplier',
        'design cards supplier',
        'East Anglia david fischhoff agent',
        'Hertfordshire david fischhoff agent',
        'Cambridgeshire david fischhoff agent',
        'Suffolk david fischhoff supplier',
        'Norfolk david fischhoff agent',
        'Essex david fischhoff supplier'
      ]
    },
    'emotional-rescue': {
      title: 'Emotional Rescue Greeting Cards | Contemporary Cards in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'emotional rescue sales agent',
        'emotional rescue agent',
        'emotional rescue supplier',
        'emotional rescue East Anglia',
        'emotional rescue Hertfordshire',
        'emotional rescue Cambridgeshire',
        'emotional rescue cards',
        'greeting cards supplier',
        'card supplier',
        'East Anglia emotional rescue agent',
        'Hertfordshire emotional rescue agent',
        'Cambridgeshire emotional rescue agent',
        'Suffolk emotional rescue supplier',
        'Norfolk emotional rescue agent',
        'Essex emotional rescue supplier',
        'contemporary greeting cards',
        'modern greeting cards',
        'current greeting cards',
        'present-day greeting cards',
        'up-to-date greeting cards',
        'trendy greeting cards',
        'fashionable greeting cards',
        'stylish greeting cards',
        'chic greeting cards',
        'elegant greeting cards',
        'sophisticated greeting cards',
        'refined greeting cards',
        'polished greeting cards',
        'classy greeting cards',
        'upscale greeting cards',
        'premium greeting cards',
        'high-end greeting cards',
        'luxury greeting cards',
        'quality greeting cards',
        'excellent greeting cards',
        'superior greeting cards',
        'exceptional greeting cards',
        'outstanding greeting cards',
        'remarkable greeting cards',
        'notable greeting cards',
        'distinctive greeting cards',
        'unique greeting cards',
        'original greeting cards',
        'creative greeting cards',
        'innovative greeting cards',
        'imaginative greeting cards',
        'inventive greeting cards',
        'artistic greeting cards',
        'designer greeting cards',
        'boutique greeting cards',
        'independent greeting cards',
        'artisan greeting cards',
        'craft greeting cards',
        'handcrafted greeting cards',
        'bespoke greeting cards',
        'custom greeting cards',
        'personalized greeting cards',
        'tailored greeting cards',
        'East Anglia greeting cards',
        'Hertfordshire greeting cards',
        'Cambridgeshire greeting cards',
        'Suffolk greeting cards',
        'Norfolk greeting cards',
        'Essex greeting cards',
        'birthday greeting cards',
        'anniversary greeting cards',
        'wedding greeting cards',
        'sympathy greeting cards',
        'thank you greeting cards',
        'congratulations greeting cards',
        'get well greeting cards',
        'new baby greeting cards',
        'graduation greeting cards',
        'retirement greeting cards',
        'housewarming greeting cards',
        'moving greeting cards',
        'holiday greeting cards',
        'seasonal greeting cards',
        'Christmas greeting cards',
        'Easter greeting cards',
        'Mother\'s Day greeting cards',
        'Father\'s Day greeting cards',
        'Valentine\'s Day greeting cards'
      ]
    },
    'boxer-gifts': {
      title: 'Boxer Gifts Sales Agent | Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'boxer gifts sales agent',
        'boxer gifts agent',
        'boxer gifts supplier',
        'boxer gifts East Anglia',
        'boxer gifts Hertfordshire',
        'boxer gifts Cambridgeshire',
        'boxer gifts supplier',
        'giftware supplier',
        'retail gifts supplier',
        'East Anglia boxer gifts agent',
        'Hertfordshire boxer gifts agent',
        'Cambridgeshire boxer gifts agent',
        'Suffolk boxer gifts supplier',
        'Norfolk boxer gifts agent',
        'Essex boxer gifts supplier'
      ]
    },
    'peppermint-grove': {
      title: 'Peppermint Grove Sales Agent | Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'peppermint grove sales agent',
        'peppermint grove agent',
        'peppermint grove supplier',
        'peppermint grove East Anglia',
        'peppermint grove Hertfordshire',
        'peppermint grove Cambridgeshire',
        'peppermint grove candles',
        'peppermint grove diffusers',
        'home fragrance supplier',
        'East Anglia peppermint grove agent',
        'Hertfordshire peppermint grove agent',
        'Cambridgeshire peppermint grove agent',
        'Suffolk peppermint grove supplier',
        'Norfolk peppermint grove agent',
        'Essex peppermint grove supplier'
      ]
    },
    'star-editions': {
      title: 'Star Editions Greeting Cards | Licensed Cards & Gifts in East Anglia, Hertfordshire & Cambridgeshire',
      keywords: [
        'star editions sales agent',
        'star editions agent',
        'star editions supplier',
        'star editions East Anglia',
        'star editions Hertfordshire',
        'star editions Cambridgeshire',
        'star editions cards',
        'star editions gifts',
        'licensed cards supplier',
        'East Anglia star editions agent',
        'Hertfordshire star editions agent',
        'Cambridgeshire star editions agent',
        'Suffolk star editions supplier',
        'Norfolk star editions agent',
        'Essex star editions supplier',
        'licensed greeting cards',
        'branded greeting cards',
        'official greeting cards',
        'authorized greeting cards',
        'certified greeting cards',
        'approved greeting cards',
        'endorsed greeting cards',
        'recognized greeting cards',
        'established greeting cards',
        'reputable greeting cards',
        'trusted greeting cards',
        'reliable greeting cards',
        'dependable greeting cards',
        'consistent greeting cards',
        'excellent greeting cards',
        'superior greeting cards',
        'exceptional greeting cards',
        'outstanding greeting cards',
        'remarkable greeting cards',
        'notable greeting cards',
        'distinctive greeting cards',
        'unique greeting cards',
        'original greeting cards',
        'creative greeting cards',
        'innovative greeting cards',
        'imaginative greeting cards',
        'inventive greeting cards',
        'artistic greeting cards',
        'designer greeting cards',
        'boutique greeting cards',
        'independent greeting cards',
        'artisan greeting cards',
        'craft greeting cards',
        'handcrafted greeting cards',
        'bespoke greeting cards',
        'custom greeting cards',
        'personalized greeting cards',
        'tailored greeting cards',
        'East Anglia greeting cards',
        'Hertfordshire greeting cards',
        'Cambridgeshire greeting cards',
        'Suffolk greeting cards',
        'Norfolk greeting cards',
        'Essex greeting cards',
        'birthday greeting cards',
        'anniversary greeting cards',
        'wedding greeting cards',
        'sympathy greeting cards',
        'thank you greeting cards',
        'congratulations greeting cards',
        'get well greeting cards',
        'new baby greeting cards',
        'graduation greeting cards',
        'retirement greeting cards',
        'housewarming greeting cards',
        'moving greeting cards',
        'holiday greeting cards',
        'seasonal greeting cards',
        'Christmas greeting cards',
        'Easter greeting cards',
        'Mother\'s Day greeting cards',
        'Father\'s Day greeting cards',
        'Valentine\'s Day greeting cards'
      ]
    }
  };

  const metadata = companyMetadata[params.slug as keyof typeof companyMetadata];
  if (metadata) {
    return {
      title: metadata.title,
      description: `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`,
      keywords: metadata.keywords.join(', '),
      openGraph: {
        title: metadata.title,
        description: `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: metadata.title,
        description: `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`,
      }
    };
  }

  // Special case for Museums and Galleries
  if (params.slug === 'museums-and-galleries') {
    const title = 'Museums and Galleries Sales Agent | Official Wholesale Supplier in East Anglia';
    const description = `Official Museums and Galleries sales agent and wholesale supplier in East Anglia. ${company.description}`;
    const keywords = [
      'museums and galleries sales agent',
      'museums and galleries agent',
      'museums and galleries wholesale supplier',
      'museums and galleries East Anglia',
      'museums and galleries cards',
      'museums and galleries gifts',
      'museums and galleries stationery',
      'art cards wholesale',
      'design-led cards supplier',
      'licensed art cards',
      'gift stationery wholesale',
      'East Anglia museums and galleries agent',
      'Suffolk museums and galleries supplier',
      'Norfolk museums and galleries agent',
      'Essex museums and galleries supplier',
      'Cambridgeshire museums and galleries agent',
      
      'museum Christmas cards wholesale',
      'gallery Christmas cards supplier',
      'art Christmas cards East Anglia',
      'licensed Christmas cards wholesale',
      'charity Christmas cards supplier',
      'museum charity cards wholesale',
      'gallery charity cards supplier',
      'art charity cards East Anglia',
      'licensed charity cards wholesale',
      'Christmas card wholesale supplier',
      'charity card wholesale supplier',
      'museum Christmas card collection',
      'gallery Christmas card range',
      'art Christmas card selection',
      'licensed Christmas card assortment',
      'charity Christmas card variety',
      'museum charity card collection',
      'gallery charity card range',
      'art charity card selection',
      'licensed charity card assortment',
      'Christmas card trade supplier',
      'charity card trade supplier',
      'museum Christmas card distributor',
      'gallery Christmas card distributor',
      'art Christmas card distributor',
      'licensed Christmas card distributor',
      'charity Christmas card distributor',
      'museum charity card distributor',
      'gallery charity card distributor',
      'art charity card distributor',
      'licensed charity card distributor',
      'charity card distributor',
      'Christmas card distributor',
      'museum Christmas card agent',
      'gallery Christmas card agent',
      'art Christmas card agent',
      'licensed Christmas card agent',
      'charity Christmas card agent',
      'museum charity card agent',
      'gallery charity card agent',
      'art charity card agent',
      'licensed charity card agent',
      'charity card agent',
      'Christmas card agent'
    ].join(', ');

    return {
      title,
      description,
      keywords,
      openGraph: {
        title,
        description,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      }
    };
  }

  // Generate metadata from company data if not present
  const title = `${company.name} Sales Agent | Wholesale Supplier in East Anglia`;
  const description = `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`;
  const keywords = `${company.name}, sales agent, wholesale supplier, East Anglia, ${company.name.toLowerCase()} cards, ${company.name.toLowerCase()} gifts`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    }
  };
}

export async function generateStaticParams() {
  return companies.map((company) => ({
    slug: company.slug,
  }))
}

export default function CompanyPage({ params }: { params: { slug: string } }) {
  const company = companies.find(c => c.slug === params.slug);
  if (!company) {
    return <div>Company not found</div>;
  }

  const structuredData = generateStructuredData(company);
  
  const hasVideoBackground = [
    'museums-and-galleries', 
    'paper-salad', 
    'ohh-deer-wholesale',
    'boxer-gifts',
    'emotional-rescue',
    'peppermint-grove',
    'mint-publishing'
  ].includes(params.slug);

  // Define base image arrays
  const paperSaladBaseImages = params.slug === 'paper-salad' ? [
    '/images/companies/paper-salad/IMG_0670_copy_bdc70bf1-59fc-476e-9c6d-bf96f508ee40_1500x.jpeg',
    '/images/companies/paper-salad/43a8e5ac-f223-4213-a4ca-c0c7d53aed48_1500x.jpeg',
    '/images/companies/paper-salad/Birthday_Collection_copy_1500x.jpeg'
  ] : [];

  const emotionalRescueBaseImages = params.slug === 'emotional-rescue' ? [
    '/images/companies/emotional-rescue/336207-IMG_3646-copy.jpeg',
    '/images/companies/emotional-rescue/emo_web.jpeg',
    '/images/companies/emotional-rescue/81J8YSOEzoL.jpeg',
    '/images/companies/emotional-rescue/519NuytaJ1L.jpeg',
    '/images/companies/emotional-rescue/613nPYonKsL.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11768_600x.jpeg',
    '/images/companies/emotional-rescue/EMZFPW11770_600x.jpeg'
  ] : [];

  const museumsAndGalleriesBaseImages = params.slug === 'museums-and-galleries' ? [
    '/images/companies/museums-and-galleries/7d55e712-89d5-448b-aa75-f4cec8b7cf87.jpeg',
    '/images/companies/museums-and-galleries/6c27d66e-3695-49a1-b4a4-d7967106679b.jpeg',
    '/images/companies/museums-and-galleries/cc0ff00f-b373-4a7f-ae5c-fa1e61f846fa.jpeg',
    '/images/companies/museums-and-galleries/ed555a28-c3ea-4cd8-b056-3a0dfebb2890.jpeg',
    '/images/companies/museums-and-galleries/4a44abec-ce62-4e46-878b-8cbad6b03da2.jpeg',
    '/images/companies/museums-and-galleries/f13f19a1-1349-4e84-89d5-e6ffe231f308.jpeg',
    '/images/companies/museums-and-galleries/1b4833b0-54b9-4457-95fb-7b94df0b0389.jpeg',
    '/images/companies/museums-and-galleries/59a26b7f-162c-454e-9efd-c483fae2ecfa.jpeg'
  ] : [];

  const starEditionsBaseImages = params.slug === 'star-editions' ? [
    '/images/companies/star-editions/E6EDAD48-3745-4C0D-B057-1C2EB79CF436.JPG',
    '/images/companies/star-editions/IMG_0562.jpg',
    '/images/companies/star-editions/IMG_0558.jpeg',
    '/images/companies/star-editions/IMG-20240510-WA0007.jpg',
    '/images/companies/star-editions/IMG-20240906-WA0024.jpg',
    '/images/companies/star-editions/IMG-20250217-WA0001.jpg',
    '/images/companies/star-editions/IMG-20240713-WA0013.jpg',
    '/images/companies/star-editions/IMG-20250228-WA0016.jpg',
    '/images/companies/star-editions/IMG-20250124-WA0007.jpg',
    '/images/companies/star-editions/Stephen-Millership.jpeg',
    '/images/companies/star-editions/stick_man.jpeg',
    '/images/companies/star-editions/ZOG011.jpeg',
    '/images/companies/star-editions/miffy_logo.png',
    '/images/companies/star-editions/BRIGGS_DESKTOP.jpeg'
  ] : [];

  const peppermintGroveBaseImages = params.slug === 'peppermint-grove' ? [
    '/images/companies/peppermint-grove/PGA_Uk_Diffuser_Category_d8e301ee-42b8-4ef0-9d68-5221f68c83b3.jpeg',
    '/images/companies/peppermint-grove/PGA_Uk_Candle_engraving_14e985bb-cf2d-43af-917f-773eea41e718.jpeg',
    '/images/companies/peppermint-grove/PGA_UK_Bath_Category_8c6ce571-33e1-42dc-b009-dd680a331094.jpeg',
    '/images/companies/peppermint-grove/LargeCandle370g-Oceania.png',
    '/images/companies/peppermint-grove/LargeCandle370g-Gardenia_4beb7369-9a18-4fcb-ad6a-4bdb7ac5c45e.png',
    '/images/companies/peppermint-grove/LargeDiffuser350ml-Camellia_WhiteLotus.png',
    '/images/companies/peppermint-grove/PGA_CoreMarch2024_51000x1000_3bf423a2-0ab0-4355-8797-fd0fe31961fb_400x.jpeg',
    '/images/companies/peppermint-grove/PGACore6_2059e7fb-a309-4078-a054-f9118e8a4a93_400x.jpeg',
    '/images/companies/peppermint-grove/New_Arrivals_65e95d71-0d66-43a3-abf2-f1eff2913b3f.jpg'
  ] : [];

  const boxerGiftsBaseImages = params.slug === 'boxer-gifts' ? [
    '/images/companies/boxer-gifts/OT2075_a70b.webp',
    '/images/companies/boxer-gifts/CO1012___MR_GOOD_LOOKIN__APRON___34_49a0.webp',
    '/images/companies/boxer-gifts/MU3131_4d24.webp',
    '/images/companies/boxer-gifts/YHU0838_Grumpy_Git_9b56.webp',
    '/images/companies/boxer-gifts/Untitled_550_550_px_4_.png'
  ] : [];

  const davidFischhoffBaseImages = params.slug === 'david-fischhoff' ? [
    '/images/companies/david-fischhoff/36.jpeg',
    '/images/companies/david-fischhoff/695.jpeg',
    '/images/companies/david-fischhoff/68.jpeg',
    '/images/companies/david-fischhoff/13.jpeg',
    '/images/companies/david-fischhoff/67.jpeg'
  ] : [];

  const ohhDeerBaseImages = params.slug === 'ohh-deer-wholesale' ? [
    '/images/companies/ohh-deer-wholesale/Tiny-Notebooks-Web-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Cath-Kidston-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Beth-Evans-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Daily-Planners-Web-Asset-Square.jpg',
    '/images/companies/ohh-deer-wholesale/Laura-Ashley-Web-Asset-Square.jpg'
  ] : [];

  const globalJourneyBaseImages = params.slug === 'global-journey-gifts' ? [
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.34.04.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.54.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.48.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.35.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.13.png',
    '/images/companies/global-journey/Screenshot 2025-05-17 at 08.33.00.png'
  ] : [];

  const wplGiftsBaseImages = params.slug === 'wpl-gifts' ? [
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.34.png',
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.28.png',
    '/images/companies/wpl-gifts/Screenshot 2025-05-17 at 08.36.21.png'
  ] : [];

  const mintPublishingBaseImages = params.slug === 'mint-publishing' ? [
    '/images/companies/mint-publishing/Katie .png',
    '/images/companies/mint-publishing/Lost The Plot.png',
    '/images/companies/mint-publishing/1-1-25 (1).jpeg',
    '/images/companies/mint-publishing/1-1-27.jpeg',
    '/images/companies/mint-publishing/1-1-26.jpeg',
    '/images/companies/mint-publishing/1-1-29.jpeg',
    '/images/companies/mint-publishing/1-1-25.jpeg',
    '/images/companies/mint-publishing/1-19.jpeg',
    '/images/companies/mint-publishing/1-30.jpeg'
  ] : [];

  const gnawChocolateBaseImages = params.slug === 'gnaw-chocolate' ? [
    '/images/companies/gnaw-chocolate/gnaw-milk-peppermint-chocolate-bar-002-gpn0005-1024x1024-72dpi.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Popcorn_Peanut-Snack-Bar-GPN0028-CBG-02.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Milk-Chocolate-Buttons-GPN0066-CBG-02.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Easter-Egg-Chocolate-Curls-GPN0069.png',
    '/images/companies/gnaw-chocolate/gnaw-mochamelt-salted-caramel-cbg-01.jpeg',
    '/images/companies/gnaw-chocolate/gnaw-taste-adventure-hot-choc-spoon-gift-gpn0052-lfs-01.jpeg',
    '/images/companies/gnaw-chocolate/GNAW-Caramel-Chocolate-Buttons-GPN0067-CBG-02.png'
  ] : [];

  // Shuffle all image arrays
  const paperSaladImages = shuffleArray(paperSaladBaseImages);
  const emotionalRescueImages = shuffleArray(emotionalRescueBaseImages);
  const museumsAndGalleriesImages = shuffleArray(museumsAndGalleriesBaseImages);
  const starEditionsImages = shuffleArray(starEditionsBaseImages);
  const peppermintGroveImages = shuffleArray(peppermintGroveBaseImages);
  const boxerGiftsImages = shuffleArray(boxerGiftsBaseImages);
  const davidFischhoffImages = shuffleArray(davidFischhoffBaseImages);
  const ohhDeerImages = shuffleArray(ohhDeerBaseImages);
  const globalJourneyImages = shuffleArray(globalJourneyBaseImages);
  const wplGiftsImages = shuffleArray(wplGiftsBaseImages);
  const mintPublishingImages = mintPublishingBaseImages;
  const gnawChocolateImages = shuffleArray(gnawChocolateBaseImages);

  const content = (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData)
        }}
      />
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Company Information */}
            <div className={`${hasVideoBackground ? 'bg-white/90 backdrop-blur-md' : ''} rounded-xl p-8 shadow-lg transition-all duration-300 hover:shadow-xl`}>
              <div className="h-60 relative mb-8 group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/10 group-hover:to-gray-50/20 transition-all duration-300" />
                <Image
                  src={company.logoUrl}
                  alt={`${company.name} logo`}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="space-y-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 relative">
                  {company.name}
                  <div className="h-1 w-20 bg-blue-600 mt-2" />
                </h1>
                <p className="text-xl leading-relaxed text-gray-600">{company.description}</p>
                
                <div className="mt-12">
                  {params.slug === 'paper-salad' && (
                    <div className="mb-8">
                      <ImageGallery images={paperSaladImages} interval={6000} />
                    </div>
                  )}
                  {params.slug === 'emotional-rescue' && (
                    <div className="mb-8">
                      <ImageGallery images={emotionalRescueImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'museums-and-galleries' && (
                    <div className="mb-8">
                      <ImageGallery images={museumsAndGalleriesImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'star-editions' && (
                    <div className="mb-8">
                      <ImageGallery images={starEditionsImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'peppermint-grove' && (
                    <div className="mb-8">
                      <ImageGallery images={peppermintGroveImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'boxer-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={boxerGiftsImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'david-fischhoff' && (
                    <div className="mb-8">
                      <ImageGallery images={davidFischhoffImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'ohh-deer-wholesale' && (
                    <div className="mb-8">
                      <ImageGallery images={ohhDeerImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'global-journey-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={globalJourneyImages} interval={5500} />
                    </div>
                  )}
                  {params.slug === 'wpl-gifts' && (
                    <div className="mb-8">
                      <ImageGallery images={wplGiftsImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'mint-publishing' && (
                    <div className="mb-8">
                      <ImageGallery images={mintPublishingImages} interval={5000} />
                    </div>
                  )}
                  {params.slug === 'gnaw-chocolate' && (
                    <div className="mb-8">
                      <ImageGallery images={gnawChocolateImages} interval={5000} />
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-4 mt-8">
                  <a
                    href={company.catalogueUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <svg 
                      className="mr-2 -ml-1 h-5 w-5" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    Download Catalogue
                  </a>
                </div>
              </div>
            </div>

            {/* Order Form */}
            <div className={`${hasVideoBackground ? 'bg-white/80 backdrop-blur-sm' : 'bg-white'} rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl`}>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 relative">
                Place an Order
                <div className="h-1 w-16 bg-blue-600 mt-2" />
              </h2>
              <OrderForm companyName={company.name} />
            </div>
          </div>
        </div>
      </div>
    </>
  );

  if (hasVideoBackground) {
    const videoPath = `/videos/companies/${params.slug}/background.mp4`;
    
    return (
      <VideoBackground videoUrl={videoPath}>
        {content}
      </VideoBackground>
    );
  }

  return content;
}

function generateStructuredData(company: Company) {
  const companyStructuredData = {
    'museums-and-galleries': {
      name: 'Museums and Galleries Greeting Cards - Art & Design-led Cards Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Licensed art and design-led greetings cards and gift stationery from the UK\'s leading publisher. Specializing in museum and gallery inspired designs.',
      categories: [
        'Greeting Cards',
        'Art Cards',
        'Design-led Cards',
        'Museum Cards',
        'Gallery Cards',
        'Licensed Cards',
        'Contemporary Cards',
        'Modern Cards',
        'Premium Cards',
        'Luxury Cards',
        'High-end Cards',
        'Quality Cards',
        'Unique Cards',
        'Exclusive Cards',
        'Specialist Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'paper-salad': {
      name: 'Paper Salad Greeting Cards - Contemporary Design-led Cards in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Contemporary greeting cards and stationery with unique, modern designs. Specializing in creative and innovative card designs.',
      categories: [
        'Greeting Cards',
        'Contemporary Cards',
        'Design-led Cards',
        'Modern Cards',
        'Unique Cards',
        'Creative Cards',
        'Innovative Cards',
        'Stylish Cards',
        'Trendy Cards',
        'Fashionable Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'ohh-deer-wholesale': {
      name: 'Ohh Deer Greeting Cards - Illustrated Cards & Stationery in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Fun and quirky greeting cards, stationery, and gifts with unique illustrations. Official supplier of Cath Kidston and Laura Ashley greeting cards and stationery.',
      categories: [
        'Greeting Cards',
        'Illustrated Cards',
        'Funny Cards',
        'Humorous Cards',
        'Quirky Cards',
        'Playful Cards',
        'Whimsical Cards',
        'Cute Cards',
        'Adorable Cards',
        'Sweet Cards',
        'Lovely Cards',
        'Charming Cards',
        'Delightful Cards',
        'Cheerful Cards',
        'Joyful Cards',
        'Happy Cards',
        'Fun Cards',
        'Entertaining Cards',
        'Amusing Cards',
        'Comical Cards',
        'Witty Cards',
        'Clever Cards',
        'Smart Cards',
        'Intelligent Cards',
        'Creative Cards',
        'Innovative Cards',
        'Unique Cards',
        'Original Cards',
        'Distinctive Cards',
        'Special Cards',
        'Exclusive Cards',
        'Premium Cards',
        'Quality Cards',
        'High-end Cards',
        'Luxury Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'Cath Kidston Cards',
        'Laura Ashley Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'gnaw-chocolate': {
      name: 'Gnaw Chocolate Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Artisanal chocolate creations and sweet treats from Norfolk.',
      categories: ['Chocolate', 'Sweet Treats', 'Gifts', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'mint-publishing': {
      name: 'Mint Publishing Greeting Cards - Funny & Captioned Cards in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Funny and refreshingly different birthday, blank, and captioned greetings cards. Specializing in humorous and witty card designs.',
      categories: [
        'Greeting Cards',
        'Funny Cards',
        'Humorous Cards',
        'Comical Cards',
        'Witty Cards',
        'Clever Cards',
        'Smart Cards',
        'Intelligent Cards',
        'Amusing Cards',
        'Entertaining Cards',
        'Hilarious Cards',
        'Laugh-out-loud Cards',
        'Side-splitting Cards',
        'Rib-tickling Cards',
        'Knee-slapping Cards',
        'Belly-laugh Cards',
        'Chuckle-inducing Cards',
        'Giggle-worthy Cards',
        'Smile-provoking Cards',
        'Joy-bringing Cards',
        'Cheer-spreading Cards',
        'Mood-lifting Cards',
        'Spirit-raising Cards',
        'Heart-warming Cards',
        'Soul-touching Cards',
        'Emotion-evoking Cards',
        'Feeling-expressing Cards',
        'Sentiment-conveying Cards',
        'Message-delivering Cards',
        'Communication-enhancing Cards',
        'Connection-fostering Cards',
        'Relationship-strengthening Cards',
        'Bond-deepening Cards',
        'Friendship-celebrating Cards',
        'Love-expressing Cards',
        'Care-showing Cards',
        'Appreciation-demonstrating Cards',
        'Gratitude-expressing Cards',
        'Thanks-giving Cards',
        'Congratulation-offering Cards',
        'Celebration-marking Cards',
        'Achievement-recognizing Cards',
        'Success-acknowledging Cards',
        'Milestone-commemorating Cards',
        'Memory-creating Cards',
        'Moment-capturing Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'wpl-gifts': {
      name: 'WPL Gifts Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Quality giftware and retail solutions for your store.',
      categories: ['Giftware', 'Retail Solutions', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'global-journey-gifts': {
      name: 'Global Journey Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Unique and original gift ranges with customised displays for tourist attractions, museums, and visitor centres.',
      categories: ['Gifts', 'Tourist Attractions', 'Museum Gifts', 'Retail Solutions', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'david-fischhoff': {
      name: 'David Fischhoff Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Artistic greeting cards and designs.',
      categories: ['Greeting Cards', 'Art Cards', 'Design-led Cards', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'emotional-rescue': {
      name: 'Emotional Rescue Greeting Cards - Contemporary Cards in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Contemporary greeting cards and stationery with modern, stylish designs. Specializing in elegant and sophisticated card designs.',
      categories: [
        'Greeting Cards',
        'Contemporary Cards',
        'Modern Cards',
        'Current Cards',
        'Present-day Cards',
        'Up-to-date Cards',
        'Trendy Cards',
        'Fashionable Cards',
        'Stylish Cards',
        'Chic Cards',
        'Elegant Cards',
        'Sophisticated Cards',
        'Refined Cards',
        'Polished Cards',
        'Classy Cards',
        'Upscale Cards',
        'Premium Cards',
        'High-end Cards',
        'Luxury Cards',
        'Quality Cards',
        'Excellent Cards',
        'Superior Cards',
        'Exceptional Cards',
        'Outstanding Cards',
        'Remarkable Cards',
        'Notable Cards',
        'Distinctive Cards',
        'Unique Cards',
        'Original Cards',
        'Creative Cards',
        'Innovative Cards',
        'Imaginative Cards',
        'Inventive Cards',
        'Artistic Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    },
    'boxer-gifts': {
      name: 'Boxer Gifts Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Quality giftware and retail solutions.',
      categories: ['Giftware', 'Retail Solutions', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'peppermint-grove': {
      name: 'Peppermint Grove Sales Agent - Official Supplier in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Luxury home fragrance including candles and diffusers.',
      categories: ['Home Fragrance', 'Candles', 'Diffusers', 'East Anglia Retail', 'Hertfordshire Retail', 'Cambridgeshire Retail']
    },
    'star-editions': {
      name: 'Star Editions Greeting Cards - Licensed Cards & Gifts in East Anglia, Hertfordshire & Cambridgeshire',
      description: 'Licensed greeting cards and gifts from well-known brands and properties. Specializing in official and authorized card designs.',
      categories: [
        'Greeting Cards',
        'Licensed Cards',
        'Branded Cards',
        'Official Cards',
        'Authorized Cards',
        'Certified Cards',
        'Approved Cards',
        'Endorsed Cards',
        'Recognized Cards',
        'Established Cards',
        'Reputable Cards',
        'Trusted Cards',
        'Reliable Cards',
        'Dependable Cards',
        'Consistent Cards',
        'Quality Cards',
        'Excellent Cards',
        'Superior Cards',
        'Exceptional Cards',
        'Outstanding Cards',
        'Remarkable Cards',
        'Notable Cards',
        'Distinctive Cards',
        'Unique Cards',
        'Original Cards',
        'Creative Cards',
        'Innovative Cards',
        'Imaginative Cards',
        'Inventive Cards',
        'Artistic Cards',
        'Designer Cards',
        'Boutique Cards',
        'Independent Cards',
        'Artisan Cards',
        'Craft Cards',
        'Handcrafted Cards',
        'Bespoke Cards',
        'Custom Cards',
        'Personalized Cards',
        'Tailored Cards',
        'East Anglia Retail',
        'Hertfordshire Retail',
        'Cambridgeshire Retail'
      ]
    }
  };

  const data = companyStructuredData[company.slug as keyof typeof companyStructuredData];
  if (data) {
    return {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
      '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
      'name': data.name,
      'description': `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${data.description}`,
      'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
      'logo': {
        '@type': 'ImageObject',
        'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
        'width': '800',
        'height': '600'
      },
      'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
        '@type': 'State',
        'name': county,
        'address': {
          '@type': 'PostalAddress',
          'addressRegion': county,
          'addressCountry': 'GB'
        }
      })),
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': `${company.name} Sales Agent - Product Catalog`,
        'itemListElement': {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Product',
            'name': `${company.name} Products`,
            'description': data.description,
            'brand': {
              '@type': 'Brand',
              'name': company.name
            },
            'category': data.categories
          },
          'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
            '@type': 'State',
            'name': county
          }))
        }
      }
    };
  }

  // Fallback to default structured data if no specific case exists
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore', 'SalesAgent'],
    '@id': `https://www.easalesltd.co.uk/companies/${company.slug}#organization`,
    'name': `${company.name} Sales Agent - Wholesale Supplier in East Anglia`,
    'description': `Official ${company.name} sales agent and wholesale supplier in East Anglia. ${company.description}`,
    'url': `https://www.easalesltd.co.uk/companies/${company.slug}`,
    'logo': {
      '@type': 'ImageObject',
      'url': `https://www.easalesltd.co.uk${company.logoUrl}`,
      'width': '800',
      'height': '600'
    },
    'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
      '@type': 'State',
      'name': county,
      'address': {
        '@type': 'PostalAddress',
        'addressRegion': county,
        'addressCountry': 'GB'
      }
    })),
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': `${company.name} Sales Agent - Wholesale Products`,
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Product',
            'name': `${company.name} Products`,
            'description': company.description,
            'brand': {
              '@type': 'Brand',
              'name': company.name
            },
            'category': ['Sales Agent Services', 'Wholesale Products', 'East Anglia Retail']
          },
          'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire', 'Hertfordshire'].map(county => ({
            '@type': 'State',
            'name': county
          }))
        }
      ]
    }
  };
}
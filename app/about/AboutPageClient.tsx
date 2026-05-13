'use client';
import { useState } from 'react';
import ImageModal from "../components/ImageModal";
import VideoBackground from "../components/VideoBackground";
import FadeInOnScroll from "../components/FadeInOnScroll";

function aboutSrc(file: string): string {
  return encodeURI(`/images/about/${file}`);
}

/** Filenames match `public/images/about` (descriptive names for SEO). Desktop wall: 4×3 grid. */
const aboutImages = [
  {
    src: aboutSrc('Selfie with Cards N Things Norwich.jpg'),
    alt:
      'Dave Langdon, greeting card sales agent for Norfolk and East Anglia, visiting Cards N Things independent card shop Norwich with wholesale ranges',
  },
  {
    src: aboutSrc('Team Ohh Deer at Spring Fair NEC.png'),
    alt:
      'Dave Langdon with Ohh Deer wholesale team at Spring Fair NEC Birmingham — greeting card trade show, East Anglia sales agent portfolio',
  },
  {
    src: aboutSrc('Dave playing with Underline The Sky at the Apex Bury St Edmunds.jpg'),
    alt:
      'Dave Langdon playing guitar on stage with Underline The Sky at The Apex Bury St Edmunds Suffolk — gift industry sales rep in East Anglia',
  },
  {
    src: aboutSrc('On the way to watch Ipswich Town.jpg'),
    alt:
      'Dave Langdon Ipswich Suffolk based greeting card sales agent on the way to watch Ipswich Town FC',
  },
  {
    src: aboutSrc('Guitar Training 101.jpg'),
    alt:
      'Dave Langdon practising guitar between East Anglia retailer visits — wholesale greeting card and gift sales agent Suffolk',
  },
  {
    src: aboutSrc('Selfie With Amanda at Love it Bury St Edmunds.jpg'),
    alt:
      'Dave Langdon with Amanda at Love it Bury St Edmunds Suffolk gift shop — independent retailer wholesale cards and gifts',
  },
  {
    src: aboutSrc('Family Langdon Selfie in Cornwall.jpg'),
    alt:
      'Dave Langdon and family in Cornwall — Ipswich based wholesale greeting card sales agent East Anglia',
  },
  {
    src: aboutSrc('Legoland Fun.jpg'),
    alt:
      'Dave Langdon family day at Legoland — greeting card sales representative East Anglian Sales Ltd',
  },
  {
    src: aboutSrc('Family Picture after completing Carten 100 for Anthony Nolan.jpg'),
    alt:
      'Dave Langdon family after Carten 100 charity ride for Anthony Nolan — card and gift wholesale agent East Anglia',
  },
  {
    src: aboutSrc('Tarzan Fun in Orwell Country Park.jpg'),
    alt:
      'Dave Langdon outdoors at Orwell Country Park Ipswich Suffolk — East Anglia greeting card sales agent',
  },
  {
    src: aboutSrc('Coffee on a Lake in Austria.jpg'),
    alt:
      'Dave Langdon relaxing by an Austrian lake — East Anglia wholesale greeting card and giftware sales agent',
  },
  {
    src: aboutSrc('Up an Austrian Moutain wearing Flip Flops, as you do.JPG'),
    alt:
      'Dave Langdon hiking in the Austrian mountains — Suffolk based Dave Langdon greeting card sales agent holiday photo',
  },
];

export default function AboutPageClient() {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const goToPrevious = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === 0 ? aboutImages.length - 1 : selectedImageIndex - 1);
    }
  };

  const goToNext = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex(selectedImageIndex === aboutImages.length - 1 ? 0 : selectedImageIndex + 1);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="bg-white">
        <div className="w-full min-h-[30vh] md:h-[30vh] relative overflow-hidden">
          <VideoBackground videoUrl="/videos/About/background.mp4">
            <div className="w-full h-full flex items-center justify-center bg-black/30 py-8 md:py-0">
              <FadeInOnScroll className="text-center px-4 max-w-3xl" direction="up" delay={0.1}>
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 drop-shadow-lg">Meet Dave</h1>
                <p className="text-sm md:text-lg text-white drop-shadow-lg leading-relaxed">
                  Dave established East Anglian Sales Ltd in 2022, bringing over a decade of experience as a rep in East Anglia.
                  Dave has built strong relationships with retailers across Suffolk, Norfolk, Essex, and Cambridgeshire,
                  understanding their unique needs and helping them succeed with expert greeting card sales representation.
                </p>
              </FadeInOnScroll>
            </div>
          </VideoBackground>
        </div>

        <FadeInOnScroll className="block lg:hidden py-6" direction="up">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4">
            {aboutImages.map((img, index) => (
              <div
                key={`mobile-${index}`}
                className="relative h-48 w-[260px] shrink-0 snap-center overflow-hidden rounded-lg shadow-lg cursor-pointer min-h-0 min-w-0"
                onClick={() => handleImageClick(index)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full max-h-full max-w-full object-cover object-center transition-transform duration-300 md:hover:scale-105"
                />
              </div>
            ))}
          </div>
        </FadeInOnScroll>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <FadeInOnScroll direction="right" delay={0.05}>
                <div className="bg-blue-50 rounded-lg p-4 mb-4 lg:mb-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">A Message from Dave</h2>
                  <p className="text-base text-gray-700 italic">
                    &quot;Hi, I&apos;m Dave Langdon, based in Ipswich, Suffolk. I&apos;ve been working in East Anglia for over a decade, roaming town to town, Monday to Friday, matching brilliant greeting card and gift brands with brilliant retailers. In the summer, I may be spotted in shorts. I apologise in advance for the legs. And Flip Flops.&quot;
                  </p>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll direction="up" delay={0.1}>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why Choose Dave Langdon?</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I&apos;m committed to helping retailers find the perfect products for their customers. Whether you&apos;re looking for traditional greeting cards or modern gift items, I can help you build a successful product range with expert knowledge and personal service.
                  </p>
                </div>
              </FadeInOnScroll>
              <FadeInOnScroll direction="left" delay={0.15}>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">My Service Area</h2>
                  <p className="text-lg text-gray-700 mb-4">
                    I proudly serve retailers across East Anglia, including:
                  </p>
                  <ul className="text-lg text-gray-700 list-disc list-inside mb-4">
                    <li>Suffolk</li>
                    <li>Norfolk</li>
                    <li>Essex</li>
                    <li>Cambridgeshire</li>
                  </ul>
                </div>
              </FadeInOnScroll>
            </div>

            <FadeInOnScroll className="hidden lg:block" direction="left" delay={0.1}>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {aboutImages.map((img, index) => (
                  <div
                    key={`desktop-${img.src}-${index}`}
                    className="relative min-w-0 w-full aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleImageClick(index)}
                  >
                    <img
                      src={img.src}
                      alt={img.alt}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </FadeInOnScroll>
          </div>

          {selectedImageIndex !== null && (
            <ImageModal
              isOpen={selectedImageIndex !== null}
              onClose={closeModal}
              imageSrc={aboutImages[selectedImageIndex].src}
              alt={aboutImages[selectedImageIndex].alt}
              onPrevious={goToPrevious}
              onNext={goToNext}
              currentIndex={selectedImageIndex}
              totalImages={aboutImages.length}
            />
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            Want to see what a day on the road is like? Double click/tap the <strong>Black East Anglia</strong> logo
            (top left).
          </p>
        </div>
      </div>
    </div>
  );
}

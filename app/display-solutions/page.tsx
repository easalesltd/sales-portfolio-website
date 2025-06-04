'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function DisplaySolutionsPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const ImageGallery = ({ images, title }: { images: string[], title: string }) => (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 transition-all duration-500 ${expandedSection === title ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
      {images.map((image, index) => (
        <div 
          key={index} 
          className="relative h-64 cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => setSelectedImage(image)}
        >
          <Image
            src={`/images/display-solutions/${image}`}
            alt={`${title} - ${image.replace('.png', '')}`}
            fill
            className="object-cover rounded-lg shadow-md"
          />
        </div>
      ))}
    </div>
  );

  const cduImages = [
    'Mint Publishing CDU.png',
    'Global Journey Bookmark CDU.png',
    'Museums and Galleries CDU.png',
    'Ohh Deer Art Print CDU.png',
    'Ohh Deer Kaliedo CDU.png',
    'WPL Gifts CDU.png',
    'Ohh Deer CDU.png'
  ];

  const fsduImages = [
    'Paper Salad Greeting Card FSDU.png',
    'Global Journey Multi Tool Pen FSDU.png',
    'Global Journey Diamond Pen FSDU.png',
    'Global Journey Wooden Keyrings FSDU.png',
    'Global Journey Rustic Plaque FSDU.png',
    'Museums and Galleries Giftware FSDU.png',
    'Museums and Galleries Flat Wrap FSDU.png',
    'Museums and Galleries Stationary FSDU.png',
    'Museums and Galleries Card FSDU.png',
    'Ohh Deer Gouda FSDU.png',
    'Ohh Deer Wholesale Journal and Art Print FSDU.png'
  ];

  const wallDisplayImages = [
    'Ohh Deer Card Wall Display.png',
    'Museums and Galleries Wall Mounted Flat Wrap Display.png',
    'Museums and Galleries Wall Mounted Card Display.png'
  ];

  const coinDispenserImages = [
    'Global Journey Coin Dispenser 1.png',
    'Global Journey Coin Dispenser 2.png',
    'Global Journey Coin Dispenser 3.png'
  ];

  const DisplaySection = ({ title, description, images, features }: { 
    title: string, 
    description: string, 
    images: string[], 
    features: string[] 
  }) => (
    <div 
      className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 h-full ${
        expandedSection === title ? 'ring-2 ring-blue-500' : 'hover:shadow-xl'
      }`}
      onClick={() => setExpandedSection(expandedSection === title ? null : title)}
    >
      <div className="flex justify-between items-center cursor-pointer">
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        <span className="text-blue-500">
          {expandedSection === title ? '▼' : '▶'}
        </span>
      </div>
      <p className="text-gray-600 mt-2">{description}</p>
      <ul className="list-disc list-inside text-gray-700 space-y-2 mt-4">
        {features.map((feature, index) => (
          <li key={index}>{feature}</li>
        ))}
      </ul>
      <div className="mt-4">
        <span className="text-blue-600 text-sm">
          {expandedSection === title ? 'Click to collapse' : 'Click to view examples'}
        </span>
      </div>
      <ImageGallery images={images} title={title} />
    </div>
  );

  // Add structured data for greeting card display solutions
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness', 'WholesaleStore'],
    '@id': 'https://www.easalesltd.co.uk/display-solutions#organization',
    'name': 'East Anglian Sales LTD - Greeting Card Display Solutions',
    'description': 'Professional greeting card display solutions including FREE greeting card spinners, affordable display units, and bespoke wall displays. Expert retail solutions for greeting cards serving Suffolk, Norfolk, Essex, and Cambridgeshire.',
    'url': 'https://www.easalesltd.co.uk/display-solutions',
    'areaServed': ['Suffolk', 'Norfolk', 'Essex', 'Cambridgeshire'].map(county => ({
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
      'name': 'Greeting Card Display Solutions',
      'itemListElement': [
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Product',
            'name': 'Free Greeting Card Spinners',
            'description': 'Complimentary greeting card spinners and display units for retailers. Professional quality displays at no cost to qualifying retailers.',
            'category': ['Retail Displays', 'Card Spinners', 'Free Displays', 'Greeting Card Solutions'],
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'GBP',
              'availability': 'https://schema.org/InStock',
              'priceValidUntil': '2024-12-31',
              'description': 'Free of charge greeting card spinners for qualifying retailers'
            }
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Product',
            'name': 'Affordable Greeting Card Displays',
            'description': 'Cost-effective greeting card display solutions for retailers. Quality displays at competitive prices.',
            'category': ['Retail Displays', 'Card Spinners', 'Affordable Displays', 'Greeting Card Solutions'],
            'offers': {
              '@type': 'Offer',
              'priceSpecification': {
                '@type': 'PriceSpecification',
                'price': '50',
                'priceCurrency': 'GBP',
                'minPrice': '50',
                'maxPrice': '200',
                'priceValidUntil': '2024-12-31'
              },
              'availability': 'https://schema.org/InStock',
              'description': 'Affordable greeting card display solutions starting from £50'
            }
          }
        },
        {
          '@type': 'Offer',
          'itemOffered': {
            '@type': 'Product',
            'name': 'Bespoke Greeting Card Wall Displays',
            'description': 'Custom-designed wall displays for greeting cards. Tailored solutions to maximize your retail space and showcase your products effectively.',
            'category': ['Retail Displays', 'Wall Displays', 'Bespoke Solutions', 'Greeting Card Solutions'],
            'offers': {
              '@type': 'Offer',
              'priceSpecification': {
                '@type': 'PriceSpecification',
                'price': '200',
                'priceCurrency': 'GBP',
                'minPrice': '200',
                'maxPrice': '1000',
                'priceValidUntil': '2024-12-31'
              },
              'availability': 'https://schema.org/InStock',
              'description': 'Custom-designed wall displays for greeting cards, tailored to your specific requirements'
            }
          }
        }
      ]
    },
    'serviceType': [
      'Greeting Card Display Solutions',
      'Free Card Spinners',
      'Affordable Display Units',
      'Bespoke Wall Displays'
    ],
    'makesOffer': [
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Free Greeting Card Display Solutions',
          'description': 'Complimentary greeting card spinners and display units for qualifying retailers'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Affordable Greeting Card Displays',
          'description': 'Cost-effective display solutions for greeting cards'
        }
      },
      {
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': 'Bespoke Greeting Card Wall Displays',
          'description': 'Custom-designed wall displays for greeting cards'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Free Display Solutions</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Complimentary Retail Display Solutions for Your Business</h2>
          
          <div className="mb-12">
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              Looking for professional display solutions at no cost? We offer FREE greeting card spinners and giftware displays to help showcase your products! 
              From counter displays to wall units, we&apos;ll help you create eye-catching displays that your customers will love - all at no charge to you. 
              Take a look at our complimentary options below - just click on any section to see examples of what we can provide for free.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DisplaySection 
                title="Counter Display Units (CDU)"
                description="Perfect for making the most of your counter space - these displays are great for catching your customer&apos;s eye right at the point of sale."
                images={cduImages}
                features={[
                  'Custom-designed counter units',
                  'Space-efficient solutions',
                  'Eye-catching product presentation',
                  'Flexible configurations'
                ]}
              />

              <DisplaySection 
                title="Floor Standing Display Units (FSDU)"
                description="Want to make a big impact? Our floor-standing displays are real attention-grabbers, perfect for high-traffic areas in your shop."
                images={fsduImages}
                features={[
                  'Greeting Card Spinners',
                  'Free-standing display solutions',
                  'Maximum visibility placement',
                  'Sturdy and durable construction',
                  'Various size options available'
                ]}
              />

              <DisplaySection 
                title="Wall Mounted Displays"
                description="Make the most of your wall space with our range of wall-mounted display solutions, perfect for showcasing products at eye level."
                images={wallDisplayImages}
                features={[
                  'Space-saving wall units',
                  'Eye-level product placement',
                  'Customizable configurations',
                  'Easy installation'
                ]}
              />

              <DisplaySection 
                title="Coin Dispenser Machines"
                description="Add a convenient and profitable service to your store with our coin dispenser machines. Perfect for providing change to customers while generating additional revenue."
                images={coinDispenserImages}
                features={[
                  'Generate passive income for your business',
                  'Provide convenient change service to customers',
                  'Low maintenance and reliable operation',
                  'Compact design fits in most retail spaces',
                  'Secure and tamper-proof construction',
                  'Easy to install and service'
                ]}
              />
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Display Solutions?</h2>
            <p className="text-lg text-gray-700 mb-6">
              Contact us to discuss your display requirements. We&apos;ll help you find the perfect solution for your retail space.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative w-full max-w-2xl mx-auto">
              <button
                className="absolute -top-8 right-0 text-white text-xl font-bold z-10"
                onClick={() => setSelectedImage(null)}
              >
                ×
              </button>
              <div className="relative h-[60vh] w-full">
                <Image
                  src={`/images/display-solutions/${selectedImage}`}
                  alt={selectedImage.replace('.png', '')}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
} 
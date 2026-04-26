'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import FadeInOnScroll from '../components/FadeInOnScroll';

/** Screen-reader-friendly alt; keeps filename wording (e.g. stationary product range). */
function altForDisplaySolutionImage(sectionTitle: string, filename: string): string {
  const stem = filename.replace(/\.(png|jpe?g)$/i, '');
  const expanded = stem
    .replace(/\bFSDU\b/g, 'floor standing display unit')
    .replace(/\bCDU\b/g, 'counter display unit');
  return `${sectionTitle}: ${expanded}`;
}

export default function DisplaySolutionsClient() {
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
            alt={altForDisplaySolutionImage(title, image)}
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
    'Ohh Deer Journal and Art Print FSDU.png'
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
      className={`bg-white rounded-lg shadow-lg p-6 transition-all duration-300 h-full hover:-translate-y-0.5 ${
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

  return (
      <div className="min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">Free Display Solutions</h1>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.08}>
            <h2 className="text-2xl font-semibold text-gray-800 mb-8 text-center">Complimentary Retail Display Solutions for Your Business</h2>
          </FadeInOnScroll>
          
          <div className="mb-12">
            <FadeInOnScroll delay={0.1}>
              <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
                Looking for professional display solutions at no cost? We offer FREE greeting card spinners and giftware displays to help showcase your products! 
                From counter displays to wall units, we&apos;ll help you create eye-catching displays that your customers will love - all at no charge to you. 
                Take a look at our complimentary options below - just click on any section to see examples of what we can provide for free.
              </p>
            </FadeInOnScroll>

            <FadeInOnScroll delay={0.12} direction="up">
              <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900">Bespoke Confectionery Displays</h3>
                <p className="mt-2 text-gray-700">
                  Need pick-up confectionery displays? Choose between full bespoke labelling or a
                  Cambridge branded off-the-shelf solution and jump straight to the right option.
                </p>
                <Link
                  href="/display-solutions/bespoke-confectionery-displays"
                  className="mt-4 inline-flex items-center px-5 py-3 rounded-md text-sm font-semibold border border-neutral-950 text-white bg-neutral-950 hover:bg-neutral-800 transition-colors"
                >
                  Explore Bespoke Confectionery Displays
                </Link>
              </div>
            </FadeInOnScroll>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FadeInOnScroll delay={0.05}>
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
              </FadeInOnScroll>

              <FadeInOnScroll delay={0.12} direction="right">
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
              </FadeInOnScroll>

              <FadeInOnScroll delay={0.08} direction="left">
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
              </FadeInOnScroll>

              <FadeInOnScroll delay={0.14} direction="right">
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
              </FadeInOnScroll>
            </div>
          </div>

          <FadeInOnScroll delay={0.1} direction="up">
            <div className="bg-blue-50 rounded-lg shadow-lg p-8 transition-shadow duration-300 hover:shadow-xl">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Display Solutions?</h2>
              <p className="text-lg text-gray-700 mb-6">
                Contact us to discuss your display requirements. We&apos;ll help you find the perfect solution for your retail space.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center px-6 py-3 border border-neutral-950 text-base font-medium rounded-md shadow-sm text-white bg-neutral-950 hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-950 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:ring-white"
              >
                Get in Touch
              </Link>
            </div>
          </FadeInOnScroll>
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
                  alt={altForDisplaySolutionImage('Display solution', selectedImage)}
                  fill
                  className="object-contain rounded-lg"
                  sizes="(max-width: 768px) 90vw, (max-width: 1200px) 70vw, 800px"
                />
              </div>
            </div>
          </div>
        )}
      </div>
  );
} 
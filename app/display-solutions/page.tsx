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

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Display Solutions</h1>
        
        <div className="mb-12">
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
            Looking for the perfect way to showcase your products? We've got you covered! From counter displays to wall units, 
            we'll help you create eye-catching displays that your customers will love. Take a look at our options below - 
            just click on any section to see examples of what we can do for you.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DisplaySection 
              title="Counter Displays (CDU)"
              description="Perfect for making the most of your counter space - these displays are great for catching your customer's eye right at the point of sale."
              images={cduImages}
              features={[
                'Custom-designed counter units',
                'Space-efficient solutions',
                'Eye-catching product presentation',
                'Flexible configurations'
              ]}
            />

            <DisplaySection 
              title="Floor Standing Units (FSDU)"
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
              title="Wall Displays"
              description="Make the most of your wall space with our stylish and practical wall-mounted displays - they're brilliant for cards, artwork, and gifts!"
              images={wallDisplayImages}
              features={[
                'Space-saving wall mounted units',
                'Adjustable shelving options',
                'Easy to install and maintain',
                'Perfect for card and gift displays'
              ]}
            />

            <DisplaySection 
              title="Coin Dispenser Machines"
              description="Need a hassle-free way to handle £1 coin sales? Our reliable coin dispensers make self-service super simple for your customers."
              images={coinDispenserImages}
              features={[
                '£1 coin vending solutions',
                'Secure and reliable operation',
                'Easy to maintain and refill',
                'Perfect for self-service retail'
              ]}
            />
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Need Display Solutions?</h2>
          <p className="text-lg text-gray-700 mb-6">
            Contact us to discuss your display requirements. We'll help you find the perfect solution for your retail space.
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
  );
} 
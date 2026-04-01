'use client';

import Link from 'next/link';
import Image from 'next/image';
import VideoBackground from '../components/VideoBackground';
import { getAllRecipes } from '../data/recipes';
import { useState, useEffect } from 'react';

export default function RecipesIndexClient() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  const recipes = getAllRecipes();

  const testimonials = [
    {
      text: "Also those mince pies are THE BEST ive ever eaten!!! Thank you so much!!",
      icon: "⭐",
      parts: ["Also those mince pies are <strong>THE BEST</strong> ive ever eaten!!! Thank you so much!!"]
    },
    {
      text: "Hi Dave\nA big THANK YOU from all the staff – they loved your mince pies and are intrigued by the secret ingredients!\nHave a wonderful Christmas and a Happy New Year!\nSee you at Harrogate, when it starts all over again!",
      icon: "⭐",
      multiline: true,
      parts: [
        "Hi Dave",
        "A big <strong>THANK YOU</strong> from all the staff – they loved your mince pies and are intrigued by the secret ingredients!",
        "Have a wonderful Christmas and a Happy New Year!",
        "See you at Harrogate, when it starts all over again!"
      ]
    },
    {
      text: "Oscar (weekend staff) who was on the till just had his break and had a mince pie. When he returned he exclaimed 'that was the best mince pie I've ever had!'",
      icon: "⭐",
      multiline: true,
      parts: [
        "Oscar (weekend staff) who was on the till just had his break and had a mince pie.",
        "When he returned he exclaimed '<strong>that was the best mince pie I've ever had!</strong>'"
      ]
    },
    {
      text: "Omg that bread taste amazing .. thank you",
      icon: "🍞",
      parts: ["Omg that <strong>bread</strong> taste <strong>amazing</strong> .. thank you"]
    },
    {
      text: "The decision of this house is 👍 the bread is amazing they are addicted to it \"best bread ever\" thank you so much Dave xx",
      icon: "🍞",
      parts: ["The decision of this house is 👍 the <strong>bread</strong> is <strong>amazing</strong> they are addicted to it \"<strong>best bread ever</strong>\" thank you so much Dave xx"]
    },
    {
      text: "Hi Dave,\n\nMince pie was 10/10! Thank you!",
      icon: "⭐",
      multiline: true,
      parts: [
        "Hi Dave,",
        "Mince pie was <strong>10/10!</strong> Thank you!"
      ]
    },
    {
      text: "Your bread was absolutely amazing! Thank you so so much for treating us! It was so good!!!!!!!!!",
      icon: "🍞",
      parts: ["Your <strong>bread</strong> was <strong>absolutely amazing!</strong> Thank you so so much for treating us! It was so good!!!!!!!!!"]
    },
    {
      text: "Hello lovely, i forgot to say thank you for the lovely bread before you left yesterday. It was very lovely 🤤 I scoffed some for my lunch x",
      icon: "🍞",
      parts: ["Hello lovely, i forgot to say thank you for the <strong>lovely bread</strong> before you left yesterday. It was <strong>very lovely</strong> 🤤 I scoffed some for my lunch x"]
    }
  ];

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Swipe handlers for mobile
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    } else if (isRightSwipe) {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  const getRecipeEmoji = (slug: string) => {
    if (slug === 'sourdough-bread') return '🍞';
    if (slug === 'orange-juice-pastry-mince-pies') return '🥧';
    if (slug === 'mini-chocolate-christmas-puddings') return '🍫';
    return '🍴';
  };

  return (
    <>
      {/* Hidden SEO text */}
      <div className="sr-only">
        <p>
          Dave Langdon&apos;s favourite baking recipes for gifting to customers.
          Sourdough bread recipe, orange juice pastry mince pies recipe, mini chocolate Christmas puddings recipe.
          Learn how to make homemade sourdough bread, delicious Christmas mince pies with orange juice pastry, and festive no-bake chocolate puddings.
          Perfect recipes for building business relationships with homemade treats. Dave Langdon recipes, East Anglian Sales recipes, business baking recipes, customer gift recipes, homemade gift recipes, Christmas baking recipes, festive baking recipes
        </p>
      </div>

      {/* Hero Section */}
      <div className="w-full h-[30vh] md:h-[40vh] relative overflow-hidden no-print-hero">
        <VideoBackground videoUrl="/videos/About/background.mp4">
          <div className="w-full h-full flex items-center justify-center bg-black/40">
            <div className="text-center px-4 max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Dave&apos;s Favourite Recipes
              </h1>
              <p className="text-base md:text-xl text-white drop-shadow-lg">
                Sharing my favourite recipes for gifting to customers. From classic sourdough to festive treats!
              </p>
            </div>
        </div>
        </VideoBackground>
      </div>

      {/* Recipes Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 recipes-page-content">
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700">
            As part of my business, I love sharing the things I bake with my customers. Here are my go-to recipes that always go down well!
          </p>
        </div>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 no-print-cards">
          {recipes.map((recipe) => (
            <Link
              key={recipe.id}
              href={`/recipes/${recipe.slug}`}
              className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl block"
            >
              <div className="h-64 relative overflow-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={recipe.slug === 'sourdough-bread'}
                  quality={85}
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl">{getRecipeEmoji(recipe.slug)}</span>
                    <h2 className="text-2xl font-bold text-white mt-4 drop-shadow-lg">{recipe.title}</h2>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">{recipe.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>⏱️ {recipe.prepTime}</span>
                  <span>🍴 {recipe.yield}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Customer Testimonials Section - Rolling Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 mb-8 overflow-hidden no-print-testimonials">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            What Customers Say
          </h3>
          <div className="relative max-w-3xl mx-auto px-4">
            {/* Testimonial Display */}
            <div 
              className="relative min-h-[160px] md:min-h-[176px] overflow-hidden touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="bg-white rounded-lg shadow-md p-4 md:p-5 border-l-4 border-amber-500 min-h-[160px] md:min-h-[176px] flex items-center">
                    <div className="flex items-start w-full">
                      <span className="text-2xl md:text-3xl mr-2 md:mr-3 flex-shrink-0">{testimonial.icon}</span>
                      {testimonial.multiline ? (
                        <div className="text-gray-700 italic text-sm md:text-base leading-relaxed flex-1">
                          <p className="mb-1">&quot;{testimonial.parts[0]}</p>
                          {testimonial.parts.slice(1).map((part, i) => (
                            <p key={i} className={i < testimonial.parts.length - 2 ? 'mb-1' : ''} dangerouslySetInnerHTML={{ __html: part }} />
                          ))}
                          <p>&quot;</p>
                        </div>
                      ) : (
                        <p className="text-gray-700 italic text-sm md:text-base leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: `&quot;${testimonial.parts[0]}&quot;` }} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-4 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonial
                      ? 'w-8 bg-amber-500'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-blue-50 rounded-xl p-8 text-center no-print-notes">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Baking for Business
          </h3>
          <div className="text-lg text-gray-700 max-w-2xl mx-auto">
            <p>
              I love sharing my baking with customers as a way to show appreciation for their custom. These recipes are my go-to favourites!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}


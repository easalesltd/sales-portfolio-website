'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import FadeInOnScroll from '../components/FadeInOnScroll';

const recipes = [
  {
    id: 1,
    title: "Dave's Go-To Sourdough Recipe",
    description: "A classic sourdough that I've been refining for years. Great for sharing with customers! I'm using a sourdough starter sent through the post from a friend in Bristol 4 years ago!",
    difficulty: "Intermediate",
    time: "24 hours (including fermentation)",
    servings: "1 large loaf",
    image: "/images/recipes/sourdough-placeholder.jpg",
    ingredients: [
      "500g strong white bread flour (higher protein, the better)",
      "340ml lukewarm water",
      "150g active sourdough starter",
      "11g fine sea salt + 10ml of water when you add the salt",
      "Rice flour for dusting"
    ],
    instructions: [
      "Mix the active sourdough starter and water in a large bowl, then add your flour until just combined. Cover and let rest for 1hr (autolyse).",
      "Add the salt and 10ml water and perform your first stretch and fold.",
      "Perform 3 sets of stretch and folds every 30 minutes over 2 hours.",
      "Bulk ferment for 1hr minimum, I leave it in the oven with the bulb on.",
      "Pre-shape the dough and let rest for 20 minutes on the counter.",
      "Final shape and place in a rice flour covered banneton.",
      "Cold ferment in the fridge for 12-24 hours covered loosely (I use disposable shower nets, lol).",
      "Preheat Dutch oven to 250°C. Score the dough and bake covered for 30 minutes with a couple ice cubes. I reduce the oven to 220°C once the loaf goes in.",
      "Remove lid, and bake for 5 minutes until golden brown.",
      "Cool completely before slicing (at least 2 hours). If you cut it too quick it'll be stodgy and you're going to have a bad time."
    ],
    tips: [
      "The longer fermentation develops better flavor",
      "A sharp blade or lame is essential for scoring",
      "Steam is crucial for a good crust (aka why I add ice) - the Dutch oven method works perfectly",
      "If you let Dave know, he'll bring you some sourdough starter"
    ]
  },
  {
    id: 2,
    title: "Orange Juice Pastry Mince Pies",
    description: "My secret weapon during Christmas visits! Originally inspired by Josceline Dimbleby and upgraded by my Mum, the orange juice pastry is incredibly tender with a lovely citrus note, plus there's a cream cheese surprise that makes them absolute slappers.",
    difficulty: "Easy",
    time: "45 minutes",
    servings: "12 mince pies",
    image: "/images/recipes/mince-pies-placeholder.jpg",
    ingredients: [
      "400g plain white flour",
      "200g butter",
      "100g lard (or swap for butter if you don't F with lard)",
      "Juice and rind from 1 large orange",
      "1 tub of cream cheese",
      "Icing sugar",
      "Golden caster sugar (or whatever sugar you have)",
      "Milk",
      "300g good quality mincemeat"
    ],
    instructions: [
      "Mix the butter and lard into your flour until it resembles breadcrumbs. I use the Magimix (someone's doing well) my sister gave me as a wedding present with the blade attachment, but if you use a processor, make sure you don't overdo it, as the heat of the machine will melt the fats.",
      "Add the orange rind, mix, and then add the orange juice until the dough just comes together. Don't overwork it.",
      "Wrap in cling film and chill for 30 minutes.",
      "Preheat oven to 220°C. Grease a 12-hole muffin tin.",
      "Roll out pastry on a floured surface to 3mm thick. I use rice flour here, as it's gluten free, so aids non-stick.",
      "Cut 12 circles for bases and 12 smaller circles for tops.",
      "Line muffin tin with larger circles, fill with mincemeat and a dollop of cream cheese whipped with icing sugar.",
      "I cheat here, and dip the whole top in milk, as it's way quicker than brushing and helps seal the bottom and wash the top. Give them a shake so they're not too wet and seal the pies however you like. Sprinkle with a little golden caster sugar and stab the lid to allow steam to escape.",
      "Bake for 14 minutes until golden brown.",
      "Cool in tin for 5 minutes, then transfer to wire rack."
    ],
    tips: [
      "Don't overwork the pastry - it should just come together",
      "Fresh orange juice makes all the difference to the flavor",
      "These freeze beautifully - perfect for unexpected customer visits!"
    ]
  }
];

export default function RecipesPage() {
  const [selectedRecipe, setSelectedRecipe] = useState<number | null>(null);

  return (
    <>
      {/* Hidden SEO Content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "Recipe",
              "name": "Josceline Dimbleby Orange Juice Pastry Mince Pies with Cream Cheese",
              "author": {
                "@type": "Person",
                "name": "Dave Langdon"
              },
              "description": "Orange juice pastry mince pies inspired by Josceline Dimbleby, upgraded with cream cheese surprise filling. Perfect Christmas treats.",
              "keywords": "Josceline Dimbleby, orange juice pastry, mince pies, cream cheese, Christmas baking",
              "recipeCategory": "Dessert",
              "recipeCuisine": "British",
              "prepTime": "PT45M",
              "cookTime": "PT14M",
              "recipeYield": "12 mince pies",
              "recipeIngredient": [
                "400g plain white flour",
                "200g butter",
                "100g lard",
                "Juice and rind from 1 large orange",
                "1 tub of cream cheese",
                "300g good quality mincemeat"
              ],
              "image": "/images/recipes/20251208_205320.jpg"
            },
            {
              "@context": "https://schema.org",
              "@type": "Recipe",
              "name": "Dave's Go-To Sourdough Recipe",
              "author": {
                "@type": "Person",
                "name": "Dave Langdon"
              },
              "description": "Classic sourdough bread recipe using 4-year-old starter from Bristol. Perfect for sharing with customers.",
              "keywords": "sourdough bread, sourdough starter, homemade bread, artisan bread",
              "recipeCategory": "Bread",
              "recipeCuisine": "International",
              "prepTime": "PT24H",
              "cookTime": "PT35M",
              "recipeYield": "1 large loaf",
              "recipeIngredient": [
                "500g strong white bread flour",
                "340ml lukewarm water",
                "150g active sourdough starter",
                "11g fine sea salt"
              ],
              "image": "/images/recipes/20251125_083621.jpg"
            }
          ])
        }}
      />
      
      {/* Hidden keyword content for SEO */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <span>Josceline Dimbleby Orange Juice Pastry Mince Pies</span>
        <span>Orange Mince Pies with Cream Cheese</span>
        <span>Josceline Dimbleby mince pie recipe</span>
        <span>Orange juice pastry recipe Josceline Dimbleby</span>
        <span>Cream cheese mince pies orange pastry</span>
        <span>Dave Langdon Josceline Dimbleby recipe</span>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <FadeInOnScroll>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6">Dave's Kitchen</h1>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.2}>
            <p className="text-lg sm:text-xl md:text-2xl mb-3 md:mb-4">Baking with Love, Sharing with Customers</p>
          </FadeInOnScroll>
          <FadeInOnScroll delay={0.3}>
            <p className="text-base sm:text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
              As a sales agent, I believe in building personal relationships. Nothing says "thank you" like homemade baked goods! 
              Here are my go-to recipes that have won over customers across East Anglia.
            </p>
          </FadeInOnScroll>
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <FadeInOnScroll>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 md:mb-12 text-gray-800">My Signature Recipes</h2>
        </FadeInOnScroll>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {recipes.map((recipe, index) => (
            <FadeInOnScroll key={recipe.id} delay={0.2 * index}>
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Recipe Header */}
                <div className="relative min-h-[240px] sm:min-h-[280px] md:h-64 bg-gradient-to-br from-orange-200 to-amber-200">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-3 sm:p-4 md:p-6 max-w-full">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-3 md:mb-4 mx-auto shadow-lg">
                        <span className="text-lg sm:text-2xl md:text-3xl">
                          {recipe.id === 1 ? '🍞' : '🥧'}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-xl md:text-2xl font-bold text-gray-800 mb-1 sm:mb-2 leading-tight">{recipe.title}</h3>
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">{recipe.description}</p>
                    </div>
                  </div>
                </div>

                {/* Photo Gallery for Sourdough */}
                {recipe.id === 1 && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-3">
                          <Image
                            src="/images/recipes/20251125_083621.jpg"
                            alt="Dave's sourdough bread"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <p className="text-sm text-gray-600 text-center font-medium">Fresh from the oven</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-3">
                          <Image
                            src="/images/recipes/PXL_20251105_075506456.jpg"
                            alt="Sourdough bread process"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <p className="text-sm text-gray-600 text-center font-medium">Criss cross score because it's the easiest and looks cool</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center italic">
                      "24 hours of love and patience - worth every minute when you see them slice it open and it isn't crap inside (hahaha)!"
                    </p>
                  </div>
                )}

                {/* Photo Gallery for Mince Pies */}
                {recipe.id === 2 && (
                  <div className="p-6 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-3">
                          <Image
                            src="/images/recipes/20251208_205320.jpg"
                            alt="Finished batch of mince pies ready for customers"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <p className="text-sm text-gray-600 text-center font-medium">Making the magic happen</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="aspect-[4/3] relative rounded-lg overflow-hidden mb-3">
                          <Image
                            src="/images/recipes/PXL_20241205_204405012.jpg"
                            alt="Kitchen scene during mince pie making"
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                        </div>
                        <p className="text-sm text-gray-600 text-center font-medium">Ready for my customers!</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center italic">
                      "Super quick to make, especially if you pre make the pastry ready in the fridge!"
                    </p>
                  </div>
                )}

                {/* Recipe Info */}
                <div className="p-3 sm:p-4 md:p-6">
                  <div className="flex flex-wrap gap-1 sm:gap-2 md:gap-4 mb-3 sm:mb-4 md:mb-6 text-xs">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                      ⏱️ {recipe.time}
                    </span>
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs">
                      👥 {recipe.servings}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      📊 {recipe.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedRecipe(selectedRecipe === recipe.id ? null : recipe.id)}
                    className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-2 sm:py-3 px-3 sm:px-4 md:px-6 rounded-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-300 font-semibold text-xs sm:text-sm md:text-base"
                  >
                    {selectedRecipe === recipe.id ? 'Hide Recipe' : 'View Full Recipe'}
                  </button>

                  {/* Expanded Recipe Details */}
                  {selectedRecipe === recipe.id && (
                    <div className="mt-6 space-y-6 border-t pt-6">
                      {/* Ingredients */}
                      <div>
                        <h4 className="text-xl font-semibold mb-3 text-gray-800">🛒 Ingredients</h4>
                        <ul className="space-y-2">
                          {recipe.ingredients.map((ingredient, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-orange-500 mr-2">•</span>
                              <span className="text-gray-700">{ingredient}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h4 className="text-xl font-semibold mb-3 text-gray-800">👨‍🍳 Instructions</h4>
                        <ol className="space-y-3">
                          {recipe.instructions.map((instruction, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                                {idx + 1}
                              </span>
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Tips */}
                      <div>
                        <h4 className="text-xl font-semibold mb-3 text-gray-800">💡 Dave's Tips</h4>
                        <ul className="space-y-2">
                          {recipe.tips.map((tip, idx) => (
                            <li key={idx} className="flex items-start">
                              <span className="text-amber-500 mr-2">💡</span>
                              <span className="text-gray-700 italic">{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeInOnScroll>
          ))}
        </div>

        {/* Personal Note */}
        <FadeInOnScroll delay={0.4}>
          <div className="mt-16 bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">👨‍🍳</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Why I Bake for Business</h3>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
              In the world of sales, relationships matter more than anything. When I visit my customers with a fresh loaf of sourdough 
              or a box of homemade mince pies, it's not just about the business transaction - it's about showing how much I appreciate their custom.
            </p>
            <div className="mt-6 text-orange-600 font-semibold">
              Happy Baking! - Dave 🍞
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
    </>
  );
}
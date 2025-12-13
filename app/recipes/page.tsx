'use client';

import { useState } from 'react';
import VideoBackground from '../components/VideoBackground';

export default function RecipesPage() {
  const [activeRecipe, setActiveRecipe] = useState<'sourdough' | 'mince-pies' | null>(null);

  const recipes = {
    sourdough: {
      title: 'Sourdough Bread',
      description: 'A classic, tangy sourdough bread that\'s perfect for sharing with customers. This recipe creates a beautiful, crusty loaf with a chewy interior.',
      prepTime: '30 minutes active, 24-48 hours total',
      cookTime: '45-50 minutes',
      yield: '1 large loaf',
      ingredients: [
        '100g active sourdough starter',
        '375g warm water',
        '500g strong white bread flour',
        '10g fine sea salt',
        'Rice flour (for dusting)'
      ],
      instructions: [
        'Mix the starter and warm water in a large bowl until combined.',
        'Add the flour and salt, mix until a shaggy dough forms.',
        'Cover and let rest for 30 minutes.',
        'Perform 4-6 sets of stretch and folds, 30 minutes apart.',
        'Cover and bulk ferment for 4-6 hours at room temperature, or overnight in the fridge.',
        'Shape the dough into a round or oval boule.',
        'Place seam-side up in a floured banneton or bowl.',
        'Cover and refrigerate for 12-24 hours (cold proof).',
        'Preheat oven to 250°C (230°C fan) with a Dutch oven inside.',
        'Score the dough with a sharp knife or razor.',
        'Bake covered for 20 minutes, then uncovered at 230°C for 25-30 minutes.',
        'Cool completely on a wire rack before slicing.'
      ],
      tips: [
        'Feed your starter 4-8 hours before mixing for best results.',
        'The longer the cold proof, the more sour the flavour.',
        'Don\'t skip the preheat time - your Dutch oven needs to be very hot!',
        'Steam is crucial for a good crust - keep the lid on for the first 20 minutes.'
      ]
    },
    'mince-pies': {
      title: 'Orange Juice Pastry Mince Pies',
      description: 'My secret weapon during Christmas visits! Originally inspired by Josceline Dimbleby and upgraded by my Mum, the orange juice pastry is incredibly Flakey with a lovely citrus note, plus there\'s a cream cheese surprise that makes them absolute slappers.',
      prepTime: '30 minutes',
      cookTime: '15-20 minutes',
      yield: '12-15 pies',
      ingredients: [
        '400g plain flour',
        '200g salted butter',
        '100g lard (if you don\'t f*** with lard, use more butter)',
        '1 large orange, juice and zest',
        '1 jar (400g) good quality mincemeat',
        'Cream cheese whipped with icing sugar',
        'Milk (for dipping tops)',
        'Golden caster sugar (for sprinkling)',
        'Rice flour (for dusting when rolling)'
      ],
      instructions: [
        'Mix flour, butter and lard together until they resemble breadcrumbs. I use a Magimix (someone\'s doing well) - a wedding gift from my sister. If you\'re going to use a food processor, make sure you don\'t overdo it, as any excess heat will melt the fats.',
        'Add the orange zest, mix, and then add the orange juice. Mix until the dough is just combined. DON\'T OVERWORK IT.',
        'Wrap the pastry in clingfilm and chill for 30 minutes.',
        'Preheat oven to 220°C.',
        'Roll out pastry on a floured surface to 3mm thick. I use rice flour here, as it\'s gluten-free, so aids non-stick.',
        'Cut 12 circles for bases and 12 smaller circles for tops.',
        'Line muffin tin with larger circles, fill with mincemeat and a dollop of cream cheese whipped with icing sugar.',
        'I cheat here, and dip the whole top in milk, as it\'s way quicker than brushing and helps seal the top and bottom. Give them a shake so they\'re not too wet. Sprinkle with a little golden caster sugar and stab the lid to allow steam to escape.',
        'Bake for 14 minutes until golden brown.',
        'Cool in tin for 5 minutes, then transfer to wire rack.'
      ],
      tips: [
        'The orange juice gives the pastry a lovely citrus note - perfect with the spiced mincemeat.',
        'Don\'t overfill the pies or the filling will bubble over.',
        'These freeze beautifully - bake from frozen, adding 5 minutes to cooking time.',
        'Perfect for gifting - wrap in cellophane bags tied with ribbon!'
      ]
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="w-full h-[30vh] md:h-[40vh] relative overflow-hidden">
        <VideoBackground videoUrl="/videos/About/background.mp4">
          <div className="w-full h-full flex items-center justify-center bg-black/40">
            <div className="text-center px-4 max-w-3xl">
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                Dave&apos;s Baking Recipes
              </h1>
              <p className="text-base md:text-xl text-white drop-shadow-lg">
                Sharing my favourite recipes for gifting to customers. From classic sourdough to festive treats!
              </p>
            </div>
          </div>
        </VideoBackground>
      </div>

      {/* Recipes Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <p className="text-lg text-gray-700">
            As part of my business, I love sharing the things I bake with my customers. Here are my two go-to recipes that always go down well!
          </p>
        </div>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Sourdough Bread Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              activeRecipe === 'sourdough' ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setActiveRecipe(activeRecipe === 'sourdough' ? null : 'sourdough')}
          >
            <div className="h-64 bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">🍞</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">Sourdough Bread</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{recipes.sourdough.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>⏱️ {recipes.sourdough.prepTime}</span>
                <span>🍴 {recipes.sourdough.yield}</span>
              </div>
            </div>
          </div>

          {/* Mince Pies Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              activeRecipe === 'mince-pies' ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setActiveRecipe(activeRecipe === 'mince-pies' ? null : 'mince-pies')}
          >
            <div className="h-64 bg-gradient-to-br from-red-100 to-pink-200 flex items-center justify-center">
              <div className="text-center">
                <span className="text-6xl">🥧</span>
                <h2 className="text-2xl font-bold text-gray-900 mt-4">Orange Juice Pastry Mince Pies</h2>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{recipes['mince-pies'].description}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>⏱️ {recipes['mince-pies'].prepTime}</span>
                <span>🍴 {recipes['mince-pies'].yield}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recipe Details */}
        {activeRecipe && (
          <div className="bg-white rounded-xl shadow-xl p-8 mb-8 animate-in fade-in duration-300">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {recipes[activeRecipe].title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipes[activeRecipe].prepTime.split(',')[0]}</div>
                  <div className="text-sm text-gray-600 mt-1">Prep Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipes[activeRecipe].cookTime}</div>
                  <div className="text-sm text-gray-600 mt-1">Cook Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{recipes[activeRecipe].yield}</div>
                  <div className="text-sm text-gray-600 mt-1">Yield</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Ingredients */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">📝</span>
                    Ingredients
                  </h3>
                  <ul className="space-y-2">
                    {recipes[activeRecipe].ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span className="text-gray-700">{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                    <span className="mr-2">👨‍🍳</span>
                    Instructions
                  </h3>
                  <ol className="space-y-3">
                    {recipes[activeRecipe].instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-gray-700">{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Tips */}
              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">💡</span>
                  Pro Tips
                </h3>
                <ul className="space-y-2">
                  {recipes[activeRecipe].tips.map((tip, index) => (
                    <li key={index} className="flex items-start text-gray-700">
                      <span className="text-blue-600 mr-2">✨</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setActiveRecipe(null)}
                className="mt-6 w-full md:w-auto px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close Recipe
              </button>
            </div>
          </div>
        )}

        {/* Note Section */}
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Baking for Business
          </h3>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            I love sharing my baking with customers as a way to show appreciation for their custom. These recipes are my go-to favourites!
          </p>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Script from 'next/script';
import VideoBackground from '../components/VideoBackground';

export default function RecipesPage() {
  const [activeRecipe, setActiveRecipe] = useState<'sourdough' | 'mince-pies' | 'chocolate-puddings' | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const recipes = {
    sourdough: {
      title: 'Sourdough Bread',
      description: 'A classic, tangy sourdough bread that\'s perfect for sharing with customers. This recipe creates a beautiful, crusty loaf with a chewy interior.',
      prepTime: '30 minutes active, 24-48 hours total',
      cookTime: '45-50 minutes',
      yield: '1 large loaf',
      image: '/images/recipes/20251125_083621.jpg',
      ingredients: [
        '150g active sourdough starter',
        '340g warm water',
        '500g strong white bread flour',
        '11g fine sea salt + 10ml more water',
        'Rice flour (for dusting)'
      ],
      instructions: [
        'Mix the starter and warm water in a large bowl until combined. Add the flour, mix until a shaggy dough forms. Cover and let rest for 1hr.',
        'Add the salt and 10ml of water, and perform the first stretch and fold.',
        'Perform 3 additional sets of stretch and folds, 30 minutes apart.',
        'Cover and bulk ferment for at least 1 hour at room temperature, or overnight in the fridge. You can also leave it in the oven with the light on if your house is cold.',
        'Shape the dough into a round or oval boule.',
        'Place seam-side up in a floured banneton or bowl.',
        'Cover and refrigerate for 12-24 hours (cold proof).',
        'Preheat oven to 250°C (230°C fan) with a Dutch oven inside.',
        'Score the dough with a sharp knife or razor.',
        'Bake covered for 30 minutes, then uncovered at 220°C for 5 minutes until brown.',
        'Cool completely on a wire rack before slicing. Minimum 90 minutes or it\'ll be a stodgy mess.'
      ],
      tips: [
        'Feed your starter 4-8 hours before mixing for best results.',
        'The longer the cold proof, the more sour the flavour.',
        'Don\'t skip the preheat time - your Dutch oven needs to be very hot!',
        'Steam is crucial for a good crust - keep the lid on for the first 30 minutes.'
      ]
    },
    'mince-pies': {
      title: 'Orange Juice Pastry Mince Pies',
      description: 'My secret weapon during Christmas visits! Originally inspired by Josceline Dimbleby and upgraded by my Mum, the orange juice pastry is incredibly flaky with a lovely citrus note, plus there\'s a cream cheese surprise that makes them absolute slappers.',
      prepTime: '30 minutes',
      cookTime: '15-20 minutes',
      yield: '12-15 pies',
      image: '/images/recipes/20251208_205320.jpg',
    ingredients: [
        '400g plain flour',
        '200g salted butter',
        '100g Lard or Trex',
        '1 large orange, juice and zest',
        '1 jar (400g) good quality mincemeat',
        'Cream cheese whipped with icing sugar',
        'Milk (for dipping tops)',
        'Golden caster sugar (or whatever sugar you have, I don\'t really care)',
        'Rice flour (for dusting when rolling)'
    ],
    instructions: [
        'Mix flour, butter and lard/trex together until they resemble breadcrumbs. I use a Magimix (someone\'s doing well / a wedding gift from my sister). If you\'re going to use a food processor, make sure you don\'t overdo it, as any excess heat will melt the fats.',
        'Add the orange zest, mix, and then add the orange juice. Mix until the dough is just combined. DON\'T OVERWORK IT.',
        'Wrap the pastry in clingfilm and chill for 30 minutes.',
        'Preheat oven to 220°C.',
        'Roll out pastry on a floured surface to 3mm thick. I use rice flour here, as it\'s gluten-free, so aids non-stick.',
        'Cut 12 circles for bases and 12 smaller circles for tops.',
        'Grease the muffin tin with butter and greaseproof paper.',
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
    },
    'chocolate-puddings': {
      title: 'Mini Chocolate Christmas Puddings',
      description: 'A festive no-bake treat perfect for Christmas visits! These mini chocolate puddings look like traditional Christmas puddings but are made with chocolate, biscuits, and dried fruit - a delightful alternative that customers love.',
      prepTime: '30 minutes',
      cookTime: '8-13 minutes (melting time)',
      yield: '30 mini puddings',
      image: '/images/recipes/chocolate-puddings.jpg',
    ingredients: [
        '100g butter, diced',
        '2 tbsp golden syrup',
        '1 tbsp milk',
        '150g plain chocolate',
        '225g digestive biscuits, crushed',
        '50g raisins',
        '50g glacé cherries',
        '40g shelled hazelnuts, chopped',
        '50g white chocolate',
        '5 glacé cherries, cut into small pieces (for decoration)'
    ],
    instructions: [
        'Place the butter, syrup and milk in a large, heat-proof bowl over a saucepan of simmering water and heat for 3-5 minutes, stirring until melted and smooth. Remove from the heat.',
        'Melt the plain chocolate in a bowl over a pan of boiling water, then add it to the butter, syrup and milk mixture.',
        'Add the crushed biscuits, raisins, glacé cherries and chopped hazelnuts. Mix until well combined.',
        'With a teaspoon, shape the mixture into rounds, repeating until you have used up the mixture and made approximately 30 rounds. Place on a baking tray lined with parchment paper.',
        'Chill for 1 hour or until firm.',
        'Melt the white chocolate (as above) and spread a little on the top of each round. Then decorate each round with a cherry piece.',
        'Chill for a further 30 minutes or until the chocolate has set, then serve as petit fours.'
    ],
    tips: [
        'These are perfect for Christmas gifting - they look festive and taste delicious!',
        'Make sure the chocolate is fully melted before mixing to avoid lumps.',
        'You can substitute the hazelnuts with other nuts if preferred.',
        'Store in the fridge until ready to serve or gift.'
      ]
    }
  };

  // Generate Recipe Schema for SEO
  const generateRecipeSchema = (recipe: typeof recipes[keyof typeof recipes]) => {
    const instructions = recipe.instructions.map((inst, idx) => ({
      '@type': 'HowToStep',
      position: idx + 1,
      text: inst
    }));

    const prepTimeMatch = recipe.prepTime.match(/\d+/);
    const cookTimeMatch = recipe.cookTime.match(/\d+/);
    
    return {
      '@context': 'https://schema.org',
      '@type': 'Recipe',
      name: recipe.title,
      description: recipe.description,
      image: `https://www.easalesltd.co.uk${recipe.image}`,
      prepTime: prepTimeMatch ? `PT${prepTimeMatch[0]}M` : 'PT30M',
      cookTime: cookTimeMatch ? `PT${cookTimeMatch[0]}M` : 'PT15M',
      recipeYield: recipe.yield,
      recipeIngredient: recipe.ingredients,
      recipeInstructions: instructions,
      author: {
        '@type': 'Person',
        name: 'Dave Langdon'
      },
      publisher: {
        '@type': 'Organization',
        name: 'East Anglian Sales LTD',
        url: 'https://www.easalesltd.co.uk'
      }
    };
  };

  const recipeSchemas = [
    generateRecipeSchema(recipes.sourdough),
    generateRecipeSchema(recipes['mince-pies']),
    generateRecipeSchema(recipes['chocolate-puddings'])
  ];

  return (
    <div className="min-h-screen">
      {/* Recipe Schema Markup for SEO */}
      <Script
        id="recipe-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeSchemas)
        }}
      />

      {/* Hidden SEO Text - Screen reader only, not visible but indexed by Google */}
      <div className="sr-only">
        <h2>Baking Recipes</h2>
        <p>
          Sourdough bread recipe, sourdough starter recipe, homemade sourdough bread, sourdough bread recipe UK, 
          easy sourdough bread recipe, sourdough bread recipe no knead, sourdough bread recipe beginner, 
          sourdough bread recipe with starter, sourdough bread recipe step by step, sourdough bread recipe video,
          Orange juice pastry mince pies recipe, mince pies recipe, Christmas mince pies recipe, 
          orange juice pastry recipe, homemade mince pies recipe, mince pies recipe UK, easy mince pies recipe,
          mince pies recipe with orange juice, mince pies recipe cream cheese, mince pies recipe Christmas,
          Mini chocolate Christmas puddings recipe, chocolate Christmas puddings recipe, mini Christmas puddings recipe,
          no bake Christmas puddings recipe, chocolate puddings recipe, Christmas pudding recipe chocolate,
          mini chocolate puddings recipe UK, easy chocolate Christmas puddings recipe, chocolate Christmas puddings recipe no bake,
          Dave Langdon recipes, Dave Langdon baking recipes, East Anglian Sales recipes, business baking recipes,
          customer gift recipes, homemade gift recipes, Christmas baking recipes, festive baking recipes
        </p>
      </div>

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
            As part of my business, I love sharing the things I bake with my customers. Here are my go-to recipes that always go down well!
          </p>
        </div>

        {/* Recipe Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Sourdough Bread Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              activeRecipe === 'sourdough' ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setActiveRecipe(activeRecipe === 'sourdough' ? null : 'sourdough')}
          >
            <div className="h-64 relative overflow-hidden">
              <Image
                src={recipes.sourdough.image}
                alt="Sourdough Bread"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl">🍞</span>
                  <h2 className="text-2xl font-bold text-white mt-4 drop-shadow-lg">Sourdough Bread</h2>
                </div>
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
            <div className="h-64 relative overflow-hidden">
                          <Image
                src={recipes['mince-pies'].image}
                alt="Orange Juice Pastry Mince Pies"
                            fill
                            className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
                          />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl">🥧</span>
                  <h2 className="text-2xl font-bold text-white mt-4 drop-shadow-lg">Orange Juice Pastry Mince Pies</h2>
                </div>
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

          {/* Chocolate Puddings Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl ${
              activeRecipe === 'chocolate-puddings' ? 'ring-4 ring-blue-500' : ''
            }`}
            onClick={() => setActiveRecipe(activeRecipe === 'chocolate-puddings' ? null : 'chocolate-puddings')}
          >
            <div className="h-64 relative overflow-hidden">
                          <Image
                src={recipes['chocolate-puddings'].image}
                alt="Mini Chocolate Christmas Puddings"
                            fill
                            className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                unoptimized
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-6xl">🍫</span>
                  <h2 className="text-2xl font-bold text-white mt-4 drop-shadow-lg">Mini Chocolate Christmas Puddings</h2>
                </div>
              </div>
                        </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">{recipes['chocolate-puddings'].description}</p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>⏱️ {recipes['chocolate-puddings'].prepTime}</span>
                <span>🍴 {recipes['chocolate-puddings'].yield}</span>
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

              {/* Recipe Image */}
              {recipes[activeRecipe].image && (
                <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
                  <Image
                    src={recipes[activeRecipe].image}
                    alt={recipes[activeRecipe].title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 768px"
                    priority
                    unoptimized
                  />
                  </div>
                )}

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

        {/* Customer Testimonials Section - Rolling Banner */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-8 mb-8 overflow-hidden">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            What Customers Say
          </h3>
          <div className="relative max-w-3xl mx-auto">
            {/* Testimonial Display */}
            <div className="relative h-48 overflow-hidden">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === currentTestimonial ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-amber-500 h-full flex items-center">
                    <div className="flex items-start w-full">
                      <span className="text-4xl mr-4 flex-shrink-0">{testimonial.icon}</span>
                      {testimonial.multiline ? (
                        <div className="text-gray-700 italic text-lg leading-relaxed">
                          {testimonial.text.split('\n').map((line, i) => (
                            <p key={i} className={i === 0 ? 'mb-2' : i < testimonial.text.split('\n').length - 1 ? 'mb-2' : ''}>
                              {i === 0 ? `"${line}` : i === testimonial.text.split('\n').length - 1 ? `${line}"` : line}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-700 italic text-lg leading-relaxed">
                          &quot;{testimonial.text}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-6 gap-2">
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
        <div className="bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Baking for Business
          </h3>
          <div className="text-lg text-gray-700 max-w-2xl mx-auto">
            <p>
              I love sharing my baking with customers as a way to show appreciation for their custom. These recipes are my go-to favourites!
            </p>
            <p className="mt-4">
              Also buy some greeting cards or gifts, I&apos;ve got so many kids.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

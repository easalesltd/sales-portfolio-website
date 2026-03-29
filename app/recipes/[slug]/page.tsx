import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getRecipeBySlug, getAllRecipeSlugs, Recipe } from '../../data/recipes';
import type { Metadata } from 'next';
import RecipeActions from './RecipeActions';
import PrintButton from './PrintButton';

export async function generateStaticParams() {
  const slugs = getAllRecipeSlugs();
  return slugs.map((slug) => ({
    slug: slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const recipe = getRecipeBySlug(resolvedParams.slug);
  
  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  // Generate recipe-specific keywords based on recipe type
  const getRecipeKeywords = (recipe: Recipe): string[] => {
    const baseKeywords = [
      recipe.title.toLowerCase(),
      `${recipe.title.toLowerCase()} recipe`,
      'Dave Langdon recipes',
      'Dave Langdon baking recipes',
      'East Anglian Sales recipes',
      'business baking recipes',
      'customer gift recipes'
    ];

    // Add sourdough-specific keywords
    if (recipe.slug === 'sourdough-bread') {
      return [
        ...baseKeywords,
        'foolproof beginners sourdough recipe',
        'foolproof sourdough bread recipe',
        'easy sourdough recipe for beginners',
        'simple sourdough bread recipe',
        'beginner friendly sourdough',
        'sourdough recipe beginners',
        'sourdough bread recipe easy',
        'foolproof sourdough starter recipe'
      ];
    }

    // Add mince pie-specific keywords (orange juice/zest and Josceline Dimbleby)
    if (recipe.slug === 'orange-juice-pastry-mince-pies') {
      return [
        ...baseKeywords,
        'orange zest mince pies',
        'orange zest pastry recipe',
        'orange juice pastry',
        'orange juice in pastry',
        'Josceline Dimbleby mince pies',
        'Josceline Dimbleby recipe',
        'orange zest mince pies recipe',
        'citrus mince pies recipe',
        'orange flavoured mince pies',
        'orange juice mincemeat pies'
      ];
    }

    return baseKeywords;
  };

  return {
    title: `${recipe.title} | Dave's Favourite Recipes`,
    description: recipe.description,
    keywords: getRecipeKeywords(recipe).join(', '),
    openGraph: {
      title: `${recipe.title} | Dave's Favourite Recipes`,
      description: recipe.description,
      images: [`https://www.easalesltd.co.uk${recipe.image}`],
      url: `https://www.easalesltd.co.uk/recipes/${recipe.slug}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${recipe.title} | Dave's Favourite Recipes`,
      description: recipe.description,
      images: [`https://www.easalesltd.co.uk${recipe.image}`],
    },
    alternates: {
      canonical: `https://www.easalesltd.co.uk/recipes/${recipe.slug}`,
    },
  };
}

function generateRecipeSchema(recipe: Recipe) {
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
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await Promise.resolve(params);
  const recipe = getRecipeBySlug(resolvedParams.slug);

  if (!recipe) {
    notFound();
  }

  const recipeSchema = generateRecipeSchema(recipe);

  return (
    <>
      <script
        id={`recipe-schema-${recipe.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(recipeSchema)
        }}
      ></script>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Recipes Link */}
        <Link 
          href="/recipes"
          className="inline-flex items-center text-neutral-900 hover:text-neutral-600 mb-6 transition-colors no-print dark:text-neutral-100 dark:hover:text-neutral-300"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Recipes
        </Link>

        {/* Recipe Content */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 recipe-print-content">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 no-print">
              <h1 className="text-4xl font-bold text-gray-900 text-center md:text-left">
                {recipe.title}
              </h1>
              <RecipeActions recipe={recipe} />
            </div>

            {/* Recipe Image */}
            {recipe.image && (
              <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden no-print-image print-hidden">
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                  priority
                  quality={85}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-lg print-margin-top">
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-950 dark:text-white">{recipe.prepTime.split(',')[0]}</div>
                <div className="text-sm text-gray-600 mt-1">Prep Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-950 dark:text-white">{recipe.cookTime}</div>
                <div className="text-sm text-gray-600 mt-1">Cook Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-neutral-950 dark:text-white">{recipe.yield}</div>
                <div className="text-sm text-gray-600 mt-1">Yield</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Ingredients */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">📝</span>
                  Ingredients
                </h2>
                <ul className="space-y-2">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-neutral-950 dark:text-white mr-2">•</span>
                      <span className="text-gray-700">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Instructions */}
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">👨‍🍳</span>
                  Instructions
                </h2>
                <ol className="space-y-3">
                  {recipe.instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-neutral-950 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5 dark:bg-white dark:text-neutral-950">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Tips */}
            <div className="mt-8 p-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <span className="mr-2">💡</span>
                Pro Tips
              </h3>
              <ul className="space-y-2">
                {recipe.tips.map((tip, index) => (
                  <li key={index} className="flex items-start text-gray-700">
                    <span className="text-neutral-950 dark:text-white mr-2">✨</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-6 no-print">
              <Link
                href="/recipes"
                className="w-full sm:w-auto px-6 py-3 rounded-lg border border-neutral-950 bg-neutral-950 text-white hover:bg-neutral-800 transition-colors text-center dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                Back to All Recipes
              </Link>
              <PrintButton />
            </div>
          </div>
        </div>
      </div>

      {/* Hidden SEO text */}
      <div className="sr-only">
        <p>
          {recipe.title} recipe by Dave Langdon. {recipe.description}
          {recipe.slug === 'sourdough-bread' && ' Foolproof beginners sourdough recipe that is easy to follow. Simple sourdough bread recipe for beginners.'}
          {recipe.slug === 'orange-juice-pastry-mince-pies' && ' Originally inspired by Josceline Dimbleby, this recipe uses orange juice and orange zest in the pastry. Orange zest mince pies recipe with citrus pastry.'}
          How to make {recipe.title.toLowerCase()}.
          {recipe.title} ingredients: {recipe.ingredients.join(', ')}.
          {recipe.title} instructions: {recipe.instructions.join(' ')}.
          Dave Langdon recipes, East Anglian Sales recipes, business baking recipes.
        </p>
      </div>
    </>
  );
}


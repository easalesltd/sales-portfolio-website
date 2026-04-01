import { getCspNonce } from '@/app/lib/csp-nonce';
import { getAllRecipes } from '../data/recipes';
import RecipesIndexClient from './RecipesIndexClient';

const reviewSnippets = [
  "Also those mince pies are THE BEST ive ever eaten!!! Thank you so much!!",
  "Hi Dave\nA big THANK YOU from all the staff – they loved your mince pies and are intrigued by the secret ingredients!\nHave a wonderful Christmas and a Happy New Year!\nSee you at Harrogate, when it starts all over again!",
  "Oscar (weekend staff) who was on the till just had his break and had a mince pie. When he returned he exclaimed 'that was the best mince pie I've ever had!'",
  'Omg that bread taste amazing .. thank you',
  'The decision of this house is 👍 the bread is amazing they are addicted to it "best bread ever" thank you so much Dave xx',
  'Hi Dave,\n\nMince pie was 10/10! Thank you!',
  'Your bread was absolutely amazing! Thank you so so much for treating us! It was so good!!!!!!!!!',
  'Hello lovely, i forgot to say thank you for the lovely bread before you left yesterday. It was very lovely 🤤 I scoffed some for my lunch x',
];

export default async function RecipesPage() {
  const nonce = await getCspNonce();
  const recipes = getAllRecipes();

  const collectionSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    '@id': 'https://www.easalesltd.co.uk/recipes#collectionpage',
    name: "Dave's Favourite Recipes",
    description:
      "Dave Langdon's favourite baking recipes for gifting to customers. Includes sourdough bread, orange juice pastry mince pies, and mini chocolate Christmas puddings.",
    url: 'https://www.easalesltd.co.uk/recipes',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: recipes.map((recipe, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Recipe',
          '@id': `https://www.easalesltd.co.uk/recipes/${recipe.slug}`,
          name: recipe.title,
          description: recipe.description,
          image: `https://www.easalesltd.co.uk${recipe.image}`,
          url: `https://www.easalesltd.co.uk/recipes/${recipe.slug}`,
        },
      })),
    },
    author: {
      '@type': 'Person',
      name: 'Dave Langdon',
    },
    publisher: {
      '@type': 'Organization',
      name: 'East Anglian Sales LTD',
      url: 'https://www.easalesltd.co.uk',
    },
  };

  const reviewSchema = {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': 'https://www.easalesltd.co.uk/recipes#reviews',
    itemReviewed: {
      '@type': 'Recipe',
      name: "Dave's Favourite Recipes",
    },
    reviewBody: reviewSnippets.join(' '),
    author: {
      '@type': 'Person',
      name: 'Customer Reviews',
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(reviewSchema),
        }}
      />
      <RecipesIndexClient />
    </>
  );
}

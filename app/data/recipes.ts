export interface Recipe {
  id: string;
  slug: string;
  title: string;
  description: string;
  prepTime: string;
  cookTime: string;
  yield: string;
  image: string;
  ingredients: string[];
  instructions: string[];
  tips: string[];
}

export const recipes: Record<string, Recipe> = {
  sourdough: {
    id: 'sourdough',
    slug: 'sourdough-bread',
    title: 'Sourdough Bread',
    description: 'A foolproof sourdough bread recipe perfect for beginners! This classic, tangy sourdough bread creates a beautiful, crusty loaf with a chewy interior. Easy to follow step-by-step instructions.',
    prepTime: '30 minutes active, 24-48 hours total',
    cookTime: '45-50 minutes',
    yield: '1 large loaf',
    image: '/images/recipes/20251125_083621.jpg',
    ingredients: [
      '150g active sourdough starter (I can give you this if you need it)',
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
    id: 'mince-pies',
    slug: 'orange-juice-pastry-mince-pies',
    title: 'Orange Juice Pastry Mince Pies',
    description: 'My secret weapon during Christmas visits! Originally inspired by Josceline Dimbleby and upgraded by my Mum, the orange juice pastry with orange zest is incredibly flaky with a lovely citrus note, plus there\'s a cream cheese surprise that makes them absolute slappers.',
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
    id: 'chocolate-puddings',
    slug: 'mini-chocolate-christmas-puddings',
    title: 'Mini Chocolate Christmas Puddings',
    description: 'A festive no-bake treat perfect for Christmas visits! These mini chocolate puddings look like traditional Christmas puddings but are made with chocolate, biscuits, and dried fruit - a delightful alternative that customers love.',
    prepTime: '30 minutes',
    cookTime: '8-13 minutes (melting time)',
    yield: '30 mini puddings',
    image: '/images/recipes/mini-chocolate-xmas-puds.jpg',
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

export const getAllRecipeSlugs = () => {
  return Object.values(recipes).map(recipe => recipe.slug);
};

export const getRecipeBySlug = (slug: string): Recipe | undefined => {
  return Object.values(recipes).find(recipe => recipe.slug === slug);
};

export const getAllRecipes = (): Recipe[] => {
  return Object.values(recipes);
};


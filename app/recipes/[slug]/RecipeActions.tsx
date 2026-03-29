'use client';

import { Recipe } from '../../data/recipes';

interface RecipeActionsProps {
  recipe: Recipe;
}

export default function RecipeActions({ recipe }: RecipeActionsProps) {
  return (
    <div className="flex flex-wrap justify-center md:justify-end gap-2">
      {/* Print/PDF Button */}
      <button
        onClick={() => window.print()}
        className="px-4 py-2 border border-neutral-950 bg-neutral-950 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium flex items-center gap-2 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        aria-label="Print recipe"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
        </svg>
        Print/Save PDF
      </button>
      {/* Share Buttons */}
      <button
        onClick={() => {
          const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
          window.open(url, '_blank', 'width=600,height=400');
        }}
        className="px-4 py-2 border border-neutral-950 bg-neutral-950 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        aria-label="Share on Facebook"
      >
        Facebook
      </button>
      <button
        onClick={() => {
          const text = `Check out this recipe: ${recipe.title}`;
          const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`;
          window.open(url, '_blank', 'width=600,height=400');
        }}
        className="px-4 py-2 border border-neutral-950 bg-neutral-950 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        aria-label="Share on Twitter"
      >
        Twitter
      </button>
      <button
        onClick={() => {
          const url = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(`https://www.easalesltd.co.uk${recipe.image}`)}&description=${encodeURIComponent(recipe.title)}`;
          window.open(url, '_blank', 'width=600,height=400');
        }}
        className="px-4 py-2 border border-neutral-950 bg-neutral-950 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        aria-label="Share on Pinterest"
      >
        Pinterest
      </button>
      <button
        onClick={() => {
          const subject = encodeURIComponent(`Recipe: ${recipe.title}`);
          const body = encodeURIComponent(`Check out this recipe:\n${window.location.href}`);
          window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }}
        className="px-4 py-2 border border-neutral-700 bg-neutral-700 text-white rounded-md hover:bg-neutral-800 transition-colors text-sm font-medium"
        aria-label="Share via email"
      >
        Email
      </button>
    </div>
  );
}


'use client';

import AnimatedBrandWall from '../components/AnimatedBrandWall';

export default function BrandWallTestPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Animated Brand Wall (Test)</h1>
        <p className="text-gray-600 mb-8">Auto-scrolling partner logos with hover focus. Links go to each brand page.</p>

        <AnimatedBrandWall rowHeight={84} speedSeconds={36} />
      </section>
    </div>
  );
}



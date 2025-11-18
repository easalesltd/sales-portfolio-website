import Image from 'next/image';

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">dave-portrait-2025.jpg</h2>
          <div className="relative h-64 w-full">
            <Image
              src="/images/about/dave-portrait-2025.jpg"
              alt="Test PXL image"
              fill
              className="object-cover"
            />
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-2">Screenshot-2025-08-30-at-17-41-48.png</h2>
          <div className="relative h-64 w-full">
            <Image
              src="/images/about/Screenshot-2025-08-30-at-17-41-48.png"
              alt="Test Screenshot image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

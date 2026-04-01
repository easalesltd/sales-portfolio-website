import Image from 'next/image';

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Image Test Page</h1>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold mb-2">Guitar Training 101.jpg</h2>
          <div className="relative h-64 w-full">
            <Image
              src="/images/about/Guitar%20Training%20101.jpg"
              alt="Test about image"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Team Ohh Deer at Spring Fair NEC.png</h2>
          <div className="relative h-64 w-full">
            <Image
              src="/images/about/Team%20Ohh%20Deer%20at%20Spring%20Fair%20NEC.png"
              alt="Test about image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

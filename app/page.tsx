import Image from "next/image";
import Link from "next/link";
import { companies } from "./data/companies";
import ShowcaseSlideshow from "./components/ShowcaseSlideshow";
import VideoBackground from "./components/VideoBackground";
import { metadata } from "./metadata";

export { metadata };

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero Section with Background Video */}
      <div className="h-[30vh] md:h-[80vh] min-h-[200px] md:min-h-[600px] w-full relative overflow-hidden">
        <VideoBackground videoUrl="/videos/background.mp4">
          <div className="w-full h-full">
            <ShowcaseSlideshow />
          </div>
        </VideoBackground>
      </div>

      {/* About Section */}
      <div className="bg-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Welcome to EA Sales</h2>
          <p className="text-lg text-gray-700 mb-6">
            We&apos;re your friendly supplier of quality Greeting Cards, Stationery, and Gifts across East Anglia. From charming Independent Shops to bustling Garden Centres, we help retailers create amazing displays that customers love.
          </p>
          <p className="text-lg text-gray-700 mb-8">
            Based in Suffolk and covering Norfolk, Essex, and Cambridgeshire, we&apos;re here to help your business grow. Ready to explore our brands? Let&apos;s chat!
          </p>
          <div className="flex justify-center gap-6">
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Request an Agent Visit
            </Link>
            <Link 
              href="/about" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              About Us
            </Link>
            <Link 
              href="/contact" 
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Get In Touch
            </Link>
          </div>
        </div>
      </div>

      {/* Brands Grid */}
      <div id="partner-brands" className="relative min-h-screen">
        <VideoBackground videoUrl="/videos/brands-background.mp4">
          <div className="py-20">
            <div className="max-w-7xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-4 text-gray-900">Our Partner Brands</h2>
              <h3 className="text-xl text-center mb-12 text-gray-700">Quality Products from Leading Suppliers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {companies.map((company) => (
                  <Link 
                    key={company.id}
                    href={`/companies/${company.slug}`}
                    className="group block bg-white/90 backdrop-blur-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="aspect-[3/2] relative">
                      <Image
                        src={company.logoUrl}
                        alt={`${company.name} logo`}
                        fill
                        className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-6 bg-white/90 backdrop-blur-sm">
                      <h3 className="text-xl font-semibold text-center text-gray-900">{company.name}</h3>
                      <p className="text-gray-700 text-center mt-2">{company.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </VideoBackground>
      </div>
    </main>
  );
}

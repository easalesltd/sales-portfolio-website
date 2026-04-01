"use client";

import Link from "next/link";
import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa";
import FadeInOnScroll from "../../components/FadeInOnScroll";

export default function AboutContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": "https://www.easalesltd.co.uk/about/contact#contactpage",
    name: "Contact Dave Langdon",
    description:
      "Direct contact details for Dave Langdon, sales agent for East Anglian Sales LTD.",
    url: "https://www.easalesltd.co.uk/about/contact",
    mainEntity: {
      "@type": "Person",
      name: "Dave Langdon",
      alternateName: "David Langdon",
      telephone: "+447709197915",
      email: "dave@easalesltd.co.uk",
      sameAs: [
        "https://www.instagram.com/eastangliansalesltd/",
        "https://www.linkedin.com/in/dave-langdon-709a8547",
        "https://www.facebook.com/eastangliansalesltd",
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema),
        }}
      />
      <div className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeInOnScroll>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-4 text-center">
              Contact Dave
            </h1>
            <p className="text-center text-gray-700 dark:text-neutral-300 mb-8 max-w-2xl mx-auto">
              Reach Dave Langdon directly for wholesale greeting cards, gifts,
              and display solutions across Suffolk, Norfolk, Essex,
              Cambridgeshire, and Hertfordshire. For a visit request you can also
              use the main{" "}
              <Link
                href="/contact"
                className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600 dark:text-neutral-100 dark:hover:text-neutral-300"
              >
                contact page
              </Link>
              .
            </p>
          </FadeInOnScroll>

          <FadeInOnScroll delay={0.12} direction="up">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-100 dark:border-neutral-800 p-8 transition-shadow duration-300 hover:shadow-xl">
              <dl className="space-y-6">
                <div className="flex items-start gap-4">
                  <dt className="sr-only">Mobile</dt>
                  <FaPhone
                    className="text-2xl text-gray-600 dark:text-neutral-400 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <dd>
                    <span className="block text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-1">
                      Mobile
                    </span>
                    <a
                      href="tel:07709197915"
                      className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
                    >
                      07709 197915
                    </a>
                  </dd>
                </div>

                <div className="flex items-start gap-4">
                  <dt className="sr-only">Email</dt>
                  <FaEnvelope
                    className="text-2xl text-gray-600 dark:text-neutral-400 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <dd>
                    <span className="block text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-1">
                      Email
                    </span>
                    <a
                      href="mailto:dave@easalesltd.co.uk"
                      className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300 break-all"
                    >
                      dave@easalesltd.co.uk
                    </a>
                  </dd>
                </div>

                <div className="flex items-start gap-4">
                  <dt className="sr-only">Instagram</dt>
                  <FaInstagram
                    className="text-2xl text-gray-600 dark:text-neutral-400 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <dd>
                    <span className="block text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-1">
                      Instagram
                    </span>
                    <a
                      href="https://www.instagram.com/eastangliansalesltd/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
                    >
                      @eastangliansalesltd
                    </a>
                  </dd>
                </div>

                <div className="flex items-start gap-4">
                  <dt className="sr-only">LinkedIn</dt>
                  <FaLinkedin
                    className="text-2xl text-gray-600 dark:text-neutral-400 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <dd>
                    <span className="block text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-1">
                      LinkedIn
                    </span>
                    <a
                      href="https://www.linkedin.com/in/dave-langdon-709a8547"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
                    >
                      linkedin.com/in/dave-langdon-709a8547
                    </a>
                  </dd>
                </div>

                <div className="flex items-start gap-4">
                  <dt className="sr-only">Facebook</dt>
                  <FaFacebook
                    className="text-2xl text-gray-600 dark:text-neutral-400 shrink-0 mt-0.5"
                    aria-hidden
                  />
                  <dd>
                    <span className="block text-sm font-semibold text-gray-500 dark:text-neutral-400 mb-1">
                      Facebook
                    </span>
                    <a
                      href="https://www.facebook.com/eastangliansalesltd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
                    >
                      facebook.com/eastangliansalesltd
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </FadeInOnScroll>
        </div>
      </div>
    </>
  );
}

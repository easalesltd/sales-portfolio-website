"use client";

import {
  FaEnvelope,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaPhone,
} from "react-icons/fa";
import { FACEBOOK_PAGE_URL } from "@/app/data/business-entity";
import FadeInOnScroll from "../../components/FadeInOnScroll";
import { trackGaEvent } from "@/app/lib/ga-event";

export default function AboutContactClient() {
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInOnScroll>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-neutral-100 mb-8 text-center">
            Contact Dave
          </h1>
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
                    onClick={() => trackGaEvent("phone_click", { location: "about_contact_page" })}
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
                    onClick={() => trackGaEvent("email_click", { location: "about_contact_page" })}
                    className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300 break-all"
                  >
                    dave@easalesltd.co.uk
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
                    href={FACEBOOK_PAGE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg text-neutral-900 font-medium hover:text-neutral-600 transition-colors dark:text-neutral-100 dark:hover:text-neutral-300"
                  >
                    East Anglian Sales LTD
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
            </dl>
          </div>
        </FadeInOnScroll>
      </div>
    </div>
  );
}

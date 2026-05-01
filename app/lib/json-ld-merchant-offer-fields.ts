/**
 * Optional Product/Offer fields Google Search may request for richer appearance.
 * Values are conservative UK trade defaults; `merchantReturnLink` points visitors to contact for full terms.
 */
export const JSON_LD_SITE_ORIGIN = 'https://www.easalesltd.co.uk';

export function jsonLdMerchantOfferComplianceFields(): {
  shippingDetails: Record<string, unknown>[];
  hasMerchantReturnPolicy: Record<string, unknown>;
} {
  return {
    shippingDetails: [
      {
        '@type': 'OfferShippingDetails',
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'GB',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: 'GBP',
        },
      },
    ],
    hasMerchantReturnPolicy: {
      '@type': 'MerchantReturnPolicy',
      applicableCountry: 'GB',
      returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
      merchantReturnDays: 30,
      returnMethod: 'https://schema.org/ReturnByMail',
      returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
      merchantReturnLink: `${JSON_LD_SITE_ORIGIN}/contact`,
    },
  };
}

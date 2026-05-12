export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'Amaterra Dental Clinic',
    image: 'https://amaterra.md/logo.webp',
    '@id': 'https://amaterra.md',
    url: 'https://amaterra.md',
    telephone: '+373-YOUR-PHONE',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'YOUR STREET ADDRESS',
      addressLocality: 'Chișinău',
      postalCode: 'YOUR POSTAL CODE',
      addressCountry: 'MD',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 47.0105, // Замени на реальные координаты
      longitude: 28.8638,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: [
      'https://www.facebook.com/amaterra',
      'https://www.instagram.com/amaterra',
    ],
  }
}

export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Amaterra Dental Clinic',
    url: 'https://amaterra.md',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://amaterra.md/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  }
}

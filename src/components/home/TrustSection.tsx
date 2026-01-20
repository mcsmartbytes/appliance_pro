const trustPoints = [
  {
    title: 'Independent Since 1998',
    description: 'Family-owned and operated for over 25 years',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    title: 'Serving Greater Sedalia',
    description: 'Delivery throughout the region',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Buy & Resell Quality Used',
    description: 'We purchase working appliances and sell them cleaned and tested',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    title: 'Licensed & Local',
    description: 'Insured professionals you can trust',
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
];

const serviceAreas = [
  'Sedalia',
  'Warrensburg',
  'Warsaw',
  'Boonville',
  'Marshall',
];

export default function TrustSection() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Sedalia Families &amp; Landlords Choose Us
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            For over 25 years, we&apos;ve been helping families and property managers find reliable appliances at fair prices.
          </p>
        </div>

        {/* Trust points grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {trustPoints.map((point, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D2691E]/10 text-[#D2691E] mb-4">
                {point.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{point.title}</h3>
              <p className="text-sm text-gray-600">{point.description}</p>
            </div>
          ))}
        </div>

        {/* Service areas */}
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-4">Areas We Serve</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {serviceAreas.map((area) => (
              <span
                key={area}
                className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

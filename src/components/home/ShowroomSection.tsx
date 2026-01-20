import Image from 'next/image';
import Link from 'next/link';

export default function ShowroomSection() {
  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="relative w-full h-72 sm:h-96">
            <Image
              src="/images/benitz-showroom.jpg"
              alt="Benitz Appliance Shop showroom"
              fill
              className="rounded-2xl object-cover shadow-xl"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">See the Selection in Person</h2>
            <p className="text-gray-600 mb-6">
              Visit our Sedalia showroom to compare models side by side, ask questions,
              and find the right fit for your home or rental. Every appliance is cleaned,
              inspected, and priced for real-world budgets.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                701 W Main St, Sedalia
              </span>
              <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                Mon-Fri 9am-6pm
              </span>
              <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium">
                Sat 9am-3pm
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/search?type=USED_UNIT"
                className="inline-flex items-center justify-center px-6 py-3 bg-[#D2691E] text-white font-semibold rounded-lg hover:bg-[#c45c18] transition-colors"
              >
                Shop Used Inventory
              </Link>
              <a
                href="https://maps.google.com/?q=701+W+Main+St+Sedalia+MO"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

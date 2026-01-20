import DeliveryCalendar from '@/components/DeliveryCalendar';

export const metadata = {
  title: 'Schedule Delivery | AppliancePro',
  description: 'Schedule professional appliance delivery to your home.',
};

export default function DeliveryPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Schedule Delivery</h1>
        <p className="mt-2 text-gray-600">
          Check available delivery times and schedule your appliance delivery
        </p>
      </div>

      {/* Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Professional Delivery</h3>
          <p className="text-sm text-gray-600 mt-1">
            White-glove service to your door
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">4-Hour Windows</h3>
          <p className="text-sm text-gray-600 mt-1">
            Morning or afternoon slots available
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg
              className="w-6 h-6 text-blue-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
          <h3 className="font-semibold text-gray-900">Local Service Area</h3>
          <p className="text-sm text-gray-600 mt-1">
            Free delivery over $500
          </p>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <DeliveryCalendar />
      </div>

      {/* Contact CTA */}
      <div className="mt-8 bg-gray-900 rounded-lg p-6 text-center">
        <h2 className="text-xl font-bold text-white">Ready to Schedule?</h2>
        <p className="text-gray-300 mt-2">
          Call us to confirm your delivery time and provide your address details.
        </p>
        <a
          href="tel:+16605535055"
          className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
          Call (660) 553-5055
        </a>
      </div>

      {/* FAQ */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Delivery FAQ</h2>
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">What is the delivery fee?</h3>
            <p className="text-gray-600 mt-1">
              Delivery is free for orders over $500. For orders under $500, delivery
              starts at $49.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">Do you offer installation?</h3>
            <p className="text-gray-600 mt-1">
              Yes! We offer professional installation for most appliances. Ask about
              installation when you call to schedule.
            </p>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900">
              What if I need to reschedule?
            </h3>
            <p className="text-gray-600 mt-1">
              No problem! Just give us a call at least 24 hours before your scheduled
              delivery to reschedule at no charge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

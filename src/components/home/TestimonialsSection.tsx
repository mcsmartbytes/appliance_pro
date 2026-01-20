const testimonials = [
  {
    quote: 'Fabulous, friendly service! Reasonable pricing! Pleasant experience!',
    name: 'Sharon B.',
  },
  {
    quote: 'good experience brought my stuff in and out no problems at all and genuine cool people',
    name: 'Kadyn',
  },
  {
    quote: 'Good people and service,bought a refrigerator from them in really good condition and reasonable price.',
    name: 'Suselle A.',
  },
  {
    quote: 'Great people & prices! Definitely going back.',
    name: 'Shawn C.',
  },
  {
    quote: 'Good people and nice appliances',
    name: 'Ken G.',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#b32020] py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">What Our Customers Say</h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            Local families and landlords trust Benitz for honest pricing and dependable appliances.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white/10 border border-white/15 rounded-2xl p-6 shadow-sm"
            >
              <div className="text-3xl text-white/80 mb-3">&ldquo;</div>
              <p className="text-white/90 leading-relaxed mb-4">{testimonial.quote}</p>
              <p className="font-semibold text-white">{testimonial.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

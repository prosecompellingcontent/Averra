const testimonials = [
  {
    quote: "My bookings tripled within 2 weeks of using my new branding. The AI model looks just like me!",
    author: "Sarah M.",
    role: "Lash Artist"
  },
  {
    quote: "Finally, professional branding that doesn't cost $5K. AVERRA made me look booked and branded.",
    author: "Mia L.",
    role: "Esthetician"
  },
  {
    quote: "The client prep guide alone was worth it. My clients show up ready and my time is respected.",
    author: "Jordan K.",
    role: "Makeup Artist"
  }
];

export function TestimonialStrip() {
  return (
    <section className="bg-[#301710] py-24 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-[#BFBBA7] font-light mb-4">
            Testimonials
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,4rem)] text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            Booked & Branded
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-6">
              <p className="text-base text-[#DCDACC]/90 font-light leading-relaxed italic" style={{ fontFamily: 'Cormorant, serif' }}>
                "{testimonial.quote}"
              </p>
              <div>
                <p className="text-sm text-[#DCDACC]" style={{ fontFamily: 'Cormorant, serif' }}>
                  {testimonial.author}
                </p>
                <p className="text-xs text-[#BFBBA7] uppercase tracking-[0.2em] font-light mt-1">
                  {testimonial.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

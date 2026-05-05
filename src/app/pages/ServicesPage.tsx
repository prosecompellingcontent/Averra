return (
  <>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Lora:wght@300;400;500&family=Montserrat:wght@400;500;600;700&display=swap');

      .services-page-root {
        background: #fdf5f7;
        color: #251218;
      }

      .services-page-root .pf {
        font-family: "Playfair Display", serif;
      }

      .services-page-root .lr {
        font-family: "Lora", serif;
      }

      .services-page-root .ms {
        font-family: "Montserrat", sans-serif;
      }
    `}</style>

    <div className="services-page-root min-h-screen bg-[#fdf5f7] text-[#251218]">
      <div className="bg-[#251218] px-4 py-3 text-center">
        <p className="ms text-[10px] font-medium uppercase tracking-[0.24em] text-[#fdf5f7] md:text-[11px]">
          Founding Member Pricing · Limited Time Only · Up To 50% Off
        </p>
      </div>

      <div className="border-b border-[#251218]/10 bg-[#fdf5f7]">
        <Navigation />
      </div>

      <div className="bg-[#c9969e] py-2.5">
        <MarqueeScroll disableOnMobile={false} duration={28}>
          <div className="ms flex items-center gap-8 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7]">
            <span>Founding Members Only</span>
            <span>•</span>
            <span>Launch Pricing Up To 50% Off</span>
            <span>•</span>
            <span>Limited Time Only</span>
            <span>•</span>
            <span>Founding Members Only</span>
            <span>•</span>
            <span>Launch Pricing Up To 50% Off</span>
            <span>•</span>
            <span>Limited Time Only</span>
          </div>
        </MarqueeScroll>
      </div>

      <section className="grid min-h-[86vh] grid-cols-1 bg-[#fdf5f7] lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 md:px-10 lg:px-16 xl:px-20">
          <div className="max-w-[560px]">
            <p className="ms mb-6 text-[10px] font-bold uppercase tracking-[0.28em] text-[#c9969e]">
              Brand Alignment System
            </p>

            <h1 className="pf mb-4 text-[clamp(2.8rem,5.5vw,5.2rem)] leading-[1.02] text-[#251218]">
              Your brand should work
              <br />
              <span className="italic text-[#c9969e]">as hard as you do.</span>
            </h1>

            <p className="lr mb-10 max-w-[470px] text-[15px] font-light leading-[1.9] text-[#251218]/72 md:text-[16px]">
              The market is full of brands built on talent. Very few are built
              on clarity. When your brand doesn't communicate at the level
              you're operating at, clients hesitate, pricing becomes harder to
              justify, and your work gets lost in a saturated market.
            </p>

            <div className="mb-8 flex items-end gap-4 md:gap-6">
              <span className="pf text-2xl font-light text-[#251218]/30 line-through md:text-3xl">
                {brandAlignmentService.price}
              </span>
              <span className="pf text-5xl leading-none text-[#251218] md:text-6xl">
                {brandAlignmentService.salePrice}
              </span>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleStartBrandAlignment}
                className={`ms inline-block bg-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                }`}
              >
                Get Started
              </button>

              <Link
                to="/about"
                className={`ms inline-block border border-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#251218] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#251218] hover:text-[#fdf5f7]" : ""
                }`}
              >
                The Process
              </Link>
            </div>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-[#251218] lg:block">
          <img
            src={getImageUrl("/services-hero.png")}
            alt="AVERRA Services"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#251218]/45" />
          <div className="absolute bottom-10 left-10 bg-[#c9969e] px-5 py-2.5">
            <p className="ms text-[10px] font-bold uppercase tracking-[0.18em] text-[#fdf5f7]">
              Clarity Through Alignment
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#251218] px-6 py-16 md:px-10 lg:px-20">
        <p className="ms mb-8 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
          Sound Familiar?
        </p>

        <h2 className="pf mb-12 max-w-[720px] text-[clamp(2rem,4vw,3.2rem)] leading-[1.14] text-[#fdf5f7]">
          If you're being honest, you've probably said this before…
        </h2>

        <div className="grid border-t border-[#fdf5f7]/10 md:grid-cols-2">
          {painPoints.map((point, index) => (
            <div
              key={point}
              className={`lr flex items-start gap-4 border-b border-[#fdf5f7]/10 py-6 text-[14px] font-light leading-[1.7] text-[#fdf5f7]/82 ${
                index % 2 === 0
                  ? "md:border-r md:border-[#fdf5f7]/10 md:pr-10"
                  : "md:pl-10"
              }`}
            >
              <span className="mt-[2px] text-[#c9969e]">—</span>
              <span>{point}</span>
            </div>
          ))}
        </div>

        <p className="pf mt-12 text-[clamp(1.6rem,3vw,2.2rem)] italic text-[#c9969e]">
          The AVERRA Brand Alignment System was built to fix exactly that.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-12 bg-[#fbf0f3] px-6 py-16 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-20">
        <div>
          <p className="ms mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Built For You
          </p>

          <h2 className="pf mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            If you're a beauty service provider, this is for you.
          </h2>

          <p className="lr mb-6 text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Whether you specialize in lashes, brows, nails, hair, facials,
            makeup, skincare, or waxing, if clients book appointments with you,
            your brand identity determines everything. Perception, pricing,
            loyalty, and growth all start here.
          </p>

          <p className="lr text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Any other beauty service? If you rely on clients to book, the
            AVERRA system applies to you.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-[2px]">
          {serviceTypes.map((item) => (
            <div
              key={item}
              className="ms border-l-2 border-[#c9969e] bg-[#fdf5f7] px-5 py-4 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#251218]"
            >
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="grid min-h-[60vh] grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[320px] overflow-hidden bg-[#251218]">
          <img
            src={getImageUrl("/meet-the-ceo-2.png")}
            alt="The System Behind AVERRA"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[#251218]/40" />
          <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#c9969e]" />
        </div>

        <div className="flex items-center bg-[#fdf5f7] px-6 py-16 md:px-10 lg:px-20">
          <div className="max-w-[620px]">
            <p className="ms mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
              The System Behind AVERRA
            </p>

            <h2 className="pf mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
              Built from experience, not theory.
            </h2>

            <p className="lr mb-6 text-[15px] font-light leading-[1.9] text-[#251218]/70">
              I have been exactly where you are. Building a brand without a
              system, posting without direction, and watching clients choose
              someone else, not because the work wasn't there, but because the
              brand wasn't communicating it.
            </p>

            <p className="lr mb-6 text-[15px] font-light leading-[1.9] text-[#251218]/70">
              I stopped guessing and started building with intention. The result
              was a brand that attracted the right clients, supported premium
              pricing, and stayed consistent as it grew. What took years to
              figure out, AVERRA has simplified into a structured system you can
              start using immediately.
            </p>

            <p className="lr mb-8 text-[16px] italic text-[#251218]">
              Real clarity. Real alignment. Real results.
            </p>

            <button
              onClick={handleStartBrandAlignment}
              className={`ms inline-block bg-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-300 ${
                !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
              }`}
            >
              Start The Process
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#fdf5f7] px-6 py-20 md:px-10 lg:px-20">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            {brandAlignmentService.industryStandard.title}
          </p>

          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            When any of these are off,
            <br />
            your value decreases.
          </h2>

          <p className="lr mx-auto max-w-[560px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            {brandAlignmentService.industryStandard.intro}
          </p>
        </div>

        <div className="mt-16 grid gap-[2px] md:grid-cols-2 xl:grid-cols-4">
          {brandAlignmentService.industryStandard.standards.map(
            (standard, index) => (
              <div key={standard.name} className="bg-[#fbf0f3] px-7 py-9">
                <div className="pf mb-3 text-5xl text-[#c9969e]/25">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <h3 className="ms mb-3 text-[13px] font-bold uppercase tracking-[0.1em] text-[#251218]">
                  {standard.name}
                </h3>

                <p className="lr text-[13px] font-light leading-[1.85] text-[#251218]/70">
                  {standard.description}
                </p>
              </div>
            )
          )}
        </div>

        <div className="mx-auto mt-14 max-w-[720px] text-center">
          <p className="lr text-[18px] font-light leading-[1.8] text-[#251218]/75">
            {brandAlignmentService.industryStandard.conclusionPart1}
          </p>
          <p className="pf mt-2 text-[28px] italic text-[#c9969e]">
            {brandAlignmentService.industryStandard.conclusionPart2}
          </p>
        </div>
      </section>

      <section className="bg-[#fbf0f3] px-6 py-20 md:px-10 lg:px-20">
        <div className="mx-auto mb-14 max-w-[760px] text-center">
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            The System
          </p>

          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            Three Stage Process
          </h2>

          <p className="lr mx-auto max-w-[500px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Everything you create should leave no room for misinterpretation.
            The AVERRA process ensures it.
          </p>
        </div>

        <div className="grid gap-[2px] lg:grid-cols-3">
          {brandAlignmentService.stages.map((stage, index) => {
            const isMiddle = index === 1;

            return (
              <div
                key={stage.name}
                className={`${isMiddle ? "bg-[#251218]" : "bg-[#fdf5f7]"} px-9 py-12`}
              >
                <div
                  className={`pf mb-2 text-7xl ${
                    isMiddle ? "text-[#c9969e]/30" : "text-[#c9969e]/25"
                  }`}
                >
                  {index + 1}
                </div>

                <p
                  className={`ms mb-4 text-[10px] font-bold uppercase tracking-[0.2em] ${
                    isMiddle ? "text-[#fdf5f7]/80" : "text-[#c9969e]"
                  }`}
                >
                  Stage {["One", "Two", "Three"][index]}
                </p>

                <h3
                  className={`pf mb-3 text-[28px] ${
                    isMiddle ? "text-[#fdf5f7]" : "text-[#251218]"
                  }`}
                >
                  {stage.name}
                </h3>

                <p
                  className={`lr mb-4 text-[14px] font-light italic ${
                    isMiddle ? "text-[#fdf5f7]/70" : "text-[#251218]/60"
                  }`}
                >
                  {stage.subtitle}
                </p>

                <p
                  className={`lr text-[14px] font-light leading-[1.85] ${
                    isMiddle ? "text-[#fdf5f7]/75" : "text-[#251218]/75"
                  }`}
                >
                  {stage.detail}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="bg-[#c9969e] py-4">
        <MarqueeScroll disableOnMobile={false} duration={20}>
          <div className="flex items-center whitespace-nowrap">
            {[
              "Clarity that converts",
              "Brands that hold their standard",
              "Visuals that match the level of the work",
              "Identity that scales",
              "Clarity that converts",
              "Brands that hold their standard",
              "Visuals that match the level of the work",
              "Identity that scales",
            ].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center">
                <span className="pf px-12 text-[22px] italic text-[#fdf5f7]">
                  {item}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#fdf5f7]/50" />
              </div>
            ))}
          </div>
        </MarqueeScroll>
      </div>

      <section className="bg-[#251218] px-6 py-20 md:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Client Results
          </p>

          <h2 className="pf mx-auto max-w-[760px] text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#fdf5f7]">
            These results aren't luck. They're what happens when a brand is
            aligned.
          </h2>
        </div>

        <div className="grid gap-[2px] lg:grid-cols-3">
          {reviewCards.map((review) => (
            <div
              key={review.name}
              className="border-t-2 border-[#c9969e] bg-white/[0.04] px-7 py-9"
            >
              <div className="ms mb-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#c9969e] text-[13px] font-bold text-[#fdf5f7]">
                {review.initial}
              </div>

              <p className="lr mb-6 text-[13px] font-light italic leading-[1.85] text-[#fdf5f7]/82">
                “{review.text}”
              </p>

              <p className="ms text-[11px] font-bold uppercase tracking-[0.14em] text-[#fdf5f7]">
                {review.name}
              </p>

              <p className="ms mt-1 text-[11px] text-[#fdf5f7]/45">
                {review.role}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="audits" className="bg-[#fdf5f7] px-6 py-20 md:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Add On Services
          </p>

          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            Focused Brand Audits
          </h2>

          <p className="lr mx-auto max-w-[500px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Targeted evaluations for specific brand problems, standalone or as
            an add on to your alignment system.
          </p>
        </div>

        <div className="mx-auto grid max-w-[980px] gap-[2px] lg:grid-cols-2">
          {auditAddOns.map((audit) => (
            <div key={audit.id} className="bg-[#fbf0f3] px-8 py-9">
              <p className="ms mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c9969e]">
                Brand Audit
              </p>

              <h3 className="pf mb-3 text-[30px] leading-[1.2] text-[#251218]">
                {audit.name}
              </h3>

              <p className="lr mb-6 text-[13px] font-light leading-[1.8] text-[#251218]/70">
                {audit.subtitle}
              </p>

              <div className="mb-6 flex items-baseline gap-3">
                <span className="pf text-[32px] text-[#251218]">
                  {audit.salePrice}
                </span>
                <span className="ms text-[14px] text-[#251218]/45 line-through">
                  {audit.price}
                </span>
              </div>

              <ul className="mb-7">
                {[
                  audit.whatThisCovers,
                  audit.whatIsIdentified,
                  audit.outcome,
                ].map((item, index) => (
                  <li
                    key={`${audit.id}-${index}`}
                    className="ms flex items-start gap-2 border-b border-[#251218]/10 py-3 text-[11px] text-[#251218]/70"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c9969e]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handleAddToCart({
                    id: audit.id,
                    name: audit.name,
                    priceNum: audit.priceNum,
                    originalPriceNum: audit.originalPriceNum,
                    subtitle: audit.subtitle,
                    type: "service",
                  })
                }
                className={`ms w-full bg-[#251218] px-6 py-3.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#fdf5f7] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                }`}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      <section id="digitals" className="bg-[#fdf5f7] px-6 py-20 md:px-10 lg:px-20">
        <div className="mb-16 text-center">
          <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            Digital Products
          </p>

          <h2 className="pf mb-4 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#251218]">
            Brand Ready Visuals
          </h2>

          <p className="lr mx-auto max-w-[520px] text-[15px] font-light leading-[1.9] text-[#251218]/70">
            Instant access. No revisions. Ready to use.
          </p>
        </div>

        <div className="mx-auto mb-14 max-w-4xl">
          <div className="border-l-2 border-[#c9969e] bg-[#fbf0f3] px-8 py-6">
            <p className="lr text-[13px] font-light leading-[1.8] text-[#251218]/70">
              All visuals are AI generated brand imagery created for marketing
              and promotional use. These images are intended to elevate brand
              presentation and should not be used to misrepresent real client
              results or services not legally provided.
            </p>
          </div>
        </div>

        <div className="grid gap-x-14 gap-y-14 lg:grid-cols-3">
          {digitalProducts.map((product) => (
            <div key={product.id}>
              <p className="ms mb-3 text-[9px] font-bold uppercase tracking-[0.22em] text-[#c9969e]">
                Digital Pack
              </p>

              <h3 className="pf mb-4 text-[30px] leading-[1.15] text-[#251218]">
                {product.name}
              </h3>

              <p className="lr mb-8 text-[13px] font-light leading-[1.9] text-[#251218]/66">
                {product.description}
              </p>

              <div className="mb-8 flex items-baseline gap-3">
                <span className="pf text-[34px] text-[#251218]">
                  {product.price}
                </span>
                <span className="ms text-[14px] text-[#251218]/45 line-through">
                  {product.originalPrice}
                </span>
              </div>

              <ul className="mb-8">
                {product.scenes.map((scene) => (
                  <li
                    key={scene.title}
                    className="ms flex items-start gap-2 border-b border-[#251218]/10 py-3 text-[11px] text-[#251218]/66"
                  >
                    <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#c9969e]" />
                    <span>{scene.title}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() =>
                  handleAddToCart({
                    id: product.id,
                    name: product.name,
                    priceNum: product.priceNum,
                    originalPriceNum: product.originalPriceNum,
                    type: "digital",
                    description: product.description,
                  })
                }
                className={`ms w-full bg-[#251218] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-[#fdf5f7] transition-all duration-300 ${
                  !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
                }`}
              >
                Add To Cart
              </button>
            </div>
          ))}
        </div>

        <p className="ms mt-14 text-center text-[11px] leading-[1.7] text-[#251218]/50">
          All digital products include commercial use rights · Files delivered
          instantly after purchase · No edits, swaps, or personalization included
        </p>
      </section>

      <section
        id="flagship"
        className="grid grid-cols-1 gap-12 bg-[#251218] px-6 py-20 md:px-10 lg:grid-cols-2 lg:gap-20 lg:px-20"
      >
        <div>
          <p className="ms mb-5 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
            The Complete System
          </p>

          <h2 className="pf mb-5 text-[clamp(2rem,4vw,3rem)] leading-[1.15] text-[#fdf5f7]">
            AVERRA Brand Alignment
          </h2>

          <p className="lr mb-8 max-w-[560px] text-[15px] font-light leading-[1.9] text-[#fdf5f7]/70">
            {brandAlignmentService.description}
          </p>

          <div className="pf mb-2 text-[64px] leading-none text-[#c9969e]">
            {brandAlignmentService.salePrice}
          </div>

          <p className="ms mb-9 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#fdf5f7]/45">
            Founding Member Pricing · Was {brandAlignmentService.price}
          </p>

          <button
            onClick={handleStartBrandAlignment}
            className={`ms bg-[#c9969e] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#251218] transition-all duration-300 ${
              !isMobile ? "hover:bg-[#fdf5f7]" : ""
            }`}
          >
            Get Started
          </button>
        </div>

        <div>
          <ul className="border-t border-[#fdf5f7]/10">
            {[
              {
                title: "Interpretation · Brand Direction",
                body:
                  "We establish your brand identity and intention so everything you create leaves no room for misinterpretation.",
              },
              {
                title: "Perception · First Glance Audit",
                body:
                  "How your brand is seen before a word is read. We evaluate and correct every visual element communicating below your level.",
              },
              {
                title: "Translation · Message Clarity",
                body:
                  "We ensure your content communicates your value clearly so clients do not hesitate, they book.",
              },
              {
                title: "Alignment · Visual Unification",
                body:
                  "Every element evaluated so everything communicates equally. Mixed signals eliminated. Brand strength increased.",
              },
              {
                title: "Stabilization · Custom Visual System",
                body:
                  "A structured system built custom to your brand so content stays consistent, controlled, and aligned as you grow.",
              },
            ].map((module, index) => (
              <li
                key={module.title}
                className="flex gap-4 border-b border-[#fdf5f7]/10 py-5"
              >
                <span className="pf w-8 shrink-0 text-[18px] text-[#c9969e]">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div>
                  <strong className="ms mb-1 block text-[13px] font-semibold text-[#fdf5f7]">
                    {module.title}
                  </strong>
                  <p className="lr text-[12px] font-light leading-[1.75] text-[#fdf5f7]/75">
                    {module.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-[#fdf5f7] px-6 py-24 text-center md:px-10 lg:px-20">
        <p className="ms mb-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#c9969e]">
          Exclusive Offer · Limited Time
        </p>

        <h2 className="pf mx-auto mb-4 max-w-[760px] text-[clamp(2rem,4vw,3.4rem)] leading-[1.12] text-[#251218]">
          Ready to be the face of your brand?
        </h2>

        <p className="lr mx-auto mb-10 max-w-[560px] text-[15px] font-light leading-[1.9] text-[#251218]/65">
          Discover your beauty brand style. Get your palette, voice tone, and
          next steps delivered in minutes.
        </p>

        <button
          onClick={handleStartBrandAlignment}
          className={`ms bg-[#251218] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#fdf5f7] transition-all duration-300 ${
            !isMobile ? "hover:bg-[#c9969e] hover:text-[#251218]" : ""
          }`}
        >
          Start Brand Quiz
        </button>
      </section>

      <CTAFooter />
    </div>
  </>
);

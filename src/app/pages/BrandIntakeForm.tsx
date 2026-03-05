import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Navigation } from "@/app/components/Navigation";
import { useCart } from "@/app/context/CartContext";
import { Check } from "lucide-react";
import { projectId, publicAnonKey } from '/utils/supabase/info';

export function BrandIntakeForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { items } = useCart();
  
  // ALL useState hooks must be declared FIRST, before any conditional returns
  const [tier, setTier] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    instagramHandle: '',
    website: '',
    servicesOffering: '',
    businessStage: [] as string[],
    businessStageOther: '',
    misalignedAspects: [] as string[],
    misalignedAspectsOther: '',
    brandPerception: '',
    idealClient: '',
    futureGoals: [] as string[],
    futureGoalsOther: '',
    aiStance: '',
    urgentNotes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // useEffect comes after all useState hooks
  useEffect(() => {
    // Check sessionStorage for selected service tier
    const storedTier = sessionStorage.getItem('selectedServiceTier');
    
    if (storedTier) {
      setTier(JSON.parse(storedTier));
    } else {
      // Fallback: check cart for service item (for backward compatibility)
      const cartServiceTier = items.find(item => item.type === 'service');
      
      if (cartServiceTier) {
        setTier(cartServiceTier);
      } else {
        // No tier found, redirect to services
        navigate('/services');
      }
    }
  }, [items, navigate]);
  
  // Conditional return comes AFTER all hooks
  if (!tier) {
    return null;
  }

  const businessStageOptions = [
    'Building foundation and momentum',
    'Growing, refining, stepping into more',
    'Scaling or preparing for expansion',
    'Leading a team or multi-chair operation',
    'Other'
  ];

  const misalignedOptions = [
    'Content that doesn\'t hold together',
    'Visuals that don\'t support the pricing I\'m working toward',
    'A presence that doesn\'t reflect the level I\'m actually operating at',
    'Growth that\'s outpaced the brand itself',
    'Not entirely sure, just know something\'s misaligned',
    'Other'
  ];

  const futureGoalsOptions = [
    'Raising prices',
    'Launching a new service',
    'Adding retail',
    'Hiring or expanding a team',
    'None of the above',
    'Other'
  ];

  const aiStanceOptions = [
    'Excited and ready',
    'Open but curious',
    'Slightly skeptical but willing',
    'I care more about the result than the tool'
  ];

  const handleCheckboxChange = (field: 'businessStage' | 'misalignedAspects' | 'futureGoals', value: string) => {
    setFormData(prev => {
      const currentValues = prev[field];
      if (currentValues.includes(value)) {
        return { ...prev, [field]: currentValues.filter(v => v !== value) };
      } else {
        return { ...prev, [field]: [...currentValues, value] };
      }
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.businessName.trim()) newErrors.businessName = 'Business name is required';
    if (!formData.servicesOffering.trim()) newErrors.servicesOffering = 'Please describe your services';
    if (formData.businessStage.length === 0) newErrors.businessStage = 'Please select at least one option';
    if (formData.misalignedAspects.length === 0) newErrors.misalignedAspects = 'Please select at least one option';
    if (!formData.brandPerception.trim()) newErrors.brandPerception = 'Please describe your brand perception';
    if (!formData.idealClient.trim()) newErrors.idealClient = 'Please describe your ideal client';
    if (formData.futureGoals.length === 0) newErrors.futureGoals = 'Please select at least one option';
    if (!formData.aiStance) newErrors.aiStance = 'Please select your stance on AI visuals';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    // Submit brand intake form to database
    submitBrandIntake();
  };

  const submitBrandIntake = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-61755bec/submit-brand-intake`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({
            ...formData,
            tier: tier.name, // Add tier name from selected service
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }

      const { intakeId } = await response.json();
      console.log('✅ Brand intake submitted with ID:', intakeId);

      // Store intake ID for payment tracking
      sessionStorage.setItem('brandIntakeId', intakeId);
      
      // Also store form data for backward compatibility
      sessionStorage.setItem('brandIntakeData', JSON.stringify(formData));
      
      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error submitting brand intake:', error);
      alert('Failed to submit form. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-[#DCDACC]">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-6 pt-32 pb-20">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 300 }}>
            AVERRA'S<br />Brand Alignment Form
          </h1>
          
          <p className="text-[#301710]/80 text-base font-light mb-2">
            This takes 3–5 minutes.
          </p>
          
          {/* Selected Package Display */}
          <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 glass-effect border border-white/30 shadow-lg">
            <Check className="w-4 h-4 text-[#301710]" />
            <span className="text-[#301710] text-sm">
              Selected: <span className="font-medium">{tier.name}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Business Information */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              1. Business Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#301710] text-sm uppercase tracking-wider mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className={`w-full px-4 py-3 glass-effect-input border ${errors.fullName ? 'border-red-500' : 'border-white/40'} text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all`}
                />
                {errors.fullName && <p className="text-red-600 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div>
                <label className="block text-[#301710] text-sm uppercase tracking-wider mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className={`w-full px-4 py-3 glass-effect-input border ${errors.businessName ? 'border-red-500' : 'border-white/40'} text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all`}
                />
                {errors.businessName && <p className="text-red-600 text-xs mt-1">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block text-[#301710] text-sm uppercase tracking-wider mb-2">
                  Instagram Handle
                </label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  value={formData.instagramHandle}
                  onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value })}
                  className="w-full px-4 py-3 glass-effect-input border border-white/40 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[#301710] text-sm uppercase tracking-wider mb-2">
                  Website (if applicable)
                </label>
                <input
                  type="url"
                  placeholder="https://"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 glass-effect-input border border-white/40 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Services Offering */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              2. What services are you currently offering? *
            </h2>
            
            <textarea
              required
              value={formData.servicesOffering}
              onChange={(e) => setFormData({ ...formData, servicesOffering: e.target.value })}
              rows={3}
              placeholder="Describe your services..."
              className={`w-full px-4 py-3 glass-effect-input border ${errors.servicesOffering ? 'border-red-500' : 'border-white/40'} text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none resize-none transition-all`}
            />
            {errors.servicesOffering && <p className="text-red-600 text-xs mt-1">{errors.servicesOffering}</p>}
          </div>

          {/* Section 3: Business Stage */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              3. Where's your business at right now? *
            </h2>
            
            <div className="space-y-3">
              {businessStageOptions.map((option) => (
                <div key={option}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.businessStage.includes(option)}
                      onChange={() => handleCheckboxChange('businessStage', option)}
                      className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer appearance-none checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:text-center checked:after:text-sm checked:after:leading-5"
                    />
                    <span className="text-[#301710] text-base leading-relaxed flex-1">
                      {option}
                    </span>
                  </label>
                  
                  {/* Show text input when "Other" is checked */}
                  {option === 'Other' && formData.businessStage.includes('Other') && (
                    <div className="mt-2 ml-8">
                      <input
                        type="text"
                        value={formData.businessStageOther}
                        onChange={(e) => setFormData({ ...formData, businessStageOther: e.target.value })}
                        placeholder="Please specify..."
                        className="w-full px-4 py-3 glass-effect-input border border-white/40 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.businessStage && <p className="text-red-600 text-xs mt-3">{errors.businessStage}</p>}
          </div>

          {/* Section 4: Misaligned Aspects */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              4. What's throwing off your brand right now? *
            </h2>
            
            <div className="space-y-3">
              {misalignedOptions.map((option) => (
                <div key={option}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.misalignedAspects.includes(option)}
                      onChange={() => handleCheckboxChange('misalignedAspects', option)}
                      className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer appearance-none checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:text-center checked:after:text-sm checked:after:leading-5"
                    />
                    <span className="text-[#301710] text-base leading-relaxed flex-1">
                      {option}
                    </span>
                  </label>
                  
                  {/* Show text input when "Other" is checked */}
                  {option === 'Other' && formData.misalignedAspects.includes('Other') && (
                    <div className="mt-2 ml-8">
                      <input
                        type="text"
                        value={formData.misalignedAspectsOther}
                        onChange={(e) => setFormData({ ...formData, misalignedAspectsOther: e.target.value })}
                        placeholder="Please specify..."
                        className="w-full px-4 py-3 glass-effect-input border border-white/40 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.misalignedAspects && <p className="text-red-600 text-xs mt-3">{errors.misalignedAspects}</p>}
          </div>

          {/* Section 5: Brand Perception */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              5. How should your brand feel? *
            </h2>
            <p className="text-[#301710]/60 text-sm mb-4 italic" style={{ fontFamily: 'Cormorant, serif' }}>
              Think energy: Elevated. Luxury. Glam. Soft. etc.
            </p>
            
            <textarea
              required
              value={formData.brandPerception}
              onChange={(e) => setFormData({ ...formData, brandPerception: e.target.value })}
              rows={3}
              placeholder="Describe how your brand should feel..."
              className={`w-full px-4 py-3 glass-effect-input border ${errors.brandPerception ? 'border-red-500' : 'border-white/40'} text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none resize-none transition-all`}
            />
            {errors.brandPerception && <p className="text-red-600 text-xs mt-1">{errors.brandPerception}</p>}
          </div>

          {/* Section 6: Ideal Client */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              6. Who is your ideal client right now? *
            </h2>
            <p className="text-[#301710]/60 text-sm mb-4 italic" style={{ fontFamily: 'Cormorant, serif' }}>
              Age range, vibe, spending level, etc.
            </p>
            
            <textarea
              required
              value={formData.idealClient}
              onChange={(e) => setFormData({ ...formData, idealClient: e.target.value })}
              rows={3}
              placeholder="Describe your ideal client..."
              className={`w-full px-4 py-3 glass-effect-input border ${errors.idealClient ? 'border-red-500' : 'border-white/40'} text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none resize-none transition-all`}
            />
            {errors.idealClient && <p className="text-red-600 text-xs mt-1">{errors.idealClient}</p>}
          </div>

          {/* Section 7: Future Goals */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              7. Are you planning any of the following in the next 6–12 months? *
            </h2>
            
            <div className="space-y-3">
              {futureGoalsOptions.map((option) => (
                <div key={option}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={formData.futureGoals.includes(option)}
                      onChange={() => handleCheckboxChange('futureGoals', option)}
                      className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer appearance-none checked:after:content-['✓'] checked:after:block checked:after:text-white checked:after:text-center checked:after:text-sm checked:after:leading-5"
                    />
                    <span className="text-[#301710] text-base leading-relaxed flex-1">
                      {option}
                    </span>
                  </label>
                  
                  {/* Show text input when "Other" is checked */}
                  {option === 'Other' && formData.futureGoals.includes('Other') && (
                    <div className="mt-2 ml-8">
                      <input
                        type="text"
                        value={formData.futureGoalsOther}
                        onChange={(e) => setFormData({ ...formData, futureGoalsOther: e.target.value })}
                        placeholder="Please specify..."
                        className="w-full px-4 py-3 glass-effect-input border border-white/40 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none transition-all"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
            {errors.futureGoals && <p className="text-red-600 text-xs mt-3">{errors.futureGoals}</p>}
          </div>

          {/* Section 8: AI Stance */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              8. When it comes to AI-generated brand visuals, where do you stand? *
            </h2>
            
            <div className="space-y-3">
              {aiStanceOptions.map((option) => (
                <label key={option} className="flex items-start gap-3 cursor-pointer group">
                  <input
                    type="radio"
                    name="aiStance"
                    value={option}
                    checked={formData.aiStance === option}
                    onChange={(e) => setFormData({ ...formData, aiStance: e.target.value })}
                    className="mt-1 w-5 h-5 border-2 border-[#301710]/40 bg-white/40 checked:bg-[#301710] checked:border-[#301710] focus:outline-none focus:ring-2 focus:ring-[#301710]/50 transition-all cursor-pointer"
                  />
                  <span className="text-[#301710] text-base leading-relaxed flex-1">
                    {option}
                  </span>
                </label>
              ))}
            </div>
            {errors.aiStance && <p className="text-red-600 text-xs mt-3">{errors.aiStance}</p>}
          </div>

          {/* Section 9: Urgent Notes */}
          <div className="glass-effect border border-white/30 shadow-xl p-8 md:p-10">
            <h2 className="text-2xl text-[#301710] mb-6" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
              9. Is there anything urgent we should know?
            </h2>
            <p className="text-[#301710]/60 text-sm mb-4 italic" style={{ fontFamily: 'Cormorant, serif' }}>
              Optional. Launch dates, rebrands, deadlines, etc.
            </p>
            
            <textarea
              value={formData.urgentNotes}
              onChange={(e) => setFormData({ ...formData, urgentNotes: e.target.value })}
              rows={3}
              placeholder="Any urgent information we should know..."
              className="w-full px-4 py-3 glass-effect-input border border-white/40 text-[#301710] placeholder:text-[#301710]/40 focus:border-[#301710]/60 focus:bg-white/60 focus:outline-none resize-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <div className="flex flex-col items-center gap-6">
            <button
              type="submit"
              className="w-full md:w-auto px-12 py-4 glass-effect border border-white/40 text-[#301710] text-sm uppercase tracking-[0.3em] font-semibold hover:bg-white/30 hover:border-white/50 transition-all shadow-lg"
            >
              Continue to Checkout →
            </button>
            
            {/* What Happens Next Section */}
            <div className="w-full max-w-2xl text-center mt-6">
              <h3 className="text-lg text-[#301710] mb-4" style={{ fontFamily: 'Cormorant, serif', fontWeight: 400 }}>
                What Happens Next
              </h3>
              
              <div className="space-y-2 text-[#301710]/70 text-sm">
                <p><span className="font-semibold text-[#301710]">1. Complete Form</span><br />Secure checkout via Stripe or PayPal.</p>
                <p><span className="font-semibold text-[#301710]">2. Schedule Your Strategy Session</span><br />You'll receive an email to book your session.</p>
                <p><span className="font-semibold text-[#301710]">3. Define Your Direction</span><br />Your strategy session ensures visuals are built with intention before production starts.</p>
                <p><span className="font-semibold text-[#301710]">4. Receive Your Brand System</span><br />Custom visuals delivered!</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
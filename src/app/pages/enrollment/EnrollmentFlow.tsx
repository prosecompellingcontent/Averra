import { useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { EnrollmentProvider, useEnrollment } from "@/app/context/EnrollmentContext";
import { PersonalInformationStep } from "@/app/pages/enrollment/steps/PersonalInformationStep";
import { AddressInformationStep } from "@/app/pages/enrollment/steps/AddressInformationStep";
import { PaymentSetupStep } from "@/app/pages/enrollment/steps/PaymentSetupStep";
import { MembershipSummaryStep } from "@/app/pages/enrollment/steps/MembershipSummaryStep";
import { GlobalNav } from "@/app/components/GlobalNav";
import { Check } from "lucide-react";

function EnrollmentFlowContent() {
  const { membershipType } = useParams<{ membershipType: "blueprint" | "gold-standard" }>();
  const navigate = useNavigate();
  const { currentStep, enrollmentData, updateEnrollmentData } = useEnrollment();

  useEffect(() => {
    if (membershipType && membershipType !== enrollmentData.membershipType) {
      updateEnrollmentData({ membershipType });
    }
  }, [membershipType]);

  const steps = [
    { number: 1, label: "Personal Info", component: PersonalInformationStep },
    { number: 2, label: "Address", component: AddressInformationStep },
    { number: 3, label: "Payment", component: PaymentSetupStep },
    { number: 4, label: "Review & Complete", component: MembershipSummaryStep },
  ];

  const CurrentStepComponent = steps[currentStep - 1]?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed]">
      {/* Header */}
      <div className="border-b border-[#251218]/5 bg-white/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1
              className="text-2xl text-[#251218]"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              AVERRA
            </h1>
            <div className="text-right">
              <p
                className="text-xs uppercase tracking-[0.15em] text-[#251218]/60 mb-1"
                style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
              >
                {enrollmentData.membershipType === "gold-standard"
                  ? "Gold Standard"
                  : "Blueprint"}
              </p>
              <p
                className="text-sm text-[#c9969e]"
                style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
              >
                Step {currentStep} of {steps.length}
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {steps.map((step, index) => (
              <div key={step.number} className="flex-1 flex items-center gap-2">
                <div className="flex-1 flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-[#c9969e] to-[#251218] border-transparent text-white"
                        : currentStep === step.number
                        ? "border-[#c9969e] text-[#c9969e]"
                        : "border-[#251218]/20 text-[#251218]/40"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <span
                        className="text-sm"
                        style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                      >
                        {step.number}
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-xs transition-colors hidden sm:inline ${
                      currentStep >= step.number ? "text-[#251218]" : "text-[#251218]/40"
                    }`}
                    style={{ fontFamily: "Lora, serif", fontWeight: 400 }}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 transition-colors ${
                      currentStep > step.number
                        ? "bg-gradient-to-r from-[#c9969e] to-[#251218]"
                        : "bg-[#251218]/10"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-3xl mx-auto px-8 py-12">
        {CurrentStepComponent && <CurrentStepComponent />}
      </div>
    </div>
  );
}

export function EnrollmentFlow() {
  return (
    <EnrollmentProvider>
      <EnrollmentFlowContent />
    </EnrollmentProvider>
  );
}

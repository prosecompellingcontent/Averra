import { createContext, useContext, useState, ReactNode } from "react";

export interface EnrollmentData {
  // Step 1: Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  consentMarketing: boolean;
  consentNonMarketing: boolean;

  // Step 2: Address Information
  addressLine1: string;
  addressLine2: string;
  city: string;
  country: string;
  stateProvince: string;
  postalCode: string;

  // Step 3: Payment Information
  cardNumber: string;
  nameOnCard: string;
  expiration: string;
  cvc: string;
  billingAddressSameAsHome: boolean;
  recurringPaymentMethod: "card" | "bank";
  bankAccountType?: "checking" | "savings";
  bankRoutingNumber?: string;
  bankAccountNumber?: string;
  bankConfirmAccountNumber?: string;

  // Membership Selection
  membershipType: "blueprint" | "gold-standard";
  isFounderPricing: boolean;

  // Promo Code
  promoCode?: string;
}

interface EnrollmentContextType {
  enrollmentData: EnrollmentData;
  updateEnrollmentData: (data: Partial<EnrollmentData>) => void;
  resetEnrollmentData: () => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const defaultEnrollmentData: EnrollmentData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  gender: "",
  emergencyContactName: "",
  emergencyContactPhone: "",
  consentMarketing: false,
  consentNonMarketing: false,
  addressLine1: "",
  addressLine2: "",
  city: "",
  country: "United States",
  stateProvince: "",
  postalCode: "",
  cardNumber: "",
  nameOnCard: "",
  expiration: "",
  cvc: "",
  billingAddressSameAsHome: true,
  recurringPaymentMethod: "card",
  membershipType: "blueprint",
  isFounderPricing: true,
};

const EnrollmentContext = createContext<EnrollmentContextType | undefined>(undefined);

export function EnrollmentProvider({ children }: { children: ReactNode }) {
  const [enrollmentData, setEnrollmentData] = useState<EnrollmentData>(defaultEnrollmentData);
  const [currentStep, setCurrentStep] = useState(1);

  const updateEnrollmentData = (data: Partial<EnrollmentData>) => {
    setEnrollmentData((prev) => ({ ...prev, ...data }));
  };

  const resetEnrollmentData = () => {
    setEnrollmentData(defaultEnrollmentData);
    setCurrentStep(1);
  };

  return (
    <EnrollmentContext.Provider
      value={{
        enrollmentData,
        updateEnrollmentData,
        resetEnrollmentData,
        currentStep,
        setCurrentStep,
      }}
    >
      {children}
    </EnrollmentContext.Provider>
  );
}

export function useEnrollment() {
  const context = useContext(EnrollmentContext);
  if (context === undefined) {
    throw new Error("useEnrollment must be used within EnrollmentProvider");
  }
  return context;
}

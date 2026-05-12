import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowRight, Play, CheckCircle2, Check, X } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { checkUsernameAvailability, createUsername } from "@/utils/supabase/queries";

export function WelcomePage() {
  const { user, updateUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [showUsernameStep, setShowUsernameStep] = useState(true);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    setTimeout(() => setFadeIn(true), 100);
    checkIfUsernameExists();
  }, []);

  const checkIfUsernameExists = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single();

    if (data?.username) {
      setShowUsernameStep(false);
    }
  };

  const validateUsername = (value: string) => {
    if (value.length < 3) {
      return "Username must be at least 3 characters";
    }
    if (value.length > 20) {
      return "Username must be less than 20 characters";
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return "Username can only contain letters, numbers, and underscores";
    }
    return "";
  };

  const checkUsername = useCallback(async (value: string) => {
    const error = validateUsername(value);
    if (error) {
      setUsernameError(error);
      setIsUsernameAvailable(false);
      setIsCheckingUsername(false);
      return;
    }

    setIsCheckingUsername(true);

    const { available, error: checkError } = await checkUsernameAvailability(value.toLowerCase());

    setIsCheckingUsername(false);

    if (checkError) {
      setUsernameError(checkError.userMessage);
      setIsUsernameAvailable(null);
      return;
    }

    if (available) {
      setUsernameError("");
      setIsUsernameAvailable(true);
    } else {
      setUsernameError("This username is already taken");
      setIsUsernameAvailable(false);
    }
  }, []);

  useEffect(() => {
    if (!username) {
      setIsUsernameAvailable(null);
      setUsernameError("");
      setIsCheckingUsername(false);
      return;
    }

    // Debounce username checking
    const timeoutId = setTimeout(() => {
      checkUsername(username);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username, checkUsername]);

  const handleUsernameChange = (value: string) => {
    setUsername(value);
    setIsUsernameAvailable(null);
    setUsernameError("");
    if (value.length >= 3) {
      setIsCheckingUsername(true);
    }
  };

  const handleUsernameSubmit = async () => {
    if (!user || !isUsernameAvailable) return;

    setIsCheckingUsername(true);

    const { data, error } = await createUsername(user.id, username.toLowerCase());

    setIsCheckingUsername(false);

    if (error) {
      setUsernameError(error.userMessage);
      return;
    }

    if (data) {
      await refreshUser();
      setShowUsernameStep(false);
    }
  };

  if (!user) return null;

  const tierLabel =
    user.membershipTier === "gold-standard" ? "Gold Standard" : "Blueprint";

  const handleComplete = () => {
    updateUser({ hasCompletedOnboarding: true });
    navigate("/members/dashboard");
  };

  if (showUsernameStep) {
    return (
      <div className="relative min-h-screen bg-[#fdf5f7] overflow-hidden">
        <div className="fixed inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed]" />
          <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[#c9969e]/10 rounded-full blur-3xl animate-pulse"
               style={{ animationDuration: '8s' }} />
          <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#251218]/5 rounded-full blur-3xl animate-pulse"
               style={{ animationDuration: '10s', animationDelay: '2s' }} />
        </div>

        <div className={`relative z-10 min-h-screen flex items-center justify-center p-8 transition-opacity duration-2000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
          <div className="max-w-md w-full">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-8 border border-[#c9969e]/20 shadow-2xl">
              <div className="text-center mb-8">
                <h1
                  className="text-4xl text-[#251218] mb-4"
                  style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                >
                  Choose Your Username
                </h1>
                <p
                  className="text-[#251218]/70 leading-relaxed"
                  style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                >
                  This is how you'll appear across the AVERRA community
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <span
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[#251218]/40 text-lg"
                      style={{ fontFamily: "Lora, serif" }}
                    >
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      onBlur={() => username && checkUsernameAvailability(username)}
                      placeholder="username"
                      className="w-full pl-10 pr-12 py-3 bg-white/60 border border-[#251218]/10 rounded-lg focus:border-[#c9969e]/30 focus:outline-none transition-all"
                      style={{ fontFamily: "Lora, serif", color: "#251218" }}
                    />
                    {isCheckingUsername && (
                      <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-[#c9969e]/30 border-t-[#c9969e] rounded-full animate-spin"></div>
                      </div>
                    )}
                    {!isCheckingUsername && isUsernameAvailable === true && (
                      <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600" />
                    )}
                    {!isCheckingUsername && isUsernameAvailable === false && (
                      <X className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600" />
                    )}
                  </div>

                  {usernameError && (
                    <p className="mt-2 text-sm text-red-600" style={{ fontFamily: "Lora, serif" }}>
                      {usernameError}
                    </p>
                  )}

                  {!usernameError && isUsernameAvailable && (
                    <p className="mt-2 text-sm text-green-600" style={{ fontFamily: "Lora, serif" }}>
                      Username is available
                    </p>
                  )}
                </div>

                <div className="text-xs text-[#251218]/50 space-y-1" style={{ fontFamily: "Lora, serif" }}>
                  <p>• 3-20 characters</p>
                  <p>• Letters, numbers, and underscores only</p>
                  <p>• Cannot be changed later</p>
                </div>

                <button
                  onClick={handleUsernameSubmit}
                  disabled={!isUsernameAvailable}
                  className="w-full py-3 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  <span className="text-sm uppercase tracking-[0.2em]">Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fdf5f7] overflow-hidden">
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0">
        {/* Soft looping background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#fdf5f7] via-[#fbf0f3] to-[#f8e8ed]" />

        {/* Floating orbs */}
        <div className="absolute top-20 right-20 w-[600px] h-[600px] bg-[#c9969e]/10 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 left-20 w-[500px] h-[500px] bg-[#251218]/5 rounded-full blur-3xl animate-pulse"
             style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      {/* Content */}
      <div className={`relative z-10 min-h-screen flex items-center justify-center p-8 transition-opacity duration-2000 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="max-w-5xl w-full">

          {/* Main Welcome */}
          <div className="text-center mb-20">
            <div className="mb-8">
              <div className="inline-block px-8 py-3 bg-white/40 backdrop-blur-md border border-[#c9969e]/20 rounded-full mb-8">
                <p
                  className="text-[10px] uppercase tracking-[0.3em] text-[#c9969e]"
                  style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
                >
                  {tierLabel} Membership
                </p>
              </div>
            </div>

            <h1
              className="text-[clamp(3rem,8vw,6rem)] text-[#251218] leading-[0.95] mb-8"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400, letterSpacing: "-0.02em" }}
            >
              Welcome to
              <br />
              <span className="italic text-[#c9969e]">AVERRA</span>
            </h1>

            <p
              className="text-2xl text-[#251218]/70 leading-relaxed max-w-2xl mx-auto mb-12"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              You're now part of an exclusive network of beauty professionals transforming
              from service providers into business founders.
            </p>

            {/* Founder Introduction */}
            <div className="max-w-3xl mx-auto mb-16">
              <div className="relative aspect-video bg-gradient-to-br from-[#c9969e]/20 to-[#251218]/10 rounded-2xl overflow-hidden group cursor-pointer backdrop-blur-sm border border-[#c9969e]/20"
                   onClick={() => setIsVideoPlaying(true)}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-[#c9969e]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-500 border border-[#c9969e]/30">
                      <Play className="w-10 h-10 text-[#c9969e] ml-2" />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#251218]/60 to-transparent">
                  <p
                    className="text-white text-lg"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
                  >
                    A Message From Jayla
                  </p>
                  <p
                    className="text-white/80 text-sm mt-1"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    5 min · Watch your orientation
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mission Statement */}
          <div className="max-w-3xl mx-auto mb-20">
            <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-12 border border-[#c9969e]/20 shadow-2xl">
              <h2
                className="text-3xl text-[#251218] mb-6 text-center"
                style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
              >
                What We're Building Together
              </h2>

              <div className="h-px bg-gradient-to-r from-transparent via-[#c9969e]/30 to-transparent mb-8"></div>

              <div className="space-y-6">
                {[
                  "A business that doesn't require your body to be present for every dollar earned",
                  "Income streams that compound while you rest and restore",
                  "A brand that finally reflects the expertise you've been building all along",
                  "Financial freedom without sacrificing the artistry that called you here"
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#c9969e] to-[#251218] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    </div>
                    <p
                      className="text-lg text-[#251218]/80 leading-relaxed pt-0.5"
                      style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Getting Started Checklist */}
          <div className="max-w-3xl mx-auto mb-16">
            <h3
              className="text-2xl text-[#251218] mb-8 text-center"
              style={{ fontFamily: "Playfair Display, serif", fontWeight: 400 }}
            >
              Your First Steps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {[
                { step: "01", title: "Explore Your Dashboard", desc: "Navigate your new ecosystem" },
                { step: "02", title: "Join The Community", desc: "Introduce yourself to the network" },
                { step: "03", title: "Start Reading", desc: "Open The Gold Standard" }
              ].map((item) => (
                <div key={item.step} className="bg-white/40 backdrop-blur-md rounded-xl p-6 border border-[#c9969e]/10 hover:border-[#c9969e]/30 transition-all duration-500 hover:-translate-y-1">
                  <p
                    className="text-5xl text-[#c9969e]/20 mb-3"
                    style={{ fontFamily: "Playfair Display, serif", fontWeight: 300 }}
                  >
                    {item.step}
                  </p>
                  <h4
                    className="text-lg text-[#251218] mb-2"
                    style={{ fontFamily: "Lora, serif", fontWeight: 500 }}
                  >
                    {item.title}
                  </h4>
                  <p
                    className="text-sm text-[#251218]/60"
                    style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={handleComplete}
              className="group relative inline-flex items-center gap-3 px-16 py-5 bg-gradient-to-r from-[#c9969e] to-[#251218] text-white overflow-hidden hover:scale-105 transition-all duration-500 shadow-2xl"
              style={{ fontFamily: "Montserrat, sans-serif", fontWeight: 600 }}
            >
              <span className="relative z-10 text-sm uppercase tracking-[0.2em]">Enter Your Dashboard</span>
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>

            <p
              className="mt-6 text-sm text-[#251218]/50"
              style={{ fontFamily: "Lora, serif", fontWeight: 300 }}
            >
              This is where everything changes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

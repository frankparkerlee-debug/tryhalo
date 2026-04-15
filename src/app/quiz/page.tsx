'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';
import HaloLogo from '@/components/HaloLogo';
import FoundingCircleForm from '@/components/FoundingCircleForm';

/* ==============================
   PROGRAM DATA
   ============================== */

const programs = {
  hormoneTherapy: {
    name: 'Hormone Therapy',
    compounds: 'Estradiol \u00B7 Progesterone \u00B7 Testosterone',
    price: '$149/mo',
    foundingPrice: '$129/mo',
    description:
      'Personalized hormone optimization for women navigating perimenopause, menopause, and hormonal imbalance.',
    includes: [
      'Compounded medications',
      'Comprehensive lab panel',
      'Provider consultations',
      'Free shipping',
    ],
    href: '/renew',
    available: true,
  },
  testosterone: {
    name: 'Testosterone',
    compounds: 'Testosterone Cypionate \u00B7 HCG \u00B7 Anastrozole',
    price: '$149/mo',
    foundingPrice: '$129/mo',
    description:
      'Lab-driven testosterone optimization with ongoing provider monitoring.',
    includes: [
      'Testosterone + ancillaries',
      'Comprehensive lab panel',
      'Provider consultations',
      'Free shipping',
    ],
    href: '/vital',
    available: true,
  },
  peptideTherapy: {
    name: 'Peptide Therapy',
    compounds: 'Sermorelin',
    price: '$229/mo',
    foundingPrice: '$179/mo',
    description:
      'Growth hormone peptide therapy for recovery, sleep, and body composition.',
    includes: [
      'Compounded peptides',
      'Provider consultations',
      'Protocol adjustments',
      'Free shipping',
    ],
    href: '/restore',
    available: true,
  },
  nadTherapy: {
    name: 'NAD+ Therapy',
    compounds: 'NAD+ Injection \u00B7 Glutathione',
    price: '$229/mo',
    foundingPrice: '$179/mo',
    description:
      'Clinical-grade NAD+ for energy, mental clarity, and cellular health.',
    includes: [
      'Pharmaceutical-grade NAD+',
      'Provider consultations',
      'Dosing optimization',
      'Free shipping',
    ],
    href: '/vitality',
    available: true,
  },
  weightLoss: {
    name: 'Weight Loss',
    compounds: 'Semaglutide \u00B7 Tirzepatide',
    price: '$249/mo',
    foundingPrice: '$199/mo',
    description: 'GLP-1 therapy for sustainable weight management.',
    includes: [
      'GLP-1 medication',
      'Provider consultations',
      'Metabolic monitoring',
      'Free shipping',
    ],
    href: '#',
    available: false,
  },
  sexualWellness: {
    name: 'Sexual Wellness',
    compounds: 'PT-141 (Bremelanotide) \u00B7 Oxytocin',
    price: 'TBD',
    foundingPrice: '',
    description: 'FDA-approved therapies for desire and sexual wellness.',
    includes: [
      'Prescribed medications',
      'Provider consultations',
      'Ongoing support',
      'Free shipping',
    ],
    href: '#',
    available: false,
  },
};

/* ==============================
   SYMPTOM MAPPING
   ============================== */

const symptomMapping: Record<string, string[]> = {
  'Energy & fatigue': [
    'Afternoon energy crashes',
    'Morning fatigue',
    'Brain fog',
    'Low motivation',
  ],
  'Sleep quality': [
    'Trouble falling asleep',
    'Waking during the night',
    'Not feeling rested',
    'Night sweats',
  ],
  'Weight management': [
    'Stubborn weight gain',
    'Slow metabolism',
    'Cravings',
    'Plateau despite exercise',
  ],
  'Mood & mental clarity': [
    'Irritability',
    'Anxiety',
    'Mood swings',
    'Difficulty concentrating',
  ],
  'Recovery & performance': [
    'Slow recovery from exercise',
    'Joint stiffness',
    'Loss of muscle mass',
    'Decreased stamina',
  ],
  'Sexual health & libido': [
    'Low desire',
    'Difficulty with arousal',
    'Decreased satisfaction',
  ],
  'Skin, hair & aging': [
    'Thinning hair',
    'Dry or aging skin',
    'Slow wound healing',
  ],
  'Overall optimization': [
    'Afternoon energy crashes',
    'Trouble falling asleep',
    'Stubborn weight gain',
    'Irritability',
    'Slow recovery from exercise',
    'Low desire',
    'Thinning hair',
    'Brain fog',
  ],
};

/* ==============================
   GOALS LIST
   ============================== */

const goalOptions = [
  'Energy & fatigue',
  'Sleep quality',
  'Weight management',
  'Mood & mental clarity',
  'Recovery & performance',
  'Sexual health & libido',
  'Skin, hair & aging',
  'Overall optimization',
];

/* ==============================
   SAFETY OPTIONS
   ============================== */

const safetyOptions = [
  'History of blood clots',
  'Cancer history',
  'Heart disease',
  'Liver disease',
  'Pregnant or planning pregnancy',
  'None of these',
];

/* ==============================
   AGE RANGE HELPER
   ============================== */

function ageToMinimum(ageRange: string): number {
  const num = parseInt(ageRange, 10);
  return isNaN(num) ? 35 : num;
}

/* ==============================
   TOTAL STEPS
   ============================== */

const TOTAL_STEPS = 8;

/* ==============================
   QUIZ PAGE COMPONENT
   ============================== */

export default function QuizPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [animating, setAnimating] = useState(false);

  // Quiz answers
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [goals, setGoals] = useState<string[]>([]);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [takingMedications, setTakingMedications] = useState<string | null>(null);
  const [medicationDetails, setMedicationDetails] = useState('');
  const [safetyItems, setSafetyItems] = useState<string[]>([]);

  // Results
  const [primaryRec, setPrimaryRec] = useState<keyof typeof programs | null>(null);
  const [secondaryRecs, setSecondaryRecs] = useState<(keyof typeof programs)[]>([]);
  const [comingSoonRecs, setComingSoonRecs] = useState<(keyof typeof programs)[]>([]);

  /* ---- Step transition ---- */
  const goTo = useCallback(
    (nextStep: number, dir: 'forward' | 'back' = 'forward') => {
      if (animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setStep(nextStep);
        setAnimating(false);
      }, 250);
    },
    [animating],
  );

  const goNext = useCallback(() => goTo(step + 1, 'forward'), [step, goTo]);
  const goBack = useCallback(() => {
    if (step > 1) goTo(step - 1, 'back');
  }, [step, goTo]);

  /* ---- Auto-advance on single-select steps ---- */
  const selectGender = (value: string) => {
    setGender(value);
    setTimeout(() => goTo(2, 'forward'), 300);
  };

  const selectAge = (value: string) => {
    setAge(value);
    setTimeout(() => goTo(3, 'forward'), 300);
  };

  /* ---- Goals multi-select ---- */
  const toggleGoal = (goal: string) => {
    setGoals((prev) => {
      if (prev.includes(goal)) return prev.filter((g) => g !== goal);
      if (prev.length >= 3) return prev;
      return [...prev, goal];
    });
  };

  /* ---- Symptoms multi-select ---- */
  const toggleSymptom = (s: string) => {
    setSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  };

  /* ---- Safety multi-select ---- */
  const toggleSafety = (item: string) => {
    if (item === 'None of these') {
      setSafetyItems(['None of these']);
      return;
    }
    setSafetyItems((prev) => {
      const without = prev.filter((x) => x !== 'None of these');
      if (without.includes(item)) return without.filter((x) => x !== item);
      return [...without, item];
    });
  };

  /* ---- Derived symptoms from selected goals ---- */
  const derivedSymptoms = Array.from(
    new Set(goals.flatMap((g) => symptomMapping[g] || [])),
  );

  /* ---- Routing logic ---- */
  const computeResults = useCallback(() => {
    const recs: (keyof typeof programs)[] = [];
    const comingSoon: (keyof typeof programs)[] = [];
    const ageNum = ageToMinimum(age);

    const goalSet = new Set(goals);

    // Primary: Hormone Therapy for women
    if (
      gender === 'Woman' &&
      (goalSet.has('Energy & fatigue') ||
        goalSet.has('Sleep quality') ||
        goalSet.has('Mood & mental clarity'))
    ) {
      recs.push('hormoneTherapy');
    }

    // Primary: Testosterone for men
    if (
      gender === 'Man' &&
      (goalSet.has('Energy & fatigue') ||
        goalSet.has('Recovery & performance') ||
        goalSet.has('Sexual health & libido') ||
        goalSet.has('Mood & mental clarity'))
    ) {
      recs.push('testosterone');
    }

    // Peptide Therapy
    if (goalSet.has('Recovery & performance') && !recs.includes('peptideTherapy')) {
      recs.push('peptideTherapy');
    }

    // NAD+ Therapy
    if (
      ageNum >= 35 &&
      (goalSet.has('Energy & fatigue') ||
        goalSet.has('Mood & mental clarity') ||
        goalSet.has('Skin, hair & aging') ||
        goalSet.has('Overall optimization')) &&
      !recs.includes('nadTherapy')
    ) {
      recs.push('nadTherapy');
    }

    // Weight Loss (coming soon)
    if (goalSet.has('Weight management')) {
      comingSoon.push('weightLoss');
    }

    // Sexual Wellness (coming soon, unless already covered)
    if (
      goalSet.has('Sexual health & libido') &&
      !recs.includes('testosterone') &&
      !recs.includes('hormoneTherapy')
    ) {
      comingSoon.push('sexualWellness');
    }

    // Ensure at least one recommendation
    if (recs.length === 0) {
      // Default based on gender
      if (gender === 'Woman') recs.push('hormoneTherapy');
      else if (gender === 'Man') recs.push('testosterone');
      else recs.push('nadTherapy');
    }

    const primary = recs[0];
    const secondary = recs.slice(1);

    setPrimaryRec(primary);
    setSecondaryRecs(secondary);
    setComingSoonRecs(comingSoon);

    // Save quiz data to localStorage for homepage personalization
    try {
      localStorage.setItem('halo_quiz', JSON.stringify({
        gender,
        age,
        goals,
        primaryRec: primary,
        secondaryRecs: secondary,
        completedAt: new Date().toISOString(),
      }));
    } catch {}
  }, [gender, age, goals]);

  /* ---- Loading screen auto-advance ---- */
  useEffect(() => {
    if (step === 7) {
      computeResults();
      const timer = setTimeout(() => {
        setDirection('forward');
        setAnimating(true);
        setTimeout(() => {
          setStep(8);
          setAnimating(false);
        }, 250);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [step, computeResults]);

  /* ---- Progress bar ---- */
  const progress = step <= 6 ? (step / TOTAL_STEPS) * 100 : step === 7 ? 87.5 : 100;

  /* ---- Shared card styles ---- */
  const optionCard = (selected: boolean) =>
    `relative cursor-pointer rounded-2xl px-6 py-5 text-left transition-all duration-300 border ${
      selected
        ? 'border-[#C8A96E] bg-[#C8A96E]/10 shadow-[0_0_20px_rgba(200,169,110,0.15)]'
        : 'border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]'
    }`;

  const checkboxCard = (selected: boolean) =>
    `relative cursor-pointer rounded-xl px-5 py-4 text-left transition-all duration-300 border flex items-center gap-3 ${
      selected
        ? 'border-[#C8A96E] bg-[#C8A96E]/10'
        : 'border-white/[0.08] bg-white/[0.04] hover:border-white/20 hover:bg-white/[0.06]'
    }`;

  const checkbox = (selected: boolean) =>
    `w-5 h-5 rounded flex-shrink-0 flex items-center justify-center border transition-all duration-200 ${
      selected
        ? 'bg-[#C8A96E] border-[#C8A96E]'
        : 'border-white/30 bg-transparent'
    }`;

  const continueBtn =
    'inline-flex items-center gap-2 mt-8 px-8 py-3.5 rounded-full bg-[#C8A96E] text-[#1a1a1a] font-semibold text-sm transition-all duration-300 hover:bg-[#d4b67a] hover:shadow-[0_0_30px_rgba(200,169,110,0.35)]';

  /* ---- Animation classes ---- */
  const stepAnim = animating
    ? 'opacity-0 translate-x-8'
    : 'opacity-100 translate-x-0';

  /* ---- RENDER ---- */
  return (
    <>
    {/* Hide main nav, announcement bar, footer, and chat on quiz page */}
    <style>{`
      body > *:not(main):not(script):not(style):not(next-route-announcer) {
        display: none !important;
      }
      body > main {
        display: flex !important;
        padding: 0 !important;
      }
    `}</style>
    <div
      className={`min-h-screen flex flex-col ${
        step === 8 ? 'bg-[#FAFAF7]' : 'bg-[#1a1a1a]'
      } transition-colors duration-500 relative overflow-hidden`}
    >
      {/* Background decoration */}
      {step < 8 && (
        <>
          <div className="absolute top-[10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-[#C8A96E] blur-[180px] opacity-[0.06] pointer-events-none" />
          <div className="absolute bottom-[20%] left-[-5%] w-[250px] h-[250px] rounded-full bg-[#7A8B6F] blur-[150px] opacity-[0.04] pointer-events-none" />
        </>
      )}
      {/* Top bar */}
      {step < 8 && (
        <div className="fixed top-0 left-0 right-0 z-50">
          {/* Progress bar */}
          <div className="h-1 bg-white/[0.06]">
            <div
              className="h-full bg-[#C8A96E] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          {/* Nav row */}
          <div className="flex items-center justify-between px-6 py-4">
            {step > 1 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <Link
                href="/"
                className="flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Home
              </Link>
            )}
            <Link href="/">
              <HaloLogo size="md" variant="dark" />
            </Link>
            <div className="w-16" />
          </div>
        </div>
      )}

      {/* Step content */}
      <div
        className={`flex-1 flex items-center justify-center px-6 ${
          step < 8 ? 'pt-24 pb-16' : 'pt-8 pb-16'
        }`}
      >
        <div
          className={`w-full max-w-2xl transition-all duration-250 ease-out ${stepAnim}`}
          style={{
            transitionProperty: 'opacity, transform',
          }}
        >
          {/* ============ STEP 1: GENDER ============ */}
          {step === 1 && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                Let&apos;s find what&apos;s right for you.
              </h1>
              <p className="text-white/40 text-sm mb-10">
                This takes about 2 minutes.
              </p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                {['Woman', 'Man', 'Prefer not to say'].map((option) => (
                  <button
                    key={option}
                    onClick={() => selectGender(option)}
                    className={optionCard(gender === option)}
                  >
                    <p className="text-white font-medium">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============ STEP 2: AGE ============ */}
          {step === 2 && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-10">
                What&apos;s your age range?
              </h1>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                {['25-34', '35-44', '45-54', '55-64', '65+'].map((option) => (
                  <button
                    key={option}
                    onClick={() => selectAge(option)}
                    className={optionCard(age === option)}
                  >
                    <p className="text-white font-medium">{option}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ============ STEP 3: GOALS ============ */}
          {step === 3 && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                What are you most looking to improve?
              </h1>
              <p className="text-white/40 text-sm mb-10">Select up to 3.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto">
                {goalOptions.map((goal) => {
                  const selected = goals.includes(goal);
                  const disabled = !selected && goals.length >= 3;
                  return (
                    <button
                      key={goal}
                      onClick={() => toggleGoal(goal)}
                      disabled={disabled}
                      className={`${optionCard(selected)} ${
                        disabled ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      <p className="text-white font-medium text-sm">{goal}</p>
                    </button>
                  );
                })}
              </div>
              {goals.length >= 1 && (
                <button onClick={goNext} className={continueBtn}>
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* ============ STEP 4: SYMPTOMS ============ */}
          {step === 4 && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                Which of these do you experience?
              </h1>
              <p className="text-white/40 text-sm mb-10">Select all that apply.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto text-left">
                {derivedSymptoms.map((symptom) => {
                  const selected = symptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      onClick={() => toggleSymptom(symptom)}
                      className={checkboxCard(selected)}
                    >
                      <span className={checkbox(selected)}>
                        {selected && <Check className="w-3 h-3 text-[#1a1a1a]" />}
                      </span>
                      <span className="text-white text-sm">{symptom}</span>
                    </button>
                  );
                })}
              </div>
              <button onClick={goNext} className={continueBtn}>
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============ STEP 5: MEDICATIONS ============ */}
          {step === 5 && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-10">
                Are you currently taking any medications?
              </h1>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                <button
                  onClick={() => setTakingMedications('Yes')}
                  className={optionCard(takingMedications === 'Yes')}
                >
                  <p className="text-white font-medium">Yes</p>
                </button>
                <button
                  onClick={() => {
                    setTakingMedications('No');
                    setMedicationDetails('');
                    setTimeout(() => goTo(6, 'forward'), 300);
                  }}
                  className={optionCard(takingMedications === 'No')}
                >
                  <p className="text-white font-medium">No</p>
                </button>
              </div>
              {takingMedications === 'Yes' && (
                <div className="mt-6 max-w-sm mx-auto">
                  <textarea
                    value={medicationDetails}
                    onChange={(e) => setMedicationDetails(e.target.value)}
                    placeholder="List your current medications..."
                    rows={3}
                    className="w-full rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm px-4 py-3 placeholder:text-white/30 outline-none focus:border-[#C8A96E] transition-colors resize-none"
                  />
                  <button onClick={goNext} className={continueBtn}>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ============ STEP 6: SAFETY ============ */}
          {step === 6 && (
            <div className="text-center">
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-white mb-3">
                Do any of these apply to you?
              </h1>
              <p className="text-white/40 text-sm mb-10">
                This helps your provider prepare.
              </p>
              <div className="flex flex-col gap-3 max-w-sm mx-auto">
                {safetyOptions.map((item) => {
                  const selected = safetyItems.includes(item);
                  return (
                    <button
                      key={item}
                      onClick={() => toggleSafety(item)}
                      className={checkboxCard(selected)}
                    >
                      <span className={checkbox(selected)}>
                        {selected && <Check className="w-3 h-3 text-[#1a1a1a]" />}
                      </span>
                      <span className="text-white text-sm">{item}</span>
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => goTo(7, 'forward')}
                className={continueBtn}
              >
                See my results
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* ============ STEP 7: LOADING ============ */}
          {step === 7 && (
            <div className="text-center flex flex-col items-center justify-center">
              <div
                className="w-20 h-20 rounded-full border-2 border-[#C8A96E] mb-8"
                style={{
                  animation: 'spin 3s linear infinite, ring-pulse 4s ease-in-out infinite',
                }}
              />
              <p className="font-serif text-xl md:text-2xl font-bold text-white mb-3">
                Analyzing your responses...
              </p>
              <p className="text-white/30 text-sm">
                647 founding members and counting
              </p>
            </div>
          )}

          {/* ============ STEP 8: RESULTS ============ */}
          {step === 8 && (
            <div>
              {/* Top bar for results page */}
              <div className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF7]/90 backdrop-blur-xl border-b border-[#2D2D2D]/[0.06]">
                <div className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
                  <button
                    onClick={() => goTo(6, 'back')}
                    className="flex items-center gap-1.5 text-sm text-[#2D2D2D]/50 hover:text-[#2D2D2D] transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                  <Link href="/" className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full border-[1.5px] border-[#C8A96E]" />
                    <span className="font-serif text-lg font-bold text-[#2D2D2D]">
                      Halo
                    </span>
                  </Link>
                  <div className="w-16" />
                </div>
              </div>

              <div className="pt-16 max-w-2xl mx-auto">
                <h1 className="font-serif text-2xl md:text-3xl font-bold text-[#2D2D2D] mb-10 text-center">
                  Based on your responses, here&apos;s what we&apos;d recommend.
                </h1>

                {/* PRIMARY RECOMMENDATION */}
                {primaryRec && (
                  <div className="rounded-2xl border border-[#C8A96E]/30 bg-white p-8 mb-6 shadow-sm">
                    <p className="text-xs font-semibold text-[#C8A96E] uppercase tracking-widest mb-4">
                      Recommended for you
                    </p>
                    <h2 className="font-serif text-2xl font-bold text-[#2D2D2D] mb-1">
                      {programs[primaryRec].name}
                    </h2>
                    <p className="text-[#2D2D2D]/40 text-sm mb-4">
                      {programs[primaryRec].compounds}
                    </p>
                    <p className="text-sm text-[#2D2D2D]/60 leading-relaxed mb-6">
                      {programs[primaryRec].description}
                    </p>

                    {/* Price */}
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="text-[#2D2D2D]/30 line-through text-sm">
                        {programs[primaryRec].price}
                      </span>
                      <span className="text-[#C8A96E] font-bold text-xl">
                        {programs[primaryRec].foundingPrice}
                      </span>
                      <span className="text-[#2D2D2D]/40 text-xs">founding price</span>
                    </div>

                    {/* Includes */}
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-[#2D2D2D]/50 uppercase tracking-wider mb-3">
                        What&apos;s included
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {programs[primaryRec].includes.map((item) => (
                          <span
                            key={item}
                            className="text-xs px-3 py-1.5 rounded-full bg-[#2D2D2D]/[0.04] text-[#2D2D2D]/60"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <Link
                      href={programs[primaryRec].href}
                      className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#C8A96E] text-[#1a1a1a] font-semibold text-sm transition-all duration-300 hover:bg-[#d4b67a] hover:shadow-[0_0_30px_rgba(200,169,110,0.35)]"
                    >
                      Claim Your Founding Spot
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* SECONDARY RECOMMENDATIONS */}
                {secondaryRecs.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm font-semibold text-[#2D2D2D]/50 mb-4">
                      Also recommended for you:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {secondaryRecs.map((key) => (
                        <Link
                          key={key}
                          href={programs[key].href}
                          className="rounded-xl border border-[#2D2D2D]/10 bg-white p-6 hover:border-[#C8A96E]/30 transition-all duration-300 hover:shadow-sm group"
                        >
                          <h3 className="font-serif text-lg font-bold text-[#2D2D2D] mb-1 group-hover:text-[#C8A96E] transition-colors">
                            {programs[key].name}
                          </h3>
                          <p className="text-[#2D2D2D]/40 text-xs mb-3">
                            {programs[key].compounds}
                          </p>
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-[#2D2D2D]/30 line-through text-xs">
                              {programs[key].price}
                            </span>
                            <span className="text-[#C8A96E] font-semibold">
                              {programs[key].foundingPrice}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1 text-sm text-[#C8A96E] font-medium">
                            Learn more <ArrowRight className="w-3.5 h-3.5" />
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* COMING SOON */}
                {comingSoonRecs.length > 0 && (
                  <div className="mb-10">
                    <p className="text-sm font-semibold text-[#2D2D2D]/50 mb-4">
                      Coming soon:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {comingSoonRecs.map((key) => (
                        <div
                          key={key}
                          className="rounded-xl border border-[#2D2D2D]/10 bg-white/60 p-6"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-serif text-lg font-bold text-[#2D2D2D]">
                              {programs[key].name}
                            </h3>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2D2D2D]/[0.06] text-[#2D2D2D]/40 font-medium">
                              Coming Soon
                            </span>
                          </div>
                          <p className="text-[#2D2D2D]/40 text-xs mb-3">
                            {programs[key].compounds}
                          </p>
                          <a
                            href="/#founding-circle"
                            className="inline-flex items-center gap-1 text-sm text-[#C8A96E] font-medium hover:underline"
                          >
                            Join the waitlist <ArrowRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* EMAIL CAPTURE */}
                <div className="mt-10 pt-10 border-t border-[#2D2D2D]/[0.06]">
                  <div className="text-center mb-6">
                    <p className="font-serif text-lg font-bold text-[#2D2D2D] mb-2">
                      Lock in your founding rate.
                    </p>
                    <p className="text-sm text-[#2D2D2D]/50">
                      999 spots. Reduced pricing for life. First access to everything.
                    </p>
                  </div>
                  <div className="max-w-lg mx-auto">
                    <FoundingCircleForm variant="light" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Spinning keyframe for loading screen */}
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
    </>
  );
}

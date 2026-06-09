import { BusinessConfig } from "../types";

export const INDUSTRY_PRESETS: Record<string, BusinessConfig> = {
  "Tech Advisory": {
    name: "Follygee Rides and Autos",
    industry: "E-hailing, Chauffeur Sienna Rentals & Auto Sales",
    tagline: "Reliable, Safe & Affordable Transportation Across Lagos, Ogun, Oyo, Ondo, Ekiti & South Western Nigeria",
    description: "Book trusted rides, airport transfers, corporate transportation, and Sienna hire services with Follygee Rides. Available 24/7 across Lagos, Ogun, Oyo, Ondo, Ekiti, Osun, and all of South Western Nigeria. We are committed to punctuality, professionalism, and vehicle safety.",
    primaryColor: "blue",
    theme: "light",
    email: "info@follygeerides.com",
    phone: "+234 803 462 3693",
    address: "Lagos, Ogun, Oyo, Ondo, Ekiti, Osun & All South Western Nigeria",
    services: [
      {
        id: "folly-1",
        title: "Airport Transfers",
        description: "Reliable, punctual airport pickups and drop-offs to check-in stress-free.",
        price: "From ₦25,000",
        icon: "Navigation"
      },
      {
        id: "folly-2",
        title: "Corporate Transportation",
        description: "Luxury logistics solutions for businesses, staff commuting schemes, and client transfers.",
        price: "Custom quotation",
        icon: "Briefcase"
      },
      {
        id: "folly-3",
        title: "Inter-State Travel",
        description: "Comfortable long-distance city transfers across Nigeria with professionally-trained highway drivers.",
        price: "From ₦45,000/day",
        icon: "Compass"
      },
      {
        id: "folly-4",
        title: "Sienna Hire",
        description: "Sienna rentals with expert drivers for family trips, retreats, events, and flexible group travels.",
        price: "From ₦35,000/day",
        icon: "Car"
      },
      {
        id: "folly-5",
        title: "Event Transportation",
        description: "Coordinated transport fleets for weddings, executive conferences, premium parties, or church outings.",
        price: "Flexible rates",
        icon: "Sparkles"
      },
      {
        id: "folly-6",
        title: "Private Ride Booking",
        description: "Daily personalized transportation services and specialized private chauffeur bookings for individuals.",
        price: "Hourly options",
        icon: "ShieldAlert"
      }
    ]
  },
  "Legal Firm": {
    name: "Athena Legal Chambers",
    industry: "Corporate Transactions & Intellectual Property Advisors",
    tagline: "Preemptive Counsel and Premium Representation for Innovators",
    description: "A elite boutique partnership representing venture funds, creative pioneers, and corporate boards through mergers, asset acquisition, and complex global regulatory licensing.",
    primaryColor: "indigo",
    theme: "light",
    email: "intake@athenachambers.com",
    phone: "+1 (212) 555-8833",
    address: "450 Lexington Avenue, Midtown Manhattan, NY",
    services: [
      {
        id: "leg-1",
        title: "Venture Financing & Equity",
        description: "Drafting stock purchase agreements, founder vesting provisions, SAFE convertible notes, and representation through Series A/B syndicates.",
        price: "$450/hour",
        icon: "Scale"
      },
      {
        id: "leg-2",
        title: "IP Defenses & Patent Licensing",
        description: "Securing national and international trademarks, copyright registration, and drafting strategic proprietary intellectual software licenses.",
        price: "From $4,500/filing",
        icon: "FileKey"
      },
      {
        id: "leg-3",
        title: "Bespoke General Counsel",
        description: "Advising executives on risk mitigation, employment agreements, master service contracts, and strategic statutory compliance frameworks.",
        price: "Retainers from $5,000/mo",
        icon: "Briefcase"
      }
    ]
  },
  "Creative Studio": {
    name: "Vanguard Studio",
    industry: "High-End Corporate Branding & Interactive User Experience",
    tagline: "Striving for Absolute Aesthetic Precision in Every Digital Interface",
    description: "We are an intimate, award-winning agency breathing life into brands via physical identity systems, typographic discipline, and ultra-fluid interactive web applications.",
    primaryColor: "rose",
    theme: "light",
    email: "hello@vanguardstudio.com",
    phone: "+44 20 8920 3341",
    address: "Shoreditch Design Rails, Block 4, London",
    services: [
      {
        id: "cre-1",
        title: "Visual Identity & Typography",
        description: "Bespoke logomarks, typography systems, comprehensive digital style assets, and pristine brand books.",
        price: "From $9,000/project",
        icon: "Sparkles"
      },
      {
        id: "cre-2",
        title: "Interactive UX/UI Systems",
        description: "User journey mapping, wireframing, high-fidelity layouts, and motion prototype design focusing on fluid feel.",
        price: "From $15,000/interface",
        icon: "Layers"
      },
      {
        id: "cre-3",
        title: "Creative Content Strategy",
        description: "Strategic creative copy, professional video production direction, editorial tone of voice guidance, and premium photography production.",
        price: "From $5,500/retainer",
        icon: "Video"
      }
    ]
  },
  "Wellness Clinic": {
    name: "Solace Holistic Health",
    industry: "Luxury Restoratives, Thermal Healing & Preventive Well-Being",
    tagline: "Reclaiming Human Vitality Through Science-Driven Natural Rituals",
    description: "An immersive sensory sanctuary combining modern bloodwork diagnostics with thermal pools, custom nutritional therapies, and restorative physical adjustments.",
    primaryColor: "emerald",
    theme: "light",
    email: "retreat@solaceholistic.com",
    phone: "+1 (800) 555-5544",
    address: "88 Canopy Ridge Road, Sedona, AZ",
    services: [
      {
        id: "wel-1",
        title: "Metabolic Assessment & Nutrition",
        description: "Advanced micronutrient scanning, metabolic analysis, and customized daily clean anti-inflammatory diet guides.",
        price: "$1,200/course",
        icon: "Heart"
      },
      {
        id: "wel-2",
        title: "Thermal & Hydro Therapy",
        description: "Therapeutic mineral bath cycles, clinical dry sauna heat routines, and sensory compression recovery sessions.",
        price: "$180/session",
        icon: "Compass"
      },
      {
        id: "wel-3",
        title: "Restoratives & Body Alignment",
        description: "Gentle physical tissue release, manual joint optimization, postural retraining, and specialized breath coaching.",
        price: "$220/hour",
        icon: "Activity"
      }
    ]
  },
  "Wealth Partners": {
    name: "Aura Wealth Advisors",
    industry: "Generational Wealth Management & Private Family Office",
    tagline: "Shielding Capital Legacy Across Generations With Integrity",
    description: "We serve high-net-worth families, foundations, and trusts with independent, conflict-free wealth stewardship, estate engineering, and bespoke tax structures.",
    primaryColor: "amber",
    theme: "light",
    email: "stewardship@aurapath.com",
    phone: "+1 (305) 555-0100",
    address: "700 Brickell Avenue, Penthouse B, Miami, FL",
    services: [
      {
        id: "wea-1",
        title: "Legacy Estate Engineering",
        description: "Establishing dynastic trusts, family foundations, strategic philanthropic structures, and seamless succession planning maps.",
        price: "By consultation",
        icon: "TrendingUp"
      },
      {
        id: "wea-2",
        title: "Alternative Asset Allocation",
        description: "Direct investment access to premier venture groups, global infrastructure credits, luxury real estate arrays, and private capital mergers.",
        price: "Fee-only indexing",
        icon: "Coins"
      },
      {
        id: "wea-3",
        title: "Global Philanthropic Funds",
        description: "Drafting, funding, and auditing large-scale international nonprofit initiatives with dynamic real-impact analytics reporting.",
        price: "Annual stewardship basis",
        icon: "HeartHandshake"
      }
    ]
  }
};

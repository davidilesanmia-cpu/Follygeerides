import React, { useState } from "react";
import * as Icons from "lucide-react";
import { BusinessConfig } from "../types";
import ContactForm from "./ContactForm";

interface PublicWebsiteProps {
  config: BusinessConfig;
  onSubmissionSuccess?: () => void;
  onAdminLogin?: () => void;
}

export default function PublicWebsite({ config, onSubmissionSuccess, onAdminLogin }: PublicWebsiteProps) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedCarForInquiry, setSelectedCarForInquiry] = useState<string | null>(null);

  // Safe icon retrieval from Lucide pack
  const renderIcon = (iconName: string, colorClass: string) => {
    const IconComp = (Icons as any)[iconName] || Icons.HelpCircle;
    return <IconComp className={`w-5 h-5 ${colorClass}`} />;
  };

  // Nigeria Car Catalog for "buy cars" function
  const TOKUNBO_CARS = [
    {
      id: "car-1",
      name: "Toyota Corolla (LE Edition)",
      year: "2018",
      type: "Foreign Used (Tokunbo)",
      status: "Available at Lot",
      specs: ["Super Clean Tokunbo", "All-Wheel Drive Duty Paid", "Alloy Wheels", "Automatic Transmission"],
      image: "🚗"
    },
    {
      id: "car-2",
      name: "Toyota Camry (XLE Luxury)",
      year: "2019",
      type: "Foreign Used (Tokunbo)",
      status: "Recently Arrived",
      specs: ["Leather Interior", "Reverse Camera & Sensor", "Sunroof Choice", "Customs Clean Duty Paper"],
      image: "🚘"
    },
    {
      id: "car-3",
      name: "Toyota Sienna Space Wagon (XLE)",
      year: "2017",
      type: "Nigerian Used",
      status: "Hot Seller",
      specs: ["Pristine Nigerian Used", "Well-maintained body", "Chilled dual AC system", "Spacious 3-Row Seating"],
      image: "🚐"
    },
    {
      id: "car-4",
      name: "Lexus RX350 (AWD Premium Luxury)",
      year: "2016",
      type: "Foreign Used (Tokunbo)",
      status: "Available at Showroom",
      specs: ["Push Start Button", "Reverse Guidance Camera", "Premium Sound System", "Full Duty Document"],
      image: "🚙"
    }
  ];

  // Follygee Rides specific FAQs
  const FAQS = [
    {
      q: "How do I book a ride?",
      a: "You can book easily in two simple ways: either fill out our encrypted online booking form on this page with your pickup and destination points, or click our floating WhatsApp badge to chat with our 24/7 Akute dispatch coordinator directly."
    },
    {
      q: "Do you operate 24/7?",
      a: "Yes! Follygee Rides operates around the clock, 24 hours a day, 7 days a week. We are always online to monitor your late-night flight arrivals at Murtala Muhammed International Airport (MMIA) or dispatches across Lagos GRA."
    },
    {
      q: "Do you offer airport transfers?",
      a: "Absolutely. We specialize in executive airport pick-ups and drop-offs. Our professional chauffeurs monitor flight delay updates in real-time, waiting to assist you with heavy luggage in a ventilated Toyota Sienna or premium SUV."
    },
    {
      q: "Can I hire a Sienna?",
      a: "Yes. Our foreign-used, multi-zone airconditioned Toyota Sienna fleet is fully open for private daily rentals, interstate travels, family vacations, wedding groups, and luxury event transportation across Lagos and beyond."
    },
    {
      q: "Do you provide corporate transportation?",
      a: "Yes. We offer optimized executive staff shuttle programs, monthly rental accounts, and airport guest transport packages tailored for startups and global institutions operating in Nigeria."
    }
  ];

  const handleInspectCar = (carName: string) => {
    setSelectedCarForInquiry(carName);
    const element = document.getElementById("booking-system");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scheme = {
    text: "text-blue-800",
    bg: "bg-blue-50/80",
    border: "border-blue-200",
    hoverBg: "hover:bg-blue-50",
    btn: "bg-blue-800 hover:bg-blue-900 text-white",
    bullet: "text-blue-700",
    gradient: "from-blue-800 to-indigo-900"
  };

  const directWhatsAppLink = "https://api.whatsapp.com/send?phone=2348034623693&text=Hello%20Follygee%20Rides!%20I%20am%20visiting%20your%20website%20and%20would%20like%20to%20learn%20more%20about%20your%20rides%20and%20autos%20services.";

  return (
    <div className="bg-slate-50 min-h-screen font-sans text-slate-800 relative pb-16 sm:pb-0">
      
      {/* FLOATING ACTION OVERLAYS FOR COG SYSTEM */}
      
      {/* 24/7 Whatsapp Bottom Right Floating Trigger */}
      <a
        href={directWhatsAppLink}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-500 hover:scale-105 duration-150 text-white rounded-full shadow-2xl flex items-center justify-center gap-1.5 cursor-pointer animate-bounce group"
        title="Chat on WhatsApp"
        id="floating-whatsapp"
      >
        <Icons.MessageSquareCode className="w-6 h-6 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 font-bold text-xs shrink-0 whitespace-nowrap">
          24/7 WhatsApp Dispatch
        </span>
      </a>

      {/* MOBILE SPEED CONTACT RAIL (Bottom Bar for easy mobile navigation) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white flex border-t border-slate-800 h-14">
        <a 
          href="tel:+2348034623693" 
          className="flex-1 flex flex-col items-center justify-center gap-0.5 border-r border-slate-800"
        >
          <Icons.PhoneCall className="w-4 h-4 text-amber-400" />
          <span className="text-[10px] font-bold text-slate-300">Call Dispatch</span>
        </a>
        <a 
          href={directWhatsAppLink} 
          target="_blank" 
          rel="noreferrer" 
          className="flex-1 flex flex-col items-center justify-center gap-0.5 bg-emerald-700/95"
        >
          <Icons.MessageSquare className="w-4 h-4 text-white" />
          <span className="text-[10px] font-bold text-white">WhatsApp Book</span>
        </a>
        <a 
          href="#booking-system" 
          className="flex-1 flex flex-col items-center justify-center gap-0.5"
        >
          <Icons.CalendarRange className="w-4 h-4 text-blue-400" />
          <span className="text-[10px] font-bold text-slate-300">Form Booking</span>
        </a>
      </div>

      {/* LUXURY GOLD/BLUE BRANDING RAIL */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 border border-amber-400 shadow-inner shrink-0 font-black text-xl">
              F
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-blue-900 tracking-tight text-base leading-none">Follygee Rides</span>
                <span className="text-[9px] px-1.5 py-0.5 font-extrabold uppercase bg-amber-400 text-slate-950 rounded tracking-widest scale-90">Autos</span>
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-wide uppercase mt-0.5 block">Akute Lagos Dispatch Lot</span>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-extrabold uppercase tracking-wider">
            <a href="#services" className="text-slate-500 hover:text-blue-900 transition-all">Our Services</a>
            <a href="#autos" className="text-slate-500 hover:text-blue-900 transition-all flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span> Buy Cars
            </a>
            <a href="#about" className="text-slate-500 hover:text-blue-900 transition-all">Commitment Contract</a>
            <a href="#faqs" className="text-slate-500 hover:text-blue-900 transition-all">Support FAQs</a>
            <button 
              onClick={onAdminLogin}
              className="text-slate-500 hover:text-blue-900 transition-all flex items-center gap-1.5 cursor-pointer font-extrabold"
            >
              <Icons.Lock className="w-3.5 h-3.5" /> Admin Login
            </button>
            <a href="tel:+2348034623693" className="text-amber-500 flex items-center gap-1 bg-amber-50/50 rounded-lg py-1.5 px-3 border border-amber-200">
              <Icons.PhoneCall className="w-3 h-3" /> Call 24/7
            </a>
          </nav>
        </div>
      </header>

      {/* HERO HERO CONTAINER */}
      <section className="bg-slate-950 text-white relative overflow-hidden py-16 sm:py-24 border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/70 via-slate-950 to-indigo-950/60 z-0"></div>
        {/* Lagos Highway Road Accent Visual Layer */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 opacity-80 z-10"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-blue-900/50 border border-amber-400/35 rounded-full px-4 py-1.5 text-xs text-amber-300 font-bold tracking-wider uppercase mb-2">
            <Icons.Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Reliable, 24/7 safe travel throughout Nigeria
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] max-w-4xl mx-auto font-sans">
            Reliable, Safe &amp; Affordable Transportation Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-400 underline decoration-amber-400">Lagos and Beyond</span>
          </h1>

          <p className="text-slate-300 text-sm md:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Book trusted rides, airport transfers, corporate transportation, and Sienna hire services with Follygee Rides. Available 24/7 with professional drivers and clean vehicles.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
            <a 
              href="#booking-system" 
              className="w-full sm:w-auto px-7 py-3 text-sm font-bold rounded-xl text-slate-950 bg-amber-400 hover:bg-amber-300 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Icons.Calendar className="w-4 h-4 text-slate-950" />
              Book structured Ride
            </a>
            
            <a 
              href={directWhatsAppLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-7 py-3 text-sm font-bold rounded-xl text-white bg-emerald-600 hover:bg-emerald-500 transition-all flex items-center justify-center gap-2"
            >
              <Icons.MessageSquare className="w-4 h-4" />
              Chat on WhatsApp
            </a>
          </div>

          {/* Prompt SEO Keywords block */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
            <span className="bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800"># Sienna Hire Lagos</span>
            <span className="bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800"># Airport Pickup MMIA</span>
            <span className="bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800"># Private Driver Lagos</span>
            <span className="bg-slate-900 py-1.5 px-3 rounded-lg border border-slate-800"># Tokunbo Car Sales</span>
          </div>

        </div>
      </section>

      {/* WHY CHOOSE COMPONENT */}
      <section className="py-16 bg-white shrink-0">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-blue-900 tracking-widest uppercase bg-blue-50 px-3 py-1 rounded">FOLLYGEE CORES</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Why Lagos Commuters Count On Us</h2>
            <p className="text-slate-500 text-xs mt-2">
              We never compromise. Every trip, inspection, and delivery is managed with strict protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold mb-4">
                <Icons.Verified className="w-5 h-5 text-blue-900" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Vehicle &amp; Chauffeur Safety</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">Our cars undergo strictly checked mechanical maintenance. Our drivers are trained defensively for highway and inner city routes.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold mb-4">
                <Icons.Activity className="w-5 h-5 text-blue-900" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Punctual Dispatch Team</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">We keep strict adherence to timelines. We arrive 15 minutes before departure to guarantee luggage load stability.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold mb-4">
                <Icons.Clock className="w-5 h-5 text-blue-900" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Available 24/7 Hours</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">Whether it's an emergency late-night airport drop-off or an early morning interstate trip, we are online for your support.</p>
            </div>

            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100">
              <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-lg flex items-center justify-center font-bold mb-4">
                <Icons.Locate className="w-5 h-5 text-blue-900" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Lagos Route Experts</h3>
              <p className="text-[11px] text-slate-500 leading-relaxed">From anywhere in Lagos or Ogun to anywhere in Nigeria, particularly Southwest Nigeria, our driver fleet uses the best traffic routes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE SERVICES */}
      <section id="services" className="py-16 bg-slate-100/60 border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-blue-900 tracking-widest uppercase bg-blue-100/50 px-2.5 py-1 rounded">ELITE TRAVEL MATRIX</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Professional Transportation Solutions</h2>
            <p className="text-slate-500 text-xs mt-1">
              Select a transport option of your choice below, then fill out our secure booking system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.services.map((srv) => (
              <div key={srv.id} className="bg-white rounded-xl border border-slate-200/90 p-6 flex flex-col justify-between hover:shadow-lg transition-all duration-150 relative">
                <div className="absolute top-4 right-4 text-[9px] font-extrabold uppercase bg-amber-400 text-slate-900 py-1 px-2 rounded-md">
                  Active in Lagos
                </div>
                <div>
                  <div className="w-9 h-9 rounded-lg bg-blue-100/60 text-blue-900 flex items-center justify-center mb-4">
                    {renderIcon(srv.icon, "text-blue-900")}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2 leading-none">{srv.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-6">{srv.description}</p>
                </div>
                <div className="border-t border-slate-100 pt-3.5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase font-bold">Standard rate</span>
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-100">{srv.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOLLYGEE AUTOS / CAR SALES CATALOG SHOWROOM */}
      <section id="autos" className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 border-b border-slate-100 pb-6 gap-4">
            <div className="text-left max-w-xl">
              <span className="text-[10px] font-bold text-amber-600 tracking-widest uppercase bg-amber-50 px-2.5 py-1 rounded border border-amber-100">TOKUNBO & NIGERIAN USED AUTOMOBILES</span>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Pristine Auto Showroom Lot</h2>
              <p className="text-slate-500 text-xs mt-1">
                Looking to purchase a vehicle instead? We sell extremely clean, foreign-used (Tokunbo) and Nigerian-used Toyota and Lexus cars directly at our showroom. Custom duties fully paid with high accountability.
              </p>
            </div>
            
            <a 
              href="#booking-system" 
              className="text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 px-4 py-2.5 rounded-lg border border-blue-100 flex items-center gap-1 shrink-0"
            >
              Request Custom Car Import <Icons.ChevronRight className="w-4 h-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TOKUNBO_CARS.map((car) => (
              <div key={car.id} className="bg-slate-50 rounded-xl border border-slate-200 text-left overflow-hidden flex flex-col justify-between group hover:border-blue-900 hover:shadow-xl duration-150">
                <div>
                  <div className="bg-slate-200 h-32 flex items-center justify-center text-4xl group-hover:scale-105 duration-150">
                    {car.image}
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="font-bold text-slate-400">{car.type}</span>
                        <span className="bg-blue-100 text-blue-900 font-extrabold px-1.5 py-0.5 rounded uppercase leading-none text-[8px]">{car.status}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">Year {car.year}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900 leading-tight block">{car.name}</h4>

                    <div className="space-y-1 pt-2">
                      {car.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                          <Icons.BadgeCheck className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 border-t border-slate-200 bg-slate-100/60 flex items-center justify-between gap-1">
                  <button
                    onClick={() => handleInspectCar(`${car.name} (${car.type})`)}
                    className="w-full text-center text-[10px] font-bold text-white bg-blue-900 hover:bg-slate-900 py-2 rounded transition-all cursor-pointer"
                  >
                    Inquire / Request Pricing
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* COMMITMENT CONTRACT (About Us Module) */}
      <section id="about" className="py-16 bg-blue-950 text-white border-y border-slate-800 relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 to-blue-950/90 opacity-90 z-0"></div>
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6 text-left">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block font-mono">CORPORATE COMMITMENT CONTRACT</span>
              <h2 className="text-3xl font-black text-white tracking-tight">Our Absolute Promise To Commuters</h2>
              
              <p className="text-slate-305 text-xs leading-relaxed max-w-lg font-medium">
                Follygee Rides is committed to providing safe, reliable, comfortable, and affordable transportation solutions across Lagos and Nigeria. We prioritize customer satisfaction, punctuality, professionalism, and vehicle safety.
              </p>

              <div className="space-y-3.5">
                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-yellow-400/20 text-yellow-300 rounded shrink-0">
                    <Icons.CheckIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">Strict Punctuality Lock</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">We don't make excuses. If we scheduled your pickup at 8:00 AM, our driver gets dispatched by 7:45 AM.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-yellow-400/20 text-yellow-300 rounded shrink-0">
                    <Icons.CheckIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">Professional Chauffeur Integrity</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">Uniformed drivers, highly vetted, absolutely non-smoking, polite and familiar with secure VIP shuttle protocols.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1 bg-yellow-400/20 text-yellow-300 rounded shrink-0">
                    <Icons.CheckIcon className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-100">Follygrace Business Verification</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5">All bookings, leases, and auto vehicle operations run transparently under national Follygrace business registrations.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Route and Dispatch Points (Instead of standard map) */}
            <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-2xl space-y-6 text-left">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Icons.Navigation2 className="w-4 h-4 text-amber-400 rotate-45" />
                    Lagos Dispatch Zones &amp; HQ
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">Physical Hub: Akute, border of Lagos and Ogun State</p>
                </div>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>

              {/* Graphical route map */}
              <div className="space-y-4">
                <div className="relative pl-6 pb-2.5 border-l border-amber-400/50">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-amber-400 flex items-center justify-center">
                    <span className="w-1 h-1 bg-slate-950 rounded-full"></span>
                  </div>
                  <strong className="text-xs text-white block">HUB 1: Akute Head Office Lot</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Follygrace business base, auto inspections lot, physical car sales, driver registration.</span>
                </div>

                <div className="relative pl-6 pb-2.5 border-l border-amber-400/50">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="w-1 h-1 bg-white rounded-full"></span>
                  </div>
                  <strong className="text-xs text-white block">MMIA Logistics Gateway</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Airports transfers drop-off and pickup terminal protocol for international travelers.</span>
                </div>

                <div className="relative pl-6">
                  <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="w-1 h-1 bg-white rounded-full"></span>
                  </div>
                  <strong className="text-xs text-white block">Corporate Hubs Matrix</strong>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Ikeja GRA, Gbagada, Victoria Island &amp; Lekki. High coverage e-hailing &amp; staff commutes.</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg text-[10px] text-slate-400 border border-slate-800">
                <strong>Google Map Location:</strong> Akute Lagos dispatch zone GPS - our drivers are mapped live. Physical inspect visit appointments available 24/7.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE BOOKING SCREEN */}
      <section className="py-16 bg-slate-100">
        <div id="booking-system" className="max-w-4xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-blue-900 tracking-widest uppercase bg-blue-200/50 px-2.5 py-1 rounded">SECURE PORTAL BACKEND</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Book Your Ride or Inquire Auto</h2>
            <p className="text-slate-500 text-xs mt-1">
              Select inquiry category inside our secure SSL form, fill information, and dispatch over our systems.
            </p>
          </div>

          <div className="max-w-xl mx-auto">
            {selectedCarForInquiry && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between">
                <span>Selected model for check auto: <strong>{selectedCarForInquiry}</strong></span>
                <button 
                  onClick={() => setSelectedCarForInquiry(null)}
                  className="text-[10px] text-red-500 underline font-semibold"
                >
                  Clear filter
                </button>
              </div>
            )}
            
            <ContactForm 
              businessName={config.name} 
              services={config.services} 
              onSubmissionSuccess={onSubmissionSuccess} 
            />
          </div>
        </div>
      </section>

      {/* CUSTOMER TESTIMONIALS */}
      <section id="testimonials" className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-bold text-blue-900 tracking-widest uppercase bg-blue-50 px-2.5 py-1 rounded">RATED 4.9 STARS BY CLIENTS</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">What Our Commuters &amp; Car Buyers Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Icons.Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic">"I constantly travel from London to Lagos for research. Follygee Rides always picks me up at MMIA. Their sienna vehicles are extremely clean and dual-AC works perfectly. Recommend to everyone!"</p>
              <div>
                <strong className="text-xs text-slate-950 block">Dr. Kunle Alao</strong>
                <span className="text-[10px] text-slate-400">MMIA Frequent Airport Commuter</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Icons.Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic">"We rented a Sienna for my sister's wedding logistics in Lagos. Driver was very professional, prompt, and dressed nicely. Outstanding punctuality and overall safety!"</p>
              <div>
                <strong className="text-xs text-slate-950 block">Mrs. Blessing Okon</strong>
                <span className="text-[10px] text-slate-400">Wedding Logistics Host</span>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 space-y-4">
              <div className="flex text-amber-500 gap-1">
                {[...Array(5)].map((_, i) => <Icons.Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <p className="text-xs text-slate-600 italic">"Bought a silver Toyota Corolla Tokunbo from Follygee Autos last month. Lot in Akute had pristine units. Duties fully paid, diagnostics clean, car drives like butter. Exceptional trust!"</p>
              <div>
                <strong className="text-xs text-slate-950 block">Engr. Tobi Shonukan</strong>
                <span className="text-[10px] text-slate-400">Corolla Purchaser, Lagos</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SUPPORT SUPPORT FAQ SECTION */}
      <section id="faqs" className="py-16 bg-slate-100/70 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6 text-left">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-[10px] font-bold text-blue-900 tracking-widest uppercase bg-blue-100/50 px-2.5 py-1 rounded">COMMON QUESTIONS</span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-3">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-3.5">
            {FAQS.map((faq, fIdx) => (
              <div 
                key={fIdx} 
                className="bg-white rounded-xl border border-slate-200 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === fIdx ? null : fIdx)}
                  className="w-full text-left py-4 px-5 text-sm font-bold text-slate-900 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {activeFaq === fIdx ? (
                    <Icons.MinusSquare className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Icons.PlusSquare className="w-4 h-4 text-blue-900 shrink-0" />
                  )}
                </button>
                
                {activeFaq === fIdx && (
                  <div className="py-3 px-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PREMIUM HIGH COVERAGE FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-800 text-left">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 border-b border-slate-800 pb-10">
          
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-900 border border-amber-400 flex items-center justify-center font-bold text-amber-400 text-sm">
                F
              </div>
              <span className="text-white font-extrabold tracking-tight text-sm">Follygee Rides and Autos</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Follygee Rides is a certified subset under <strong>Follygrace business</strong> operations. Committed to secure, trustworthy premium e-hailing, airport protocol vectors, Sienna hire and high durability vehicle sales across Lagos, Nigeria.
            </p>
          </div>

          <div className="md:col-span-3 space-y-3 pt-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Quick Transit Links</h5>
            <ul className="text-[11px] space-y-2">
              <li><a href="#services" className="hover:text-amber-400 transition-all">Sienna Fleet Lease</a></li>
              <li><a href="#autos" className="hover:text-amber-400 transition-all">Toyota Auto Sales</a></li>
              <li><a href="#booking-system" className="hover:text-amber-400 transition-all">Airport Transfer Form</a></li>
              <li><a href="#about" className="hover:text-amber-400 transition-all">Commitment Contract</a></li>
              <li className="pt-1.5 border-t border-slate-800/30">
                <button 
                  onClick={onAdminLogin}
                  className="hover:text-amber-400 transition-all text-left font-bold cursor-pointer text-slate-400 flex items-center gap-1 w-full"
                >
                  <Icons.Lock className="w-3 h-3 text-slate-500" /> Operator Log-In
                </button>
              </li>
            </ul>
          </div>

          <div className="md:col-span-5 space-y-3 pt-2">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Lagos HQ Contacts</h5>
            <ul className="text-[11px] space-y-2.5">
              <li className="flex items-start gap-2">
                <Icons.MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Akute Lagos, Ogun state border, Nigeria</span>
              </li>
              <li className="flex items-center gap-2">
                <Icons.Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="tel:+2348034623693" className="hover:underline">+234 803 462 3693 (Direct Hailing)</a>
              </li>
              <li className="flex items-center gap-2">
                <Icons.Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <a href="mailto:info@follygeerides.com" className="hover:underline">info@follygeerides.com</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
          <div>
            <p className="text-[11px] text-slate-500">
              © 2026 Follygee Rides. All Rights Reserved. Fully backed by the Follygrace business registrations.
            </p>
          </div>
          <div className="flex gap-4 text-[10px] text-slate-600 font-bold">
            <span className="flex items-center gap-1"><Icons.ShieldCheck className="w-3.5 h-3.5" /> SEO OPTIMIZED</span>
            <span className="flex items-center gap-1"><Icons.CheckCircle className="w-3.5 h-3.5" /> SSL COMPLIANT</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

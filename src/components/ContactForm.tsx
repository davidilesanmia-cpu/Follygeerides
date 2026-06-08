import React, { useState, useEffect } from "react";
import { Shield, CheckCircle2, AlertCircle, Lock, ArrowRight, Send, Check, Calendar, Clock, MapPin, Car, MessageSquare, PhoneCall } from "lucide-react";
import { Service } from "../types";

interface ContactFormProps {
  businessName: string;
  services: Service[];
  onSubmissionSuccess?: () => void;
}

export default function ContactForm({ businessName, services, onSubmissionSuccess }: ContactFormProps) {
  const [inquiryType, setInquiryType] = useState<'booking' | 'car_purchase' | 'message'>('booking');
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  
  // Ride Booking fields
  const [pickupLocation, setPickupLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [vehicleType, setVehicleType] = useState("Toyota Sienna Space Wagon");

  // Car Purchase fields
  const [carModelOfInterest, setCarModelOfInterest] = useState("Toyota Corolla Tokunbo");

  // General fields
  const [selectedService, setSelectedService] = useState("");
  const [message, setMessage] = useState("");
  
  // Math Challenge State for Form Security
  const [num1, setNum1] = useState(3);
  const [num2, setNum2] = useState(5);
  const [rawMathAnswer, setRawMathAnswer] = useState("");

  // Statuses
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSubmittedData, setLastSubmittedData] = useState<any>(null);

  // Regenerate math challenge
  const refreshMath = () => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 8) + 2;
    setNum1(n1);
    setNum2(n2);
    setRawMathAnswer("");
  };

  useEffect(() => {
    refreshMath();
    if (services.length > 0) {
      setSelectedService(services[0].title);
    }
  }, [services]);

  // Construct a beautiful WhatsApp API dispatch message
  const getWhatsAppLink = () => {
    const businessPhone = "2348034623693"; // Follygee default Nigeria whatsapp dispatch number
    let boldText = `*New Booking Request - Follygee Rides*%0A%0A`;
    boldText += `*Name:* ${name || lastSubmittedData?.name}%0A`;
    boldText += `*Phone:* ${phone || lastSubmittedData?.phone}%0A`;
    
    if (inquiryType === 'booking') {
      boldText += `*Service:* ${vehicleType}%0A`;
      boldText += `*Pickup:* ${pickupLocation}%0A`;
      boldText += `*Destination:* ${destination}%0A`;
      boldText += `*Date/Time:* ${bookingDate} @ ${bookingTime}%0A`;
    } else if (inquiryType === 'car_purchase') {
      boldText += `*Inquiry:* Car Purchase / Autos%0A`;
      boldText += `*Vehicle Model:* ${carModelOfInterest}%0A`;
    } else {
      boldText += `*Inquiry:* General Message%0A`;
      boldText += `*Service Selected:* ${selectedService}%0A`;
    }

    if (message || lastSubmittedData?.message) {
      boldText += `*Notes:* ${message || lastSubmittedData?.message}%0A`;
    }

    boldText += `%0APower by Follygee Rides Online Portal.`;
    return `https://api.whatsapp.com/send?phone=${businessPhone}&text=${boldText}`;
  };

  // Handle Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // 1. Basic validation
    if (name.trim().length < 2) {
      setSubmitError("Please enter your complete name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSubmitError("Please enter an authentic, correctly formatted email address.");
      return;
    }

    if (inquiryType === 'booking') {
      if (!pickupLocation.trim()) {
        setSubmitError("Please provide an explicit pickup location.");
        return;
      }
      if (!destination.trim()) {
        setSubmitError("Please provide an explicit destination point.");
        return;
      }
      if (!bookingDate) {
        setSubmitError("Please select a calendar date for booking.");
        return;
      }
      if (!bookingTime) {
        setSubmitError("Please select a scheduled pickup time.");
        return;
      }
    } else {
      if (message.trim().length < 10) {
        setSubmitError("Please supply more context (minimum 10 characters for secure delivery).");
        return;
      }
    }

    // 2. Security Math verification
    const correctAnswer = num1 + num2;
    if (parseInt(rawMathAnswer.trim(), 10) !== correctAnswer) {
      setSubmitError(`Anti-spam fail: ${num1} + ${num2} equals ${correctAnswer}. Please check your answer.`);
      return;
    }

    setIsSubmitting(true);

    const submissionPayload = {
      name,
      email,
      phone,
      inquiryType,
      service: inquiryType === 'booking' ? `Ride Booking (${vehicleType})` : inquiryType === 'car_purchase' ? 'Car Purchase / Autos' : selectedService,
      message: message || `Booking requested from ${pickupLocation} to ${destination} using ${vehicleType} on ${bookingDate} at ${bookingTime}.`,
      pickupLocation: inquiryType === 'booking' ? pickupLocation : undefined,
      destination: inquiryType === 'booking' ? destination : undefined,
      bookingDate: inquiryType === 'booking' ? bookingDate : undefined,
      bookingTime: inquiryType === 'booking' ? bookingTime : undefined,
      vehicleType: inquiryType === 'booking' ? vehicleType : undefined,
      carModelOfInterest: inquiryType === 'car_purchase' ? carModelOfInterest : undefined,
      businessName: "Follygee Rides and Autos"
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Form submission rejected by server-side validation.");
      }

      // Success
      setLastSubmittedData({ ...submissionPayload });
      setIsSuccess(true);
      
      // Keep name, phone, email so whatsapp can read them easily
      setRawMathAnswer("");
      refreshMath();
      
      if (onSubmissionSuccess) {
        onSubmissionSuccess();
      }
    } catch (err: any) {
      setSubmitError(err.message || "A secure server connection timeout occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="booking-system" className="bg-white rounded-2xl border border-slate-200 shadow-xl relative overflow-hidden">
      
      {/* Visual Header */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500"></div>

      {isSuccess ? (
        <div className="text-center py-10 px-6 transition-all duration-300">
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-5 border border-emerald-150">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          
          <h3 className="text-xl font-bold text-slate-900 mb-2 font-sans tracking-tight">
            Booking & Contact Saved!
          </h3>
          
          <p className="text-slate-500 text-xs max-w-sm mx-auto mb-6 leading-relaxed">
            Your dispatch request is recorded in Follygee's secure email backlog. To skip queues and secure your driver instantly, please dispatch this receipt to our 24/7 WhatsApp dispatch line now!
          </p>

          <div className="flex flex-col gap-3 justify-center items-center max-w-xs mx-auto">
            {/* WHATSAPP ACTION BUTTON */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 px-5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer scale-105 duration-150"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.27-5.181l.366.217c1.547.919 3.321 1.404 5.132 1.405 5.518 0 10.007-4.437 10.01-9.9C21.84 5.09 17.35.534 11.83.534 6.307.534 1.82 5.02 1.817 10.485c-.001 1.898.498 3.754 1.444 5.392l.238.412-1.002 3.659 3.832-.934zM18.156 14.86c-.279-.14-1.65-.815-1.905-.907-.256-.093-.443-.14-.629.14-.186.279-.718.907-.881 1.093-.163.186-.326.21-.605.07-.279-.14-1.18-.435-2.247-1.388-.83-.741-1.39-1.656-1.554-1.936-.163-.28-.017-.43.122-.569.124-.125.279-.326.419-.489.14-.163.186-.279.279-.465.093-.186.046-.35-.023-.489-.069-.14-.629-1.512-.861-2.07-.226-.543-.454-.47-.629-.47-.162-.004-.349-.004-.535-.004-.186 0-.489.07-.745.349-.256.279-.977.954-.977 2.327s1.001 2.701 1.14 2.887c.14.186 1.968 3.006 4.761 4.21.666.286 1.184.457 1.589.587.67.213 1.28.183 1.761.111.537-.08 1.65-.675 1.883-1.326.233-.65.233-1.21.163-1.325-.069-.115-.256-.21-.535-.35z"/>
              </svg>
              Complete Booking via WhatsApp
            </a>

            <button
              onClick={() => {
                setIsSuccess(false);
                setName("");
                setEmail("");
                setPhone("");
                setPickupLocation("");
                setDestination("");
                setMessage("");
              }}
              className="mt-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-all hover:underline"
            >
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
          
          {/* Segmented Controls */}
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block mb-2 text-left">How can we assist you today?</span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setInquiryType('booking')}
                className={`py-2 px-1 text-[10px] md:text-xs font-bold rounded-lg flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${inquiryType === 'booking' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>Book Rides</span>
              </button>
              
              <button
                type="button"
                onClick={() => setInquiryType('car_purchase')}
                className={`py-2 px-1 text-[10px] md:text-xs font-bold rounded-lg flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${inquiryType === 'car_purchase' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Car className="w-3.5 h-3.5 shrink-0" />
                <span>Buy Cars</span>
              </button>
              
              <button
                type="button"
                onClick={() => setInquiryType('message')}
                className={`py-2 px-1 text-[10px] md:text-xs font-bold rounded-lg flex flex-col md:flex-row items-center justify-center gap-1.5 transition-all cursor-pointer ${inquiryType === 'message' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                <span>Inquire</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-b border-rose-50/10 pb-1">
            <p className="text-[10px] text-slate-400 text-left uppercase font-black tracking-widest">
              {inquiryType === 'booking' ? "Ride Request Coordinates" : inquiryType === 'car_purchase' ? "Auto Showroom Catalog" : "Direct Client Inquiry Desk"}
            </p>
            <span className="flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 bg-emerald-50 rounded">
              <Lock className="w-2.5 h-2.5" /> SECURE SSL
            </span>
          </div>

          {submitError && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-lg text-rose-700 text-xs text-left animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* BASIC INFO SECTION */}
          <div className="space-y-3.5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700">Full Name <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kolawole Balogun"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-900 transition-all font-medium"
                />
              </div>

              <div className="space-y-1 text-left">
                <label className="text-xs font-bold text-slate-700">Phone Number <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +234 815 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-900 transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-700">Email Address <span className="text-rose-500">*</span></label>
              <input
                type="email"
                required
                placeholder="e.g. kolawole@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-900 transition-all font-medium"
              />
            </div>
          </div>

          {/* DYNAMIC FIELD MODULE RENDERING */}
          {inquiryType === 'booking' && (
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-150 animate-fadeIn">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" /> Pickup Location
                  </label>
                  <input
                    type="text"
                    required={inquiryType === 'booking'}
                    placeholder="e.g. Airport MMIA Terminal"
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900"
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-500" /> Destination
                  </label>
                  <input
                    type="text"
                    required={inquiryType === 'booking'}
                    placeholder="e.g. Gbagada Lagos Lot"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-500" /> Departure Date
                  </label>
                  <input
                    type="date"
                    required={inquiryType === 'booking'}
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900 cursor-pointer"
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-500" /> Dispatch Time
                  </label>
                  <input
                    type="time"
                    required={inquiryType === 'booking'}
                    value={bookingTime}
                    onChange={(e) => setBookingTime(e.target.value)}
                    className="w-full text-xs px-2 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900 cursor-pointer"
                  />
                </div>
              </div>

              <div className="space-y-1 text-left">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Select Fleet Car Category</label>
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900 cursor-pointer appearance-none"
                >
                  <option value="Toyota Sienna Space Wagon">Toyota Sienna Space Wagon (Family & Corporate Event Hire)</option>
                  <option value="Executive Sedan (Toyota Camry/Corolla)">Executive Sedan (Toyota Camry / Corolla)</option>
                  <option value="Airport Shuttle Pick-up SUV">Airport Shuttle Pick-up SUV (Prado/Rx350)</option>
                  <option value="Inter-State Premium Service Pack">Inter-State Premium Travel Bus / Coaster</option>
                  <option value="Private Daily Driver Service">Private Chauffeur Daily Driver Hailing</option>
                </select>
              </div>
            </div>
          )}

          {inquiryType === 'car_purchase' && (
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-150 animate-fadeIn text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Vehicle Model of Interest</label>
                <select
                  value={carModelOfInterest}
                  onChange={(e) => setCarModelOfInterest(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900 cursor-pointer appearance-none"
                >
                  <option value="Toyota Corolla Tokunbo (2016 - 2020)">Toyota Corolla Foreign Used Tokunbo (₦10m - ₦14m)</option>
                  <option value="Toyota Camry Tokunbo (2018 - 2022)">Toyota Camry Foreign Used Tokunbo (₦12m - ₦18m)</option>
                  <option value="Toyota Sienna Space Wagon (2015 - 2019)">Toyota Sienna Space Wagon (₦9.5m - ₦15m)</option>
                  <option value="Lexus RX350 Premium SUV (2015 - 2020)">Lexus RX350 Premium SUV (₦16m - ₦24m)</option>
                  <option value="Brand New / Custom Car Imports">Other Custom Car Import Request (Inquire specifications)</option>
                </select>
              </div>
            </div>
          )}

          {inquiryType === 'message' && (
            <div className="space-y-3 p-3.5 bg-slate-50 rounded-xl border border-slate-150 animate-fadeIn text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Primary Topic</label>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full text-xs px-2.5 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-900 cursor-pointer appearance-none"
                >
                  <option value="Sienna / Vehicle Fleet Lease">Sienna / Vehicle Fleet Lease</option>
                  <option value="Corporate Staff Shuttle Solutions">Corporate Staff Shuttle Solutions</option>
                  <option value="Airport Pickup Protocol Coordination">Airport Pickup Protocol Coordination</option>
                  <option value="Custom Interstate Travel Planning">Custom Interstate Travel Planning</option>
                  <option value="General Partnerships & Feedback">General Partnerships & Feedback</option>
                </select>
              </div>
            </div>
          )}

          {/* MESSAGE AREA */}
          <div className="space-y-1 text-left">
            <div className="flex justify-between items-baseline">
              <label className="text-xs font-bold text-slate-700">
                {inquiryType === 'booking' ? "Space Wagon Pickup Notes / Instructions" : inquiryType === 'car_purchase' ? "Specific Car Color/Mileage Preferences" : "Message details"}
                <span className="text-slate-400 font-normal"> (Optional for bookings)</span>
              </label>
              <span className="text-[10px] text-slate-400">Min 10 chars if general inquiry</span>
            </div>
            <textarea
              rows={inquiryType === 'booking' ? 2 : 3}
              placeholder={inquiryType === 'booking' ? "Enter any luggage instructions, extra stops, flight numbers, or specific route guidelines..." : "Detail your exact request so our dispatch reps can consult and reply instantly..."}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 focus:bg-white text-slate-900 leading-relaxed"
            />
          </div>

          {/* CAPTCHA ANTI-SPAM */}
          <div className="bg-slate-50/50 p-3.5 border border-slate-150 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left">
              <Shield className="w-4 h-4 text-amber-500 shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-slate-900">Anti-Spam Verification</p>
                <p className="text-[9px] text-slate-500">Security gate for automated booking protection.</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded border border-slate-200/50">
                What is {num1} + {num2}?
              </span>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="Ans"
                value={rawMathAnswer}
                onChange={(e) => setRawMathAnswer(e.target.value)}
                className="w-12 text-center text-xs px-1 py-1.5 bg-white border border-slate-200 rounded-lg focus:outline-none text-slate-950 font-mono font-bold"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 cursor-pointer text-center font-sans tracking-wide uppercase"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Transmitting Coordinates...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" /> 
                {inquiryType === 'booking' ? "Submit Booking & Prepare WhatsApp" : inquiryType === 'car_purchase' ? "Inquire Car Sales Catalog" : "Submit Encrypted Inquiry"}
              </>
            )}
          </button>
        </form>
      )}

      {/* Trust Margin */}
      <div className="bg-slate-50 py-2.5 px-4 border-t border-slate-150 flex items-center justify-between text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><Shield className="w-3.5 h-3.5 text-slate-400" /> Enrouted to Follygrace business</span>
        <span>Secure Lagos Server Connected</span>
      </div>

    </div>
  );
}

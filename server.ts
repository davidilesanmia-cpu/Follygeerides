import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import { ContactInquiry } from "./src/types";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for Contact Inquiries
const inquiries: ContactInquiry[] = [
  {
    id: "inq-1",
    name: "Adebayo Kosoko",
    email: "adebayo.kosoko@gmail.com",
    phone: "+234 803 123 4567",
    service: "Airport Transfers",
    message: "I need a reliable airport pickup from Murtala Muhammed International Airport (MMIA) to my hotel in Ikeja GRA. My flight lands around 5:30 PM on Thursday. I will have 3 large suitcases so I require a spacious vehicle. Please confirm availability and pricing.",
    status: "new" as const,
    createdAt: new Date(Date.now() - 3600000 * 25).toISOString(), // ~1 day ago
    inquiryType: "booking",
    pickupLocation: "Murtala Muhammed International Airport Terminal 2 (MMIA)",
    destination: "Radisson Blu, Ikeja GRA, Lagos",
    bookingDate: "2026-06-11",
    bookingTime: "17:30",
    vehicleType: "Toyota Sienna Space Wagon",
    geminiAnalysis: {
      sentiment: "Prompt, exact & detail-focused",
      urgency: "high" as const,
      category: "Sales Prospect",
      suggestedReply: "Dear Adebayo,\n\nThank you for choosing Follygee Rides! We have safely logged your airport transfer booking request from MMIA to Radisson Blu, Ikeja GRA.\n\nWe indeed have a premium, air-conditioned Toyota Sienna clean utility vehicle available for your pickup on Thursday at 5:30 PM. This vehicle easily accommodates your 3 large suitcases and offers ample legroom. Our professional driver will monitor your flight status and meet you at the arrivals gate holding a placard with your name. \n\nOur flat rate for this transfer is ₦25,000. \n\nTo lock this in, please confirm via WhatsApp or reply here, and we will send our payment details.\n\nWarm regards,\nThe Follygee Rides Operations Team"
    }
  },
  {
    id: "inq-2",
    name: "Chioma Nwachukwu",
    email: "chioma.n@yahoo.com",
    phone: "+234 803 462 3693",
    service: "Car Purchase / Autos",
    message: "Hi, I saw that you also deal in clean autos and car sales. I am searching for a clean Tokunbo (foreign used) Toyota Corolla or Camry (2018 - 2020 model). Do you currently have any units at your Akute, Lagos lot? What is your price bracket?",
    status: "read" as const,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    inquiryType: "car_purchase",
    carModelOfInterest: "Toyota Corolla / Camry 2018-2020",
    geminiAnalysis: {
      sentiment: "Serious buyer & inquisitive",
      urgency: "medium" as const,
      category: "Sales Prospect",
      suggestedReply: "Dear Chioma,\n\nThank you for reaching out to Follygee Rides and Autos! We boast some of the cleanest imported foreign-used vehicles in Akute and surrounding Lagos environments.\n\nYes! We currently have a fresh, pristine 2018 Toyota Camry (LE trim, grey color, custom duty fully paid) and a 2019 Toyota Corolla on our direct showroom lot in Akute. Our price bracket ranges from ₦12,500,000 to ₦16,000,000 depending on the mileage and year grade.\n\nWe would love to invite you for a physical inspection and diagnostic drive at our Akute lot. Is there a day this week that suits your schedule? We can also share a video walk-around over WhatsApp.\n\nWarm regards,\nFollygee Rides and Autos Sales Representative"
    }
  },
  {
    id: "inq-3",
    name: "Olumide Benson",
    email: "olumide.benson@greenlights.ng",
    phone: "+234 902 444 5555",
    service: "Sienna Hire",
    message: "Hello Follygee, I am looking to rent a Sienna for a family weekend trip to Ibadan. We will leave on Friday morning and return Sunday evening. Will you provide a professional driver, or do you do self-drive? Also, what are your daily hire rates?",
    status: "new" as const,
    createdAt: new Date().toISOString(), // very recent
    inquiryType: "booking",
    pickupLocation: "Gbagada, Lagos",
    destination: "Ibadan, Oyo State",
    bookingDate: "2026-06-12",
    bookingTime: "08:00",
    vehicleType: "Toyota Sienna Space Wagon",
    geminiAnalysis: {
      sentiment: "Warm & family-oriented",
      urgency: "medium" as const,
      category: "Sales Prospect",
      suggestedReply: "Dear Olumide,\n\nThank you for consulting Follygee Rides for your family weekend travel! We are excited to support your trip to Ibadan.\n\nAt Follygee Rides, all our Sienna hires are strictly chauffeur-driven. We provide a highly trained, professional, and route-alert interstate driver who is familiar with the Lagos-Ibadan expressway. This guarantees your family's absolute safety, comfort, and peaceful travel.\n\nOur flat rate for interstate Sienna Hire is ₦45,000 per day (which covers vehicle hire, driver's allowance, and road clearance) excluding fueling. \n\nPlease let us know if our Gbagada dispatch office should lock in Friday 8 AM for your departure.\n\nBest regards,\nThe Follygee Rides Booking Portal"
    }
  }
];

// Lazy Gemini API Client Initialization
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("No GEMINI_API_KEY supplied. Server will execute rule-based contact form analysis.");
      return null;
    }
    try {
      aiInstance = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
      console.log("Gemini client successfully initialized.");
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiInstance;
}

// SECURE CONTACT SUBMISSION ENDPOINT
app.post("/api/contact", async (req, res) => {
  try {
    const { 
      name, 
      email, 
      phone, 
      service, 
      message, 
      businessName, 
      businessServices,
      inquiryType,
      pickupLocation,
      destination,
      bookingDate,
      bookingTime,
      vehicleType,
      carModelOfInterest
    } = req.body;

    // Server-Side Verification & Sanitization (Making it extremely secure!)
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return res.status(400).json({ error: "Invalid name spelling or too short (minimum 2 characters)." });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: "Please enter a valid, secure email address." });
    }
    
    // In case of booking, generic message is optional; let's allow custom text or provide default
    const minLengthMessage = (inquiryType === 'booking') ? 0 : 10;
    if (minLengthMessage > 0 && (!message || typeof message !== "string" || message.trim().length < minLengthMessage)) {
      return res.status(400).json({ error: "Your message content must be at least 10 characters long to submit safely." });
    }

    const businessContext = "Follygee Rides and Autos";
    const servicesListStr = Array.isArray(businessServices) 
      ? businessServices.map((s: any) => `- ${s.title}: ${s.description}`).join('\n')
      : "e-hailing, corporate shuttle transfers, private Sienna rentals, airport drop-offs, and clean foreign-used car sales based in Akute, Lagos.";

    // Create unique record ID
    const newInquiry: ContactInquiry = {
      id: `inq-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : "",
      service: service || "General Inquiry",
      message: message ? message.trim() : `High-fidelity ride booking request for ${service || 'transportation'}.`,
      status: "new" as const,
      createdAt: new Date().toISOString(),
      inquiryType: inquiryType || "message",
      pickupLocation: pickupLocation || undefined,
      destination: destination || undefined,
      bookingDate: bookingDate || undefined,
      bookingTime: bookingTime || undefined,
      vehicleType: vehicleType || undefined,
      carModelOfInterest: carModelOfInterest || undefined,
      geminiAnalysis: undefined
    };

    const ai = getGeminiClient();
    if (ai) {
      try {
        console.log(`Analyzing contact form using Gemini model... User: ${name}`);
        const promptSystem = `You are an AI Operational Inbox Manager for "${businessContext}".
We provide the following services to clients:
${servicesListStr}

Your job is to analyze incoming contact inquiries and bookings from our secure website form, then output a structured JSON analysis.
You MUST output EXACTLY matching the requested JSON format schema. Do not include markdown wraps or additional formatting outside of standard JSON.`;

        let detailsString = "";
        if (newInquiry.inquiryType === 'booking') {
          detailsString = `This is a NEW TRANSPORTATION BOOKING REQUEST:
- Pickup Point: ${newInquiry.pickupLocation}
- Destination/Drop-off: ${newInquiry.destination}
- Date of Booking: ${newInquiry.bookingDate}
- Scheduled Time: ${newInquiry.bookingTime}
- Requested Vehicle Category: ${newInquiry.vehicleType}
- Additional Rider Notes: ${newInquiry.message}`;
        } else if (newInquiry.inquiryType === 'car_purchase') {
          detailsString = `This is a CAR PURCHASE / AUTO SALES inquiry:
- Requested Car Model: ${newInquiry.carModelOfInterest}
- Details: ${newInquiry.message}`;
        } else {
          detailsString = `This is a GENERAL INQUIRY / message:
- Service: ${newInquiry.service}
- Client Note: ${newInquiry.message}`;
        }

        const userPrompt = `Inquiry received from Website Contact Form:
- Name: ${newInquiry.name}
- Email: ${newInquiry.email}
- Phone: ${newInquiry.phone || 'Not provided'}
- Service requested/selected: ${newInquiry.service}

${detailsString}

Please analyze this message and provide:
1. "sentiment" (A short 3-5 word high-fidelity description of client confidence, readiness, or excitement)
2. "urgency" (Select exactly 'low', 'medium', or 'high' based on travel deadlines, vehicle sales appeal, or event timelines)
3. "category" (Select exactly 'Sales Prospect', 'Technical Query', 'Partnership Offer', or 'Spam / Out of Topic')
4. "suggestedReply" (Produce a custom, professional, personalized email reply from "${businessContext}" addressing the prospect directly, acknowledging their pickup locations or vehicle model of interest, quoting professional rates if helpful, emphasizing Follygee commitment to safe, reliable, comfortable transport, and outlining immediate action items over WhatsApp).`;

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: userPrompt,
          config: {
            systemInstruction: promptSystem,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                sentiment: { type: Type.STRING, description: "Sentiment description of sender (3-5 words)" },
                urgency: { type: Type.STRING, enum: ["low", "medium", "high"], description: "Priority rating of user message" },
                category: { type: Type.STRING, enum: ["Sales Prospect", "Technical Query", "Partnership Offer", "Spam / Out of Topic"], description: "Category/Intent of inquiry" },
                suggestedReply: { type: Type.STRING, description: "A beautifully composed, complete and structured ready-to-use email response to the sender" }
              },
              required: ["sentiment", "urgency", "category", "suggestedReply"]
            }
          }
        });

        const rawText = response.text?.trim() || "{}";
        const parsed = JSON.parse(rawText);
        
        newInquiry.geminiAnalysis = {
          sentiment: parsed.sentiment || "Neutral & Inquiring",
          urgency: (parsed.urgency === "low" || parsed.urgency === "medium" || parsed.urgency === "high") ? parsed.urgency : "medium",
          category: parsed.category || "Sales Prospect",
          suggestedReply: parsed.suggestedReply || `Dear ${newInquiry.name},\n\nThank you for choosing ${businessContext}.\n\nWe have safely received your inquiry regarding our "${newInquiry.service}" offerings. A representative will contact you shortly to review your requirements.\n\nWarm regards,\nThe Operations Team`
        };
      } catch (geminiError) {
        console.error("Gemini analysis error: (Proceeding with default local analyzer)", geminiError);
      }
    }

    // Heuristic/Rule-based Fallback Analyzer if Gemini is not set up or fails
    if (!newInquiry.geminiAnalysis) {
      const lowerMsg = newInquiry.message.toLowerCase();
      let urgency: 'low' | 'medium' | 'high' = "medium";
      let category = "Sales Prospect";
      let sentiment = "Neutral & Interested";

      if (lowerMsg.includes("asap") || lowerMsg.includes("urgent") || lowerMsg.includes("immediately") || lowerMsg.includes("airport") || newInquiry.inquiryType === 'booking') {
        urgency = "high";
      }

      let bookingResponseText = "";
      if (newInquiry.inquiryType === 'booking') {
        bookingResponseText = `Dear ${newInquiry.name},\n\nThank you for choosing Follygee Rides! We have safely received your booking request for ${newInquiry.vehicleType || 'reliable rides'} on ${newInquiry.bookingDate || 'scheduled date'}.\n\nIntake Details:\n- Pickup Point: ${newInquiry.pickupLocation || 'Not specified'}\n- Destination: ${newInquiry.destination || 'Not specified'}\n- Time: ${newInquiry.bookingTime || 'Not specified'}\n\nOur operations coordinators at Akute, Lagos are verifying vehicle dispatch schedules. We will follow up immediately with your calculated rate. We suggest sharing this booking to our WhatsApp line at +234 803 462 3693 for instant routing approval.\n\nBest regards,\nThe Follygee Rides Dispatch Team`;
      } else {
        bookingResponseText = `Dear ${newInquiry.name},\n\nThank you for reaching out to Follygee Rides and Autos.\n\nWe appreciate you contacting our team. We have safely logged your message inside our database, and our representative will contact you at your email (${newInquiry.email}) or phone (${newInquiry.phone}) soon to assist you with "${newInquiry.service}".\n\nBest regards,\nThe Follygee Rides team\nAkute, Lagos`;
      }

      newInquiry.geminiAnalysis = {
        sentiment,
        urgency,
        category,
        suggestedReply: bookingResponseText
      };
    }

    inquiries.unshift(newInquiry);
    return res.status(200).json({ success: true, message: "Your booking details are logged in our system, and ready to send to WhatsApp as well! Thank you.", inquiry: newInquiry });
  } catch (err: any) {
    console.error("Contact form endpoint submission error:", err);
    return res.status(500).json({ error: "A server-side secure validation error occurred while processing your message." });
  }
});

// GET INQUIRIES LIST FOR ADMIN INBOX
app.get("/api/inquiries", (req, res) => {
  return res.json({ success: true, inquiries });
});

// UPDATE INQUIRY STATUS
app.post("/api/inquiries/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  if (!["new", "read", "replied", "archived"].includes(status)) {
    return res.status(400).json({ error: "Invalid status state configuration." });
  }

  const inquiry = inquiries.find(i => i.id === id);
  if (!inquiry) {
    return res.status(404).json({ error: "Inquiry item not found." });
  }

  inquiry.status = status;
  return res.json({ success: true, inquiry });
});

// SEND SIMULATED REPLY
app.post("/api/inquiries/:id/reply", (req, res) => {
  const { id } = req.params;
  const { replyText } = req.body;

  if (!replyText || replyText.trim().length < 5) {
    return res.status(400).json({ error: "Reply body must contain authentic text." });
  }

  const inquiry = inquiries.find(i => i.id === id);
  if (!inquiry) {
    return res.status(404).json({ error: "Inquiry item not found." });
  }

  inquiry.status = "replied";
  console.log(`SIMULATED EMAIL SENT to ${inquiry.email}\nSubject: Re: ${inquiry.service}\nBody: ${replyText}`);
  
  return res.json({ success: true, message: `Email draft successfully customized and sent directly to ${inquiry.email}.`, inquiry });
});

// VITE SERVER AND STATIC ROUTING CONFIGURATION
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Secure Business Server running successfully at http://localhost:${PORT}`);
  });
}

startServer();

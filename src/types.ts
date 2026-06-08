export interface Service {
  id: string;
  title: string;
  description: string;
  price?: string;
  icon: string;
}

export interface BusinessConfig {
  name: string;
  industry: string;
  tagline: string;
  description: string;
  primaryColor: 'indigo' | 'emerald' | 'blue' | 'violet' | 'amber' | 'rose';
  theme: 'light' | 'dark';
  services: Service[];
  email: string;
  phone: string;
  address: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: string;
  inquiryType?: 'message' | 'booking' | 'car_purchase';
  pickupLocation?: string;
  destination?: string;
  bookingDate?: string;
  bookingTime?: string;
  vehicleType?: string;
  carModelOfInterest?: string;
  geminiAnalysis?: {
    sentiment: string;
    urgency: 'low' | 'medium' | 'high';
    category: string;
    suggestedReply: string;
  };
}

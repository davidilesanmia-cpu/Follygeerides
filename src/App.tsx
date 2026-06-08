import React, { useState, useEffect } from "react";
import { ShieldAlert, Eye, Sliders, Settings2, Sparkles, HelpCircle } from "lucide-react";
import { BusinessConfig, ContactInquiry } from "./types";
import { INDUSTRY_PRESETS } from "./data/presets";
import PublicWebsite from "./components/PublicWebsite";
import AdminPortal from "./components/AdminPortal";

export default function App() {
  const [activeView, setActiveView] = useState<'public' | 'admin'>('public');
  const [currentConfig, setCurrentConfig] = useState<BusinessConfig>(INDUSTRY_PRESETS["Tech Advisory"]);
  const [inquiries, setInquiries] = useState<ContactInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch inquiries on mount + when active views change to keep synchronized
  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data.inquiries || []);
      }
    } catch (e) {
      console.error("Failed to query API inquiries:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // Handler for status transitions
  const handleUpdateStatus = async (id: string, status: ContactInquiry['status']) => {
    try {
      const res = await fetch(`/api/inquiries/${id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchInquiries();
      }
    } catch (err) {
      console.error("Status synchronization fail:", err);
    }
  };

  // Handler for simulated reply broadcasts
  const handleSendReplySimulation = async (id: string, replyText: string) => {
    const res = await fetch(`/api/inquiries/${id}/reply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ replyText })
    });
    if (!res.ok) {
      throw new Error("Simulation dispatch fail.");
    }
    fetchInquiries();
  };

  // Resolve secondary theme elements
  const activeColorTheme = 
    currentConfig.primaryColor === 'indigo' ? 'text-indigo-600 bg-indigo-50 border-indigo-100' :
    currentConfig.primaryColor === 'emerald' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
    currentConfig.primaryColor === 'blue' ? 'text-blue-600 bg-blue-50 border-blue-100' :
    currentConfig.primaryColor === 'rose' ? 'text-rose-600 bg-rose-50 border-rose-100' :
    'text-amber-700 bg-amber-50 border-amber-100';

  return (
    <div className="min-h-screen bg-slate-105 flex flex-col justify-between">
      
      {/* CORE FRAMEWORK RENDER */}
      <main className="flex-1">
        {activeView === 'public' ? (
          <PublicWebsite 
            config={currentConfig} 
            onSubmissionSuccess={fetchInquiries} 
            onAdminLogin={() => setActiveView('admin')}
          />
        ) : (
          <div className="py-8 px-6 bg-slate-50 min-h-screen">
            <AdminPortal
              currentConfig={currentConfig}
              onUpdateConfig={setCurrentConfig}
              inquiries={inquiries}
              onRefreshInquiries={fetchInquiries}
              onUpdateInquiryStatus={handleUpdateStatus}
              onSendSimulationReply={handleSendReplySimulation}
              onLogout={() => setActiveView('public')}
            />
          </div>
        )}
      </main>

      {/* FOOTER ENTERPRISE NOTIFICATION BANNER */}
      <div className="bg-white border-t border-slate-150 py-2 px-6 text-center text-[10px] text-slate-400 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-left">
            Follygee Rides Secured Operator Deck is protected with standard enterprise encryption algorithms.
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span>Enterprise Secure Connection Mode Active</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
        </div>
      </div>

    </div>
  );
}

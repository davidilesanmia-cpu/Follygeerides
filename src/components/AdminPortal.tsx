import React, { useState, useEffect } from "react";
import { 
  Shield, Lock, Unlock, MessageSquare, AlertTriangle, Check, CheckSquare, 
  Inbox, Sliders, Eye, BarChart3, Clock, ArrowUpRight, Send, Sparkles, RefreshCw,
  Mail, Phone, ExternalLink, Archive
} from "lucide-react";
import { BusinessConfig, ContactInquiry, Service } from "../types";
import { INDUSTRY_PRESETS } from "../data/presets";

interface AdminPortalProps {
  currentConfig: BusinessConfig;
  onUpdateConfig: (newConfig: BusinessConfig) => void;
  inquiries: ContactInquiry[];
  onRefreshInquiries: () => void;
  onUpdateInquiryStatus: (id: string, status: ContactInquiry['status']) => Promise<void>;
  onSendSimulationReply: (id: string, replyText: string) => Promise<void>;
  onLogout?: () => void;
}

export default function AdminPortal({
  currentConfig,
  onUpdateConfig,
  inquiries,
  onRefreshInquiries,
  onUpdateInquiryStatus,
  onSendSimulationReply,
  onLogout
}: AdminPortalProps) {
  // Authentication State
  const [accessCode, setAccessCode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tabs: 'inquiries' | 'branding'
  const [activeTab, setActiveTab] = useState<'inquiries' | 'branding'>('inquiries');

  // Selected Inquiry State
  const [selectedInquiryId, setSelectedInquiryId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filter for Inquiries: 'all' | 'new' | 'read' | 'replied' | 'archived'
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'read' | 'replied' | 'archived'>('all');

  // Interactive Branding Edits
  const [brandName, setBrandName] = useState(currentConfig.name);
  const [brandTagline, setBrandTagline] = useState(currentConfig.tagline);
  const [brandIndustry, setBrandIndustry] = useState(currentConfig.industry);
  const [brandDesc, setBrandDesc] = useState(currentConfig.description);
  const [brandEmail, setBrandEmail] = useState(currentConfig.email);
  const [brandPhone, setBrandPhone] = useState(currentConfig.phone);
  const [brandAddress, setBrandAddress] = useState(currentConfig.address);
  const [brandColor, setBrandColor] = useState(currentConfig.primaryColor);

  // Manage Services local editing list
  const [localServices, setLocalServices] = useState<Service[]>(currentConfig.services);

  // Refresh editable branding if preset changes are pushed from outside
  useEffect(() => {
    setBrandName(currentConfig.name);
    setBrandTagline(currentConfig.tagline);
    setBrandIndustry(currentConfig.industry);
    setBrandDesc(currentConfig.description);
    setBrandEmail(currentConfig.email);
    setBrandPhone(currentConfig.phone);
    setBrandAddress(currentConfig.address);
    setBrandColor(currentConfig.primaryColor);
    setLocalServices(currentConfig.services);
  }, [currentConfig]);

  // Auth gate check
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim() === "admin123") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Unauthorized secure key. Please try checking instructions (Hint: admin123).");
    }
  };

  // Get current selected inquiry details
  const currentInquiry = inquiries.find(i => i.id === selectedInquiryId);

  // Set default reply text draft if none exists in map
  useEffect(() => {
    if (currentInquiry && !replyTextMap[currentInquiry.id] && currentInquiry.geminiAnalysis) {
      setReplyTextMap(prev => ({
        ...prev,
        [currentInquiry.id]: currentInquiry.geminiAnalysis?.suggestedReply || ""
      }));
    }
  }, [currentInquiry]);

  // Process manual/AI reply submit
  const handleSendReply = async (inqId: string) => {
    const text = replyTextMap[inqId];
    if (!text || text.trim().length < 5) return;

    setActionLoading(true);
    setActionSuccess(null);
    try {
      await onSendSimulationReply(inqId, text);
      setActionSuccess("Simulated draft reply sent safely directly to applicant.");
      setTimeout(() => setActionSuccess(null), 3500);
    } catch (err: any) {
      alert("Submission failed during remote validation triggers.");
    } finally {
      setActionLoading(false);
    }
  };

  // Mark status trigger
  const handleStatusChange = async (inqId: string, status: ContactInquiry['status']) => {
    setActionLoading(true);
    try {
      await onUpdateInquiryStatus(inqId, status);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Preset quick choice
  const selectPreset = (key: string) => {
    const preset = INDUSTRY_PRESETS[key];
    if (preset) {
      onUpdateConfig(preset);
    }
  };

  // Brand config updater
  const handleSaveBranding = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      name: brandName,
      industry: brandIndustry,
      tagline: brandTagline,
      description: brandDesc,
      primaryColor: brandColor,
      theme: "light",
      services: localServices,
      email: brandEmail,
      phone: brandPhone,
      address: brandAddress
    });
    setActionSuccess("Identity architecture updated! Review the Public Website tab above.");
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // Edit fields for Service Grid helper
  const updateServiceField = (index: number, field: keyof Service, value: string) => {
    const updated = [...localServices];
    updated[index] = { ...updated[index], [field]: value };
    setLocalServices(updated);
  };

  // Filter inquiry counts
  const filteredInquiries = inquiries.filter(inq => {
    if (statusFilter === "all") return true;
    return inq.status === statusFilter;
  });

  // Calculate high-fidelity key performance metrics
  const totalInquires = inquiries.length;
  const newInquiriesCount = inquiries.filter(i => i.status === "new").length;
  const highUrgencyCount = inquiries.filter(i => i.geminiAnalysis?.urgency === "high").length;
  const spamCount = inquiries.filter(i => i.geminiAnalysis?.category === "Spam / Out of Topic").length;

  // Render Login state first if unauthenticated
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900"></div>
        <div className="mx-auto w-12 h-12 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-center mb-6">
          <Lock className="w-5 h-5 text-slate-700" />
        </div>
        <h3 className="text-xl font-bold text-slate-950 font-sans tracking-tight mb-2">Corporate Operator Deck</h3>
        <p className="text-slate-400 text-xs leading-relaxed mb-6">
          Authorized personnel only. Access forms require client-side encryption evaluation passes.
        </p>

        {authError && (
          <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-100 rounded-lg p-3 text-xs mb-4 text-left">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="space-y-1.5 text-left">
            <label className="text-xs font-semibold text-slate-700 block">Operator Passcode</label>
            <input
              type="password"
              placeholder="Enter passcode (e.g. admin123)"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-slate-400 text-slate-900"
            />
          </div>
          <div className="flex gap-2.5">
            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold tracking-wide transition-all cursor-pointer border border-slate-200"
              >
                Go Back
              </button>
            )}
            <button
              type="submit"
              className={`${onLogout ? 'w-1/2' : 'w-full'} py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer`}
            >
              Authenticate
            </button>
          </div>
        </form>
        <p className="text-[10px] text-slate-400 mt-6 bg-slate-50 py-2 rounded-md border border-slate-100">
          🔑 Use security key <code className="font-mono font-bold text-slate-700">admin123</code> to gain entry.
        </p>
      </div>
    );
  }

  return (
    <div className="text-left py-6 px-1 max-w-7xl mx-auto">
      
      {/* SUCCESS POP OVER NOTIFICATION */}
      {actionSuccess && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-xl text-xs border border-white/5 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* ADMIN CONTROL DECK NAVIGATION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
        <div>
          <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase block">Operational Control Hub</span>
          <div className="flex items-center gap-2.5 mt-1">
            <h2 className="text-2xl font-bold text-slate-950 tracking-tight leading-none">Security Suite Dashboard</h2>
            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              <Unlock className="w-2.5 h-2.5" /> DECRYPTED
            </span>
          </div>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === 'inquiries' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Inbox className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" /> Client Inbox ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('branding')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${activeTab === 'branding' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Sliders className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5" /> Brand customizer
          </button>
          {onLogout && (
            <button
              onClick={() => {
                setIsAuthenticated(false);
                setAccessCode("");
                onLogout();
              }}
              className="px-4 py-2 rounded-lg text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50/70 transition-all cursor-pointer border border-transparent"
            >
              Log Out & Exit
            </button>
          )}
        </div>
      </div>

      {activeTab === 'inquiries' ? (
        <div className="space-y-6">
          
          {/* STATS DEUGRID */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 font-medium text-xs font-mono uppercase tracking-wider">Total Received</span>
                <MessageSquare className="w-4 h-4 text-indigo-500" />
              </div>
              <strong className="text-2xl font-black text-slate-900 block tracking-tight leading-none">{totalInquires}</strong>
              <span className="text-[10px] text-slate-400 block mt-2 font-medium">Safe inquiries parsed</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 font-medium text-xs font-mono uppercase tracking-wider">Awaiting Review</span>
                <Clock className="w-4 h-4 text-amber-500 animate-pulse" />
              </div>
              <strong className="text-2xl font-black text-slate-950 block tracking-tight leading-none">{newInquiriesCount}</strong>
              <span className="text-[10px] text-slate-400 block mt-2 font-medium">Marked with new state status</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 font-medium text-xs font-mono uppercase tracking-wider">High Priority AI</span>
                <AlertTriangle className="w-4 h-4 text-rose-500" />
              </div>
              <strong className="text-2xl font-black text-rose-950 block tracking-tight leading-none">{highUrgencyCount}</strong>
              <span className="text-[10px] text-slate-400 block mt-2 font-medium">Urgent deadlines detected</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-2">
                <span className="text-slate-400 font-medium text-xs font-mono uppercase tracking-wider">Filtered Spam</span>
                <CheckSquare className="w-4 h-4 text-slate-400" />
              </div>
              <strong className="text-2xl font-black text-slate-500 block tracking-tight leading-none">{spamCount}</strong>
              <span className="text-[10px] text-slate-400 block mt-2 font-medium">Bypassed manually verified</span>
            </div>

          </div>

          {/* MAIN INBOX GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT: INBOUND MESSAGES LIST */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[650px]">
              
              {/* FILTERS & REFRESH ACTION */}
              <div className="p-4 border-b border-slate-50 flex items-center justify-between gap-4 bg-slate-50/50">
                <div className="flex flex-wrap gap-1">
                  {(['all', 'new', 'replied'] as const).map(flt => (
                    <button
                      key={flt}
                      onClick={() => setStatusFilter(flt)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest border transition-all ${statusFilter === flt ? 'bg-slate-900 border-slate-900 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                    >
                      {flt}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={onRefreshInquiries}
                  className="p-1.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
                  title="Force connection database updates"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* MESSAGES SCROLL REGION */}
              <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                {filteredInquiries.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <MessageSquare className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                    <p className="text-xs font-semibold">No transactions detected matching rules.</p>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => {
                    const isSelected = selectedInquiryId === inq.id;
                    const cleanDate = new Date(inq.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    
                    return (
                      <div
                        key={inq.id}
                        onClick={() => setSelectedInquiryId(inq.id)}
                        className={`p-4 text-left cursor-pointer transition-colors border-l-2 relative ${isSelected ? 'bg-slate-50/70 border-slate-900' : 'bg-white border-transparent hover:bg-slate-50/30'}`}
                      >
                        {/* UNREAD NEW METADATA BULLET */}
                        {inq.status === "new" && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-blue-500"></span>
                        )}

                        <div className="flex items-center gap-2 mb-1">
                          <strong className="text-xs text-slate-900 font-bold block max-w-[140px] truncate">{inq.name}</strong>
                          <span className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-widest rounded ${
                            inq.status === 'replied' ? 'bg-indigo-50 text-indigo-700' :
                            inq.status === 'new' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {inq.status}
                          </span>
                        </div>

                        <span className="text-[10px] text-slate-400 block mb-2">{cleanDate} &middot; {inq.service}</span>
                        <p className="text-[11px] text-slate-550 leading-relaxed max-w-sm truncate mb-2">
                          {inq.message}
                        </p>

                        {/* HIGH PRIORITY WARNING MINI BADGE */}
                        {inq.geminiAnalysis?.urgency === "high" && (
                          <span className="inline-flex items-center gap-1 text-[8px] font-extrabold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100">
                            <span className="w-1 h-1 rounded-full bg-rose-500 animate-ping"></span> URGENT ACTION
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* RIGHT: COMPREHENSIVE DETAIL COMPOSER PANEL */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 min-h-[650px] flex flex-col justify-between">
              {currentInquiry ? (
                <div className="space-y-6 flex-1 text-left">
                  
                  {/* HEADER DIRECTORY IDENTIFIERS */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-slate-900 font-sans tracking-tight">{currentInquiry.name}</h3>
                        <a href={`mailto:${currentInquiry.email}`} className="text-slate-400 hover:text-slate-600 transition-colors" title="Launch direct browser mailto Client">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1">Inquiry ID: <span className="font-mono">{currentInquiry.id}</span> &middot; Filed {new Date(currentInquiry.createdAt).toLocaleString()}</p>
                    </div>

                    {/* STATUS ACTION SELECTORS */}
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      {currentInquiry.status !== "replied" && (
                        <button
                          onClick={() => handleStatusChange(currentInquiry.id, "replied")}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" /> Mark Rep
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleStatusChange(currentInquiry.id, "archived")}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-[10px] font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1"
                        title="Move to archival folders"
                      >
                        <Archive className="w-3.5 h-3.5" /> Archive
                      </button>
                    </div>
                  </div>

                  {/* CONTACT SENDER CARD */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider mb-0.5">service selected</span>
                      <strong className="text-slate-900 font-bold">{currentInquiry.service}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider mb-0.5">email endpoint</span>
                      <a href={`mailto:${currentInquiry.email}`} className="text-slate-700 font-medium hover:underline block truncate">{currentInquiry.email}</a>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider mb-0.5">validated phone</span>
                      <span className="text-slate-700 font-medium block">{currentInquiry.phone || 'None provided'}</span>
                    </div>
                  </div>

                  {/* ORIGINAL SUBMISSION SEGMENT */}
                  <div className="space-y-1.5 text-xs text-left">
                    <span className="text-[10px] text-slate-400 block font-mono uppercase tracking-wider">original message transcript</span>
                    <div className="bg-white p-4 border border-slate-100 rounded-xl leading-relaxed text-slate-850 whitespace-pre-wrap">
                      "{currentInquiry.message}"
                    </div>
                  </div>

                  {/* GEMINI INTELLIGENCE MATRIX */}
                  {currentInquiry.geminiAnalysis && (
                    <div className="border border-indigo-100/50 rounded-2xl bg-indigo-50/20 p-5 space-y-4">
                      
                      <div className="flex items-center gap-2 border-b border-indigo-100/20 pb-3">
                        <div className="p-1 rounded-lg bg-indigo-500 text-white flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs text-indigo-950 font-sans tracking-tight block font-bold">Gemini AI Client Analysis</strong>
                          <span className="text-[9px] text-indigo-600 font-medium leading-none block">Real-time LLM operational context evaluators</span>
                        </div>
                      </div>

                      {/* CLASSIFICATIONS */}
                      <div className="grid grid-cols-2 gap-3 text-[11px]">
                        
                        <div className="bg-white/60 p-2.5 rounded-lg border border-indigo-50/50 text-left">
                          <span className="text-[9px] text-indigo-500 uppercase tracking-wider block font-mono mb-1">sentiment summary</span>
                          <span className="text-indigo-950 font-bold">{currentInquiry.geminiAnalysis.sentiment}</span>
                        </div>

                        <div className="bg-white/60 p-2.5 rounded-lg border border-indigo-50/50 text-left">
                          <span className="text-[9px] text-indigo-500 uppercase tracking-wider block font-mono mb-1">urgency / categorization</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`px-1.5 py-0.5 rounded font-black uppercase text-[8px] tracking-widest ${
                              currentInquiry.geminiAnalysis.urgency === 'high' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                              currentInquiry.geminiAnalysis.urgency === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                            }`}>
                              {currentInquiry.geminiAnalysis.urgency}
                            </span>
                            <span className="text-slate-400">&bull;</span>
                            <strong className="text-slate-700 font-bold block truncate">{currentInquiry.geminiAnalysis.category}</strong>
                          </div>
                        </div>

                      </div>

                      {/* EMAIL RESPONSE DRAFT COMPOSER */}
                      <div className="space-y-2 text-left">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[10px] text-indigo-500 block font-mono uppercase tracking-wider">automated draft email proposal</span>
                          <span className="text-[9px] text-indigo-400">Feel free to modify content text</span>
                        </div>
                        <textarea
                          rows={6}
                          value={replyTextMap[currentInquiry.id] || ""}
                          onChange={(e) => setReplyTextMap({ ...replyTextMap, [currentInquiry.id]: e.target.value })}
                          className="w-full text-xs font-mono p-3 bg-white border border-indigo-100 rounded-xl focus:outline-none focus:border-indigo-400 leading-relaxed text-slate-800"
                        ></textarea>
                      </div>

                      {/* DISPATCH ACTION DRAFT BUTTON */}
                      <button
                        onClick={() => handleSendReply(currentInquiry.id)}
                        disabled={actionLoading}
                        className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold tracking-wide shadow-sm flex items-center justify-center gap-1.5 cursor-pointer ml-auto"
                      >
                        <Send className="w-3.5 h-3.5" /> Approve & Dispatch Mock Response
                      </button>

                    </div>
                  )}

                </div>
              ) : (
                <div className="text-center py-32 text-slate-450 flex-1 flex flex-col justify-center">
                  <Eye className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                  <h4 className="text-sm font-bold text-slate-900">Inquiry Ledger Selected</h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Please select any client submission from the left inbox lane to audit data profiles and compose replies.</p>
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 md:p-8">
          
          <div className="border-b border-slate-100 pb-5 mb-6 text-left">
            <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight">Identity Architecture & Preset Builder</h3>
            <p className="text-xs text-slate-450 mt-1 leading-relaxed">
              Dynamically rebuild the primary showcase website instantly. Tweak values, pick strategic industry profiles, and observe layout changes instantly on the "Public Website" tab above.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* BRAND PROFILE FORM */}
            <form onSubmit={handleSaveBranding} className="lg:col-span-7 space-y-5">
              
              {/* BRAND QUICK PRESETS CHOICE */}
              <div className="bg-slate-50 p-4 border border-slate-100 rounded-xl text-left space-y-2.5">
                <span className="text-[10px] text-slate-450 block font-mono uppercase tracking-widest font-semibold">LOAD METRIC PRESET</span>
                <div className="flex flex-wrap gap-1.5">
                  {Object.keys(INDUSTRY_PRESETS).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => selectPreset(key)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                        currentConfig.industry.toLowerCase().includes(key.split(" ")[0].toLowerCase()) || currentConfig.name.includes(key.split(" ")[0])
                          ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                          : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {key} Preset
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-705 block">Business Firm Name</label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900 font-bold"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-705 block">Industry Space Focus</label>
                  <input
                    type="text"
                    value={brandIndustry}
                    onChange={(e) => setBrandIndustry(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-705 block">Primary Tagline & Motto</label>
                <input
                  type="text"
                  value={brandTagline}
                  onChange={(e) => setBrandTagline(e.target.value)}
                  className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-705 block">Comprehensive Narrative Profile</label>
                <textarea
                  rows={3}
                  value={brandDesc}
                  onChange={(e) => setBrandDesc(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900 leading-relaxed"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-block">Public Intake Email</label>
                  <input
                    type="email"
                    value={brandEmail}
                    onChange={(e) => setBrandEmail(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900"
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-semibold text-slate-block">Public Tel Line</label>
                  <input
                    type="text"
                    value={brandPhone}
                    onChange={(e) => setBrandPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-block">Corporate Headquarter HQ Street</label>
                <input
                  type="text"
                  value={brandAddress}
                  onChange={(e) => setBrandAddress(e.target.value)}
                  className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:bg-white text-slate-900"
                />
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-xs font-semibold text-slate-705 block">Theme Accent Palette Color</label>
                <div className="flex gap-4 pt-1">
                  {(['indigo', 'emerald', 'blue', 'rose', 'amber'] as const).map((color) => {
                    const active = brandColor === color;
                    const bgClass = 
                      color === 'indigo' ? 'bg-indigo-600' :
                      color === 'emerald' ? 'bg-emerald-600' :
                      color === 'blue' ? 'bg-blue-600' :
                      color === 'rose' ? 'bg-rose-600' : 'bg-amber-500';
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setBrandColor(color)}
                        className={`w-7 h-7 rounded-full ${bgClass} transition-all border ring-offset-2 cursor-pointer ${active ? 'ring-2 ring-slate-900 scale-110' : 'border-transparent opacity-85'}`}
                        title={color}
                      />
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                Save Identity Architecture
              </button>
            </form>

            {/* SERVICES REPAIR FORM PANEL */}
            <div className="lg:col-span-5 bg-slate-50/50 p-5 border border-slate-100 rounded-xl text-left space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider">Dynamic Showcase Services</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Customize specific card services and rate tables shown on the public face.</p>
              </div>

              {localServices.map((srv, idx) => (
                <div key={srv.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 relative text-xs">
                  <span className="absolute top-3 right-3 text-[9px] font-mono font-bold text-slate-400">Card 0{idx + 1}</span>
                  
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-semibold text-slate-600">Service Header Title</label>
                    <input
                      type="text"
                      value={srv.title}
                      onChange={(e) => updateServiceField(idx, "title", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-150 rounded"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-semibold text-slate-600">Description Copy</label>
                    <textarea
                      rows={2}
                      value={srv.description}
                      onChange={(e) => updateServiceField(idx, "description", e.target.value)}
                      className="w-full text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-150 rounded leading-relaxed"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left">
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600">Investment pricing</label>
                      <input
                        type="text"
                        value={srv.price || ""}
                        onChange={(e) => updateServiceField(idx, "price", e.target.value)}
                        className="w-full text-xs px-2.5 py-1 bg-slate-50 border border-slate-150 rounded"
                        placeholder="e.g. Free, $500"
                      />
                    </div>
                    {/* Icon Selection helper */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-slate-600">Lucide style icon</label>
                      <select
                        value={srv.icon}
                        onChange={(e) => updateServiceField(idx, "icon", e.target.value)}
                        className="w-full text-xs px-2.5 py-1 bg-slate-50 border border-slate-150 rounded appearance-none cursor-pointer"
                      >
                        <option value="Cpu">Cpu</option>
                        <option value="Cloud">Cloud</option>
                        <option value="ShieldAlert">ShieldAlert</option>
                        <option value="Scale">Scale</option>
                        <option value="FileKey">FileKey</option>
                        <option value="Briefcase">Briefcase</option>
                        <option value="Sparkles">Sparkles</option>
                        <option value="Layers">Layers</option>
                        <option value="Video">Video</option>
                        <option value="Heart">Heart</option>
                        <option value="Compass">Compass</option>
                        <option value="Activity">Activity</option>
                        <option value="Coins">Coins</option>
                        <option value="TrendingUp">TrendingUp</option>
                        <option value="HeartHandshake">HeartHandshake</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle,
  Search,
  Clock,
  CheckCircle2,
  ChevronRight,
  Send,
  Paperclip,
  BookOpen,
  MessagesSquare,
  Mail,
  ArrowUpRight,
  Plus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getUserTickets, createTicket } from "@/lib/data/tickets";
import type { TicketWithMessages, TicketStatus, TicketPriority, TicketCategory } from "@/types/database";

type ViewType = "tickets" | "new";
type StatusFilter = "all" | TicketStatus;

const statusConfig: Record<TicketStatus, { label: string; dot: string; text: string; bg: string }> = {
  open: { label: "Open", dot: "bg-amber-500", text: "text-amber-600", bg: "bg-amber-50" },
  in_progress: { label: "In Progress", dot: "bg-blue-500", text: "text-blue-600", bg: "bg-blue-50" },
  waiting_customer: { label: "Waiting", dot: "bg-purple-500", text: "text-purple-600", bg: "bg-purple-50" },
  resolved: { label: "Resolved", dot: "bg-emerald-500", text: "text-emerald-600", bg: "bg-emerald-50" },
  closed: { label: "Closed", dot: "bg-slate-500", text: "text-slate-600", bg: "bg-slate-50" },
};

const priorityConfig: Record<TicketPriority, { label: string; bg: string; text: string }> = {
  low: { label: "Low", bg: "bg-surface-2", text: "text-dark-muted" },
  medium: { label: "Medium", bg: "bg-amber-500/10", text: "text-amber-600" },
  high: { label: "High", bg: "bg-orange-500/10", text: "text-orange-600" },
  urgent: { label: "Urgent", bg: "bg-red-500/10", text: "text-red-500" },
};

const quickHelp = [
  { icon: BookOpen, title: "Documentation", description: "Browse guides and tutorials", href: "#", color: "bg-blue-500/10", iconColor: "text-blue-500" },
  { icon: MessagesSquare, title: "Live Chat", description: "Chat with our team", href: "#", color: "bg-emerald-500/10", iconColor: "text-emerald-500" },
  { icon: Mail, title: "Email Us", description: "support@layerium.com", href: "mailto:support@layerium.com", color: "bg-purple-500/10", iconColor: "text-purple-500" },
];

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function ViewToggle({ active, onChange, ticketCount }: { active: ViewType; onChange: (v: ViewType) => void; ticketCount: number }) {
  return (
    <div className="inline-flex items-center p-1.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-border">
      {(["tickets", "new"] as ViewType[]).map((view) => {
        const isActive = active === view;
        return (
          <button
            key={view}
            onClick={() => onChange(view)}
            className={cn(
              "relative flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-dm-sans font-semibold transition-all duration-300",
              isActive ? "text-white" : "text-dark-muted hover:text-dark"
            )}
          >
            {isActive && (
              <motion.div layoutId="supportViewPill" className="absolute inset-0 bg-dark rounded-full shadow-elevated" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            {view === "tickets" ? (
              <MessageCircle className={cn("relative z-10 w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
            ) : (
              <Plus className={cn("relative z-10 w-4 h-4 transition-transform duration-300", isActive && "scale-110")} />
            )}
            <span className="relative z-10">{view === "tickets" ? "My Tickets" : "New Ticket"}</span>
            {view === "tickets" && (
              <span className={cn("relative z-10 ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold transition-colors", isActive ? "bg-white/20 text-white" : "bg-dark/5 text-dark-muted")}>
                {ticketCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StatusFilterPills({ active, onChange, tickets }: { active: StatusFilter; onChange: (f: StatusFilter) => void; tickets: TicketWithMessages[] }) {
  const filters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "All", count: tickets.length },
    { id: "open", label: "Open", count: tickets.filter(t => t.status === "open").length },
    { id: "in_progress", label: "In Progress", count: tickets.filter(t => t.status === "in_progress").length },
    { id: "resolved", label: "Resolved", count: tickets.filter(t => t.status === "resolved").length },
  ];

  return (
    <div className="inline-flex items-center p-1 bg-surface-2/60 rounded-full">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn("relative px-4 py-2 rounded-full text-xs font-dm-sans font-semibold transition-all duration-200", active === filter.id ? "bg-white text-dark shadow-soft" : "text-dark-muted hover:text-dark")}
        >
          {filter.label}
          <span className={cn("ml-1.5 px-1.5 py-0.5 rounded-full text-[10px]", active === filter.id ? "bg-dark/10" : "bg-dark/5")}>{filter.count}</span>
        </button>
      ))}
    </div>
  );
}

function QuickHelpCard({ item, index }: { item: typeof quickHelp[0]; index: number }) {
  return (
    <motion.a
      href={item.href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex items-center gap-3 px-5 py-4 bg-surface-1 rounded-full border border-border hover:border-dark/20 hover:shadow-elevated transition-all duration-300 overflow-hidden"
    >
      <div className="absolute inset-0 bg-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className={cn("relative z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300", item.color, "group-hover:bg-white/20")}>
        <item.icon className={cn("w-4 h-4 transition-colors duration-300", item.iconColor, "group-hover:text-white")} />
      </div>
      <div className="relative z-10 flex-1">
        <h4 className="font-dm-sans font-semibold text-dark group-hover:text-white transition-colors duration-300">{item.title}</h4>
        <p className="font-outfit text-xs text-dark-muted group-hover:text-white/70 transition-colors duration-300">{item.description}</p>
      </div>
      <ArrowUpRight className="relative z-10 w-4 h-4 text-dark-muted group-hover:text-white opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
    </motion.a>
  );
}


function TicketRow({ ticket, index }: { ticket: TicketWithMessages; index: number }) {
  const status = statusConfig[ticket.status] || statusConfig.open;
  const priority = priorityConfig[ticket.priority] || priorityConfig.medium;
  const messagesCount = Array.isArray(ticket.messages) ? ticket.messages.length : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group px-6 py-5 flex items-center justify-between hover:bg-surface-2/40 transition-colors cursor-pointer"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", status.bg)}>
          {ticket.status === "resolved" || ticket.status === "closed" ? (
            <CheckCircle2 className={cn("w-5 h-5", status.text)} />
          ) : ticket.status === "in_progress" ? (
            <Clock className={cn("w-5 h-5", status.text)} />
          ) : (
            <AlertCircle className={cn("w-5 h-5", status.text)} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap mb-1">
            <span className="font-dm-sans font-semibold text-dark truncate">{ticket.subject}</span>
            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-dm-sans font-bold uppercase tracking-wider", status.bg, status.text)}>
              {status.label}
            </span>
            <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-dm-sans font-bold uppercase tracking-wider", priority.bg, priority.text)}>
              {priority.label}
            </span>
          </div>
          <p className="font-outfit text-sm text-dark-muted truncate">{ticket.ticket_number} • {ticket.category}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 ml-4">
        <div className="text-right hidden sm:block">
          <p className="font-dm-sans text-sm font-medium text-dark">{formatRelativeTime(ticket.updated_at)}</p>
          <p className="font-outfit text-xs text-dark-muted">{messagesCount} {messagesCount === 1 ? "reply" : "replies"}</p>
        </div>
        <ChevronRight className="w-4 h-4 text-dark-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
      </div>
    </motion.div>
  );
}

function NewTicketForm({ onSubmit }: { onSubmit: () => void }) {
  const [subject, setSubject] = React.useState("");
  const [category, setCategory] = React.useState<TicketCategory>("technical");
  const [priority, setPriority] = React.useState<TicketPriority>("medium");
  const [message, setMessage] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      await createTicket({ subject, message, category, priority });
      setSubject("");
      setMessage("");
      setCategory("technical");
      setPriority("medium");
      onSubmit();
    } catch (error) {
      console.error("Error creating ticket:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="bg-surface-1 rounded-[32px] border border-border overflow-hidden"
    >
      <div className="px-8 py-6 border-b border-border">
        <h3 className="font-google-sans font-semibold text-xl text-dark">Create New Ticket</h3>
        <p className="font-outfit text-sm text-dark-muted mt-1">Describe your issue and we'll get back to you shortly</p>
      </div>

      <div className="p-8 space-y-6">
        <div>
          <label className="block font-dm-sans text-sm font-semibold text-dark mb-3">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Brief description of your issue"
            className="w-full h-14 px-5 bg-surface-2/50 border border-border rounded-2xl font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 focus:bg-white transition-all"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-dm-sans text-sm font-semibold text-dark mb-3">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TicketCategory)}
              className="w-full h-14 px-5 bg-surface-2/50 border border-border rounded-2xl font-outfit text-dark focus:outline-none focus:border-primary/30 focus:bg-white transition-all"
            >
              <option value="technical">Technical</option>
              <option value="billing">Billing</option>
              <option value="sales">Sales</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-dm-sans text-sm font-semibold text-dark mb-3">Priority</label>
            <div className="flex items-center gap-3">
              {(["low", "medium", "high"] as TicketPriority[]).map((p) => {
                const isActive = priority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={cn(
                      "flex-1 px-4 py-3 rounded-full text-sm font-dm-sans font-semibold transition-all duration-200 capitalize",
                      isActive ? "bg-dark text-white shadow-soft" : "bg-surface-2/60 text-dark-muted hover:text-dark hover:bg-surface-2"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div>
          <label className="block font-dm-sans text-sm font-semibold text-dark mb-3">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide detailed information about your issue..."
            rows={6}
            className="w-full px-5 py-4 bg-surface-2/50 border border-border rounded-2xl font-outfit text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 focus:bg-white transition-all resize-none"
            required
          />
        </div>

        <div className="flex items-center justify-between pt-4">
          <button type="button" className="inline-flex items-center gap-2 px-5 py-3 bg-surface-2/60 hover:bg-surface-2 text-dark-muted hover:text-dark rounded-full text-sm font-dm-sans font-semibold transition-colors">
            <Paperclip className="w-4 h-4" /> Attach File
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !subject.trim() || !message.trim()}
            className={cn(
              "inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-dm-sans font-semibold transition-all",
              isSubmitting || !subject.trim() || !message.trim()
                ? "bg-dark/30 text-white/50 cursor-not-allowed"
                : "bg-dark hover:bg-primary text-white shadow-soft hover:shadow-elevated"
            )}
          >
            {isSubmitting ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit Ticket</>
            )}
          </button>
        </div>
      </div>
    </motion.form>
  );
}


export default function SupportPage() {
  const [tickets, setTickets] = React.useState<TicketWithMessages[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [view, setView] = React.useState<ViewType>("tickets");
  const [statusFilter, setStatusFilter] = React.useState<StatusFilter>("all");
  const [search, setSearch] = React.useState("");

  const fetchTickets = React.useCallback(async () => {
    setLoading(true);
    try {
      const result = await getUserTickets({
        status: statusFilter === "all" ? "all" : statusFilter,
        search: search || undefined,
        limit: 50,
      });
      setTickets(result.tickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const filteredTickets = tickets.filter((ticket) => {
    const matchSearch = ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
      ticket.ticket_number.toLowerCase().includes(search.toLowerCase());
    return matchSearch;
  });

  const openTickets = tickets.filter(t => t.status === "open" || t.status === "in_progress").length;

  const handleTicketSubmit = () => {
    setView("tickets");
    fetchTickets();
  };

  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="mb-12">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 bg-surface-1 rounded-full border border-border"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-dm-sans text-sm font-medium text-dark-muted">
              {openTickets} open {openTickets === 1 ? "ticket" : "tickets"}
            </span>
          </motion.div>
        </div>

        <div className="max-w-2xl">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[clamp(2.5rem,8vw,4.5rem)] font-google-sans font-semibold text-dark tracking-[-0.03em] leading-[0.95] mb-5"
          >
            Support
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="font-outfit text-xl text-dark-muted leading-relaxed"
          >
            Get help from our team<span className="text-dark-muted/40">—</span><span className="text-dark"> we're here for you.</span>
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="grid sm:grid-cols-3 gap-4 mb-12"
      >
        {quickHelp.map((item, i) => (
          <QuickHelpCard key={item.title} item={item} index={i} />
        ))}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex justify-center mb-10">
        <ViewToggle active={view} onChange={setView} ticketCount={tickets.length} />
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "tickets" ? (
          <motion.div key="tickets" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <StatusFilterPills active={statusFilter} onChange={setStatusFilter} tickets={tickets} />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted" />
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-64 h-11 pl-11 pr-4 bg-surface-1 border border-border rounded-full font-outfit text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none focus:border-primary/30 transition-colors"
                />
              </div>
            </div>

            <div className="bg-surface-1 rounded-[32px] border border-border overflow-hidden">
              <div className="px-6 py-5 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="font-google-sans font-semibold text-lg text-dark">Your Tickets</h3>
                  <p className="font-outfit text-sm text-dark-muted">{filteredTickets.length} tickets found</p>
                </div>
                <button onClick={() => setView("new")} className="inline-flex items-center gap-2 px-5 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
                  <Plus className="w-4 h-4" /> New Ticket
                </button>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-8 h-8 animate-spin text-dark-muted" />
                </div>
              ) : filteredTickets.length > 0 ? (
                <div className="divide-y divide-border/50">
                  {filteredTickets.map((ticket, i) => (
                    <TicketRow key={ticket.id} ticket={ticket} index={i} />
                  ))}
                </div>
              ) : (
                <div className="px-6 py-16 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-surface-2 flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-8 h-8 text-dark-muted" />
                  </div>
                  <p className="font-dm-sans font-semibold text-dark mb-1">No tickets found</p>
                  <p className="font-outfit text-sm text-dark-muted mb-6">
                    {search || statusFilter !== "all" ? "Try adjusting your search or filter" : "You haven't created any tickets yet"}
                  </p>
                  {!search && statusFilter === "all" && (
                    <button onClick={() => setView("new")} className="inline-flex items-center gap-2 px-6 py-3 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors">
                      <Plus className="w-4 h-4" /> Create Your First Ticket
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <NewTicketForm key="new" onSubmit={handleTicketSubmit} />
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LifeBuoy,
  Search,
  MoreVertical,
  Eye,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  X,
  Send,
  RefreshCw,
  UserCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getAllTickets, updateTicketStatus, addTicketMessage, getTicketStats } from "@/lib/data";
import type { TicketWithMessages, TicketStatus, TicketPriority } from "@/types/database";

type FilterStatus = "all" | TicketStatus;
type FilterPriority = "all" | TicketPriority;

const statusConfig: Record<TicketStatus, { bg: string; text: string; label: string }> = {
  open: { bg: "bg-blue-500/10", text: "text-blue-600", label: "Open" },
  in_progress: { bg: "bg-amber-500/10", text: "text-amber-600", label: "In Progress" },
  waiting_customer: { bg: "bg-purple-500/10", text: "text-purple-600", label: "Waiting" },
  resolved: { bg: "bg-emerald-500/10", text: "text-emerald-600", label: "Resolved" },
  closed: { bg: "bg-slate-500/10", text: "text-slate-600", label: "Closed" },
};

const priorityConfig: Record<TicketPriority, { bg: string; text: string }> = {
  urgent: { bg: "bg-red-500", text: "text-white" },
  high: { bg: "bg-orange-500/10", text: "text-orange-600" },
  medium: { bg: "bg-amber-500/10", text: "text-amber-600" },
  low: { bg: "bg-slate-500/10", text: "text-slate-600" },
};

const categoryConfig: Record<string, { bg: string; text: string }> = {
  technical: { bg: "bg-blue-500/10", text: "text-blue-600" },
  billing: { bg: "bg-emerald-500/10", text: "text-emerald-600" },
  sales: { bg: "bg-purple-500/10", text: "text-purple-600" },
  abuse: { bg: "bg-red-500/10", text: "text-red-600" },
  other: { bg: "bg-slate-500/10", text: "text-slate-600" },
};

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


function ReplyModal({ 
  ticket, 
  isOpen, 
  onClose, 
  onSend 
}: {
  ticket: TicketWithMessages | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, status: TicketStatus) => Promise<void>;
}) {
  const [message, setMessage] = React.useState("");
  const [newStatus, setNewStatus] = React.useState<TicketStatus>("open");
  const [sending, setSending] = React.useState(false);

  React.useEffect(() => {
    if (ticket) setNewStatus(ticket.status);
  }, [ticket]);

  const handleSend = async () => {
    if (!message.trim()) return;
    setSending(true);
    await onSend(message, newStatus);
    setMessage("");
    setSending(false);
    onClose();
  };

  if (!isOpen || !ticket) return null;
  const user = ticket.user as { email: string; full_name: string | null } | undefined;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl bg-white rounded-[28px] shadow-elevated overflow-hidden"
        >
          <div className="px-8 py-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-google-sans font-semibold text-xl text-dark">Reply to Ticket</h2>
                <p className="font-outfit text-sm text-dark-muted mt-1">{ticket.ticket_number}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-surface-2 rounded-xl transition-colors">
                <X className="w-5 h-5 text-dark-muted" />
              </button>
            </div>
          </div>
          <div className="px-8 py-6">
            <div className="mb-6 p-4 bg-surface-1 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-4 h-4 text-dark-muted" />
                <span className="font-dm-sans text-sm font-medium text-dark">
                  {user?.full_name || user?.email || "Unknown User"}
                </span>
              </div>
              <h3 className="font-dm-sans font-semibold text-dark mb-2">{ticket.subject}</h3>
              <p className="font-outfit text-sm text-dark-muted">{ticket.category}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Your Reply</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                  placeholder="Type your reply..."
                />
              </div>
              <div>
                <label className="block font-dm-sans text-sm font-medium text-dark mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as TicketStatus)}
                  className="w-full px-4 py-3 bg-surface-1 border border-border rounded-xl font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="waiting_customer">Waiting for Customer</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          </div>
          <div className="px-8 py-5 bg-surface-1 border-t border-border flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-6 py-2.5 bg-white border border-border hover:bg-surface-2 rounded-full text-sm font-dm-sans font-semibold text-dark-muted transition-colors">
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={sending || !message.trim()}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-dark hover:bg-primary text-white rounded-full text-sm font-dm-sans font-semibold transition-colors disabled:opacity-50"
            >
              {sending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {sending ? "Sending..." : "Send Reply"}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}


export default function AdminTicketsPage() {
  const [tickets, setTickets] = React.useState<TicketWithMessages[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("all");
  const [priorityFilter, setPriorityFilter] = React.useState<FilterPriority>("all");
  const [dropdownOpen, setDropdownOpen] = React.useState<string | null>(null);
  const [replyingTicket, setReplyingTicket] = React.useState<TicketWithMessages | null>(null);
  const [stats, setStats] = React.useState({ openTickets: 0, urgentTickets: 0, inProgressTickets: 0, resolvedToday: 0 });

  const fetchTickets = React.useCallback(async () => {
    setLoading(true);
    try {
      const [ticketsResult, statsResult] = await Promise.all([
        getAllTickets({
          search: searchQuery || undefined,
          status: statusFilter === "all" ? "all" : statusFilter,
          priority: priorityFilter === "all" ? "all" : priorityFilter,
          page,
          limit: 10,
        }),
        getTicketStats(),
      ]);
      setTickets(ticketsResult.tickets);
      setTotal(ticketsResult.total);
      setTotalPages(ticketsResult.totalPages);
      setStats(statsResult);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, statusFilter, priorityFilter, page]);

  React.useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSendReply = async (message: string, status: TicketStatus) => {
    if (!replyingTicket) return;
    await addTicketMessage(replyingTicket.id, message, true);
    if (status !== replyingTicket.status) {
      await updateTicketStatus(replyingTicket.id, status);
    }
    fetchTickets();
  };

  const handleMarkResolved = async (ticketId: string) => {
    await updateTicketStatus(ticketId, "resolved");
    fetchTickets();
    setDropdownOpen(null);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <ReplyModal
        ticket={replyingTicket}
        isOpen={!!replyingTicket}
        onClose={() => setReplyingTicket(null)}
        onSend={handleSendReply}
      />

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="font-google-sans font-semibold text-3xl text-dark mb-2">Support Tickets</h1>
          <p className="font-outfit text-dark-muted">Manage customer support requests</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-blue-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Open</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.openTickets}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5 text-red-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Urgent</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.urgentTickets}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">In Progress</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.inProgressTickets}</p>
        </div>
        <div className="bg-surface-1 rounded-[20px] border border-border p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="font-outfit text-sm text-dark-muted">Resolved Today</span>
          </div>
          <p className="font-work-sans font-bold text-2xl text-dark">{stats.resolvedToday}</p>
        </div>
      </motion.div>


      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-surface-1 rounded-[24px] border border-border p-4 mb-6"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white rounded-xl border border-border">
            <Search className="w-4 h-4 text-dark-muted" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent font-outfit text-sm text-dark placeholder:text-dark-muted/50 focus:outline-none"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FilterStatus)}
            className="px-4 py-2.5 bg-white rounded-xl border border-border font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="waiting_customer">Waiting</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as FilterPriority)}
            className="px-4 py-2.5 bg-white rounded-xl border border-border font-outfit text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </motion.div>

      {/* Tickets List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-dark-muted" />
        </div>
      ) : tickets.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          {tickets.map((ticket) => {
            const statusStyle = statusConfig[ticket.status] || statusConfig.open;
            const priorityStyle = priorityConfig[ticket.priority] || priorityConfig.medium;
            const catStyle = categoryConfig[ticket.category] || categoryConfig.other;
            const user = ticket.user as { email: string; full_name: string | null } | undefined;
            const assignedUser = ticket.assigned_user as { full_name: string | null } | undefined;
            const messagesCount = Array.isArray(ticket.messages) ? ticket.messages.length : 0;

            return (
              <div key={ticket.id} className="bg-surface-1 rounded-[24px] border border-border p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <span className="font-mono text-xs text-dark-muted">{ticket.ticket_number}</span>
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-dm-sans font-bold uppercase", statusStyle.bg, statusStyle.text)}>
                        {statusStyle.label}
                      </span>
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-dm-sans font-bold uppercase", priorityStyle.bg, priorityStyle.text)}>
                        {ticket.priority}
                      </span>
                      <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-dm-sans font-semibold capitalize", catStyle.bg, catStyle.text)}>
                        {ticket.category}
                      </span>
                    </div>
                    <h3 className="font-dm-sans font-semibold text-dark mb-2 truncate">{ticket.subject}</h3>
                    <div className="flex items-center gap-4 text-xs text-dark-muted flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" /> {user?.full_name || user?.email || "Unknown"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {formatRelativeTime(ticket.updated_at)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5" /> {messagesCount} messages
                      </span>
                      {assignedUser?.full_name && (
                        <span className="flex items-center gap-1.5">
                          <UserCheck className="w-3.5 h-3.5" /> {assignedUser.full_name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setReplyingTicket(ticket)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-dark hover:bg-primary text-white rounded-full text-xs font-dm-sans font-semibold transition-colors"
                    >
                      <Send className="w-3.5 h-3.5" /> Reply
                    </button>
                    <div className="relative">
                      <button
                        onClick={() => setDropdownOpen(dropdownOpen === ticket.id ? null : ticket.id)}
                        className="p-2 hover:bg-surface-2 rounded-xl transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-dark-muted" />
                      </button>
                      {dropdownOpen === ticket.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-border shadow-elevated z-10 overflow-hidden">
                          <button className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-dark hover:bg-surface-2 transition-colors">
                            <Eye className="w-4 h-4" /> View Thread
                          </button>
                          <button className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-dark hover:bg-surface-2 transition-colors">
                            <UserCheck className="w-4 h-4" /> Assign
                          </button>
                          {ticket.status !== "resolved" && ticket.status !== "closed" && (
                            <button
                              onClick={() => handleMarkResolved(ticket.id)}
                              className="flex items-center gap-2.5 w-full px-4 py-3 font-outfit text-sm text-emerald-600 hover:bg-emerald-50 transition-colors"
                            >
                              <CheckCircle2 className="w-4 h-4" /> Mark Resolved
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-surface-1 rounded-[24px] border border-border">
          <LifeBuoy className="w-12 h-12 text-dark-muted mx-auto mb-4" />
          <h3 className="font-google-sans font-semibold text-xl text-dark mb-2">No tickets found</h3>
          <p className="font-outfit text-dark-muted">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between mt-6"
      >
        <p className="font-outfit text-sm text-dark-muted">
          Showing {tickets.length} of {total} tickets
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-2 hover:bg-surface-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <ChevronLeft className="w-5 h-5 text-dark-muted" />
          </button>
          <span className="font-dm-sans text-sm text-dark px-3">
            Page {page} of {totalPages || 1}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-2 hover:bg-surface-2 rounded-xl transition-colors disabled:opacity-50"
          >
            <ChevronRight className="w-5 h-5 text-dark-muted" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

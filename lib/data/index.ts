/**
 * Layerium Cloud - Data Layer
 * Server actions for database operations
 */

// Servers
export {
  getUserServers,
  getServerById,
  performServerAction,
  updateServer,
  getServerActivityLogs,
  // Admin functions
  getAllServers,
  updateServerCredentials,
  updateServerStatus,
  deleteServer,
  type GetServersParams,
  type GetServersResult,
  type GetAllServersParams,
  type GetAllServersResult,
} from "./servers";

// Orders
export {
  getUserOrders,
  getOrderById,
  getOrderByNumber,
  getBillingSummary,
  // Admin functions
  getAllOrders,
  updateOrderStatus,
  getOrderStats,
  type GetOrdersParams,
  type GetOrdersResult,
  type GetAllOrdersParams,
  type GetAllOrdersResult,
} from "./orders";

// Tickets
export {
  getUserTickets,
  getTicketById,
  createTicket,
  addTicketReply,
  closeTicket,
  reopenTicket,
  // Admin functions
  getAllTickets,
  updateTicketStatus,
  addTicketMessage,
  getTicketStats,
  type GetTicketsParams,
  type GetTicketsResult,
  type CreateTicketParams,
  type GetAllTicketsParams,
  type GetAllTicketsResult,
} from "./tickets";

// Users
export {
  getCurrentUserProfile,
  updateCurrentUser,
  updateUserEmail,
  updateUserPassword,
  getUserActivityLogs,
  getUserSessions,
  getUserSSHKeys,
  addSSHKey,
  removeSSHKey,
  // Admin functions
  getUsers,
  updateUser,
  type UpdateProfileParams,
  type GetUsersParams,
  type GetUsersResult,
} from "./users";

// Settings
export {
  getAllSettings,
  getSettingsByCategory,
  getSetting,
  getPublicSettings,
  updateSetting,
  updateSettings,
  createSetting,
  deleteSetting,
  initializeDefaultSettings,
  type SettingsCategory,
} from "./settings";

// Plans
export {
  getAllPlans,
  createPlan,
  updatePlan,
  deletePlan,
  getPlanStats,
  type GetAllPlansParams,
  type GetAllPlansResult,
} from "./plans";

// Stats (Admin Dashboard)
export {
  getAdminDashboardStats,
  getServerLocations,
  getRecentOrders,
  getRecentTickets,
  type DashboardStats,
  type ServerLocation,
} from "./stats";


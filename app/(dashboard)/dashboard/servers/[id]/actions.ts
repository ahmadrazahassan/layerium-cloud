"use server";

import { getServerById as getServer, getServerActivityLogs as getActivityLogs, performServerAction as performAction } from "@/lib/data/servers";
import type { ServerWithPlan } from "@/types/database";

export async function fetchServerById(serverId: string): Promise<ServerWithPlan | null> {
  return getServer(serverId);
}

export async function fetchServerActivityLogs(serverId: string): Promise<any[]> {
  return getActivityLogs(serverId);
}

export async function executeServerAction(
  serverId: string,
  action: "start" | "stop" | "restart"
): Promise<{ success: boolean; error?: string }> {
  return performAction(serverId, action);
}

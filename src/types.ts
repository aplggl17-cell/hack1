/**
 * @fileoverview Single Source of Truth for Aegis Data Structures.
 * Downstream agents MUST import from this file.
 */

export type UserRole = 'ADMIN' | 'VOLUNTEER' | 'FAN';
export type BlockStatus = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
export type EventType = 'WEATHER_ALERT' | 'ZONE_WARNING' | 'RED_ZONE_SOS' | 'GATE_CLOSED' | 'VOICE_COMMAND';
export type BountyStatus = 'PENDING' | 'COMPLETED' | 'EXPIRED';

/**
 * Represents an authenticated entity within the Aegis system.
 */
export interface User {
  id: string;
  email: string;
  role: UserRole;
  assigned_gate: string | null;
  phone_number: string | null;
  vanguard_points: number;
  has_consented: boolean;
  created_at: string;
}

/**
 * Represents a discrete spatial node within the stadium.
 */
export interface StadiumBlock {
  block_id: string;
  current_density_pct: number;
  status_color: BlockStatus;
  is_open: boolean;
  last_updated: string;
}

/**
 * Auditable system event logged by the Genkit Supervisor or Human Admin.
 */
export interface EventLog {
  log_id: string;
  timestamp: string;
  event_type: EventType;
  ai_action_taken: string;
  target_block_id: string | null;
  admin_approved_by: string | null;
  raw_payload: Record<string, unknown>;
}

/**
 * Transient state for AI telemetry streamed via SSE.
 */
export interface AgentTelemetryPayload {
  state: 'idle' | 'thinking' | 'executing_tool' | 'streaming_text' | 'complete' | 'error';
  tool?: string;
  logic?: string;
  text?: string;
}

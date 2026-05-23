-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- ENUMERATED TYPES
-- ==========================================
CREATE TYPE user_role AS ENUM ('ADMIN', 'VOLUNTEER', 'FAN');
CREATE TYPE block_status AS ENUM ('GREEN', 'YELLOW', 'ORANGE', 'RED');
CREATE TYPE event_type AS ENUM ('WEATHER_ALERT', 'ZONE_WARNING', 'RED_ZONE_SOS', 'GATE_CLOSED', 'VOICE_COMMAND');
CREATE TYPE bounty_status AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- ==========================================
-- TABLE: users
-- ==========================================
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'FAN',
    assigned_gate VARCHAR(50),
    phone_number VARCHAR(20),
    vanguard_points INTEGER NOT NULL DEFAULT 0,
    has_consented BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexing for role-based routing and query acceleration
CREATE INDEX idx_users_role ON users USING btree(role);
CREATE INDEX idx_users_assigned_gate ON users USING btree(assigned_gate);

-- ==========================================
-- TABLE: stadium_blocks (The Spatial Grid)
-- ==========================================
CREATE TABLE stadium_blocks (
    block_id VARCHAR(50) PRIMARY KEY,
    current_density_pct INTEGER NOT NULL CHECK (current_density_pct >= 0 AND current_density_pct <= 100),
    status_color block_status NOT NULL DEFAULT 'GREEN',
    is_open BOOLEAN NOT NULL DEFAULT TRUE,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==========================================
-- TABLE: event_logs (Enterprise Audit Trail)
-- ==========================================
CREATE TABLE event_logs (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    event_type event_type NOT NULL,
    ai_action_taken TEXT NOT NULL,
    target_block_id VARCHAR(50) REFERENCES stadium_blocks(block_id) ON DELETE SET NULL,
    admin_approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    raw_payload JSONB
);

-- GIN Indexing for high-speed JSONB telemetry querying
CREATE INDEX idx_event_logs_raw_payload ON event_logs USING GIN (raw_payload);
CREATE INDEX idx_event_logs_timestamp ON event_logs USING btree(timestamp DESC);

-- ==========================================
-- TABLE: vanguard_bounties (Idempotent Gamification)
-- ==========================================
CREATE TABLE vanguard_bounties (
    bounty_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_gate VARCHAR(50) NOT NULL REFERENCES stadium_blocks(block_id) ON DELETE CASCADE,
    points_reward INTEGER NOT NULL CHECK (points_reward > 0),
    status bounty_status NOT NULL DEFAULT 'PENDING',
    idempotency_key UUID UNIQUE NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_bounties_user_status ON vanguard_bounties USING btree(user_id, status);

-- ==========================================
-- ATOMIC RPC: claim_vanguard_bounty
-- Prevents race conditions (double-spend) via row-level locking
-- ==========================================
CREATE OR REPLACE FUNCTION claim_vanguard_bounty(
    p_user_id UUID,
    p_bounty_id UUID,
    p_idempotency_key UUID
) RETURNS BOOLEAN AS $$
DECLARE
    v_points INTEGER;
    v_status bounty_status;
BEGIN
    -- Acquire row-level lock
    SELECT points_reward, status INTO v_points, v_status
    FROM vanguard_bounties
    WHERE bounty_id = p_bounty_id 
      AND user_id = p_user_id 
      AND idempotency_key = p_idempotency_key
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bounty not found or idempotency key mismatch.';
    END IF;

    IF v_status != 'PENDING' THEN
        RETURN FALSE; -- Already claimed or expired
    END IF;

    -- Update bounty status
    UPDATE vanguard_bounties
    SET status = 'COMPLETED'
    WHERE bounty_id = p_bounty_id;

    -- Increment user points atomically
    UPDATE users
    SET vanguard_points = vanguard_points + v_points
    WHERE id = p_user_id;

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

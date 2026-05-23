const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
function loadEnv() {
  let currentDir = __dirname;
  while (currentDir) {
    const envPath = path.join(currentDir, '.env.local');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) {
            value = value.slice(1, -1);
          } else if (value.startsWith("'") && value.endsWith("'")) {
            value = value.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = value.trim();
          }
        }
      });
      break;
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase credentials in .env.local. Please check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("🏏 Starting Aegis Stadium Mock Density Stream...");
console.log(`Supabase URL: ${supabaseUrl}`);

const gates = Array.from({ length: 8 }).map((_, i) => `GATE_${i + 1}`);
let iteration = 0;

async function updateDensities() {
  iteration++;
  console.log(`\n🔄 [Iteration ${iteration}] Pushing telemetry update...`);
  
  const updates = gates.map(gateId => {
    let density;
    
    // Crisis Trigger: Every 10th iteration, spike GATE_7 to 96%
    if (gateId === 'GATE_7' && iteration % 10 === 0) {
      density = 96;
      console.log(`🚨 [CRISIS TRIGGER] Spiking GATE_7 to ${density}%!`);
    } else {
      // Normal variation: between 15% and 82%
      density = Math.floor(Math.random() * (82 - 15 + 1)) + 15;
    }
    
    // Determine status color based on density threshold
    let statusColor = 'GREEN';
    if (density >= 95) {
      statusColor = 'RED';
    } else if (density >= 75) {
      statusColor = 'ORANGE';
    } else if (density >= 40) {
      statusColor = 'YELLOW';
    }
    
    return {
      block_id: gateId,
      current_density_pct: density,
      status_color: statusColor,
      is_open: true,
      last_updated: new Date().toISOString()
    };
  });

  // Upsert all stadium block values
  const { error } = await supabase
    .from('stadium_blocks')
    .upsert(updates, { onConflict: 'block_id' });

  if (error) {
    console.error("❌ Upsert failed:", error.message);
  } else {
    updates.forEach(up => {
      console.log(`   Gate ${up.block_id}: ${up.current_density_pct}% (${up.status_color})`);
    });
    console.log("✅ Telemetry batch updated successfully.");
  }
}

// Run immediately, then every 5 seconds
updateDensities();
setInterval(updateDensities, 5000);

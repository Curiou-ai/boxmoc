// Supabase Edge Function: alerts your phone when the Pi worker stops sending heartbeats.
// Must live OUTSIDE the Pi, since a dead Pi can't report its own death.
// Secrets: supabase secrets set NTFY_TOPIC=your-long-random-topic
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const STALE_AFTER_MS = 3 * 60 * 1000;          // 3 missed beats = dead
const PRINTER_OFFLINE_AFTER_MS = 5 * 60 * 1000; // worker alive but printer unreachable

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const NTFY_TOPIC = Deno.env.get('NTFY_TOPIC')!;

async function push(title: string, body: string, priority = 'high', tags = 'warning') {
  await fetch(`https://ntfy.sh/${NTFY_TOPIC}`, {
    method: 'POST',
    headers: { Title: title, Priority: priority, Tags: tags },
    body,
  });
}

Deno.serve(async () => {
  const { data: rows, error } = await supabase.from('worker_heartbeats').select('*');
  if (error) return new Response(error.message, { status: 500 });

  const now = Date.now();
  for (const w of rows ?? []) {
    const age = now - new Date(w.last_seen).getTime();
    const stale = age > STALE_AFTER_MS;
    const mins = Math.round(age / 60000);

    // Worker down / recovered
    if (stale && !w.alerted) {
      await push('🚨 Print worker offline', `${w.worker_id} silent for ${mins} min. Check the Pi.`, 'urgent', 'rotating_light');
      await supabase.from('worker_heartbeats').update({ alerted: true }).eq('worker_id', w.worker_id);
    } else if (!stale && w.alerted) {
      await push('✅ Print worker back online', `${w.worker_id} is sending heartbeats again.`, 'default', 'white_check_mark');
      await supabase.from('worker_heartbeats').update({ alerted: false }).eq('worker_id', w.worker_id);
    }

    // Worker alive, printer unreachable (only meaningful while worker is fresh)
    if (!stale) {
      if (!w.printer_connected && !w.printer_alerted && age < PRINTER_OFFLINE_AFTER_MS) {
        // Debounce: require it to still be disconnected on the next ticks via updated_at-free approach
        // (simple version: alert once when first seen disconnected for a full cron cycle)
        await push('⚠️ Printer unreachable', `${w.worker_id} is up but the Bambu P1S MQTT link is down.`);
        await supabase.from('worker_heartbeats').update({ printer_alerted: true }).eq('worker_id', w.worker_id);
      } else if (w.printer_connected && w.printer_alerted) {
        await supabase.from('worker_heartbeats').update({ printer_alerted: false }).eq('worker_id', w.worker_id);
      }
    }
  }
  return new Response('ok');
});
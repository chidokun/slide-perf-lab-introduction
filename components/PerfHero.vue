<script setup lang="ts">
// Animated "live load test" dashboard used on the cover and closing slides.
// Numbers are the real 16:13 run of PUT notification-settings TC01 (100 VUs, 1 min).
</script>

<template>
  <div class="perf-hero" aria-hidden="true">
    <svg viewBox="0 0 400 330" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ph-vu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.28" />
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0.02" />
        </linearGradient>
        <linearGradient id="ph-gauge" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="var(--cool)" />
          <stop offset="55%" stop-color="var(--accent-2)" />
          <stop offset="100%" stop-color="var(--red)" />
        </linearGradient>
        <clipPath id="ph-chart"><rect x="22" y="150" width="356" height="140" /></clipPath>
      </defs>

      <!-- card -->
      <rect class="card-bg" x="1" y="1" width="398" height="328" rx="18" />
      <circle cx="22" cy="22" r="4" fill="#ef8b80" />
      <circle cx="35" cy="22" r="4" fill="#f2c46b" />
      <circle cx="48" cy="22" r="4" fill="#7cc58a" />
      <text class="mono head" x="64" y="26">k6 run · 100 VUs · ramp-up 30s</text>
      <circle class="live-dot" cx="352" cy="22" r="3.5" />
      <text class="mono live" x="360" y="26">LIVE</text>
      <line class="sep" x1="1" y1="40" x2="399" y2="40" />

      <!-- stat chips -->
      <g class="chip c1">
        <rect x="20" y="56" width="104" height="40" rx="10" />
        <text class="lbl" x="32" y="72">RPS</text>
        <text class="val" x="32" y="89">1,175</text>
      </g>
      <g class="chip c2">
        <rect x="20" y="102" width="104" height="40" rx="10" />
        <text class="lbl" x="32" y="118">p95</text>
        <text class="val" x="32" y="135">122<tspan class="unit">ms</tspan></text>
      </g>
      <g class="chip c3">
        <rect x="132" y="56" width="104" height="40" rx="10" />
        <text class="lbl" x="144" y="72">ERRORS</text>
        <text class="val ok" x="144" y="89">0.00%</text>
      </g>
      <g class="chip c4">
        <rect x="132" y="102" width="104" height="40" rx="10" />
        <text class="lbl" x="144" y="118">REQUESTS</text>
        <text class="val" x="144" y="135">106,001</text>
      </g>

      <!-- gauge -->
      <g transform="translate(318 118)">
        <path class="gauge-track" d="M -58 0 A 58 58 0 0 1 58 0" />
        <path class="gauge-arc" d="M -58 0 A 58 58 0 0 1 58 0" />
        <g class="needle">
          <line x1="0" y1="0" x2="0" y2="-46" />
          <circle r="5" />
        </g>
        <text class="lbl" x="0" y="18" text-anchor="middle">LATENCY</text>
      </g>

      <!-- chart -->
      <g class="grid">
        <line x1="22" y1="185" x2="378" y2="185" />
        <line x1="22" y1="220" x2="378" y2="220" />
        <line x1="22" y1="255" x2="378" y2="255" />
        <line x1="22" y1="290" x2="378" y2="290" />
      </g>
      <g clip-path="url(#ph-chart)">
        <!-- VUs: ramp 0 → 100 then hold -->
        <path class="vu-area" d="M22 290 L92 168 L378 168 L378 290 Z" />
        <path class="vu-line" d="M22 290 L92 168 L378 168" />
        <!-- RPS bars -->
        <g class="bars">
          <rect v-for="(h, i) in [10, 18, 26, 32, 36, 38, 37, 39, 38, 40, 39, 38, 40, 39, 40, 38, 39, 40, 39, 40]"
                :key="i" :x="26 + i * 17.6" :y="290 - h" width="10" :height="h" rx="2"
                :style="{ animationDelay: (i * 0.06) + 's' }" />
        </g>
        <!-- p95 latency under the threshold -->
        <path class="p95"
              d="M22 262 L40 250 L58 236 L76 228 L94 222 L112 226 L130 219 L148 224 L166 217 L184 223 L202 216 L220 222 L238 218 L256 224 L274 215 L292 221 L310 217 L328 223 L346 216 L364 220 L378 218" />
        <line class="scan" x1="0" y1="150" x2="0" y2="290" />
      </g>
      <line class="threshold" x1="22" y1="196" x2="378" y2="196" />
      <text class="mono th-lbl" x="376" y="190" text-anchor="end">p95 &lt; 200ms</text>
      <text class="mono axis" x="24" y="306">0s</text>
      <text class="mono axis" x="86" y="306">30s</text>
      <text class="mono axis" x="376" y="306" text-anchor="end">1m</text>
      <g class="legend">
        <rect x="120" y="300" width="8" height="8" rx="2" class="lg-vu" />
        <text class="mono axis" x="132" y="307">VUs</text>
        <rect x="168" y="300" width="8" height="8" rx="2" class="lg-rps" />
        <text class="mono axis" x="180" y="307">RPS</text>
        <rect x="216" y="300" width="8" height="8" rx="2" class="lg-p95" />
        <text class="mono axis" x="228" y="307">p95</text>
      </g>
    </svg>
    <div class="pass-badge">✓ thresholds passed</div>
  </div>
</template>

<style scoped>
.perf-hero {
  position: absolute;
  right: 2.4rem;
  top: 50%;
  width: 360px;
  transform: translateY(-50%);
  pointer-events: none;
}
svg { display: block; width: 100%; overflow: visible; filter: drop-shadow(0 18px 34px rgba(29, 27, 38, 0.12)); }
.card-bg { fill: var(--panel); stroke: var(--line); }
.sep { stroke: var(--line); }
.mono { font-family: 'JetBrains Mono', monospace; }
.head { font-size: 10px; fill: var(--muted); }
.live { font-size: 9px; font-weight: 700; fill: var(--red); }
.live-dot { fill: var(--red); animation: blink 1.2s ease-in-out infinite; }

.chip rect { fill: var(--prompt-bg); }
.chip .lbl, .lbl { font: 600 8px 'Be Vietnam Pro', sans-serif; letter-spacing: 0.12em; fill: var(--muted); }
.chip .val { font: 800 15px 'Be Vietnam Pro', sans-serif; fill: var(--text); }
.chip .val.ok { fill: var(--cool); }
.chip .unit { font-size: 9px; font-weight: 600; fill: var(--muted); }
.chip { opacity: 0; animation: chip-in 0.5s ease-out forwards; }
.chip.c2 { animation-delay: 0.15s; }
.chip.c3 { animation-delay: 0.3s; }
.chip.c4 { animation-delay: 0.45s; }

.gauge-track { fill: none; stroke: var(--row-line); stroke-width: 11; stroke-linecap: round; }
.gauge-arc { fill: none; stroke: url(#ph-gauge); stroke-width: 11; stroke-linecap: round; opacity: 0.9; }
.needle line { stroke: var(--text); stroke-width: 3; stroke-linecap: round; }
.needle circle { fill: var(--text); }
.needle { animation: needle 3.2s ease-in-out infinite alternate; transform-origin: 0 0; }

.grid line { stroke: var(--row-line); }
.vu-area { fill: url(#ph-vu); }
.vu-line { fill: none; stroke: var(--accent); stroke-width: 2; stroke-dasharray: 4 4; opacity: 0.7; }
.bars rect { fill: var(--cool); opacity: 0.35; transform-box: fill-box; transform-origin: bottom; animation: grow 0.6s ease-out both; }
.p95 {
  fill: none;
  stroke: var(--violet);
  stroke-width: 2.6;
  stroke-linejoin: round;
  stroke-linecap: round;
  stroke-dasharray: 520;
  stroke-dashoffset: 520;
  animation: draw 2.4s ease-out 0.4s forwards;
}
.scan { stroke: var(--accent); stroke-width: 1.5; opacity: 0.5; animation: scan 4s linear infinite; }
.threshold { stroke: var(--red); stroke-width: 1.5; stroke-dasharray: 6 5; }
.th-lbl { font-size: 9px; font-weight: 700; fill: var(--red); }
.axis { font-size: 8px; fill: var(--muted); }
.lg-vu { fill: var(--accent); opacity: 0.5; }
.lg-rps { fill: var(--cool); opacity: 0.5; }
.lg-p95 { fill: var(--violet); }

.pass-badge {
  position: absolute;
  left: -18px;
  bottom: 54px;
  padding: 0.38rem 0.8rem;
  border-radius: 999px;
  background: var(--cool);
  color: var(--on-accent);
  font: 700 0.72rem 'Be Vietnam Pro', sans-serif;
  box-shadow: 0 8px 20px rgba(35, 129, 138, 0.3);
  animation: badge 0.5s ease-out 2.6s both, float 3s ease-in-out 3.2s infinite;
}

@keyframes blink { 50% { opacity: 0.25; } }
@keyframes chip-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
@keyframes needle { from { transform: rotate(-68deg); } to { transform: rotate(-40deg); } }
@keyframes grow { from { transform: scaleY(0); } to { transform: scaleY(1); } }
@keyframes draw { to { stroke-dashoffset: 0; } }
@keyframes scan { from { transform: translateX(22px); } to { transform: translateX(378px); } }
@keyframes badge { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
@keyframes float { 50% { transform: translateY(-5px); } }
</style>

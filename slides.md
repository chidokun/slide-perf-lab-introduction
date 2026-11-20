---
theme: default
title: Perf Lab — Performance test tại local, có AI đồng hành
info: |
  Giới thiệu Perf Lab qua một câu chuyện thật: trả lời câu hỏi
  "API này chịu được bao nhiêu tải?" cho dự án trong một ngày, với AI hỗ trợ.
  Song ngữ Tiếng Việt / English: chọn ngôn ngữ ở slide đầu, hoặc thêm ?lang=en vào URL.
colorSchema: light
transition: slide-left
mdc: true
fonts:
  sans: Be Vietnam Pro
  mono: JetBrains Mono
  weights: '300,400,600,700,800'
layout: default
class: cover-x
---

<LangSwitch />

<PerfHero />

<div class="cover-text">

<div class="eyebrow"><Vi>Giới thiệu công cụ</Vi><En>Tool introduction</En></div>

<div class="brand">Perf Lab</div>

<h1 class="cover-title"><Vi>Local performance test giờ dễ như <span class="accent">uống <span class="nowrap">trà sữa 🧋</span></span></Vi><En>Local performance testing, now as easy as <span class="accent">sipping <span class="nowrap">bubble tea 🧋</span></span></En></h1>

<p class="subtitle"><Vi>Perf Lab với sự kết hợp của AI, giúp tối ưu công việc mất thời gian, lặp đi lặp lại.</Vi><En>Perf Lab, combined with AI, streamlines the slow and repetitive parts of the job.</En></p>

<div class="presenter">
  <img src="./images/avatar.jpg" alt="Nguyen Le Hoang Tuan (Jeremy)" />
  <div>
    <div class="presenter-label"><Vi>Người trình bày</Vi><En>Presenter</En></div>
    <div class="presenter-name">Nguyen Le Hoang Tuan (Jeremy)</div>
    <div class="presenter-role">Back-end Engineer</div>
  </div>
</div>

</div>

<!--
VI: Hôm nay không liệt kê tính năng, mà kể lại một ngày thật: dùng Perf Lab trả lời một câu hỏi hiệu năng cho dự án.
EN: Instead of listing features, we'll replay one real day: using Perf Lab to answer a performance question for our project.
-->

---

<div class="eyebrow"><Vi>Mọi chuyện bắt đầu từ một câu hỏi</Vi><En>It starts with a question</En></div>

# <Vi>Một câu hỏi tưởng đơn giản</Vi><En>A question that sounds simple</En>

<div class="ask">
<img class="asker" src="/images/asker.webp" alt="" />
<div class="question">
  <span class="q-mark">“</span>
  <p><Vi>API <code>PUT /notification-settings</code> có chịu được <strong>100 người dùng ghi đồng thời</strong>, với <strong>p95 dưới 200ms</strong> không?</Vi><En>Can <code>PUT /notification-settings</code> handle <strong>100 users writing at once</strong>, with <strong>p95 under 200ms</strong>?</En></p>
</div>
</div>

<p class="mt-7 lead"><Vi>Để trả lời cho có cơ sở, phải làm đủ 5 việc:</Vi><En>To answer it with evidence, you have to do 5 things:</En></p>

<div class="chips5 mt-3">
  <div><span>1</span><Vi>Dựng hạ tầng</Vi><En>Stand up infra</En></div>
  <div><span>2</span><Vi>Hiểu luồng code</Vi><En>Understand the code path</En></div>
  <div><span>3</span><Vi>Chuẩn bị data + viết script</Vi><En>Prepare data + write the script</En></div>
  <div><span>4</span><Vi>Chạy tải</Vi><En>Run the load</En></div>
  <div><span>5</span><Vi>Đọc & chia sẻ kết quả</Vi><En>Read & share results</En></div>
</div>

<!--
VI: Câu hỏi này là câu hỏi thật của team ngày 17/11. Cả bài sẽ đi theo đúng 5 việc này.
EN: This was the team's real question on Nov 17. The whole talk follows these 5 steps.
-->

---

<div class="eyebrow"><Vi>Trước đây</Vi><En>Before</En></div>

# <Vi>Những việc thủ công mất thời gian</Vi><En>Manual work that eats up time</En>

<div class="flow mt-4">
  <div class="card step pain-step">
    <div class="num">1</div>
    <h3><Vi>Dựng hạ tầng</Vi><En>Infra</En></h3>
    <p><Vi>10 thành phần (Mongo, Redis, Kafka, WireMock…) + 7 module. Mỗi máy một kiểu, lỗi port và config.</Vi><En>10 components (Mongo, Redis, Kafka, WireMock…) + 7 modules. Every machine differs; port and config errors.</En></p>
  </div>
  <div class="arrow">→</div>
  <div class="card step pain-step">
    <div class="num">2</div>
    <h3><Vi>Hiểu code</Vi><En>Code path</En></h3>
    <p><Vi>Lần controller → service → cache / DB / Feign bằng tay. Dễ bỏ sót nhánh quan trọng.</Vi><En>Trace controller → service → cache / DB / Feign by hand. Easy to miss key branches.</En></p>
  </div>
  <div class="arrow">→</div>
  <div class="card step pain-step">
    <div class="num">3</div>
    <h3><Vi>Data + script</Vi><En>Data + script</En></h3>
    <p><Vi>Seed Mongo, tạo token, stub WireMock, viết k6 từ đầu cho từng case.</Vi><En>Seed Mongo, mint tokens, stub WireMock, write k6 from scratch per case.</En></p>
  </div>
  <div class="arrow">→</div>
  <div class="card step pain-step">
    <div class="num">4</div>
    <h3><Vi>Chạy tải</Vi><En>Run</En></h3>
    <p><Vi>Gõ tay <code>BASE_URL</code>, <code>SEED_FILE</code>, VUs. Quên seed là mất trắng một lần chạy 10 phút.</Vi><En>Hand-typed <code>BASE_URL</code>, <code>SEED_FILE</code>, VUs. Forget the seed and a 10-minute run is wasted.</En></p>
  </div>
  <div class="arrow">→</div>
  <div class="card step pain-step">
    <div class="num">5</div>
    <h3><Vi>Kết quả</Vi><En>Results</En></h3>
    <p><Vi>Summary trong terminal, chụp màn hình gửi chat. Không biết commit, flag nào; không so được lần trước.</Vi><En>Summary in the terminal, screenshots in chat. Unknown commit or flags; no comparison with last time.</En></p>
  </div>
</div>

<div class="pain-row mt-5">
<img class="thinker" src="/images/thinker.webp" alt="" />
<div class="pain-list">
  <div class="callout"><span class="red">✕</span> <Vi>Tri thức nằm trong đầu <strong>người từng làm</strong></Vi><En>Know-how lives with <strong>whoever did it last</strong></En></div>
  <div class="callout"><span class="red">✕</span> <Vi>Fail thì <strong>đọc log bằng mắt</strong>, đoán nguyên nhân</Vi><En>Failures mean <strong>eyeballing logs</strong> and guessing</En></div>
  <div class="callout"><span class="red">✕</span> <Vi>Kết quả <strong>không lặp lại, không so sánh</strong> được</Vi><En>Results are <strong>not reproducible or comparable</strong></En></div>
</div>
</div>

<!--
VI: Hệ quả: perf test thường bị làm muộn, làm ít, và không ai muốn làm lại.
EN: The result: perf tests get done late, done rarely, and nobody wants to redo them.
-->

---

<div class="eyebrow"><Vi>Ý tưởng</Vi><En>The idea</En></div>

# <Vi>Một công cụ kết hợp với AI</Vi><En>A tool combined with AI</En>

<div class="ask ask-sm">
<img class="asker" src="/images/thumbsup.webp" alt="" />
<div class="question">
  <span class="q-mark">“</span>
  <p><Vi>Một công cụ kết hợp với AI, giúp tự động hóa việc dựng hạ tầng, quản lý việc performance test sẽ rất hữu ích</Vi><En>A tool combined with AI that automates infra setup and manages performance tests would be really useful</En></p>
</div>
</div>

<div class="grid grid-cols-3 gap-4 mt-6">
  <div class="card who">
    <div class="who-head"><span class="who-ico">🛠️</span>
    <h3><Vi>Perf Lab lo phần lặp lại</Vi><En>Perf Lab does the plumbing</En></h3></div>
    <ul>
      <li><Vi>Dựng stack bằng một click</Vi><En>One-click stack</En></li>
      <li><Vi>Tự điền env, tự seed data</Vi><En>Auto env, auto seed data</En></li>
      <li><Vi>Lưu mọi run kèm ngữ cảnh</Vi><En>Every run kept with context</En></li>
      <li><Vi>So sánh run, publish cho team</Vi><En>Compare runs, publish to the team</En></li>
    </ul>
  </div>
  <div class="card who hl">
    <div class="who-head"><span class="who-ico">✨</span>
    <h3><Vi>AI lo phần đọc</Vi><En>AI does the reading</En></h3></div>
    <ul>
      <li><Vi>Đọc code, trace luồng dữ liệu</Vi><En>Reads code, traces the data path</En></li>
      <li><Vi>Đề xuất test case + test data</Vi><En>Proposes cases + test data</En></li>
      <li><Vi>Viết k6 script và fixture</Vi><En>Writes k6 scripts and fixtures</En></li>
      <li><Vi>Đọc log, tìm nguyên nhân fail</Vi><En>Reads logs, finds why runs fail</En></li>
    </ul>
  </div>
  <div class="card who">
    <div class="who-head"><span class="who-ico">🧑‍💻</span>
    <h3><Vi>Người lo phần quyết định</Vi><En>People make the calls</En></h3></div>
    <ul>
      <li><Vi>Chọn case nào đáng test</Vi><En>Choose which cases matter</En></li>
      <li><Vi>Duyệt trước khi AI ghi file</Vi><En>Approve before the AI writes</En></li>
      <li><Vi>Cho phép từng lệnh nhạy cảm</Vi><En>Allow each sensitive command</En></li>
      <li><Vi>Kết luận từ số liệu</Vi><En>Draw conclusions from the data</En></li>
    </ul>
  </div>
</div>

---

<div class="eyebrow"><Vi>Perf Lab</Vi><En>Perf Lab</En></div>

# <Vi>Perf Lab - Công cụ chạy ngay ở local</Vi><En>Perf Lab - A tool that runs locally</En>

<div class="grid grid-cols-[1.35fr_1fr] gap-6 items-center mt-2">
<div class="arch">
  <div class="arch-top">
    <div class="node">🧑‍💻 Engineer</div>
    <span class="harrow">→</span>
    <div class="node main">Perf Lab UI<small>Infra · APIs · Scripts · Runs · Settings</small></div>
  </div>
  <div class="arch-cols">
    <div class="arch-col">
      <span class="varrow">↓ <em>queue run</em></span>
      <div class="node">Worker<small>Bun + k6</small></div>
      <span class="varrow">↓ <em>load</em></span>
      <div class="node db">API services<small>+ Docker infra</small></div>
    </div>
    <div class="arch-col">
      <span class="varrow">↕ <em>claude -p stream</em></span>
      <div class="node ai">✨ Claude Code<small>AI agents</small></div>
      <span class="varrow">↓ <em>read code</em></span>
      <div class="node db">Service repo<small>+ Perf Lab repo</small></div>
    </div>
    <div class="arch-col">
      <span class="varrow">↓ <em>save</em></span>
      <div class="node">results/&lt;run-id&gt;<small>meta · summary · metrics</small></div>
      <span class="varrow">↓ <em>git publish</em></span>
      <div class="node db">GitLab Pages<small>team-wide view</small></div>
    </div>
  </div>
</div>
<div class="flex flex-col gap-3">
  <div class="card"><h3 class="accent">UI</h3><p><Vi>Quản lý trạng thái hạ tầng, Test case và Kết quả test.</Vi><En>Manage infra status, test cases and test results.</En></p></div>
  <div class="card"><h3 class="accent">Worker</h3><p><Vi>Nhận run từ hàng đợi, chạy k6, stream log. Cho phép nhiều worker phân bổ VUs.</Vi><En>Claims runs from a queue, runs k6, streams logs. Multiple workers can share the VUs.</En></p></div>
  <div class="card hl"><h3 class="accent">AI Agents</h3><p><Vi>Đọc được cả <strong>test case</strong> và <strong>source code</strong> của bạn.</Vi><En>Reads both your <strong>test cases</strong> and your <strong>source code</strong>.</En></p></div>
</div>
</div>

<!--
VI: Đây là bộ đồ nghề. Giờ quay lại câu hỏi ban đầu và xem nó chạy thật thế nào.
EN: That's the toolkit. Now back to the question, and how it played out for real.
-->

---

<div class="eyebrow"><Vi>Tab Infra · Dựng hạ tầng</Vi><En>Infra tab · Stand up the stack</En></div>

# <Vi>Dựng và quản lý cả hạ tầng một cách đơn giản</Vi><En>Set up and manage the whole infrastructure, simply</En>

<div class="tour6" style="--t6: 20s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: ti-step1">
      <span class="t6-num" style="animation-name: ti-num1">1</span>
      <div>
        <h3><Vi>Settings: trỏ tới repo service</Vi><En>Settings: point to your repo</En></h3>
        <p><Vi>Repo path + script start, cấu hình một lần trên máy bạn.</Vi><En>Repo path + start script, set once on your machine.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: ti-step2">
      <span class="t6-num" style="animation-name: ti-num2">2</span>
      <div>
        <h3><Vi>Quản lý infra và các module</Vi><En>Manage infra and modules</En></h3>
        <p><Vi>Health của 10 thành phần + 7 module, start / stop từng module.</Vi><En>Health for 10 components + 7 modules; start / stop each module.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: ti-step3">
      <span class="t6-num" style="animation-name: ti-num3">3</span>
      <div>
        <h3><Vi>Start: Host jars hoặc Docker</Vi><En>Start: host jars or Docker</En></h3>
        <p><Vi>Chọn runtime, build jar hay bỏ qua, rồi <strong>Start all</strong>.</Vi><En>Pick the runtime, build the jar or skip, then <strong>Start all</strong>.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: ti-step4">
      <span class="t6-num" style="animation-name: ti-num4">4</span>
      <div>
        <h3><Vi>Log và limit cho container</Vi><En>Logs and container limits</En></h3>
        <p><Vi>Click module để xem log realtime; tab Config đặt CPU / RAM cho Docker.</Vi><En>Click a module for live logs; the Config tab sets Docker CPU / RAM.</En></p>
      </div>
    </div>
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: ti-u1">localhost:5280/settings</span>
      <span class="t6-url" style="animation-name: ti-u2">localhost:5280/infra</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.79">
      <div class="t6-scene" style="animation-name: ti-sc1">
        <div class="t6-img framed" style="width: 78%">
          <img src="/screens/settings-repo.png" alt="Settings: stack and repo" />
          <div class="t6-ring" style="animation-name: ti-r-repo; left: 3.9%; top: 48.2%; width: 92.2%; height: 9.2%"></div>
          <div class="t6-ring" style="animation-name: ti-r-script; left: 3.9%; top: 73.8%; width: 92.2%; height: 9.2%"></div>
          <div class="t6-cursor" style="animation-name: ti-c1"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: ti-k1"></i></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: ti-sc2">
        <div class="t6-img" style="width: 100%; animation-name: ti-zoom; transform-origin: 55% 12%">
          <img src="/screens/infra-overview.png" alt="Infra tab: workers, infra health, API modules" />
          <div class="t6-ring" style="animation-name: ti-r-infra; left: 2.1%; top: 29.6%; width: 95.9%; height: 24.2%"></div>
          <div class="t6-hint" style="animation-name: ti-h-infra; left: 40%; top: 29.4%"><Vi>10 thành phần · health realtime</Vi><En>10 components · live health</En></div>
          <div class="t6-ring" style="animation-name: ti-r-mod; left: 2.1%; top: 55.7%; width: 95.9%; height: 19.5%"></div>
          <div class="t6-hint" style="animation-name: ti-h-mod; left: 33%; top: 55.4%"><Vi>▶ / ■ từng module</Vi><En>▶ / ■ each module</En></div>
        </div>
        <div class="t6-layer">
          <div class="t6-ring" style="animation-name: ti-r-rt; left: 21.8%; top: 6.7%; width: 30.8%; height: 9.9%"></div>
          <div class="t6-hint" style="animation-name: ti-h-rt; left: 22%; top: 19%"><b>↑</b> <Vi>Host jars hoặc Docker</Vi><En>Host jars or Docker</En></div>
          <div class="t6-ring" style="animation-name: ti-r-start; left: 82.7%; top: 6.9%; width: 15%; height: 9.2%"></div>
          <div class="t6-cursor" style="animation-name: ti-c3"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: ti-k3"></i></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: ti-sc4">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/infra-log.png" alt="Infra tab with the API module log panel" />
          <div class="t6-ring" style="animation-name: ti-r-notif; left: 38%; top: 78.4%; width: 17.2%; height: 6.8%"></div>
          <div class="t6-ring" style="animation-name: ti-r-panel; left: 56.8%; top: 16.2%; width: 41.2%; height: 83.3%"></div>
          <div class="t6-hint" style="animation-name: ti-h-log; right: 45%; top: 40%"><Vi>Log realtime · ✨ AI analyze</Vi><En>Live log · ✨ AI analyze</En> <b>→</b></div>
          <div class="t6-ring" style="animation-name: ti-r-cfg; left: 63.1%; top: 26.1%; width: 6.2%; height: 3.9%"></div>
          <div class="t6-cursor" style="animation-name: ti-c4"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: ti-k4"></i></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: ti-sc5">
        <div class="t6-img framed crop" style="width: 54%; --crop: 1120 / 1027">
          <img src="/screens/infra-config.png" alt="Docker CPU and RAM limits for the API module" />
          <div class="t6-ring" style="animation-name: ti-r-cpu; left: 3%; top: 43.9%; width: 93.9%; height: 8.2%"></div>
          <div class="t6-ring" style="animation-name: ti-r-ram; left: 3%; top: 67.9%; width: 93.9%; height: 8.2%"></div>
          <div class="t6-ring" style="animation-name: ti-r-restart; left: 17.7%; top: 89.9%; width: 23.2%; height: 6.2%"></div>
          <div class="t6-tag yes" style="animation-name: ti-t-restart; left: 44%; top: 90%">↻ <Vi>áp dụng limit ngay</Vi><En>applies the limit now</En></div>
          <div class="t6-cursor" style="animation-name: ti-c5"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: ti-k5"></i></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: Trỏ Perf Lab tới repo một lần. Từ đó tab Infra dùng đúng script start của repo: chọn chạy module dạng jar trên máy hoặc Docker, xem health, log, và giới hạn CPU/RAM cho từng container để đo sát môi trường thật.
EN: Point Perf Lab at the repo once. The Infra tab then uses the repo's own start script: run modules as host jars or in Docker, watch health and logs, and cap each container's CPU/RAM to match production more closely.
-->

---

<div class="eyebrow"><Vi>Tab APIs · Chọn API cần test</Vi><En>APIs tab · Pick what to test</En></div>

# <Vi>Thấy hết API, biết API nào đã có test case</Vi><En>See every API, and which ones have test cases</En>

<div class="tour6" style="--t6: 10s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: ta-step1">
      <span class="t6-num" style="animation-name: ta-num1">1</span>
      <div>
        <h3><Vi>APIs: chọn một module</Vi><En>APIs: pick a module</En></h3>
        <p><Vi>Mỗi module một thẻ, danh sách endpoint đọc từ OpenAPI.</Vi><En>One tile per module; endpoints are read from OpenAPI.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: ta-step2">
      <span class="t6-num" style="animation-name: ta-num2">2</span>
      <div>
        <h3><Vi>Thấy API nào đã có test case</Vi><En>See which APIs are covered</En></h3>
        <p class="t6-legend"><span class="cov yes"></span><Vi><strong>Đã có</strong>: mở từng TC, chạy ngay</Vi><En><strong>Covered</strong>: open each TC, run it</En></p>
        <p class="t6-legend"><span class="cov no"></span><Vi><strong>Chưa có</strong>: bấm <span class="accent">✨ AI</span> để thiết kế</Vi><En><strong>Not yet</strong>: hit <span class="accent">✨ AI</span> to design</En></p>
      </div>
    </div>
    <img class="side-char" src="/images/relax.webp" alt="" />
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: ta-u1">localhost:5280/apis</span>
      <span class="t6-url" style="animation-name: ta-u2">localhost:5280/apis/<span class="redact" aria-hidden="true">xxxxxxxxxxxx</span>-api</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.95">
      <div class="t6-scene" style="animation-name: ta-scA">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/apis-catalog.png" alt="APIs: one tile per module" />
          <div class="t6-ring" style="animation-name: ta-r-tile; left: 26.6%; top: 64.2%; width: 22.8%; height: 23.1%; border-radius: 14px"></div>
          <div class="t6-hint" style="animation-name: ta-h-tile; left: 51%; top: 70%"><b>←</b> <Vi>Click vào module</Vi><En>Click the module</En></div>
          <div class="t6-cursor" style="animation-name: ta-c"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: ta-k"></i></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: ta-scB; transform-origin: 50% 20%">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/apis-coverage.png" alt="Endpoints with test coverage marked" />
          <div class="t6-tag yes" style="animation-name: ta-t-yes; left: 71.5%; top: 15.5%">✓ <Vi>4 test case</Vi><En>4 test cases</En></div>
          <div class="t6-tag no" style="animation-name: ta-t-no; left: 55%; top: 57.5%">✕ <Vi>chưa có test case</Vi><En>no test case yet</En></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: Endpoint lấy từ OpenAPI của từng module, script tự gắn vào endpoint qua header @source / @endpoint. Lọc "No script" là thấy ngay chỗ còn trống.
EN: Endpoints come from each module's OpenAPI; scripts attach to endpoints via @source / @endpoint headers. Filter "No script" to see the gaps.
-->

---

<div class="eyebrow"><Vi>AI test designer · Test case & data seed</Vi><En>AI test designer · Test cases & seed data</En></div>

# <Vi>Chưa có test case? Chat với AI ngay</Vi><En>No test cases yet? Chat with the AI right away</En>

<div class="tour6" style="--t6: 24s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: td-step1">
      <span class="t6-num" style="animation-name: td-num1">1</span>
      <div>
        <h3><Vi>Bấm ✨ AI trên endpoint</Vi><En>Hit ✨ AI on the endpoint</En></h3>
        <p><Vi>Mỗi endpoint một phiên chat riêng, quay lại là tiếp tục.</Vi><En>One chat per endpoint; come back and it resumes.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: td-step2">
      <span class="t6-num" style="animation-name: td-num2">2</span>
      <div>
        <h3><Vi>Nhắn yêu cầu, AI đọc source</Vi><En>Ask, and the AI reads the source</En></h3>
        <p><Vi>Trace controller → service → cache → DB, dẫn từng <strong>file:line</strong>.</Vi><En>Traces controller → service → cache → DB, citing each <strong>file:line</strong>.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: td-step3">
      <span class="t6-num" style="animation-name: td-num3">3</span>
      <div>
        <h3><Vi>AI đề xuất, bạn chốt</Vi><En>The AI proposes, you decide</En></h3>
        <p><Vi>8 test case + test data cần chuẩn bị; bạn tick chọn case trong tab Plan.</Vi><En>8 test cases + the data they need; you tick the ones to keep in Plan.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: td-step4">
      <span class="t6-num" style="animation-name: td-num4">4</span>
      <div>
        <h3><Vi>Approve & write</Vi><En>Approve & write</En></h3>
        <p><Vi>AI viết script k6 và <strong>data seed</strong>; endpoint hiện ngay 4 test case.</Vi><En>The AI writes the k6 scripts and the <strong>seed data</strong>; the endpoint shows 4 test cases.</En></p>
      </div>
    </div>
    <div class="callout"><Vi>🔒 AI chỉ được đọc cho tới khi bạn bấm <strong>Approve & write</strong>.</Vi><En>🔒 The AI is read-only until you hit <strong>Approve & write</strong>.</En></div>
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: td-u1">localhost:5280/apis/<span class="redact" aria-hidden="true">xxxxxxxxxxxx</span>-api</span>
      <span class="t6-url" style="animation-name: td-u2">PUT <span class="redact" aria-hidden="true">/xxxx/xx/xx</span>/notification-settings · ✨ AI test designer</span>
      <span class="t6-url" style="animation-name: td-u3">localhost:5280/apis/<span class="redact" aria-hidden="true">xxxxxxxxxxxx</span>-api</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.6">
      <div class="t6-scene" style="animation-name: td-sc1">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/designer-list.png" alt="API module endpoints at 10:30, PUT has no script yet" />
          <div class="t6-ring" style="animation-name: td-r-row; left: 17.6%; top: 21.2%; width: 82.4%; height: 13%"></div>
          <div class="t6-hint" style="animation-name: td-h-ai; right: 1%; top: 37%"><b>↑</b> <Vi>Chưa có test case? Bấm ✨ AI</Vi><En>No test cases? Hit ✨ AI</En></div>
          <div class="t6-cursor" style="animation-name: td-c1"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: td-k1"></i></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: td-sc2">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/designer-prompt.png" alt="Your request to the AI test designer" />
          <div class="t6-ring" style="animation-name: td-r-prompt; left: 15.8%; top: 33%; width: 79.8%; height: 16.2%"></div>
          <div class="t6-hint" style="animation-name: td-h-prompt; left: 2%; top: 26%"><Vi>Bạn nhắn yêu cầu</Vi><En>Your request</En> <b>→</b></div>
          <div class="t6-ring" style="animation-name: td-r-tools; left: 2.5%; top: 55.3%; width: 95%; height: 7.3%"></div>
          <div class="t6-hint" style="animation-name: td-h-tools; right: 3%; top: 56.2%"><Vi>AI tự đọc 17 file source</Vi><En>The AI reads 17 source files</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: td-sc3">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/ai-designer.png" alt="The traced code flow with file:line references" />
          <div class="t6-ring" style="animation-name: td-r-ln1; left: 2.3%; top: 49%; width: 49%; height: 4%"></div>
          <div class="t6-ring" style="animation-name: td-r-ln2; left: 2.3%; top: 65.3%; width: 45%; height: 4%"></div>
          <div class="t6-hint" style="animation-name: td-h-flow; left: 55%; top: 49.3%"><b>←</b> <Vi>dẫn từng file:line</Vi><En>cites file:line</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: td-sc4">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/designer-cases.png" alt="Proposed test cases" />
          <div class="t6-ring" style="animation-name: td-r-cases; left: 2.3%; top: 37%; width: 95.3%; height: 62%"></div>
          <div class="t6-hint" style="animation-name: td-h-cases; right: 3%; top: 30.5%"><Vi>8 test case đề xuất</Vi><En>8 proposed test cases</En></div>
          <div class="t6-hint" style="animation-name: td-h-data; right: 3%; top: 88%"><Vi>+ test data cần chuẩn bị</Vi><En>+ the test data they need</En> <b>↓</b></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: td-sc5">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/ai-plan.png" alt="Plan tab: chosen test cases" />
          <div class="t6-ring" style="animation-name: td-r-tc1; left: 3.4%; top: 38.6%; width: 63%; height: 4.8%"></div>
          <div class="t6-ring" style="animation-name: td-r-tc2; left: 3.4%; top: 68.3%; width: 49%; height: 4.8%"></div>
          <div class="t6-hint" style="animation-name: td-h-pick; right: 3%; top: 30.5%"><Vi>Bạn tick chọn 4 / 8 case</Vi><En>You keep 4 of 8 cases</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: td-sc6">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/plan-data.png" alt="Plan tab: test data and seed commands" />
          <div class="t6-ring" style="animation-name: td-r-d1; left: 3.6%; top: 47.6%; width: 92.8%; height: 9.4%"></div>
          <div class="t6-ring" style="animation-name: td-r-d2; left: 3.6%; top: 76.4%; width: 92.8%; height: 9.4%"></div>
          <div class="t6-hint" style="animation-name: td-h-seed; right: 3%; top: 30.5%"><Vi>Lệnh seed + file seed sẵn sàng</Vi><En>Seed commands + seed file ready</En></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: td-sc7">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/apis-coverage.png" alt="PUT now has 4 test cases" />
          <div class="t6-tag yes" style="animation-name: td-t-done; left: 71.5%; top: 15.5%">✓ <Vi>4 script + seed đã ghi</Vi><En>4 scripts + seed written</En></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: Trước đây phải tự lần code và tự viết seed. Giờ chat với AI ngay trên endpoint: AI đọc source, đề xuất case và data, bạn chỉ việc chọn và duyệt. Ảnh danh sách đầu tiên tái hiện lúc 10:30, khi PUT chưa có script.
EN: You used to trace the code and write the seed by hand. Now you chat with the AI right on the endpoint: it reads the source and proposes cases and data; you pick and approve. The first list view recreates 10:30, before PUT had any script.
-->

---

<div class="eyebrow"><Vi>Tab Scripts · Review script & chạy</Vi><En>Scripts tab · Review & run</En></div>

# <Vi>Script sẵn sàng để bạn review</Vi><En>Scripts ready for your review</En>

<div class="tour6" style="--t6: 24s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: tr-step1">
      <span class="t6-num" style="animation-name: tr-num1">1</span>
      <div>
        <h3><Vi>Mở script AI vừa viết</Vi><En>Open the script the AI wrote</En></h3>
        <p><Vi>Từ endpoint hoặc tab Scripts; mỗi test case một file k6.</Vi><En>From the endpoint or the Scripts tab; one k6 file per case.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tr-step2">
      <span class="t6-num" style="animation-name: tr-num2">2</span>
      <div>
        <h3><Vi>Đọc sequence diagram</Vi><En>Read the sequence diagram</En></h3>
        <p><Vi>Luồng request qua API, cache, DB; thấy trước chỗ chịu tải.</Vi><En>The request path through API, cache, DB; see where load lands.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tr-step3">
      <span class="t6-num" style="animation-name: tr-num3">3</span>
      <div>
        <h3><Vi>Review source, hỏi AI</Vi><En>Review the source, ask the AI</En></h3>
        <p><Vi>Code k6 thật, sửa được; ✨ AI explain giải thích và sửa theo yêu cầu.</Vi><En>Real k6 code you can edit; ✨ AI explain answers and edits on request.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tr-step4">
      <span class="t6-num" style="animation-name: tr-num4">4</span>
      <div>
        <h3><Vi>Bấm Run</Vi><En>Hit Run</En></h3>
        <p><Vi>Tool tự điền vào các thông số của service, bạn chỉ cần control VUs và Duration.</Vi><En>The tool fills in the service settings; you only control VUs and Duration.</En></p>
      </div>
    </div>
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: tr-u1">localhost:5280/apis/<span class="redact" aria-hidden="true">xxxxxxxxxxxx</span>-api</span>
      <span class="t6-url" style="animation-name: tr-u2">localhost:5280/scripts/view?path=…TC01_first-write.js</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.6">
      <div class="t6-scene top" style="animation-name: tr-sc1">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/apis-coverage.png" alt="PUT row with its 4 test case scripts" />
          <div class="t6-ring" style="animation-name: tr-r-link; left: 51%; top: 24%; width: 19%; height: 5.4%"></div>
          <div class="t6-hint" style="animation-name: tr-h-link; left: 26%; top: 31%"><Vi>Mở script TC01 để review</Vi><En>Open TC01 to review</En> <b>↗</b></div>
          <div class="t6-cursor" style="animation-name: tr-c1"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: tr-k1"></i></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tr-sc2">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/script-head.png" alt="Script page: header, actions and sequence diagram" />
          <div class="t6-ring" style="animation-name: tr-r-seq; left: 5%; top: 37.4%; width: 90%; height: 61%"></div>
          <div class="t6-hint" style="animation-name: tr-h-seq; left: 52%; top: 40.5%"><Vi>Sequence diagram nhúng sẵn</Vi><En>Sequence diagram built in</En> <b>↓</b></div>
          <div class="t6-ring" style="animation-name: tr-r-acts; left: 18.8%; top: 27.6%; width: 33.6%; height: 6.2%"></div>
          <div class="t6-hint" style="animation-name: tr-h-acts; left: 59%; top: 28.3%"><b>←</b> <Vi>hỏi AI, publish, run</Vi><En>ask AI, publish, run</En></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tr-sc3">
        <div class="t6-img" style="width: 100%; animation-name: tr-pan">
          <img src="/screens/script-seq.png" alt="Full sequence diagram of the PUT request" />
        </div>
        <div class="t6-layer">
          <div class="t6-hint" style="animation-name: tr-h-pan; right: 3%; top: 4%"><Vi>Client → API → Caffeine → Mongo</Vi><En>Client → API → Caffeine → Mongo</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tr-sc4">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/script-code.png" alt="k6 source with @source / @endpoint / @case header" />
          <div class="t6-ring" style="animation-name: tr-r-head; left: 3%; top: 0.6%; width: 52%; height: 10%"></div>
          <div class="t6-hint" style="animation-name: tr-h-head; left: 57%; top: 1.5%"><b>←</b> <Vi>gắn script vào endpoint</Vi><En>links the script to its endpoint</En></div>
          <div class="t6-ring" style="animation-name: tr-r-seqsrc; left: 3%; top: 19.6%; width: 52%; height: 69.6%"></div>
          <div class="t6-hint" style="animation-name: tr-h-seqsrc; left: 57%; top: 50%"><b>←</b> <Vi>diagram viết ngay trong script</Vi><En>the diagram lives in the script</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tr-sc5">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/script-explain.png" alt="AI script explainer answering about ramp-up" />
          <div class="t6-ring" style="animation-name: tr-r-ask; left: 13.8%; top: 32.4%; width: 83.8%; height: 15%"></div>
          <div class="t6-hint" style="animation-name: tr-h-ask; left: 2%; top: 49.5%"><Vi>bạn hỏi về ramp-up</Vi><En>you ask about ramp-up</En> <b>↑</b></div>
          <div class="t6-ring" style="animation-name: tr-r-ans; left: 1.5%; top: 72%; width: 70%; height: 7.5%"></div>
          <div class="t6-hint" style="animation-name: tr-h-ans; right: 2%; top: 80.5%"><Vi>AI đọc code, trả lời, rồi thêm warmup 30s</Vi><En>The AI reads, answers, then adds a 30 s warmup</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tr-sc6">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/script-run.png" alt="Run dialog opened from the script page" />
          <div class="t6-ring" style="animation-name: tr-r-env; left: 30.6%; top: 23.6%; width: 38.8%; height: 21.4%"></div>
          <div class="t6-hint" style="animation-name: tr-h-env; left: 70.5%; top: 25%"><b>←</b> <Vi>port lấy từ Infra</Vi><En>port from Infra</En></div>
          <div class="t6-ring" style="animation-name: tr-r-vus; left: 30.6%; top: 69.4%; width: 38.8%; height: 9.6%"></div>
          <div class="t6-hint" style="animation-name: tr-h-vus; left: 70.5%; top: 71%"><b>←</b> <Vi>VUs worker còn trống</Vi><En>free worker VUs</En></div>
          <div class="t6-cursor" style="animation-name: tr-c6"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: tr-k6"></i></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: AI viết xong, người review. Mỗi script có sequence diagram nhúng trong header nên đọc là hiểu luồng; muốn hỏi hay sửa thì gọi AI explain ngay trên trang. Review xong bấm Run, env tự điền. Lần chạy đầu 11:05 fail sau 0.9 giây: slide sau.
EN: The AI writes, people review. Each script carries its sequence diagram in the header, so reading it shows the flow; ask or edit with AI explain right on the page. Then hit Run with env filled in. The first run at 11:05 fails after 0.9 s: next slide.
-->

---

<div class="eyebrow"><Vi>AI triage · Khi có lỗi</Vi><En>AI triage · When something breaks</En></div>

# <Vi>Lỗi ở bước nào, AI cũng giúp điều tra và sửa</Vi><En>Whatever breaks, the AI helps find and fix it</En>

<div class="tour6" style="--t6: 30s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: tf-step1">
      <span class="t6-num" style="animation-name: tf-num1">1</span>
      <div>
        <h3><Vi>Run fail? Bấm ✨ AI triage</Vi><En>Run failed? Hit ✨ AI triage</En></h3>
        <p><Vi>AI giúp điều tra nguyên nhân bị lỗi.</Vi><En>The AI helps investigate why it failed.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tf-step2">
      <span class="t6-num" style="animation-name: tf-num2">2</span>
      <div>
        <h3><Vi>AI tìm nguyên nhân, kèm bằng chứng</Vi><En>The AI finds the cause, with evidence</En></h3>
        <p><Vi>Đọc log, env, script, seed; dẫn dòng log và file:line.</Vi><En>Reads log, env, script, seed; cites log lines and file:line.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tf-step3">
      <span class="t6-num" style="animation-name: tf-num3">3</span>
      <div>
        <h3><Vi>Bạn chọn cách sửa, AI sửa</Vi><En>You pick the fix, the AI applies it</En></h3>
        <p><Vi>Sau khi fix xong bạn có thể chạy lại để kiểm chứng.</Vi><En>Once it is fixed, you can re-run to verify.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tf-step4">
      <span class="t6-num" style="animation-name: tf-num4">4</span>
      <div>
        <h3><Vi>Bước khác lỗi cũng vậy</Vi><En>Same for any other step</En></h3>
        <p><Vi>Infra không lên? ✨ AI analyze ngay trên log, đề xuất và sửa.</Vi><En>Infra down? ✨ AI analyze right on the log; it proposes and fixes.</En></p>
      </div>
    </div>
    <div class="callout"><Vi>Nút ✨ có ở mọi tab: log Infra, Runs, Scripts. Lệnh shell, ghi file cần bạn cho phép (trừ khi bật YOLO).</Vi><En>The ✨ button is on every tab: Infra logs, Runs, Scripts. Shell commands and edits need your OK (unless YOLO is on).</En></div>
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: tf-u1">localhost:5280/runs/20261117-110520… · ✨ AI triage</span>
      <span class="t6-url" style="animation-name: tf-u2">localhost:5280/runs/20261117-111203…</span>
      <span class="t6-url" style="animation-name: tf-u3">localhost:5280/infra</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.6">
      <div class="t6-scene" style="animation-name: tf-sc1">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/fail-top.png" alt="The 11:05 run: Error, k6 exited 108, no metrics" />
          <div class="t6-ring" style="animation-name: tf-r-err; left: 4.6%; top: 41.8%; width: 5.2%; height: 4.2%"></div>
          <div class="t6-ring" style="animation-name: tf-r-banner; left: 4.6%; top: 63.3%; width: 90.8%; height: 6.4%"></div>
          <div class="t6-hint" style="animation-name: tf-h-fail; right: 6%; top: 64.6%"><Vi>fail sau 0.9 giây · bấm ✨ AI triage</Vi><En>failed after 0.9 s · hit ✨ AI triage</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc2">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/triage.png" alt="AI triage: cause and evidence" />
          <div class="t6-ring" style="animation-name: tf-r-cause; left: 1.6%; top: 30.5%; width: 96.8%; height: 21%"></div>
          <div class="t6-hint" style="animation-name: tf-h-cause; right: 3%; top: 24.5%"><Vi>Nguyên nhân: thiếu owner token, không phải lỗi API</Vi><En>Cause: no owner token, not an API bug</En></div>
          <div class="t6-ring" style="animation-name: tf-r-evid; left: 1.6%; top: 52.5%; width: 96.8%; height: 46%"></div>
          <div class="t6-hint" style="animation-name: tf-h-evid; right: 3%; top: 54%"><Vi>dẫn dòng log + file:line</Vi><En>cites log lines + file:line</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc3">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/triage-fix.png" alt="AI triage: two ways to fix" />
          <div class="t6-ring" style="animation-name: tf-r-quick; left: 4.6%; top: 35.8%; width: 52%; height: 5.8%"></div>
          <div class="t6-ring" style="animation-name: tf-r-stable; left: 4.6%; top: 68.3%; width: 57%; height: 5.8%"></div>
          <div class="t6-hint" style="animation-name: tf-h-fix; right: 3%; top: 49%"><Vi>2 cách sửa: nhanh hoặc ổn định</Vi><En>2 fixes: quick or stable</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc4">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/triage-done.png" alt="You pick the stable fix and the AI applies it" />
          <div class="t6-ring" style="animation-name: tf-r-pick; left: 62.8%; top: 37.4%; width: 35.4%; height: 10.6%"></div>
          <div class="t6-hint" style="animation-name: tf-h-pick; right: 38.5%; top: 40.5%"><Vi>bạn chọn "ổn định"</Vi><En>you pick "stable"</En> <b>→</b></div>
          <div class="t6-ring" style="animation-name: tf-r-done; left: 1.6%; top: 72%; width: 96.8%; height: 27.5%"></div>
          <div class="t6-hint" style="animation-name: tf-h-done; right: 3%; top: 52.5%"><Vi>AI đổi tên seed, sửa 4 script</Vi><En>The AI renames the seed, fixes 4 scripts</En> <b>↓</b></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc5">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/rerun-top.png" alt="The 11:12 re-run with real requests" />
          <div class="t6-ring" style="animation-name: tf-r-reqs; left: 82.6%; top: 61.3%; width: 12.6%; height: 11.4%"></div>
          <div class="t6-hint" style="animation-name: tf-h-reqs; right: 18%; top: 53.5%"><Vi>chạy lại: 202,883 request</Vi><En>re-run: 202,883 requests</En> <b>↘</b></div>
          <div class="t6-ring" style="animation-name: tf-r-th; left: 4.6%; top: 41.8%; width: 8.6%; height: 4.2%"></div>
          <div class="t6-hint" style="animation-name: tf-h-th; left: 14%; top: 34%"><b>↙</b> <Vi>giờ mới là bài toán hiệu năng</Vi><En>now it's a real performance question</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc6">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/infra-cd.png" alt="Infra: Central Dogma is down and has no container" />
          <div class="t6-ring" style="animation-name: tf-r-cd; left: 15.5%; top: 54.6%; width: 13%; height: 9.5%"></div>
          <div class="t6-ring" style="animation-name: tf-r-ana; left: 80.6%; top: 18.1%; width: 8.2%; height: 4.6%"></div>
          <div class="t6-hint" style="animation-name: tf-h-cd; left: 30%; top: 56.5%"><b>←</b> <Vi>Central Dogma không lên</Vi><En>Central Dogma is down</En></div>
          <div class="t6-cursor" style="animation-name: tf-c6"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: tf-k6"></i></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc7">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/infra-ai-cause.png" alt="AI infra log: the container never existed" />
          <div class="t6-ring" style="animation-name: tf-r-icause; left: 1.6%; top: 30.5%; width: 96.8%; height: 37.5%"></div>
          <div class="t6-hint" style="animation-name: tf-h-icause; right: 3%; top: 69.5%"><Vi>chưa từng có container, compose thiếu service</Vi><En>no container ever; compose lacks the service</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tf-sc8">
        <div class="t6-img crop" style="width: 100%; --crop: 1280 / 800">
          <img src="/screens/infra-ai-done.png" alt="You pick minimal, the AI adds the container and it is healthy" />
          <div class="t6-ring" style="animation-name: tf-r-ipick; left: 84.8%; top: 29.4%; width: 13.4%; height: 10.8%"></div>
          <div class="t6-hint" style="animation-name: tf-h-ipick; right: 16.5%; top: 32%"><Vi>bạn chọn cách nhẹ nhất</Vi><En>you pick the minimal fix</En> <b>→</b></div>
          <div class="t6-tag yes" style="animation-name: tf-t-healthy; left: 48%; top: 91%">✓ <Vi>AI thêm container, CD healthy</Vi><En>the AI adds the container, CD healthy</En></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: Lỗi không còn là lúc ngồi đọc log. Run fail thì AI triage đọc log, env, script và seed, chỉ ra nguyên nhân có bằng chứng, đưa cách sửa; người chọn, AI sửa. Infra không lên cũng vậy: AI analyze ngay trên log Infra.
EN: A failure no longer means reading logs. When a run fails, AI triage reads the log, env, script and seed, gives the cause with evidence and the fixes; a person picks, the AI applies. Same when infra won't start: AI analyze right on the Infra log.
-->

---

<div class="eyebrow"><Vi>Tab Runs · Đọc kết quả</Vi><En>Runs tab · Results</En></div>

# <Vi>Mỗi run là một báo cáo đầy đủ ngữ cảnh</Vi><En>Every run is a report with full context</En>

<div class="tour6" style="--t6: 26s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: tg-step1">
      <span class="t6-num" style="animation-name: tg-num1">1</span>
      <div>
        <h3><Vi>Kết quả ngay sau khi chạy</Vi><En>Results right after the run</En></h3>
        <p><Vi>p95, RPS, lỗi, số request; kèm commit, worker, VUs, thời gian.</Vi><En>p95, RPS, errors, requests; plus commit, worker, VUs, timing.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tg-step2">
      <span class="t6-num" style="animation-name: tg-num2">2</span>
      <div>
        <h3><Vi>Chụp lại hạ tầng lúc chạy</Vi><En>Infra captured at run time</En></h3>
        <p><Vi>CPU / RAM container, thread pool, Mongo pool, threshold, feature flag.</Vi><En>Container CPU / RAM, thread pool, Mongo pool, thresholds, feature flags.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tg-step3">
      <span class="t6-num" style="animation-name: tg-num3">3</span>
      <div>
        <h3><Vi>Ảnh Grafana lưu kèm run</Vi><En>Grafana shots saved with the run</En></h3>
        <p><Vi>Tự chụp dashboard đúng khung giờ; xem lại lúc nào cũng còn.</Vi><En>The dashboard for that window, captured automatically and kept.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tg-step4">
      <span class="t6-num" style="animation-name: tg-num4">4</span>
      <div>
        <h3><Vi>Link Grafana để xem sâu</Vi><En>A Grafana link to dig deeper</En></h3>
        <p><Vi>Mở dashboard đúng service, đúng khung giờ của run.</Vi><En>Opens the dashboard on the right service and time window.</En></p>
      </div>
    </div>
    <div class="callout"><Vi><strong>Publish to git</strong>: đưa run lên GitLab Pages cho cả team xem.</Vi><En><strong>Publish to git</strong>: send the run to GitLab Pages for the team.</En></div>
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: tg-u1">localhost:5280/runs/20261117-161345…</span>
      <span class="t6-url" style="animation-name: tg-u2">127.0.0.1:13000/d/localperf-api · job=<span class="redact" aria-hidden="true">xxxxxxxxxxxx</span>-api · 16:13:17 → 16:15:48</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.6">
      <div class="t6-scene" style="animation-name: tg-sc1">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/run-grafana-btn.png" alt="Run report: header, context and headline metrics" />
          <div class="t6-ring" style="animation-name: tg-r-metrics; left: 1.8%; top: 77.6%; width: 96.4%; height: 17.6%"></div>
          <div class="t6-hint" style="animation-name: tg-h-metrics; right: 3%; top: 66.5%"><Vi>p95 122ms · 1,175 RPS · 0% lỗi</Vi><En>p95 122ms · 1,175 RPS · 0% errors</En> <b>↓</b></div>
          <div class="t6-ring" style="animation-name: tg-r-chips; left: 1.8%; top: 49.6%; width: 96.4%; height: 12.6%"></div>
          <div class="t6-hint" style="animation-name: tg-h-chips; right: 3%; top: 41.5%"><Vi>commit · worker · VUs · thời gian</Vi><En>commit · worker · VUs · timing</En> <b>↓</b></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tg-sc2">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/run-context.png" alt="Infra and pool config captured at run start" />
          <div class="t6-ring" style="animation-name: tg-r-cap; left: 1.8%; top: 4.6%; width: 81%; height: 5.4%"></div>
          <div class="t6-hint" style="animation-name: tg-h-cap; right: 3%; top: 11.2%"><Vi>chụp lúc bắt đầu run</Vi><En>captured at run start</En> <b>↑</b></div>
          <div class="t6-ring" style="animation-name: tg-r-infra; left: 50.2%; top: 20.6%; width: 47.8%; height: 28.8%"></div>
          <div class="t6-hint" style="animation-name: tg-h-infra; left: 55%; top: 39%"><Vi>CPU / RAM container</Vi><En>container CPU / RAM</En></div>
          <div class="t6-ring" style="animation-name: tg-r-pools; left: 2%; top: 50.5%; width: 96%; height: 40.6%"></div>
          <div class="t6-hint" style="animation-name: tg-h-pools; left: 36%; top: 92%"><Vi>thread pool · Mongo pool thật đang dùng</Vi><En>the thread pool · Mongo pool actually in use</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tg-sc3">
        <div class="t6-img crop left" style="width: 100%; --crop: 2.2">
          <img src="/screens/run-flags.png" alt="Thresholds and feature flags of the run" />
          <div class="t6-ring" style="animation-name: tg-r-th; left: 3.6%; top: 17%; width: 44%; height: 26.5%"></div>
          <div class="t6-hint" style="animation-name: tg-h-th; left: 50%; top: 25%"><b>←</b> <Vi>threshold đạt</Vi><En>thresholds met</En></div>
          <div class="t6-ring" style="animation-name: tg-r-flags; left: 3.8%; top: 73%; width: 75%; height: 18.6%"></div>
          <div class="t6-hint" style="animation-name: tg-h-flags; left: 30%; top: 60%"><b>↓</b> <Vi>feature flag lúc chạy</Vi><En>flags at run time</En></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tg-sc4">
        <div class="t6-img crop" style="width: 100%; --crop: 1.6">
          <img src="/screens/grafana-shot.png" alt="Grafana dashboard captured for the run window" />
          <div class="t6-ring" style="animation-name: tg-r-win; left: 1.8%; top: 6.8%; width: 42.6%; height: 3.8%"></div>
          <div class="t6-hint" style="animation-name: tg-h-win; left: 46%; top: 6.2%"><b>←</b> <Vi>tự chụp đúng khung giờ run</Vi><En>captured for the run's window</En></div>
          <div class="t6-ring" style="animation-name: tg-r-p95; left: 58.8%; top: 26.8%; width: 38.4%; height: 28.8%"></div>
          <div class="t6-hint" style="animation-name: tg-h-p95; right: 5%; top: 66%"><b>↑</b> <Vi>p95 / p99 theo thời gian</Vi><En>p95 / p99 over time</En></div>
        </div>
      </div>
      <div class="t6-scene" style="animation-name: tg-sc5">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/run-grafana-btn.png" alt="The Grafana link on the run page" />
          <div class="t6-ring" style="animation-name: tg-r-btn; left: 1.8%; top: 64.2%; width: 18.8%; height: 8.4%"></div>
          <div class="t6-hint" style="animation-name: tg-h-btn; left: 22%; top: 65.5%"><b>←</b> <Vi>mở Grafana để xem sâu</Vi><En>open Grafana to dig deeper</En></div>
          <div class="t6-cursor" style="animation-name: tg-c5"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: tg-k5"></i></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tg-sc6; background: #111217">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/grafana-live.png" alt="Grafana opened on the API module for the run's time window" />
          <div class="t6-ring" style="animation-name: tg-r-picker; left: 53.6%; top: 12.2%; width: 28.6%; height: 5%"></div>
          <div class="t6-hint" style="animation-name: tg-h-picker; left: 58%; top: 19.5%"><b>↑</b> <Vi>đúng khung giờ của run</Vi><En>the run's time window</En></div>
          <div class="t6-ring" style="animation-name: tg-r-job; left: 1%; top: 12.2%; width: 17%; height: 5%"></div>
          <div class="t6-hint" style="animation-name: tg-h-job; left: 1.5%; top: 19.5%"><b>↑</b> <Vi>đúng service</Vi><En>the right service</En></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: Đây là lần đầu đạt: 100 CCU trong 1 phút, p95 122ms, 1,175 RPS. Mọi thứ cần để giải thích con số đều được chụp lại lúc chạy: hạ tầng, pool, flag, ảnh Grafana. Cần xem sâu hơn thì bấm Grafana, dashboard mở đúng service và khung giờ.
EN: The first pass: 100 CCU for 1 minute, p95 122ms, 1,175 RPS. Everything needed to explain the numbers is captured at run time: infra, pools, flags, Grafana shots. To dig deeper, hit Grafana and the dashboard opens on the right service and time window.
-->

---

<div class="eyebrow"><Vi>GitLab Pages · Chia sẻ cho team</Vi><En>GitLab Pages · Share with the team</En></div>

# <Vi>Cả team xem kết quả test qua GitLab Pages</Vi><En>The whole team reads results on GitLab Pages</En>

<div class="tour6" style="--t6: 28s">
  <div class="tour6-steps">
    <div class="t6-step" style="animation-name: tp-step1">
      <span class="t6-num" style="animation-name: tp-num1">1</span>
      <div>
        <h3><Vi>Một link cho cả team</Vi><En>One link for the whole team</En></h3>
        <p><Vi>Run của mọi người ở một chỗ; lọc theo service, API, người chạy.</Vi><En>Everyone's runs in one place; filter by service, API, tester.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tp-step2">
      <span class="t6-num" style="animation-name: tp-num2">2</span>
      <div>
        <h3><Vi>Chi tiết từng run</Vi><En>Every run in detail</En></h3>
        <p><Vi>Số liệu, người chạy, commit, VUs; mở luôn report k6.</Vi><En>Numbers, tester, commit, VUs; the k6 report one click away.</En></p>
      </div>
    </div>
    <div class="t6-step" style="animation-name: tp-step3">
      <span class="t6-num" style="animation-name: tp-num3">3</span>
      <div>
        <h3><Vi>Đủ ngữ cảnh như trong lab</Vi><En>The same context as the lab</En></h3>
        <p><Vi>Sequence diagram, ảnh Grafana, infra metrics, script source.</Vi><En>Sequence diagram, Grafana shots, infra metrics, script source.</En></p>
      </div>
    </div>
    <div class="callout"><Vi>Trong lab bấm <strong>Publish to git</strong> trên run; CI tự build lại Pages. Người xem không cần cài gì.</Vi><En>Hit <strong>Publish to git</strong> on a run in the lab; CI rebuilds Pages. Viewers need nothing installed.</En></div>
  </div>

  <div class="shot t6-demo">
    <div class="shot-bar"><i></i><i></i><i></i>
      <span class="t6-url" style="animation-name: tp-u1">perf-lab.pages.internal/</span>
      <span class="t6-url" style="animation-name: tp-u2">perf-lab.pages.internal/runs/20261117-092927…/</span>
      <span class="t6-url" style="animation-name: tp-u3">perf-lab.pages.internal/runs/20261117-092927…/report.html</span>
      <span class="t6-url" style="animation-name: tp-u4">perf-lab.pages.internal/runs/20261117-092927…/</span>
    </div>
    <div class="t6-stage" style="--ratio: 1.6">
      <div class="t6-scene top" style="animation-name: tp-sc1">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/pages-index.png" alt="GitLab Pages: every published run of the team" />
          <div class="t6-ring" style="animation-name: tp-r-badge; left: 14.9%; top: 1.6%; width: 12.1%; height: 3.9%"></div>
          <div class="t6-hint" style="animation-name: tp-h-badge; left: 28%; top: 1.4%"><b>←</b> <Vi>trang tĩnh, ai cũng mở được</Vi><En>a static site anyone can open</En></div>
          <div class="t6-ring" style="animation-name: tp-r-tiles; left: 1.8%; top: 13.6%; width: 96.4%; height: 12.8%"></div>
          <div class="t6-hint" style="animation-name: tp-h-tiles; left: 40%; top: 27%"><b>↑</b> <Vi>API nào ổn, API nào cần chú ý</Vi><En>which APIs are fine, which need attention</En></div>
          <div class="t6-ring" style="animation-name: tp-r-by; left: 90.4%; top: 33.2%; width: 8%; height: 66%"></div>
          <div class="t6-hint" style="animation-name: tp-h-by; right: 10.5%; top: 41%"><Vi>run của cả team</Vi><En>the whole team's runs</En> <b>→</b></div>
          <div class="t6-ring" style="animation-name: tp-r-testers; left: 77.2%; top: 8.1%; width: 8.5%; height: 4.5%"></div>
          <div class="t6-cursor" style="animation-name: tp-c1"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: tp-k1"></i></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tp-sc2">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/pages-run-top.png" alt="A published run: who, when, and the headline numbers" />
          <div class="t6-ring" style="animation-name: tp-r-who; left: 1.6%; top: 15.4%; width: 48.6%; height: 4%"></div>
          <div class="t6-hint" style="animation-name: tp-h-who; left: 52%; top: 15.2%"><b>←</b> <Vi>ai chạy, lúc nào</Vi><En>who ran it, and when</En></div>
          <div class="t6-ring" style="animation-name: tp-r-metrics; left: 1.6%; top: 40.4%; width: 84.6%; height: 10.6%"></div>
          <div class="t6-hint" style="animation-name: tp-h-metrics; left: 30%; top: 52.5%"><b>↑</b> <Vi>đủ số liệu, không cần mở lab</Vi><En>all the numbers, no lab needed</En></div>
          <div class="t6-ring" style="animation-name: tp-r-report; left: 81.9%; top: 34%; width: 7.6%; height: 5%"></div>
          <div class="t6-cursor" style="animation-name: tp-c2"><svg viewBox="0 0 24 24"><path d="M5 3l14 8-6 1.6L9.6 19z"/></svg><i style="animation-name: tp-k2"></i></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tp-sc3">
        <div class="t6-img" style="width: 100%">
          <img src="/screens/pages-report.png" alt="The k6 HTML report of the run" />
          <div class="t6-ring" style="animation-name: tp-r-k6; left: 4.5%; top: 29.5%; width: 86%; height: 36.5%"></div>
          <div class="t6-hint" style="animation-name: tp-h-k6; right: 4%; top: 21%"><Vi>report k6 đầy đủ theo thời gian</Vi><En>the full k6 report over time</En> <b>↓</b></div>
        </div>
      </div>
      <div class="t6-scene top" style="animation-name: tp-sc4">
        <div class="t6-img" style="width: 100%; animation-name: tp-pan">
          <img src="/screens/pages-run-full.png" alt="The whole published run page" />
        </div>
        <div class="t6-layer">
          <div class="t6-hint" style="animation-name: tp-h-top; right: 3%; top: 4%"><Vi>cuộn cả trang run</Vi><En>scrolling the run page</En> <b>↓</b></div>
          <div class="t6-hint" style="animation-name: tp-h-seq; right: 3%; top: 4%"><Vi>sequence diagram của API</Vi><En>the API's sequence diagram</En></div>
          <div class="t6-hint" style="animation-name: tp-h-graf; right: 3%; top: 4%"><Vi>ảnh Grafana đúng khung giờ</Vi><En>Grafana shots for that window</En></div>
          <div class="t6-hint" style="animation-name: tp-h-prom; right: 3%; top: 4%"><Vi>infra metrics: CPU, heap, threads, Feign</Vi><En>infra metrics: CPU, heap, threads, Feign</En></div>
          <div class="t6-hint" style="animation-name: tp-h-src; right: 3%; top: 4%"><Vi>script source để review lại</Vi><En>the script source to review</En></div>
        </div>
      </div>
    </div>
    <div class="t6-progress"><i></i></div>
  </div>
</div>

<!--
VI: Kết quả không còn nằm trên máy một người. Bấm Publish to git, CI build lại GitLab Pages, cả team mở cùng một link: số liệu, report k6, Grafana, infra metrics, script. Ảnh chụp từ bản build của origin/main (cùng script CI dùng để deploy).
EN: Results no longer live on one laptop. Hit Publish to git, CI rebuilds GitLab Pages, and the team opens one link: numbers, k6 report, Grafana, infra metrics, script. Screenshots come from a build of origin/main (the same script CI deploys).
-->

---

<div class="eyebrow"><Vi>Hướng phát triển</Vi><En>What's next</En></div>

# <Vi>Từ một team đến mọi dự án</Vi><En>From one team to every project</En>

<div class="future-line">
  <div class="fl-stage done">
    <span class="fl-dot"></span>
    <span class="fl-tag"><Vi>Hiện tại</Vi><En>Today</En></span>
    <div class="card fl-card">
      <span class="fl-ico">✅</span>
      <p><Vi>Đã tích hợp và hỗ trợ tốt công việc của team hiện tại.</Vi><En>Integrated and already supporting the current team's work well.</En></p>
    </div>
  </div>
  <div class="fl-stage next">
    <span class="fl-dot"></span>
    <span class="fl-tag"><Vi>Hướng phát triển</Vi><En>Next</En></span>
    <div class="card fl-card">
      <span class="fl-ico">🤝</span>
      <p><Vi>Để hỗ trợ cho mọi dự án, cần sự đóng góp từ mọi người vào tool.</Vi><En>To support every project, the tool needs contributions from everyone.</En></p>
    </div>
  </div>
</div>

<!--
VI: Perf Lab đang chạy tốt cho team mình. Để dùng được cho mọi dự án, cần mọi người cùng đóng góp vào tool.
EN: Perf Lab already works well for our team. To serve every project, it needs contributions from everyone.
-->

---
layout: default
class: cover-x
---

<PerfHero />

<div class="cover-text">

<div class="eyebrow"><Vi>Cảm ơn mọi người đã lắng nghe</Vi><En>Thanks for listening</En></div>

<div class="brand">Perf Lab</div>

<h1 class="cover-title"><Vi>Cảm ơn! <span class="accent">Giờ thì <span class="nowrap">uống trà sữa 🧋</span></span></Vi><En>Thank you! <span class="accent">Now go grab <span class="nowrap">a bubble tea 🧋</span></span></En></h1>

<p class="subtitle"><Vi>Câu hỏi, góp ý, muốn thử cho project của bạn: cứ hỏi nhé.</Vi><En>Questions, feedback, or want to try it on your project? Just ask.</En></p>

<div class="presenter">
  <img src="./images/avatar.jpg" alt="Nguyen Le Hoang Tuan (Jeremy)" />
  <div>
    <div class="presenter-label"><Vi>Người trình bày</Vi><En>Presenter</En></div>
    <div class="presenter-name">Nguyen Le Hoang Tuan (Jeremy)</div>
    <div class="presenter-role">Back-end Engineer</div>
  </div>
</div>

</div>

// Local pre-push gate. Drives headless Chrome through the agent-browser CLI and
// fails on real layout defects: text overlap, horizontal overflow, clipped text,
// contrast under WCAG AA, a font that did not load, a cover CTA below the fold, or
// a template with missing / nested scroll reveals.
//
//   node scripts/audit-pages.mjs [baseUrl]          # phone only, fast (~2 min)
//   node scripts/audit-pages.mjs [baseUrl] --full   # phone, small, landscape, desktop
//
// Every browser call has a timeout, and progress is printed, so a hung browser
// cannot look like a hung script.
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const args = process.argv.slice(2);
const base = args.find((arg) => arg.startsWith('http')) ?? 'http://localhost:4399';
const full = args.includes('--full');
const only = args.find((arg) => arg.startsWith('--vp='))?.slice(5);
const CALL_TIMEOUT = 25_000;

const auditScript = readFileSync('scripts/audit-layout.js', 'utf8');

const allViewports = full
  ? [
      ['phone', 390, 844],
      ['small-phone', 320, 568],
      ['landscape', 844, 390],
      ['desktop', 1280, 900],
    ]
  : [['phone', 390, 844]];

const viewports = only ? allViewports.filter(([label]) => label === only) : allViewports;

const steps = [0, 2, 4];

const call = (bin, argv, input) =>
  execFileSync(bin, argv, { encoding: 'utf8', input, timeout: CALL_TIMEOUT, stdio: ['pipe', 'pipe', 'pipe'] });

const browser = (...argv) => call('agent-browser', argv);
const sleep = (seconds) => execFileSync('sleep', [String(seconds)]);

const parsePayload = (raw) => {
  const trimmed = raw.trim();
  try {
    const once = JSON.parse(trimmed);
    return typeof once === 'string' ? JSON.parse(once) : once;
  } catch {
    return trimmed;
  }
};

const evalJs = (code) => parsePayload(call('agent-browser', ['eval', code]));

// The catalogue page lists every theme; the home page only teases six.
const html = await fetch(`${base}/themes`).then((response) => response.text());
const slugs = [...new Set([...html.matchAll(/\/preview\/([\w-]+)\//g)].map((m) => m[1]))];
const pages = ['/', '/themes', '/packages', '/process', '/about', '/faq', '/custom', '/contact'];
const routes = [...pages, ...slugs.map((slug) => `/preview/${slug}/`)];

const started = Date.now();
const failures = [];
let checked = 0;

for (const [label, width, height] of viewports) {
  browser('set', 'viewport', String(width), String(height));

  for (const route of routes) {
    const isInvitation = route.startsWith('/preview/');
    browser('open', base + route);
    sleep(1.4);

    if (isInvitation) {
      evalJs(
        "(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('Open Invitation'));if(b)b.click();return 'ok'})()"
      );
      sleep(0.8);
    }

    for (const step of steps) {
      if (step > 0) {
        evalJs(
          `(()=>{const c=document.querySelector('.overflow-y-auto');if(c)c.scrollTop=${step}*760;return 'ok'})()`
        );
        sleep(0.9);
      }

      const report = parsePayload(call('agent-browser', ['eval', '--stdin'], auditScript));
      checked++;

      const problems = {
        hOverflow: report.hOverflow,
        textOverlap: report.textOverlap,
        clipped: report.clipped,
        lowContrast: report.lowContrast,
        coverCta: report.coverCta && !report.coverCta.visible ? report.coverCta : [],
        reveal: isInvitation && report.revealNodes < 5 ? { nodes: report.revealNodes } : [],
        nested: report.nestedReveals > 0 ? { nested: report.nestedReveals } : [],
        smallTargets: report.smallTargets,
        // Cormorant is the invitation voice; marketing pages never use it, so the
        // browser does not fetch it there.
        fonts: isInvitation ? Object.entries(report.fonts).filter(([, ok]) => !ok) : [],
      };

      const count = Object.values(problems).reduce((n, list) => n + list.length, 0);
      if (count) failures.push({ label, route, step, problems });
    }

    process.stdout.write(
      `\r${checked} states checked · ${failures.length} failing · ${Math.round((Date.now() - started) / 1000)}s   `
    );
  }
}

const seconds = Math.round((Date.now() - started) / 1000);

if (!failures.length) {
  console.log(`\nOK — ${routes.length} routes × ${viewports.length} viewport(s), ${checked} states, ${seconds}s, no layout defects.`);
  process.exit(0);
}

console.log(`\n\n✗ ${failures.length} failing state(s) of ${checked} in ${seconds}s`);
for (const failure of failures.slice(0, 12)) {
  console.log(`\n✗ ${failure.label} ${failure.route} (scroll step ${failure.step})`);
  console.log(JSON.stringify(failure.problems, null, 1));
}
process.exit(1);

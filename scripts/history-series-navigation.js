// Add one forward link without replacing the previous-episode or hub journeys.
// Shared with Episode 1.2's importer so later content syncs retain Episode 1.3.
export function linkNextHistoryEpisode(html, { href, label, title }) {
  if (!/^\/(?:[a-z]{2}\/)?science\/[a-z0-9-]+\.html$/.test(href) || /[<>]/.test(label + title)) {
    throw new Error('Invalid next-episode navigation');
  }
  const nav = html.match(/<nav class="history-series-navigation(?: history-series-navigation--with-next)?"[\s\S]*?<\/nav>/)?.[0];
  if (!nav) throw new Error('Missing series navigation');
  const next = `<a href="${href}" rel="next"><span>${label}</span><strong>${title}</strong></a>`;
  let updated = nav.replace(/<a href="[^"]+" rel="next">[\s\S]*?<\/a>\s*/, '');
  updated = updated.replace('class="history-series-navigation"', 'class="history-series-navigation history-series-navigation--with-next"');
  updated = updated.replace(/(\s*)(<a href="\/(?:[a-z]{2}\/)?science\/">)/, (_match, space, hub) => `${space}${next}${space}${hub}`);
  if (!updated.includes(next)) throw new Error('Missing series hub link');
  return html.replace(nav, updated);
}

export function retainNextHistoryEpisode(html, template) {
  const nav = template.match(/<nav class="history-series-navigation[^>]*>[\s\S]*?<\/nav>/)?.[0];
  const next = nav?.match(/<a href="([^"]+)" rel="next"><span>([^<]+)<\/span><strong>([^<]+)<\/strong><\/a>/);
  return next ? linkNextHistoryEpisode(html, { href: next[1], label: next[2], title: next[3] }) : html;
}

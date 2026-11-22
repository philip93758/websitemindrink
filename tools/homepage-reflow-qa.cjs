const assert = require('node:assert/strict');

async function checkHomepageReflow(page, width) {
  await page.evaluate(() => document.fonts.ready.then(() => true));
  const hero = page.locator('#home .home-store-link');
  await hero.locator('img').evaluateAll(images => Promise.all(images.map(image => image.decode())));
  const layout = await page.evaluate(() => {
    const { clientWidth, scrollWidth } = document.documentElement;
    const range = document.createRange();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const clippedText = [];
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (!node.textContent.trim() || node.parentElement.closest('script, style, noscript, template, [hidden]')) continue;
      range.selectNodeContents(node);
      if ([...range.getClientRects()].some(rect => rect.width > 0 && rect.height > 0 && (rect.left < -1 || rect.right > clientWidth + 1))) {
        clippedText.push(node.textContent.trim());
      }
    }
    const box = element => {
      const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
      return { left, right, top, bottom, width, height };
    };
    const badges = section => [...document.querySelectorAll(section + ' .home-store-link')].map(link => ({
      host: new URL(link.href).hostname, label: link.getAttribute('aria-label'),
      link: box(link), image: box(link.querySelector('img')),
    }));
    return { innerWidth, clientWidth, scrollWidth, scrollX, clippedText, hero: badges('#home'), download: badges('#download') };
  });

  assert.equal(layout.innerWidth, width, 'Effective viewport width');
  assert.equal(layout.clientWidth, width, 'Available page width');
  assert.equal(layout.scrollWidth, width, 'Homepage must not scroll horizontally');
  assert.equal(layout.scrollX, 0, 'Homepage must start at the left edge');
  assert.deepEqual(layout.clippedText, [], 'Text must fit inside both edges of the viewport');
  for (const [section, badges] of [['Hero', layout.hero], ['Download', layout.download]]) {
    assert.deepEqual(badges.map(badge => badge.host), ['apps.apple.com', 'play.google.com'], section + ' must link to both stores');
    for (const { link, image, label } of badges) {
      assert.ok(label?.trim(), section + ' store link must have an accessible label');
      assert.ok(link.width > 0 && link.height > 0 && link.left >= 0 && link.right <= width, section + ' store link is clipped');
      assert.ok(image.width > 0 && image.height > 0 && image.left >= link.left && image.right <= link.right, section + ' store image is clipped');
    }
  }

  const [first, second] = layout.hero.map(badge => badge.link);
  if (width === 320) {
    assert.ok(first.top === second.top && first.right <= second.left, 'Hero badges must stay side by side at 320 CSS px');
    return;
  }
  assert.ok(first.bottom <= second.top, 'Hero badges must stack at 240 CSS px');
  for (let i = 0; i < 8 && !(await hero.first().evaluate(link => link === document.activeElement)); i++) {
    await page.keyboard.press('Tab');
  }
  for (const [i, badge] of (await hero.all()).entries()) {
    if (i > 0) await page.keyboard.press('Tab');
    assert.ok(await badge.evaluate(link => {
      const style = getComputedStyle(link);
      const ring = parseFloat(style.outlineWidth) + parseFloat(style.outlineOffset);
      const rect = link.getBoundingClientRect();
      return link === document.activeElement && link.matches(':focus-visible') && style.outlineStyle === 'solid'
        && rect.left >= ring && rect.right + ring <= document.documentElement.clientWidth && scrollX === 0;
    }), 'Each hero badge must be reachable by Tab with its full focus ring visible');
  }
}

module.exports = { checkHomepageReflow };

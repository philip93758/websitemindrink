import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';

const ROOT = resolve(import.meta.dirname, '..');

// A bounded regression guard for the known internal log, not a general scanner
// or a claim that arbitrary internal information cannot be published elsewhere.
test('the internal SEO action log is absent from the public repository working tree', () => {
  const tracked = execFileSync('git', ['ls-files', '--cached', '-z'], {cwd:ROOT, encoding:'utf8'})
    .split('\0').filter(Boolean).filter(path => existsSync(resolve(ROOT, path)));
  assert.deepEqual(tracked.filter(path => /(^|\/)SEO_ACTION_LOG\.md$/i.test(path)), []);
  assert.equal(existsSync(resolve(ROOT, 'docs/SEO_ACTION_LOG.md')), false);
});

test('public agent entry points direct internal SEO records to private Atrium', () => {
  const ignore = spawnSync('git', ['check-ignore', '--no-index', '-q', 'docs/SEO_ACTION_LOG.md'], {cwd:ROOT});
  assert.equal(ignore.status, 0, 'the former public log location must be ignored');
  for (const path of ['AGENTS.md', 'docs/AI_CONTEXT.md']) {
    const text = readFileSync(resolve(ROOT, path), 'utf8');
    assert.match(text, /mindrink-atrium\/docs\/marketing\/seo\/README\.md/);
    assert.doesNotMatch(text, /\]\(SEO_ACTION_LOG\.md\)/);
  }
});

/**
 * End-to-end tests for "The Way of Asking"
 * Run with: npx playwright test
 * Install:  npm init -y && npm install -D @playwright/test && npx playwright install chromium
 *
 * To run against the Vercel preview URL:
 *   BASE_URL=https://your-preview.vercel.app npx playwright test
 *
 * To run headlessly in CI (e.g. GitHub Actions):
 *   npx playwright test --reporter=github
 */

const { test, expect } = require('@playwright/test');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper: sign in and land on the Home screen
async function signIn(page) {
  await page.goto(BASE_URL);
  await page.click('text=Sign in');
  await page.click('button:has-text("Sign in")');
  await expect(page.locator('#main-app')).toBeVisible();
}

// ─── AUTH ────────────────────────────────────────────────────────────────────
test.describe('Auth', () => {
  test('shows auth screen on load', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page.locator('#auth-screen')).toBeVisible();
    await expect(page.locator('#main-app')).toBeHidden();
  });

  test('sign in reveals app', async ({ page }) => {
    await signIn(page);
    await expect(page.locator('#screen-home')).toBeVisible();
  });

  test('join tab shows name field', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.click('text=Join');
    await expect(page.locator('#name-field')).toBeVisible();
  });

  test('sign out returns to auth screen', async ({ page }) => {
    await signIn(page);
    await page.click('text=Sign out');
    await expect(page.locator('#auth-screen')).toBeVisible();
  });
});

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
test.describe('Navigation', () => {
  test('bottom nav switches screens', async ({ page }) => {
    await signIn(page);
    for (const [label, screenId] of [
      ['Prompts', 'screen-prompts'],
      ['Journal', 'screen-journal'],
      ['Plans', 'screen-plans'],
      ['Community', 'screen-feed'],
    ]) {
      await page.click(`nav button:has-text("${label}")`);
      await expect(page.locator(`#${screenId}`)).toBeVisible();
    }
  });

  test('topbar title updates with active screen', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    await expect(page.locator('#topbar-title')).toHaveText('Community Feed');
  });

  test('Home "All plans →" navigates to plans', async ({ page }) => {
    await signIn(page);
    await page.click('text=All plans →');
    await expect(page.locator('#screen-plans')).toBeVisible();
  });

  test('Home "All entries →" navigates to journal', async ({ page }) => {
    await signIn(page);
    await page.click('text=All entries →');
    await expect(page.locator('#screen-journal')).toBeVisible();
  });
});

// ─── JOURNAL ─────────────────────────────────────────────────────────────────
test.describe('Journal', () => {
  test('journal tab shows entry and word count stats', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Journal")');
    await expect(page.locator('#journal-entry-count')).not.toHaveText('');
    await expect(page.locator('#journal-word-count')).not.toHaveText('');
  });

  test('new entry opens editor', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Journal")');
    await page.click('text=New entry');
    await expect(page.locator('#journal-editor')).toBeVisible();
  });

  test('writing and saving an entry', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Journal")');
    await page.click('text=New entry');
    await page.fill('#journal-textarea', 'This is a test journal entry with enough words to count.');
    await expect(page.locator('#word-count')).toContainText('words');
    await page.click('text=Done');
    await expect(page.locator('#journal-editor')).toBeHidden();
    await expect(page.locator('#journal-list')).toContainText('This is a test journal entry');
  });

  test('editing an entry does not duplicate it', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Journal")');
    // Count initial entries
    const initial = await page.locator('#journal-list .card').count();
    // Open first entry and save
    await page.locator('#journal-list .card').first().click();
    await page.fill('#journal-textarea', 'Updated content that is definitely unique.');
    await page.click('text=Done');
    // Count should be the same
    const after = await page.locator('#journal-list .card').count();
    expect(after).toBe(initial);
  });

  test('archive button hides entry from journal list', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Journal")');
    const initial = await page.locator('#journal-list .card').count();
    // Accept the confirm dialog
    page.on('dialog', d => d.accept());
    await page.locator('#journal-list .card').first().locator('button[title="Archive entry"]').click();
    const after = await page.locator('#journal-list .card').count();
    expect(after).toBe(initial - 1);
  });

  test('journal entries persist after reload', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Journal")');
    await page.click('text=New entry');
    await page.fill('#journal-textarea', 'Persistence test entry unique string 99281.');
    await page.click('text=Done');
    await page.reload();
    await page.click('button:has-text("Sign in")');
    await page.click('nav button:has-text("Journal")');
    await expect(page.locator('#journal-list')).toContainText('Persistence test entry unique string 99281');
  });
});

// ─── PROMPTS ─────────────────────────────────────────────────────────────────
test.describe('Prompts', () => {
  test('prompts list renders', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Prompts")');
    await expect(page.locator('#prompts-list .card')).toHaveCount({ minimum: 1 });
  });

  test('opening a prompt shows detail overlay', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Prompts")');
    await page.locator('#prompts-list .card').first().click();
    await expect(page.locator('#prompt-detail')).toHaveClass(/open/);
  });

  test('board tab shows comments', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Prompts")');
    await page.locator('#prompts-list .card').first().click();
    await page.click('#tab-board');
    await expect(page.locator('#comments-list')).toBeVisible();
  });

  test('submitting a comment appears in board', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Prompts")');
    await page.locator('#prompts-list .card').first().click();
    await page.click('#tab-board');
    await page.fill('#new-comment-text', 'Automated test comment 77321');
    await page.click('text=Post');
    await expect(page.locator('#comments-list')).toContainText('Automated test comment 77321');
  });

  test('user can delete their own board comment', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Prompts")');
    await page.locator('#prompts-list .card').first().click();
    await page.click('#tab-board');
    await page.fill('#new-comment-text', 'Comment to delete 99123');
    await page.click('text=Post');
    page.on('dialog', d => d.accept());
    await page.locator('#comments-list .comment-item').last().locator('text=Delete').click();
    await expect(page.locator('#comments-list')).not.toContainText('Comment to delete 99123');
  });
});

// ─── COMMUNITY FEED ──────────────────────────────────────────────────────────
test.describe('Community Feed', () => {
  test('feed renders posts', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    await expect(page.locator('#feed-list .post')).toHaveCount({ minimum: 1 });
  });

  test('creating a new post appears at top of feed', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    await page.click('text=Share with the community');
    await expect(page.locator('#post-composer')).toBeVisible();
    await page.fill('#post-composer-text', 'Automated post test 88123');
    await page.click('#post-composer button:has-text("Post")');
    await expect(page.locator('#feed-list .post').first()).toContainText('Automated post test 88123');
  });

  test('character counter updates in composer', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    await page.click('text=Share with the community');
    await page.fill('#post-composer-text', 'Hello');
    await expect(page.locator('#post-composer-count')).toContainText('5 / 500');
  });

  test('liking a post increments count', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    const likeBtn = page.locator('#feed-list .post').first().locator('.action-btn').first();
    const before = await likeBtn.textContent();
    await likeBtn.click();
    const after = await likeBtn.textContent();
    expect(after).not.toBe(before);
  });

  test('posting a feed comment updates comment count', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    const post = page.locator('#feed-list .post').first();
    const commentBtn = post.locator('.action-btn').nth(1);
    await commentBtn.click();
    const input = post.locator('input[placeholder="Add a comment…"]');
    await input.fill('Test feed comment');
    await input.press('Enter');
    await expect(post.locator('.comment-bubble')).toHaveCount({ minimum: 1 });
  });

  test('feed posts persist after reload', async ({ page }) => {
    await signIn(page);
    await page.click('nav button:has-text("Community")');
    await page.click('text=Share with the community');
    await page.fill('#post-composer-text', 'Persistence test post 55512');
    await page.click('#post-composer button:has-text("Post")');
    await page.reload();
    await page.click('button:has-text("Sign in")');
    await page.click('nav button:has-text("Community")');
    await expect(page.locator('#feed-list')).toContainText('Persistence test post 55512');
  });
});

// ─── PROFILE ─────────────────────────────────────────────────────────────────
test.describe('Profile', () => {
  test('profile opens from topbar icon', async ({ page }) => {
    await signIn(page);
    await page.locator('.topbar .relative').click();
    await expect(page.locator('#screen-profile, #profile-overlay')).toBeVisible();
  });

  test('inline status editor saves new status', async ({ page }) => {
    await signIn(page);
    await page.locator('.topbar .relative').click();
    await page.locator('#profile-status-display').click();
    await page.fill('#profile-status-input', 'My new test status');
    await page.press('#profile-status-input', 'Enter');
    await expect(page.locator('#profile-status-display')).toContainText('My new test status');
  });

  test('notifications render and can be dismissed', async ({ page }) => {
    await signIn(page);
    await page.locator('.topbar .relative').click();
    const notifList = page.locator('#notifications-list');
    await expect(notifList.locator('.card')).toHaveCount({ minimum: 1 });
    // Dismiss the first notification
    await notifList.locator('.card').first().locator('button[title="Dismiss"]').click();
    const after = await notifList.locator('.card').count();
    // Either count decreased or shows "all caught up"
    const text = await notifList.textContent();
    expect(text.includes('all caught up') || after < 3).toBe(true);
  });

  test('export journal downloads a file', async ({ page }) => {
    await signIn(page);
    await page.locator('.topbar .relative').click();
    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('text=Export my journal'),
    ]);
    expect(download.suggestedFilename()).toMatch(/journal_export.*\.json/);
  });
});

// ─── PWA ─────────────────────────────────────────────────────────────────────
test.describe('PWA', () => {
  test('manifest is linked', async ({ page }) => {
    await page.goto(BASE_URL);
    const manifest = await page.$('link[rel="manifest"]');
    expect(manifest).not.toBeNull();
  });

  test('service worker registers', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    const swRegistered = await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const reg = await navigator.serviceWorker.getRegistration('/');
      return !!reg;
    });
    expect(swRegistered).toBe(true);
  });
});

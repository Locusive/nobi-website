/**
 * Browser integration check, run through Codex's CUA tab API at a short mobile
 * and desktop viewport. Uses the live widget to catch stacking regressions.
 * The tab must show a buying guide with its Book a demo link.
 */
export async function verifyDemoModalControls(tab) {
  await tab.playwright.locator('#nobi-floating-chat-bar-container').waitFor({ state: 'visible', timeoutMs: 15000 });
  await tab.playwright.getByRole('link', { name: 'Book a demo', exact: true }).first().click();
  await tab.playwright.domSnapshot();

  const layout = await tab.playwright.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const panel = dialog.querySelector(':scope > div');
    const rect = panel.getBoundingClientRect();
    const chat = document.querySelector('#nobi-floating-chat-bar-container');
    return {
      top: rect.top,
      bottom: rect.bottom,
      viewportHeight: document.documentElement.clientHeight,
      dialogLayer: Number(getComputedStyle(dialog).zIndex),
      chatLayer: chat ? Number(getComputedStyle(chat).zIndex) : null,
    };
  });
  if (layout.top < 0 || layout.bottom > layout.viewportHeight) {
    throw new Error(`Demo form extends outside the viewport: ${JSON.stringify(layout)}`);
  }
  if (layout.chatLayer === null) throw new Error("The chat widget must be present for this regression check");
  if (layout.dialogLayer <= layout.chatLayer) {
    throw new Error(`Chat can cover the demo form: ${JSON.stringify(layout)}`);
  }

  // Keyboard focus must bring the form's final action row into view.
  await tab.playwright.getByRole('button', { name: 'Cancel', exact: true }).press('Shift+Tab');
  await tab.playwright.domSnapshot();
  const actions = await tab.playwright.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    return Array.from(dialog.querySelectorAll('button'))
      .filter((button) => ['Submit', 'Cancel'].includes(button.textContent.trim()))
      .map((button) => {
        const rect = button.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return { text: button.textContent.trim(), reachable: button.contains(hit) };
      });
  });
  if (actions.length !== 2 || actions.some((action) => !action.reachable)) {
    throw new Error(`Demo actions are obscured: ${JSON.stringify(actions)}`);
  }

  await tab.playwright.getByRole('button', { name: 'Cancel', exact: true }).click();
  await tab.playwright.domSnapshot();
  if (await tab.playwright.getByRole('dialog').count()) throw new Error('Cancel did not close the demo form');
  return { layout, actions, cancelled: true };
}

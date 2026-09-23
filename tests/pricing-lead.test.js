import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sendPricingEstimate } from '../src/utils/pricingLead.js';

const request = {
  website: ' example.com ', name: ' Example ', email: ' owner@example.com ',
  estimate: { setup: 'Search only', input_method: 'usage', searches: 2501, messages: 0, estimated_monthly_cost: 25.01 },
};

test('a pricing request delivers contact details and the chosen estimate to the existing lead destination', async () => {
  let sent = false;
  await sendPricingEstimate(request, async (url, options) => {
    sent = true;
    assert.equal(url, 'https://api.web3forms.com/submit');
    assert.equal(options.method, 'POST');
    assert.equal(options.body.get('email'), 'owner@example.com');
    assert.equal(options.body.get('website'), 'example.com');
    assert.match(options.body.get('message'), /Setup: Search only/);
    assert.match(options.body.get('message'), /Monthly searches: 2501/);
    assert.match(options.body.get('message'), /Monthly assistant messages: 0/);
    assert.match(options.body.get('message'), /Estimated monthly cost: \$25\.01/);
    return Response.json({ success: true });
  });
  assert.ok(sent);
});

test('failed, malformed, and unacknowledged requests never count as a successful lead', async () => {
  for (const response of [
    () => Response.json({ success: false }),
    () => Response.json({ success: true }, { status: 500 }),
    () => Response.json({}),
    () => new Response('not JSON'),
  ]) {
    await assert.rejects(sendPricingEstimate(request, async () => response()));
  }
  await assert.rejects(sendPricingEstimate(request, async () => { throw new Error('Network unavailable'); }));
});

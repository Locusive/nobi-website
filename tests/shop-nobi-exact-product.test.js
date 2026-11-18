import assert from 'node:assert/strict';
import test from 'node:test';
import { exactProductApiUrl, exactProductPath, readExactProductCard } from '../src/utils/shopNobiExactProduct.js';

const id = '95bf918d-a549-4cdd-ab7d-5e0ab118521d';
const card = { variantId: id, product: { name: "Printworks Recipe Book Today's Special", store: 'Saint Bernard', price: 50,
  currency: 'USD', inStock: true, url: 'https://api.nobi.ai/v1/shop/go/signed', paidLink: false } };

test('builds only a canonical exact product link and a model-free GET', () => {
  assert.equal(exactProductPath(id), `/shop/item/${id}`);
  assert.equal(exactProductApiUrl(id), `https://api.nobi.ai/v1/shop/products/${id}`);
  assert.equal(exactProductApiUrl('red-books'), null);
});

test('rejects stale, mismatched or non-Nobi click targets', () => {
  assert.equal(readExactProductCard(card, id)?.name, card.product.name);
  assert.equal(readExactProductCard({ ...card, variantId: crypto.randomUUID() }, id), null);
  assert.equal(readExactProductCard({ ...card, product: { ...card.product, inStock: false } }, id), null);
  assert.equal(readExactProductCard({ ...card, product: { ...card.product, url: 'https://elsewhere.example/buy' } }, id), null);
});

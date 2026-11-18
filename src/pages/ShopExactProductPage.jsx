import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../components/home/Nav';
import ShopNobiFooter from '../components/shopNobi/ShopNobiFooter';
import { useAdoptedAssistantContainer } from '../hooks/useAdoptedAssistantContainer';
import { useSEO } from '../hooks/useSEO';
import { exactProductApiUrl, exactProductPath, readExactProductCard } from '../utils/shopNobiExactProduct';
import { readStoreLinkRel, ShopNobiImage } from '../utils/shopNobiPage';
import '../components/home/homepage.css';

/** A current exact catalog result for a known variant, backed by the model-free public GET. */
export default function ShopExactProductPage() {
  const { variantId } = useParams();
  const searchSlot = useRef(null);
  useAdoptedAssistantContainer(searchSlot);
  const [state, setState] = useState({ loading: true, card: null });
  const path = exactProductPath(variantId);

  useEffect(() => {
    const apiUrl = exactProductApiUrl(variantId);
    if (!apiUrl) { setState({ loading: false, card: null }); return undefined; }
    const abort = new AbortController();
    setState({ loading: true, card: null });
    fetch(apiUrl, { signal: abort.signal, cache: 'no-store' })
      .then(response => response.ok ? response.json() : null)
      .then(payload => { if (!abort.signal.aborted) setState({ loading: false, card: readExactProductCard(payload, variantId) }); })
      .catch(() => { if (!abort.signal.aborted) setState({ loading: false, card: null }); });
    return () => abort.abort();
  }, [variantId]);

  // This client-fetched page has no product HTML for crawlers. Indexing and preview generation
  // belong to a separate, server-rendered release; the exact link is for people opening it.
  useSEO({
    title: state.card ? `${state.card.name} | Shop Nobi` : 'Product on Shop Nobi',
    description: 'See the current product listing and go directly to the store.',
    path: path || '/shop', image: state.card?.imageUrl || ShopNobiImage, noindex: true,
  });

  return <div className="min-h-screen bg-white text-black dark:bg-[#0a0a0a] dark:text-white">
    <header><Nav active="shop" pinned={false} /></header>
    <main className="mx-auto max-w-6xl px-5 py-10">
      <a className="underline" href="/shop">Shop Nobi search</a>
      {state.loading ? <p className="mt-8" role="status">Checking the current listing…</p>
        : state.card ? <article className="mt-8 grid gap-8 md:grid-cols-[minmax(0,320px)_1fr]">
          {state.card.imageUrl && <img className="w-full rounded-xl object-contain" src={state.card.imageUrl} alt={state.card.name} />}
          <div>
            <h1 className="text-3xl font-semibold">{state.card.name}</h1>
            <p className="mt-3">At {state.card.store}</p>
            <p className="mt-2 text-xl">{new Intl.NumberFormat('en-US', { style: 'currency', currency: state.card.currency || 'USD' }).format(state.card.price)}</p>
            <p className="mt-2 text-sm">Catalog price and availability can change. Confirm the selected item at the store.</p>
            <a className="mt-5 inline-block rounded-lg bg-black px-5 py-3 font-semibold text-white dark:bg-white dark:text-black" href={state.card.url} rel={readStoreLinkRel(state.card.paidLink)} target="_blank">View at {state.card.store}</a>
            {state.card.paidLink && <p className="mt-2 text-sm">We may earn a commission from this link.</p>}
          </div>
        </article> : <section className="mt-8">
          <h1 className="text-2xl font-semibold">This listing is unavailable right now</h1>
          <p className="mt-3">It may be out of stock or no longer in the Shop Nobi catalog. Try a fresh search below.</p>
        </section>}
      <section className="mt-12" aria-label="Search more products"><div ref={searchSlot} /></section>
    </main>
    <ShopNobiFooter />
  </div>;
}

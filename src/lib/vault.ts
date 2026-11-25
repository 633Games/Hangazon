import type { Product } from '../data/products'

/**
 * Lightweight client-side seal for ladder secrets.
 * Not cryptographic security — raises the bar so locked / not-yet-unlocked
 * title, price, and image are not sitting clear in React state or the DOM.
 * Determined attackers can still recover the catalog from the bundle.
 */

const KEY = 'hz-ladder-v1'

export type SealedProduct = {
  id: string
  category: Product['category']
  /** Opaque payload — do not log or render */
  envelope: string
}

type SecretPayload = {
  title: string
  brand: string
  price: number
  listPrice?: number
  rating: number
  reviews: number
  prime?: boolean
  blurb: string
  asin: string
  imageUrl: string
  affiliateUrl: string
}

function xorBytes(data: Uint8Array, key: string): Uint8Array {
  const out = new Uint8Array(data.length)
  for (let i = 0; i < data.length; i++) {
    out[i] = data[i]! ^ key.charCodeAt(i % key.length)
  }
  return out
}

function toB64(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!)
  return btoa(bin)
}

function fromB64(b64: string): Uint8Array {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

/** Seal a product so secrets are not cleartext in ladder state. */
export function sealProduct(product: Product): SealedProduct {
  const payload: SecretPayload = {
    title: product.title,
    brand: product.brand,
    price: product.price,
    listPrice: product.listPrice,
    rating: product.rating,
    reviews: product.reviews,
    prime: product.prime,
    blurb: product.blurb,
    asin: product.asin,
    imageUrl: product.imageUrl,
    affiliateUrl: product.affiliateUrl,
  }
  const json = new TextEncoder().encode(JSON.stringify(payload))
  return {
    id: product.id,
    category: product.category,
    envelope: toB64(xorBytes(json, KEY)),
  }
}

/** Open a sealed product when it becomes the active rung (or history). */
export function openProduct(sealed: SealedProduct): Product {
  const raw = new TextDecoder().decode(xorBytes(fromB64(sealed.envelope), KEY))
  const payload = JSON.parse(raw) as SecretPayload
  return {
    id: sealed.id,
    category: sealed.category,
    title: payload.title,
    brand: payload.brand,
    price: payload.price,
    listPrice: payload.listPrice,
    rating: payload.rating,
    reviews: payload.reviews,
    prime: payload.prime,
    blurb: payload.blurb,
    asin: payload.asin,
    imageUrl: payload.imageUrl,
    affiliateUrl: payload.affiliateUrl,
  }
}

export function sealLadder(products: readonly Product[]): SealedProduct[] {
  return products.map(sealProduct)
}

/**
 * Patches GET /products/:id so:
 * - nested variantTypes / variants ids resolve to the parent product
 * - numericId (e.g. 1) resolves like /products/1 alongside string id (prod_001)
 */
import { Service } from 'json-server/lib/service.js'

const origFindById = Service.prototype.findById
Service.prototype.findById = function patchedFindById(name, id, query) {
  const item = origFindById.call(this, name, id, query)
  if (item !== undefined) return item
  if (name !== 'products') return undefined
  const q = query ?? {}
  const products = this.find(name, {
    where: {},
    sort: undefined,
    page: undefined,
    perPage: undefined,
    embed: q['_embed'],
  })
  if (!Array.isArray(products)) return undefined
  return products.find(
    (p) =>
      p.variantTypes?.some((vt) => vt?.id === id) ||
      p.variants?.some((v) => v?.id === id) ||
      (p.numericId != null && String(p.numericId) === String(id)),
  )
}

await import('json-server/lib/bin.js')

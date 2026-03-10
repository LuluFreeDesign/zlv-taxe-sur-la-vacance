import { CommuneData } from '@/data/communes';

/**
 * Optimized search engine for communes
 * Uses indexed data structures for O(1) and O(log n) lookups
 */
export class CommuneSearchEngine {
  private byInseeCode: Map<string, CommuneData>;
  private byNameLower: Map<string, CommuneData[]>;
  private nameStartsWith: Map<string, CommuneData[]>;
  private allCommunes: CommuneData[];

  constructor(communes: CommuneData[]) {
    this.allCommunes = communes;
    this.byInseeCode = new Map();
    this.byNameLower = new Map();
    this.nameStartsWith = new Map();

    this.indexCommunes(communes);
  }

  private indexCommunes(communes: CommuneData[]): void {
    for (const commune of communes) {
      // Index by INSEE code (exact match)
      if (commune.inseeCode) {
        this.byInseeCode.set(commune.inseeCode, commune);
      }

      // Index by full name lowercase (for exact match fallback)
      const nameLower = commune.name.toLowerCase();
      if (!this.byNameLower.has(nameLower)) {
        this.byNameLower.set(nameLower, []);
      }
      this.byNameLower.get(nameLower)!.push(commune);

      // Index by name prefix (first 2+ chars)
      for (let i = 2; i <= commune.name.length; i++) {
        const prefix = commune.name.substring(0, i).toLowerCase();
        if (!this.nameStartsWith.has(prefix)) {
          this.nameStartsWith.set(prefix, []);
        }
        this.nameStartsWith.get(prefix)!.push(commune);
      }
    }
  }

  /**
   * Fast search that prioritizes exact matches, then prefixes
   */
  search(query: string, limit: number = 10): CommuneData[] {
    const trimmed = query.trim();
    if (trimmed.length < 2) return [];

    const results: CommuneData[] = [];
    const seen = new Set<string>();

    // 1. Try exact INSEE code match first (fastest)
    if (this.byInseeCode.has(trimmed)) {
      const commune = this.byInseeCode.get(trimmed)!;
      results.push(commune);
      seen.add(commune.name + commune.inseeCode);
      if (results.length >= limit) return results;
    }

    // 2. Try exact name match (case-insensitive)
    const nameLower = trimmed.toLowerCase();
    const exactMatches = this.byNameLower.get(nameLower);
    if (exactMatches) {
      for (const commune of exactMatches) {
        const key = commune.name + commune.inseeCode;
        if (!seen.has(key)) {
          results.push(commune);
          seen.add(key);
          if (results.length >= limit) return results;
        }
      }
    }

    // 3. Try prefix matches (name starts with)
    const prefixKey = trimmed.substring(0, Math.min(trimmed.length, 3)).toLowerCase();
    const prefixMatches = this.nameStartsWith.get(prefixKey);
    if (prefixMatches) {
      for (const commune of prefixMatches) {
        const key = commune.name + commune.inseeCode;
        if (!seen.has(key)) {
          results.push(commune);
          seen.add(key);
          if (results.length >= limit) return results;
        }
      }
    }

    // 4. Fallback: partial name match
    const queryLower = trimmed.toLowerCase();
    for (const commune of this.allCommunes) {
      if (results.length >= limit) break;
      const key = commune.name + commune.inseeCode;
      if (!seen.has(key) && commune.name.toLowerCase().includes(queryLower)) {
        results.push(commune);
        seen.add(key);
      }
    }

    return results;
  }

  /**
   * Exact match by name or INSEE code
   */
  findExactMatch(query: string): CommuneData | undefined {
    const trimmed = query.trim();

    // Try INSEE code exact match
    if (this.byInseeCode.has(trimmed)) {
      return this.byInseeCode.get(trimmed);
    }

    // Try name exact match
    const matches = this.byNameLower.get(trimmed.toLowerCase());
    return matches?.[0];
  }

  /**
   * Get commune by INSEE code (O(1))
   */
  getByInseeCode(code: string): CommuneData | undefined {
    return this.byInseeCode.get(code);
  }
}

// Singleton instance - created once per app
let searchEngine: CommuneSearchEngine | null = null;

export function initializeSearchEngine(communes: CommuneData[]): void {
  searchEngine = new CommuneSearchEngine(communes);
}

export function getSearchEngine(): CommuneSearchEngine {
  if (!searchEngine) {
    throw new Error('Search engine not initialized. Call initializeSearchEngine first.');
  }
  return searchEngine;
}

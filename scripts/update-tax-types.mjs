// Réconciliation du champ `taxType` de src/data/communes.ts avec les sources opendata officielles.
//
// Sources (les deux désignées par l'équipe ZLV) :
//   - TLV  : décret n°2025-1267 du 22/12/2025 — jeu "liste-des-communes-selon-le-zonage-tlv-1"
//            (ressource CSV "Zonage TLV", colonne "Zonage TLV post décret 22/12/2025").
//            TLV si la zone vaut "1. Zone tendue" ou "2. Zone touristique et tendue".
//   - THLV : délibérations de fiscalité directe locale 2025
//            (jeu "deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux"),
//            THLV si le champ `thlvdat` (date de délibération) est renseigné.
//   La TLV prime sur la THLV (une commune en zone tendue ne lève pas la THLV).
//
// Le script ne touche QUE la valeur de `taxType` : `name`, `inseeCode`, `postalCode`
// sont préservés (les CSV opendata ne contiennent pas le code postal).
//
// Usage : node scripts/update-tax-types.mjs   (depuis la racine du dépôt)

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const COMMUNES_PATH = join(__dirname, '..', 'src', 'data', 'communes.ts');

const TLV_DATASET = 'liste-des-communes-selon-le-zonage-tlv-1';
const TLV_FALLBACK_CSV =
  'https://static.data.gouv.fr/resources/liste-des-communes-selon-le-zonage-tlv-1/20251230-094759/zonage-tlv-decret-22-dec-2025.csv';
const DELIB_EXPORT =
  'https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/' +
  'deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux/exports/csv' +
  '?select=depcom,libcom,indtlv,thlvdat&delimiter=%3B';

const TLV_ZONES = new Set(['1. Zone tendue', '2. Zone touristique et tendue']);

// --- petits utilitaires ---
async function fetchText(url, label) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Téléchargement ${label} échoué : HTTP ${res.status} (${url})`);
  return res.text();
}

// Parseur CSV minimal gérant guillemets et le délimiteur ';'.
function parseCsv(text, delimiter = ';') {
  text = text.replace(/^﻿/, ''); // BOM
  const rows = [];
  let field = '', row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === delimiter) { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c === '\r') { /* ignore */ }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift().map((h) => h.trim());
  return rows
    .filter((r) => r.length > 1)
    .map((r) => Object.fromEntries(header.map((h, idx) => [h, (r[idx] ?? '').trim()])));
}

const stripAccents = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
const normName = (s) => stripAccents(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const depOf = (insee) => (/^(2A|2B)/.test(insee) ? insee.slice(0, 2) : insee.slice(0, 2));

async function resolveTlvCsvUrl() {
  try {
    const meta = JSON.parse(
      await fetchText(`https://www.data.gouv.fr/api/1/datasets/${TLV_DATASET}/`, 'métadonnées TLV')
    );
    const csv = (meta.resources || []).find((r) => (r.format || '').toLowerCase() === 'csv' && r.url);
    if (csv) return csv.url;
  } catch (e) {
    console.warn(`⚠️  Résolution dynamique de la ressource TLV impossible (${e.message}), URL de repli utilisée.`);
  }
  return TLV_FALLBACK_CSV;
}

async function main() {
  console.log('→ Téléchargement des sources opendata…');
  const tlvUrl = await resolveTlvCsvUrl();
  const [tlvCsv, delibCsv] = await Promise.all([
    fetchText(tlvUrl, 'CSV zonage TLV'),
    fetchText(DELIB_EXPORT, 'export délibérations THLV'),
  ]);

  // 1) Zonage TLV (clé CODGEO25)
  const tlvRows = parseCsv(tlvCsv);
  const tlvCol = 'Zonage TLV post décret 22/12/2025';
  const tlvSet = new Set();
  for (const r of tlvRows) if (TLV_ZONES.has(r[tlvCol])) tlvSet.add(r['CODGEO25']);
  const decGeo = new Set(tlvRows.map((r) => r['CODGEO25'])); // géographie de référence (== communes.ts)
  console.log(`  TLV (décret) : ${tlvSet.size} communes / ${decGeo.size} au total`);

  // 2) Délibérations THLV (clé depcom)
  const delibRows = parseCsv(delibCsv);
  const thlvSet = new Set();
  const thlvByDep = new Map(); // dep -> Map(normName -> [depcom])  (pour le rattachement commune nouvelle)
  for (const r of delibRows) {
    if (!r['thlvdat']) continue;
    thlvSet.add(r['depcom']);
    const dep = depOf(r['depcom']);
    if (!thlvByDep.has(dep)) thlvByDep.set(dep, new Map());
    const m = thlvByDep.get(dep);
    const k = normName(r['libcom']);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(r['depcom']);
  }
  console.log(`  THLV (délibérations) : ${thlvSet.size} communes`);

  // 3) Référence taxType par code INSEE (sur la géographie du décret = celle de communes.ts)
  const ref = new Map();
  for (const code of decGeo) {
    if (tlvSet.has(code)) ref.set(code, 'TLV');
    else if (thlvSet.has(code)) ref.set(code, 'THLV');
    else ref.set(code, 'NONE');
  }

  // 3bis) Lecture de communes.ts (pour l'index nom + dép, et le patch)
  const original = readFileSync(COMMUNES_PATH, 'utf8');
  const lines = original.split('\n');
  const lineRe = /^(\s*\{\s*name:\s*"(?<name>[^"]*)",\s*inseeCode:\s*"(?<insee>[^"]+)".*?taxType:\s*")(?<tax>TLV|THLV|NONE)("\s*\},?\s*)$/;

  const zlvByDep = new Map(); // dep -> Map(normName -> [insee])
  for (const line of lines) {
    const m = line.match(lineRe);
    if (!m) continue;
    const dep = depOf(m.groups.insee);
    if (!zlvByDep.has(dep)) zlvByDep.set(dep, new Map());
    const mm = zlvByDep.get(dep);
    const k = normName(m.groups.name);
    if (!mm.has(k)) mm.set(k, []);
    mm.get(k).push(m.groups.insee);
  }

  // 4) Rattachement commune nouvelle : THLV délibérée sous un code absent de la géographie actuelle.
  const remapped = [];
  const unmatched = [];
  for (const r of delibRows) {
    if (!r['thlvdat'] || decGeo.has(r['depcom'])) continue; // déjà couvert par l'INSEE direct
    const dep = depOf(r['depcom']);
    const cand = (zlvByDep.get(dep)?.get(normName(r['libcom']))) || [];
    if (cand.length === 1 && ref.get(cand[0]) === 'NONE') {
      ref.set(cand[0], 'THLV');
      remapped.push({ from: r['depcom'], to: cand[0], name: r['libcom'], date: r['thlvdat'] });
    } else {
      unmatched.push({ code: r['depcom'], name: r['libcom'], date: r['thlvdat'], cand });
    }
  }

  // 5) Application : remplacement de taxType ligne par ligne
  const transitions = new Map(); // "FROM→TO" -> count
  let changed = 0;
  const out = lines.map((line) => {
    const m = line.match(lineRe);
    if (!m) return line;
    const want = ref.get(m.groups.insee);
    if (!want || want === m.groups.tax) return line;
    const key = `${m.groups.tax} → ${want}`;
    transitions.set(key, (transitions.get(key) || 0) + 1);
    changed++;
    return `${m[1]}${want}${m[5]}`;
  });

  // 6) En-tête : date + sources
  const today = new Date().toISOString().slice(0, 10).split('-').reverse().join('/');
  let text = out.join('\n');
  text = text.replace(
    /^\/\/ Liste des communes[\s\S]*?\n\nexport type TaxType/,
    `// Liste des communes et leur fiscalité sur les logements vacants
// Mise à jour : ${today} (script scripts/update-tax-types.mjs)
// TLV = Taxe sur les Logements Vacants (zones tendues)
// THLV = Taxe d'Habitation sur les Logements Vacants
// NONE = Aucune taxe spécifique
// Sources opendata :
//   - TLV  : décret n°2025-1267 du 22/12/2025 — data.gouv.fr "${TLV_DATASET}"
//   - THLV : délibérations 2025 — data.economie.gouv.fr "deliberations-de-fiscalite-directe-locale-des-communes-2025-hors-taux" (champ thlvdat)

export type TaxType`
  );

  writeFileSync(COMMUNES_PATH, text);

  // --- Résumé ---
  console.log(`\n✅ ${changed} communes mises à jour dans src/data/communes.ts`);
  for (const [k, v] of [...transitions.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`   ${k.padEnd(14)} : ${v}`);
  }
  if (remapped.length) {
    console.log(`\n↪︎  Rattachements commune nouvelle (THLV, par nom + département) :`);
    for (const x of remapped) console.log(`   ${x.from} → ${x.to}  ${x.name} (THLV ${x.date})`);
  }
  if (unmatched.length) {
    console.log(`\n⚠️  THLV délibérée sous un code hors géographie actuelle, SANS rattachement automatique (à traiter à la main) :`);
    for (const x of unmatched) console.log(`   ${x.code} ${x.name} (THLV ${x.date}) — candidats ZLV: ${x.cand.length ? x.cand.join(', ') : 'aucun'}`);
  }

  // Distribution finale
  const dist = { TLV: 0, THLV: 0, NONE: 0 };
  for (const line of text.split('\n')) {
    const m = line.match(lineRe);
    if (m) dist[ref.get(m.groups.insee) ?? m.groups.tax]++;
  }
  console.log(`\nDistribution finale : TLV ${dist.TLV} / THLV ${dist.THLV} / NONE ${dist.NONE}`);
}

main().catch((e) => {
  console.error('❌', e);
  process.exit(1);
});

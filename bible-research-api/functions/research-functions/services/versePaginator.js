import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const VERSES_PER_PAGE = 8;
export const DEFAULT_VERSE_DATA_PATH = new URL('./verses_john.json', import.meta.url);

let cachedVerseIndex = null;
let dataSource = DEFAULT_VERSE_DATA_PATH;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function setVerseDataPath(newPath) {
  if (typeof newPath !== 'string' && !(newPath instanceof URL)) {
    throw new TypeError('newPath must be a string or URL');
  }

  dataSource = newPath instanceof URL ? newPath : path.resolve(__dirname, newPath);
  cachedVerseIndex = null;
}

export function resetVerseDataCache() {
  cachedVerseIndex = null;
  dataSource = DEFAULT_VERSE_DATA_PATH;
}

export function getVerseReferencesForPage(book, pageNum, options = {}) {
  assertBook(book);
  assertPageNumber(pageNum);

  const { pageSize = VERSES_PER_PAGE } = options;
  assertPageSize(pageSize);

  const verseIndex = ensureVerseIndex();
  const normalizedBook = normalizeBookName(book);
  const bookRecord = verseIndex.get(normalizedBook);

  if (!bookRecord) {
    throw new Error(`No verse data available for book "${book}"`);
  }

  const totalPages = bookRecord.verses.length === 0 ? 0 : Math.ceil(bookRecord.verses.length / pageSize);
  const startIndex = (pageNum - 1) * pageSize;

  const verseReferences =
    startIndex >= bookRecord.verses.length
      ? []
      : bookRecord.verses.slice(startIndex, startIndex + pageSize);

  return Object.freeze({
    verseReferences: Object.freeze([...verseReferences]),
    pageNumber: pageNum,
    book: bookRecord.bookName,
    pageCount: totalPages
  });
}

function ensureVerseIndex() {
  if (cachedVerseIndex) {
    return cachedVerseIndex;
  }

  const entries = loadVerseData(dataSource);
  cachedVerseIndex = buildVerseIndex(entries);
  return cachedVerseIndex;
}

function loadVerseData(source) {
  const dataPath = resolveDataPath(source);

  if (!fs.existsSync(dataPath)) {
    throw new Error(`Verse data file not found at ${dataPath}`);
  }

  const rawContent = fs.readFileSync(dataPath, 'utf8');
  let parsed;

  try {
    parsed = JSON.parse(rawContent);
  } catch (error) {
    throw new Error(`Failed to parse verse data: ${error.message}`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error('Verse data file must contain an array of entries');
  }

  return parsed;
}

function buildVerseIndex(entries) {
  const map = new Map();

  for (const entry of entries) {
    if (!isValidEntry(entry)) {
      continue;
    }

    const normalizedKey = normalizeBookName(entry.book);
    const canonicalBookName = entry.book.trim();

    if (!map.has(normalizedKey)) {
      map.set(normalizedKey, { bookName: canonicalBookName, verses: [] });
    }

    const record = map.get(normalizedKey);
    record.bookName = canonicalBookName;
    record.verses.push(entry.verse_citation);
  }

  for (const [key, value] of map.entries()) {
    map.set(
      key,
      Object.freeze({
        bookName: value.bookName,
        verses: Object.freeze([...value.verses])
      })
    );
  }

  return map;
}

function resolveDataPath(source) {
  if (source instanceof URL) {
    return fileURLToPath(source);
  }

  if (typeof source === 'string') {
    return path.isAbsolute(source) ? source : path.resolve(__dirname, source);
  }

  throw new TypeError('Data source must be a string path or file URL');
}

function normalizeBookName(value) {
  return value.trim().toLowerCase();
}

function isValidEntry(entry) {
  return (
    entry &&
    typeof entry.book === 'string' &&
    entry.book.trim() !== '' &&
    typeof entry.verse_citation === 'string' &&
    entry.verse_citation.trim() !== ''
  );
}

function assertBook(book) {
  if (typeof book !== 'string' || book.trim() === '') {
    throw new TypeError('book must be a non-empty string');
  }
}

function assertPageNumber(pageNum) {
  if (!Number.isInteger(pageNum) || pageNum <= 0) {
    throw new RangeError('pageNum must be a positive integer');
  }
}

function assertPageSize(pageSize) {
  if (!Number.isInteger(pageSize) || pageSize <= 0) {
    throw new RangeError('pageSize must be a positive integer');
  }
}

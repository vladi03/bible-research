import fetch from "node-fetch";

const DEFAULT_ENDPOINTS = Object.freeze({
  verses: "https://velocitech.ent.us-central1.gcp.cloud.es.io/api/as/v1/engines/verses-rich/search",
  sections: "https://velocitech.ent.us-central1.gcp.cloud.es.io/api/as/v1/engines/verse-sections/search"
});

const DEFAULT_VERSE_REQUEST = Object.freeze({
  query: "",
  filters: {
    all: [
      {
        verse_citation: []
      }
    ]
  },
  page: {
    current: 1,
    size: 10
  },
  result_fields: {
    context: { raw: {} },
    parallel_translations: { raw: {} },
    verse_citation: { raw: {} },
    book: { raw: {} },
    chapter: { raw: {} },
    verse: { raw: {} },
    original_words: { raw: {} },
    verse_cross_ref: { raw: {} },
    ai_commentaries: { raw: {} },
    section_id: { raw: {} }
  }
});

const DEFAULT_SECTION_REQUEST = Object.freeze({
  query: "",
  filters: {
    all: [
      {
        verses_in_the_group: []
      }
    ]
  },
  page: {
    current: 1,
    size: 10
  },
  result_fields: {
    id: { raw: {} },
    title: { raw: {} },
    verses_in_the_group: { raw: {} },
    theological_perspective: { raw: {} },
    pastoral_perspective: { raw: {} },
    literal_perspective: { raw: {} }
  }
});

const BIBLE_BOOK_ORDER = [
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Songs",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation"
];

const BOOK_ORDER_MAP = new Map(
  BIBLE_BOOK_ORDER.map((book, index) => [book.toLowerCase(), index])
);

const DEFAULT_CLIENT_OPTIONS = Object.freeze({
  apiKey: process.env.ELASTIC_APP_SEARCH_API_KEY,
  verseRequest: DEFAULT_VERSE_REQUEST,
  sectionRequest: DEFAULT_SECTION_REQUEST,
  endpoints: DEFAULT_ENDPOINTS
});

/**
 * Build the request headers required by Elastic App Search.
 * @param {string | undefined} apiKey
 * @returns {Record<string, string>}
 */
function buildHeaders(apiKey) {
  if (!apiKey) {
    throw new Error(
      "Missing Elastic App Search API key. Set ELASTIC_APP_SEARCH_API_KEY environment variable or pass apiKey option."
    );
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`
  };
}

/**
 * Execute a JSON POST against the Elastic App Search endpoint.
 * @param {string} url
 * @param {unknown} payload
 * @param {string} apiKey
 * @returns {Promise<any>}
 */
async function executeSearch(url, payload, apiKey) {
  const response = await fetch(url, {
    method: "POST",
    headers: buildHeaders(apiKey),
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Elastic search request failed (${response.status} ${response.statusText}): ${text}`);
  }

  return response.json();
}

/**
 * Parse JSON when the raw Elastic field is provided as a string.
 * @param {unknown} value
 * @returns {unknown}
 */
function parseJsonIfString(value) {
  if (typeof value !== "string") {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
}

/**
 * Apply JSON parsing for each entry in an array field.
 * @param {unknown} raw
 * @returns {unknown}
 */
function parseJsonArray(raw) {
  if (!Array.isArray(raw)) {
    return parseJsonIfString(raw);
  }

  return raw.map((entry) => parseJsonIfString(entry));
}

/**
 * Convert the context field into a structured object when possible.
 * @param {unknown[]} rawContext
 * @returns {object | null}
 */
function parseContext(rawContext) {
  if (!Array.isArray(rawContext) || rawContext.length === 0) {
    return null;
  }

  const [first] = rawContext;
  const parsed = parseJsonIfString(first);

  if (parsed && typeof parsed === "object") {
    return parsed;
  }

  return { body: first };
}

/**
 * Deep clone a request template to avoid mutating the defaults.
 * @param {object} baseRequest
 * @returns {object}
 */
function cloneRequestTemplate(baseRequest) {
  return JSON.parse(JSON.stringify(baseRequest));
}

/**
 * Ensure a verse list exists and is iterable.
 * @param {unknown} versesList
 * @returns {string[]}
 */
function sanitizeVerseList(versesList) {
  if (!Array.isArray(versesList) || versesList.length === 0) {
    throw new Error("Provide a non-empty array of verse citations.");
  }

  return versesList;
}

function parseVerseReference(reference) {
  if (typeof reference !== "string") {
    return null;
  }

  const match = reference.match(/^(?<book>.+?)\s+(?<chapter>\d+):(?<verse>\d+)$/);

  if (!match || !match.groups) {
    return null;
  }

  const book = match.groups.book.trim();
  const chapter = Number.parseInt(match.groups.chapter, 10);
  const verse = Number.parseInt(match.groups.verse, 10);

  if (Number.isNaN(chapter) || Number.isNaN(verse)) {
    return null;
  }

  const orderIndex = BOOK_ORDER_MAP.get(book.toLowerCase());

  return {
    book,
    chapter,
    verse,
    orderIndex: typeof orderIndex === "number" ? orderIndex : Number.POSITIVE_INFINITY
  };
}

function compareVerseReferences(a, b) {
  const parsedA = parseVerseReference(a);
  const parsedB = parseVerseReference(b);

  if (!parsedA && !parsedB) {
    return String(a).localeCompare(String(b));
  }

  if (!parsedA) {
    return 1;
  }

  if (!parsedB) {
    return -1;
  }

  if (parsedA.orderIndex !== parsedB.orderIndex) {
    return parsedA.orderIndex - parsedB.orderIndex;
  }

  if (parsedA.chapter !== parsedB.chapter) {
    return parsedA.chapter - parsedB.chapter;
  }

  if (parsedA.verse !== parsedB.verse) {
    return parsedA.verse - parsedB.verse;
  }

  return 0;
}

function sortVerseList(versesList) {
  const unique = Array.from(new Set(versesList));
  unique.sort(compareVerseReferences);
  return unique;
}

function buildVerseOrderMap(verses) {
  return verses.reduce((acc, reference, index) => {
    acc.set(reference, index);
    return acc;
  }, new Map());
}

function getPrimaryCitation(value) {
  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return value ?? null;
}

function compareVersesUsingOrderMap(a, b, orderMap) {
  const citationA = getPrimaryCitation(a.verseCitation);
  const citationB = getPrimaryCitation(b.verseCitation);

  const indexA = typeof citationA === "string" && orderMap.has(citationA) ? orderMap.get(citationA) : Number.POSITIVE_INFINITY;
  const indexB = typeof citationB === "string" && orderMap.has(citationB) ? orderMap.get(citationB) : Number.POSITIVE_INFINITY;

  if (indexA !== indexB) {
    return indexA - indexB;
  }

  return compareVerseReferences(citationA, citationB);
}

function smallestOrderIndex(verseGroup, orderMap) {
  if (!Array.isArray(verseGroup)) {
    return Number.POSITIVE_INFINITY;
  }

  return verseGroup.reduce((min, reference) => {
    if (orderMap.has(reference)) {
      return Math.min(min, orderMap.get(reference));
    }

    const parsed = parseVerseReference(reference);
    if (!parsed) {
      return min;
    }

    const fallbackIndex = parsed.orderIndex * 10000 + parsed.chapter * 100 + parsed.verse;
    return Math.min(min, fallbackIndex);
  }, Number.POSITIVE_INFINITY);
}

function compareSectionsUsingOrderMap(a, b, orderMap) {
  const indexA = smallestOrderIndex(a.versesInTheGroup, orderMap);
  const indexB = smallestOrderIndex(b.versesInTheGroup, orderMap);

  if (indexA !== indexB) {
    return indexA - indexB;
  }

  const citationA = getPrimaryCitation(a.versesInTheGroup);
  const citationB = getPrimaryCitation(b.versesInTheGroup);

  return compareVerseReferences(citationA, citationB);
}

function withVerseFilters(request, versesList) {
  const nextRequest = cloneRequestTemplate(request);
  nextRequest.filters = nextRequest.filters ?? {};
  nextRequest.filters.all = [{ verse_citation: versesList }];
  return nextRequest;
}

function withSectionFilters(request, versesList) {
  const nextRequest = cloneRequestTemplate(request);
  nextRequest.filters = nextRequest.filters ?? {};
  nextRequest.filters.all = [{ verses_in_the_group: versesList }];
  return nextRequest;
}

/**
 * Execute the verses search endpoint with caller-provided overrides.
 * @param {object} [options]
 * @returns {Promise<any>}
 */
export async function searchVerses(options = {}) {
  const { apiKey, verseRequest, endpoints } = { ...DEFAULT_CLIENT_OPTIONS, ...options };
  return executeSearch(endpoints.verses, verseRequest, apiKey);
}

/**
 * Execute the verse sections search endpoint with caller-provided overrides.
 * @param {object} [options]
 * @returns {Promise<any>}
 */
export async function searchVerseSections(options = {}) {
  const { apiKey, sectionRequest, endpoints } = { ...DEFAULT_CLIENT_OPTIONS, ...options };
  return executeSearch(endpoints.sections, sectionRequest, apiKey);
}

/**
 * Retrieve verses and associated section commentaries, returning structured results.
 * @param {string[]} versesList
 * @param {object} [options]
 * @returns {Promise<{ verses: any[]; sectionCommentaries: any[] }>}
 */
export async function fetchVerseAndSectionData(versesList, options = {}) {
  const normalizedVerses = sanitizeVerseList(versesList);
  const sortedVerses = sortVerseList(normalizedVerses);
  const verseOrderMap = buildVerseOrderMap(sortedVerses);

  const { apiKey, verseRequest: baseVerseRequest, sectionRequest: baseSectionRequest, endpoints } = {
    ...DEFAULT_CLIENT_OPTIONS,
    ...options
  };

  const verseRequest = withVerseFilters(baseVerseRequest, sortedVerses);
  const sectionRequest = withSectionFilters(baseSectionRequest, sortedVerses);

  const [versesResponse, sectionsResponse] = await Promise.all([
    searchVerses({ apiKey, verseRequest, endpoints }),
    searchVerseSections({ apiKey, sectionRequest, endpoints })
  ]);

  const verses = (versesResponse.results || [])
    .map((result) => ({
      id: result._meta?.id ?? result.id?.raw ?? null,
      verseCitation: result.verse_citation?.raw ?? [],
      book: result.book?.raw ?? null,
      chapter: result.chapter?.raw ?? null,
      verse: result.verse?.raw ?? null,
      context: parseContext(result.context?.raw),
      aiCommentaries: parseJsonArray(result.ai_commentaries?.raw ?? []),
      originalWords: parseJsonArray(result.original_words?.raw ?? []),
      parallelTranslations: parseJsonArray(result.parallel_translations?.raw ?? []),
      sectionId: result.section_id?.raw ?? null
    }))
    .sort((a, b) => compareVersesUsingOrderMap(a, b, verseOrderMap));

  const sectionCommentaries = (sectionsResponse.results || [])
    .map((result) => ({
      id: result.id?.raw ?? null,
      title: result.title?.raw ?? null,
      versesInTheGroup: result.verses_in_the_group?.raw ?? [],
      theologicalPerspective: result.theological_perspective?.raw ?? null,
      pastoralPerspective: result.pastoral_perspective?.raw ?? null,
      literalPerspective: result.literal_perspective?.raw ?? null
    }))
    .sort((a, b) => compareSectionsUsingOrderMap(a, b, verseOrderMap));

  return { verses, sectionCommentaries };
}

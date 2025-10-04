import { cors } from "./lib/utils/routeUtils.js";
import { onRequest } from "firebase-functions/https";
import { getVerseReferencesForPage as paginateVerseReferences } from "./services/versePaginator.js";
import { fetchVerseAndSectionData } from "./services/elasticSearchClient.js";

export const test = onRequest({ timeoutSeconds: 540 }, async (request, response) => {
  await cors(request, response, async () => {
    const { data } = request.body;
    try {
      response.send({ message: "Hello" });
    } catch (error) {
      console.error("Error sending email:", error);
      response.status(500).send({ error: "Failed to send email" });
    }
  });
});

export const verse = onRequest({ timeoutSeconds: 540 }, async (request, response) => {
  await cors(request, response, async () => {
    try {
      ensurePost(request);

      const { book, pageNumber, pageSize } = request.body ?? {};
      const normalizedBook = normalizeBook(book);
      const normalizedPageNumber = normalizePositiveInteger(pageNumber, "pageNumber");
      const normalizedPageSize = pageSize === undefined ? undefined : normalizePositiveInteger(pageSize, "pageSize");

      const pagination = paginateVerseReferences(
        normalizedBook,
        normalizedPageNumber,
        buildPaginationOptions(normalizedPageSize)
      );

      if (pagination.verseReferences.length === 0) {
        response.send(
          buildSchemaResponse({
            verses: [],
            sectionCommentaries: [],
            book: pagination.book,
            pageNumber: pagination.pageNumber,
            pageCount: pagination.pageCount
          })
        );
        return;
      }

      const { verses, sectionCommentaries } = await fetchVerseAndSectionData(pagination.verseReferences);

      response.send(
        buildSchemaResponse({
          verses: verses.map(normalizeVerseEntry),
          sectionCommentaries: sectionCommentaries.map(normalizeSectionEntry),
          book: pagination.book,
          pageNumber: pagination.pageNumber,
          pageCount: pagination.pageCount
        })
      );
    } catch (error) {
      if (error instanceof ClientInputError) {
        response.status(400).send({ error: error.message });
        return;
      }

      console.error("Failed to fetch verse data:", error);
      response.status(500).send({ error: "Failed to fetch verse data" });
    }
  });
});

export default { test, verse };

class ClientInputError extends Error {}

function ensurePost(request) {
  if (request.method && request.method.toUpperCase() !== "POST") {
    throw new ClientInputError("Only POST requests are supported.");
  }
}

function normalizeBook(book) {
  if (typeof book !== "string" || book.trim() === "") {
    throw new ClientInputError("Provide a non-empty book name.");
  }

  return book.trim();
}

function normalizePositiveInteger(value, fieldName) {
  const parsed = Number.parseInt(value, 10);

  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new ClientInputError(fieldName + " must be a positive integer.");
  }

  return parsed;
}

function buildPaginationOptions(pageSize) {
  if (pageSize === undefined) {
    return undefined;
  }

  return { pageSize };
}

function buildSchemaResponse({ verses, sectionCommentaries, book, pageNumber, pageCount }) {
  return {
    verses,
    sectionCommentaries,
    pageNumber,
    book,
    pageCount
  };
}

function normalizeVerseEntry(rawVerse) {
  const verseCitation = extractPrimaryString(rawVerse.verseCitation);
  const context = normalizeContext(rawVerse.context);
  const parallelTranslations = normalizeParallelTranslations(rawVerse.parallelTranslations);
  const aiCommentaries = normalizeObjectArray(rawVerse.aiCommentaries);
  const originalWords = normalizeObjectArray(rawVerse.originalWords);
  const verseCrossRef = Array.isArray(rawVerse.verse_cross_ref)
    ? rawVerse.verse_cross_ref.filter((entry) => typeof entry === "string")
    : [];

  return {
    sectionId: String(rawVerse.sectionId ?? ""),
    context,
    parallelTranslations,
    verseCitation,
    book: extractPrimaryString(rawVerse.book),
    chapter: extractPrimaryString(rawVerse.chapter),
    verse: extractPrimaryString(rawVerse.verse),
    originalWords,
    verseCrossRef,
    aiCommentaries
  };
}

function normalizeSectionEntry(rawSection) {
  const id = normalizeSectionId(rawSection.id);

  return {
    id,
    title: typeof rawSection.title === "string" ? rawSection.title : null,
    versesInTheGroup: Array.isArray(rawSection.versesInTheGroup)
      ? rawSection.versesInTheGroup.filter((entry) => typeof entry === "string")
      : [],
    theologicalPerspective:
      typeof rawSection.theologicalPerspective === "string" ? rawSection.theologicalPerspective : null,
    pastoralPerspective:
      typeof rawSection.pastoralPerspective === "string" ? rawSection.pastoralPerspective : null,
    literalPerspective:
      typeof rawSection.literalPerspective === "string" ? rawSection.literalPerspective : null
  };
}

function normalizeSectionId(value) {
  const parsed = Number.parseInt(value, 10);

  if (Number.isInteger(parsed)) {
    return parsed;
  }

  throw new Error("Invalid section id: " + value);
}

function extractPrimaryString(value) {
  if (Array.isArray(value)) {
    const [first] = value;
    return first === undefined || first === null ? "" : String(first);
  }

  if (value === undefined || value === null) {
    return "";
  }

  return String(value);
}

function normalizeContext(context) {
  if (!context) {
    return [];
  }

  if (Array.isArray(context)) {
    return context.filter((entry) => entry && typeof entry === "object");
  }

  if (typeof context === "object") {
    return [context];
  }

  return [];
}

function normalizeParallelTranslations(value) {
  if (!value) {
    return {};
  }

  if (Array.isArray(value)) {
    return value.reduce((acc, entry) => {
      if (entry && typeof entry === "object") {
        Object.assign(acc, extractStringProperties(entry));
      }
      return acc;
    }, {});
  }

  if (typeof value === "object") {
    return extractStringProperties(value);
  }

  if (typeof value === "string") {
    return { esv: value };
  }

  return {};
}

function extractStringProperties(source) {
  return Object.entries(source).reduce((acc, [key, val]) => {
    if (typeof val === "string") {
      acc[key] = val;
    }
    return acc;
  }, {});
}

function normalizeObjectArray(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((entry) => entry && typeof entry === "object");
}

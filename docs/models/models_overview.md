# Application Data Models Overview

## Core identity & access
- **User** — account, profile, preferences. Connects to studies, posts, annotations, and groups.
- **Organization** — optional workspace for churches/ministries.
- **Group** — class or small-group container.
- **Membership / GroupMembership** — link users to organizations/groups with roles.
- **StudyAccess** — defines permissions per study.

## Scripture content
- **BibleVersion** — translation metadata (ESV, KJV, NASB).
- **BibleBook** — canonical book info.
- **Verse** — normalized verse text.
- **Passage** — saved selections of verses.
- **PassageContext** — curated or generated context for a passage.
- **CrossReference** — links between verses.
- **Topic** — tags for theology/subjects.

## Study authoring & publishing
- **Study** — main study container.
- **StudyVersion** — versioned snapshots.
- **StudySection** — ordered sections of a study.
- **ContentBlock** — typed block (text, scripture, callout, etc.).
- **Question** — participant prompts.
- **Handout** — rendered participant documents.
- **Template** — reusable study scaffolds.
- **SavedSelection** — initial Bible selection.
- **Citation** — structured references to sources.
- **CommentThread** — inline review comments.

## Sources, retrieval, and AI
- **SourceWork** — commentary/theological work.
- **SourceChunk** — text segments from sources.
- **Embedding** — vector representation.
- **VectorIndex** — index of embeddings.
- **PromptSession** — iterative Q&A study builder.
- **PromptTurn** — each Q/A step in a session.

## Social & collaboration
- **Post** — shared insights or studies.
- **Reaction** — amen/like/insightful responses.
- **Follow** — user-to-user connections.
- **ShareLink** — public tokens for sharing.

## Notes, personalization, and content assets
- **Annotation** — highlights/notes on verses or studies.
- **Attachment** — uploaded files.
- **Preference** — per-user settings.

## System & operations
- **Notification** — alerts and updates.
- **AuditLog** — records of changes.
- **Tag** — general-purpose labels.

---

## Interaction Flow
1. **Bible Interaction** → User creates a **SavedSelection** → becomes a **Passage**/**PassageContext** → seeds a **Study**/**StudyVersion** with **StudySections**/**ContentBlocks**.
2. Authoring uses **PromptSession**/**PromptTurn** pulling from **VectorIndex** (via **SourceWork**/**SourceChunk**/**Embedding**) to suggest citations.
3. The **Study** is shared through **StudyAccess**, published as **Handout**, or posted via **Post**. Readers engage with **Reaction**, **CommentThread**, and **Annotation**.
4. **Notification**s and **AuditLog** track changes and activity.


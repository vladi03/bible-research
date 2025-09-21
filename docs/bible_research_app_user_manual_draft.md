# New Bible App — User Manual (User‑Facing Guide)

> Version: Draft 1 • Target platforms: Web (React SPA)

---

## 1) What this app is
A modern Bible study workspace that brings Scripture, trusted insights (commentaries & theologians), and your own study materials into one place. You can read any supported English translation, explore verse context, pull in insights, and generate shareable studies for teachers and participants. Optional group features let you discuss and share within your class or cohort.

---

## 2) Core concepts
- **Bible Interaction**: Your primary reading and research workspace for any passage.
- **Insights**: Commentary and theology snippets relevant to the currently selected verses.
- **Studies**: Structured documents you create from passages or topics (Teacher Study or Participant Handout).
- **Groups (optional)**: Share studies and reflections with a private audience.
- **Resources**: Bibles (ESV, KJV, NASB), commentaries, theologians—queried through the app’s APIs.

---

## 3) Getting started
1. **Sign in** (or continue as guest if available).
2. Pick your **default Bible version** (you can change per passage later).
3. Land on **Bible Interaction**.
4. Use the **reference box** to open a passage (e.g., `John 3:16–21`).
5. Toggle which insights you want to see: **Commentaries** and/or **Theologians**.
6. Optionally, press **Create Study** to scaffold a Teacher Study or Participant Handout.

---

## 4) Navigation & layout
- **Top menu**: **Bible Interaction**, **Existing Studies**, **New Topic Study**.
- **Command Palette** (⌘/Ctrl + K): Jump to a reference, open a study, insert blocks in the editor, switch versions.
- **Panels** (in Bible Interaction):
  - **Center**: Verse Main Area (selected passage), inline verse numbering, copy/citation tools.
  - **Right Insights Drawer**: Tabs for **Commentaries**, **Theologies**, and **Personal Studies** (studies you previously created that reference the current verses).
  - **Context Panel**: A concise description of the surrounding verses so you always understand where your selection lives.
- **Action Bar**: Create Study, Add Note, Save Snippet, Share (if available).

---

## 5) Bible Interaction (reading & research)
### 5.1 Select a passage
- Type a reference (`Gen 12:1–9`) or navigate with next/previous chapter controls.
- Change **version** from a quick selector (ESV/KJV/NASB). The view updates instantly.

### 5.2 Verse context
- The **Context** section summarizes what happens just before and after your selected verses.
- Use this to quickly orient yourself without leaving the passage.

### 5.3 Insights: commentaries & theologians
- Turn **Commentaries** and/or **Theologians** on from the filter chips or the right rail.
- Insights are ranked for relevance to your current selection.
- Click a snippet to expand, view full citation, and **Insert into Study** (if you have a study open or are creating one).

### 5.4 Personal Studies referencing this passage
- The **Personal Studies** tab shows your previously created studies that cite any of the selected verses.
- Open a study in a new tab or quickly **Insert a block** from that study into your current one.

### 5.5 Create a study from selected verses
- Click **Create Study** → choose **Teacher Study** or **Participant Handout**.
- A study page opens with the passage attached and initial scaffolded sections.

---

## 6) Studies (authoring & sharing)
### 6.1 Study types
- **Teacher Study Detail**: For leaders; includes background, observations, interpretation, theology tie‑ins, and application.
- **Participant Handout**: Concise overview, discussion questions, application prompts, and key verses.

### 6.2 Editor experience
- **Block-based**: Add, remove, and reorder blocks—e.g., Big Idea, Context, Observations, Interpretation, Application, Discussion Questions, Notes.
- **Iterative Q&A**: A left sidebar guides you with prompts (e.g., refine main point, add cross references, balance OT/NT).
- **Insert from Insights**: When you expand an insight, use **Insert** to add it into the active block with citation.
- **Convert**: One click to convert a Teacher Study into a Participant Handout (a guided condensation tool preserves citations).
- **Live Preview**: The right pane shows the final layout in real time.

### 6.3 Saving, versions, and history
- **Auto-save** after each edit.
- **Version history**: View changes and restore earlier versions. A mini diff view highlights text edits.

### 6.4 Export & print
- **Export** to link (private or group), **PDF**, or **print-friendly** view.
- **Share** with a group (if you’re a member) or via view-only link.

---

## 7) Existing Studies (library)
- See all your studies in **grid or list**.
- Filter by **book**, **passage**, **tags**, **type** (Teacher/Participant), and **shared with**.
- Quick actions: **Open**, **Duplicate**, **Convert** (Teacher ↔ Participant), **Share**, **Archive**.

---

## 8) New Topic Study (guided creation)
- Start with a **topic** (e.g., “God’s faithfulness”) and optional **seed verses**.
- The builder suggests an **outline** and **key passages**.
- Use the **iterative Q&A** to refine: tighten application, add cross‑references, emphasize redemptive‑historical flow, etc.
- Pin/replace **sources** before finalizing your study.

---

## 9) Social (optional)
- **Groups**: Join or create a group for a class or cohort.
- **Posts**: Share short reflections tied to a verse or to a study block.
- **Threaded comments**: Keep discussion focused; everything anchors to Scripture or a study.
- **Permissions**: Choose **Private**, **Group-only**, or **Shareable link** per item.
- No public feed; the app avoids noisy, algorithmic timelines.

---

## 10) Search & discovery
- **Reference search**: Type any familiar pattern (`Ps 23`, `Jn 1:1–5`).
- **Study search**: Search titles, tags, and passages.
- **Insight search**: Within a passage, quickly filter insights by author or keyword.

---

## 11) Resources & data
- **Bible versions**: ESV, KJV, NASB are available.
- **Commentaries** & **Theologians**: Curated sources are available via the app’s vector-backed search.
- Citations accompany every inserted snippet to keep your work traceable.

---

## 12) Privacy & data control
- Your studies are **private by default**.
- You control sharing scope: **Private**, **Group**, or **Link** (view-only).
- Download your studies or delete them at any time.

---

## 13) Personalization & settings
- Set your **default Bible** (can be overridden per passage).
- Choose default **Insights toggles** (Commentaries/Theologians on/off).
- Manage **groups** and membership.
- Toggle **dark mode**, **font size**, and **line spacing**.

---

## 14) Accessibility & keyboard shortcuts
- Fully navigable with keyboard; ARIA landmarks for readers.
- High contrast mode for readability.
- **Shortcuts**:
  - ⌘/Ctrl + K: Command Palette
  - ⌘/Ctrl + F: Search within current panel
  - ⌘/Ctrl + S: Manual save (auto-save is always on)
  - ⌘/Ctrl + Shift + N: New Study

---

## 15) Offline & performance
- Recently read passages and open studies are cached for read-only access when offline.
- When online, edits sync immediately.

---

## 16) Typical workflows
### 16.1 Prepare a lesson from a passage
1) Open **Bible Interaction** and enter `Philippians 2:5–11`.
2) Read the passage and skim the **Context** summary.
3) Enable **Commentaries** and **Theologians**; pin 1–2 key insights.
4) Click **Create Study → Teacher Study**.
5) Use **Insert from Insights** to add commentary snippets with citations.
6) Build **Big Idea**, **Observations**, **Interpretation**, **Application**, and **Discussion Questions** blocks.
7) Convert to **Participant Handout**, adjust questions, and export a PDF.

### 16.2 Build a topical study
1) Go to **New Topic Study** and enter “Hope in suffering.”
2) Accept the suggested outline, swap 1–2 passages.
3) Use Q&A prompts to refine applications for your audience.
4) Finalize as **Participant Handout**, share to your group.

### 16.3 Reuse past work
1) In **Bible Interaction**, select your new passage.
2) Open **Personal Studies** tab to find older studies referencing related verses.
3) Insert a block from the old study into your new one; update citations.

---

## 17) Troubleshooting
- **I don’t see insights**: Ensure **Commentaries** or **Theologians** are toggled on; check your internet connection.
- **Wrong verse range**: Adjust the reference box; confirm hyphen/en‑dash formatting for ranges (e.g., `1–5`).
- **Can’t share**: You may not belong to a group; invite or request access first.
- **Export issues**: Try regenerating the PDF or use the print-friendly view.

---

## 18) FAQ
- **Can I change my default Bible later?** Yes, in Settings, and per passage.
- **Are my studies public?** No—never by default. You must explicitly share.
- **Can I cite sources automatically?** Yes; inserted insights carry citations.
- **Can I duplicate a study?** Yes—use the Duplicate action in Existing Studies.

---

## 19) Roadmap (visible to users)
- Personal notes per verse
- Cross‑reference graph view
- Mobile apps
- More Bible versions and commentary sets

---

## 20) Support
- Use the help icon (?) to access tutorials and contact support.
- Keyboard shortcut **⌘/Ctrl + K** → type “help” to open the help center.


# AIcoding project columns

The AIcoding page lists dy-cut and four project columns. The new columns use
`/aicoding/series/<project>`. Their HTML documents use
`/aicoding/series/<project>/documents/<file>`.

## Content

- `perfectoken`: payment architecture, gateway comparison, integration and PoC.
- `sinochem-assistant`: four HTML documents from `松澜集/docs`: user manual,
  technical handover, dated requirements review and model comparison, plus nine
  protected handbook screenshots. These are documentation snapshots, not a
  production acceptance claim for the underlying assistant.
- `funeng`: industry dashboard V2 and market dashboard V1.
- `mediaflow`: system overview and architecture, with five linked Markdown references.

The standalone HTML retains its original styles, scripts and embedded data.
Document responses add collection, previous and next links. Local workbench
links are disabled in the imported snapshots. Relative reference files remain
accessible behind the same access check.

## Update

1. Add or update the selected source paths in `scripts/sync-project-documents.py`.
2. Run `python3 scripts/sync-project-documents.py`.
3. Add the document title, filename and description in `src/lib/projectSeries.ts`.
4. Verify links and interactive behavior, then deploy the website.

The sync validates all source files and relative dependencies before replacing
snapshots. It imports selected documentation, not application entry points,
test pages or build outputs. The two funeng dashboards are prototype snapshots;
hosting them does not connect them to the production database.

To avoid updating other project snapshots, use
`python3 scripts/sync-project-documents.py --project sinochem-assistant`.
Referenced PNG/JPEG images are served as binary files behind the same whitelist
as HTML documents and are never copied into `public`.

## Access

The new columns reuse dy-cut's server-side phone whitelist and signed cookie.
`DY_CUT_APPROVED_PHONES` and `DY_CUT_ACCESS_SECRET` remain the configuration keys.
Collection pages and document routes validate access independently. Protected
documents are stored outside `public`, and document responses disable caching.
The Vercel file tracing configuration includes the imported documents.

No new production deployment is performed by the import script.

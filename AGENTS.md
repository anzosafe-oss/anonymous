# AGENTS.md — anonymous

## Priorities and scope

- Read this file before working on Anonymous. Prioritize quality, stability, and user experience over token savings.
- Start with `anzosafe-oss/anonymous`. Consult other repositories or Supabase projects when the task requires it, and limit access to relevant resources. Verify unknown resource identifiers and protect secrets.
- When the user references another MyApps application as a model, inspect its actual implementation and reuse the validated solution, adapting it to Anonymous where needed.
- Maintain visual and functional consistency across MyApps and follow established design and behavior conventions.
- Use targeted reads and avoid repeating investigations. Expand inspection and testing as needed for a reliable change.

## Implementation and verification

- Preserve existing features and behavior outside the requested scope. Keep changes focused and avoid unsolicited cleanup.
- Remove obsolete files or code only after checking direct and dynamic references, manifests, service workers, caches, and deployment configuration as applicable. Keep resources whose usage is uncertain. Do not rewrite Git history.
- Verify compatibility on iOS, Android, and desktop for application changes. Run relevant regression checks and report any platform or behavior that could not be verified.
- Summarize changed files, test results, limitations, and decisions concisely.

## Data and releases

- Use demo data only in previews and test environments. The first production release must start without demo data.
- Preserve all real user data during subsequent updates.
- Prepare application changes on a separate branch. Update the app version at release using the established versioning convention.
- Deploy to production only with the user's explicit approval.

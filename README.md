# Community Health Toolkit — UPM-SHS

A Next.js starter/MVP for the proposed UPM-SHS Community Health Toolkit: community directory, project registry, handover workflow, versioned resources, and institutional coordination directory.

## Included in this starter

- Responsive UP-inspired interface using restrained maroon, forest green, gold, white, and neutral surfaces
- Palatino/Georgia headings + Helvetica/Arial body typography
- Student dashboard and predeployment workflow
- Six current community sites: Palo, Alangalang, Dagami, Tolosa, Tanauan, Dulag
- User-provided preceptor data:
  - Alangalang — Dr. Angelita Jaya
  - Tolosa — Dr. Maria Sheryl P. Indencia
- Community profile pages
- Project registry + project detail/handover screens
- Toolkit/resource hub
- Health workforce directory with verification states
- Admin UI starter
- Supabase MVP schema + baseline RLS

## Important data rule

The starter intentionally leaves MHO/DTTB names as **Awaiting official verification**. Do not seed names from old web posts into production without an institutional source and last-verified date.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Connect Supabase

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local`.
3. Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Review and run `supabase/schema.sql` in the SQL editor.
5. Review and run `supabase/seed.sql`.
6. Replace the mock arrays in `lib/data.ts` with Supabase queries once the data governance rules are approved.

## Before production

- Use the official UP/UP Manila approved seal/logotype asset. The current circular `UP` mark is only a text placeholder and should not be treated as an official seal.
- Finalize user roles and RLS before enabling write actions.
- Do not store identifiable patient/family case data in the shared community repository.
- Add document de-identification and faculty approval before publishing student outputs to future batches.
- Add source + last verified fields to every official directory record.
- Decide whether this platform is internal-only or has a limited public information layer.

## Suggested next build sprint

1. Supabase authentication
2. Admin CRUD for communities + directory
3. Project creation/update workflow
4. Handover approval workflow
5. Resource uploads via Supabase Storage
6. Faculty review queue
7. Global search
8. Real geographic map using verified GeoJSON / coordinates

## Deploy to GitHub Pages

This copy is configured for GitHub Pages static hosting.

1. Create a GitHub repository and upload the **contents of this folder** to the repository root. Do not upload the enclosing folder as an extra nested directory.
2. Make sure the default branch is `main`.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment → Source**, choose **GitHub Actions**.
5. Push to `main`. The workflow `.github/workflows/deploy-pages.yml` will build the Next.js static export and deploy the `out/` directory.
6. Open the repository **Actions** tab to see build/deployment status.

### Why this differs from the original starter

GitHub Pages only hosts static files. This version uses `output: "export"`, generates the dynamic community/project routes at build time, automatically handles the repository base path, disables Next.js image optimization for static export, and includes the GitHub Pages deployment workflow.

### Important limitation

This is suitable for the current prototype/read-only MVP. A future full Community Health Toolkit with secure server-side authentication, protected APIs, server actions, or other server-only Next.js features should be deployed to a platform that runs Next.js server functions (for example Vercel) while keeping the source code on GitHub. Supabase client-side features can still be used on a static site, but security-sensitive authorization must remain enforced by Supabase RLS.

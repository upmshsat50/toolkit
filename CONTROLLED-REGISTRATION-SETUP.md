# Controlled Registration Setup

This version implements the recommended access model:

- **Students:** self-register with `@up.edu.ph`
- **New student accounts:** `pending`
- **Approved students:** `active`
- **Faculty / preceptor / coordinator / admin:** never self-selected; assigned by an authorized admin
- **Portal:** only `active` accounts enter the dashboard

## A. Upload the files

Replace your current website files with this package.

Important new files:
- `signup.html`
- `signup.js`
- `supabase-schema.sql`

Keep your existing configured `supabase-config.js`.

## B. Run the database setup

In your Supabase project:

1. Open the SQL Editor.
2. Paste the entire contents of `supabase-schema.sql`.
3. Run it once.

This creates:
- `profiles`
- role/status fields
- Row Level Security policies
- secure new-user trigger

Every new Auth user receives:

- role = `student`
- status = `pending`

The browser cannot make itself an admin.

## C. Enable email/password registration

In Supabase Authentication settings, make sure email/password sign-ups are enabled.

For institutional use, keep email confirmation enabled if possible.

## D. Add your production URL

For email confirmation links, set your Supabase Authentication Site URL / redirect URLs to your deployed Vercel domain.

The signup code redirects email-confirmed users to:

`/portal.html`

## E. Create your first administrator

1. Register your own UP account through `signup.html`.
2. Confirm the email.
3. In Supabase SQL Editor, run:

```sql
update public.profiles
set
  role = 'admin',
  status = 'active',
  approved_at = now()
where lower(email) = lower('YOUR_EMAIL@up.edu.ph');
```

Replace the email.

## F. Approve pilot users

For now, while we do not yet have an Admin dashboard, approve students using the Table Editor or SQL Editor:

```sql
update public.profiles
set
  status = 'active',
  approved_at = now()
where lower(email) = lower('student@up.edu.ph');
```

Later, the next phase can add a proper Admin → Pending Accounts interface with Approve / Reject / Assign Rotation buttons.

## G. Access behavior

After signup:

1. Email is registered.
2. Email is confirmed.
3. User logs in.
4. Portal reads `profiles.status`.
5. `pending` → shows Pending Approval screen.
6. `active` → opens dashboard.
7. `suspended` → access denied.
8. `archived` → access denied.

## Important security note

The publishable/anon key is safe for frontend use, but it is not a security boundary by itself.

Real protection must come from Row Level Security policies on every table we add later.

Do not place a `service_role` key or `sb_secret_...` key in browser JavaScript.


## Server-side UP Mail enforcement

The SQL trigger also rejects newly created Auth users whose email does not end in `@up.edu.ph`.

This means the restriction is not only a JavaScript/UI check.

A future admin-only backend can create an approved non-UP partner account by explicitly setting:

`app_metadata.allow_non_up_email = true`

Do not expose that ability to the browser/client.

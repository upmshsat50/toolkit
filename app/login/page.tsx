import { LoginForm } from "@/components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ setup?: string; next?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <main className="login-page">
      <section className="login-brand-panel" aria-label="Community Health Toolkit introduction">
        <div className="login-brand-lockup">
          <div className="login-brand-mark">UP</div>
          <div>
            <span>University of the Philippines Manila</span>
            <strong>School of Health Sciences</strong>
          </div>
        </div>

        <div className="login-brand-copy">
          <span className="login-kicker">Community-based medical education</span>
          <h1>Community Health Toolkit</h1>
          <p>
            A living platform for community clerkship and internship—connecting learning resources,
            community profiles, ongoing projects, structured handovers, and institutional memory.
          </p>
        </div>

        <div className="login-principles">
          <span>Learn with communities.</span>
          <span>Document what matters.</span>
          <span>Continue what works.</span>
        </div>
      </section>

      <section className="login-form-panel">
        <LoginForm setupMissing={params.setup === "1"} nextPath={params.next} />
        <footer className="login-footer">
          University of the Philippines Manila · School of Health Sciences
        </footer>
      </section>
    </main>
  );
}

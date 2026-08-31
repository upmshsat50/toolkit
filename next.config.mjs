/** @type {import('next').NextConfig} */

// GitHub project pages are served from /<repository-name>/ rather than /.
// During GitHub Actions, GITHUB_REPOSITORY is available as "owner/repo".
const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isUserOrOrgPages = repositoryName.endsWith(".github.io");
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubActions && repositoryName && !isUserOrOrgPages
  ? `/${repositoryName}`
  : "";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

import type { ReactNode } from "react";
import Link from "next/link";
import teamData from "./team.json";
import portfolioData from "./portfolio.json";
import { BLOG_POSTS, type BlogPost } from "@/lib/blog-posts";

export type TeamMember = {
  slug: string;
  name: string;
  image: string;
  year: string;
  position?: string;
  linkedin?: string;
  email?: string;
};

export type FsFile = { kind: "file"; render: () => ReactNode };
export type FsDir = { kind: "dir"; children: Record<string, FsNode> };
export type FsNode = FsFile | FsDir;

function file(render: () => ReactNode): FsFile {
  return { kind: "file", render };
}

function dir(children: Record<string, FsNode>): FsDir {
  return { kind: "dir", children };
}

const AboutFile = () => (
  <div className="term-output">
    <h2 className="term-h2">{"// who we are"}</h2>
    <p className="term-para">
      The M&amp;T Innovation Fund is a student-led venture development
      organization built entirely by students in the Jerome Fisher Program in
      Management &amp; Technology at the University of Pennsylvania. Our team
      spans a wide range of backgrounds: engineers, designers, operators, and
      builders united by a shared obsession with early-stage company creation.
    </p>
    <h2 className="term-h2">{"// what we do"}</h2>
    <p className="term-para term-para--dim">
      We run a two-semester cycle. In the fall, we scout early-stage founders
      across the Penn ecosystem. In the spring, we work directly with the teams
      we back: product judgment, customer discovery, go-to-market, and growth.
    </p>
    <h2 className="term-h2">{"// who can apply"}</h2>
    <p className="term-para term-para--dim">
      Anyone in the Penn ecosystem is eligible: undergrads, MBA and master's
      students, PhDs, and faculty. If you're building something at Penn, we
      want to hear from you.
    </p>
    <h2 className="term-h2">{"// what we offer"}</h2>
    <p className="term-para term-para--dim">
      We provide grants ranging from $4,000 to $8,000 per team. But capital is
      the smallest thing we offer. Most of the value is operating support from
      analysts and partners who have built, shipped, and sold in the same
      trenches as the founders we work with.
    </p>
  </div>
);


const ApplyFile = () => (
  <div className="term-output">
    <p className="term-para">
      We open applications once per semester to both founders seeking support
      and Penn students looking to join the fund.
    </p>
    <div className="term-card">
      <p className="term-line term-line--dim">{"// founders"}</p>
      <p className="term-para">
        Building something out of Penn? Tell us about the company, the team, and
        what you&apos;d want help with.
      </p>
      <a className="term-link" href="mailto:hello@mntif.com">
        &rarr; use the contact command to reach out to the co-presidents
      </a>
    </div>
    <div className="term-card">
      <p className="term-line term-line--dim">{"// students"}</p>
      <p className="term-para">
        Recruiting for the next analyst cohort opens at the start of each
        fall semester. Open to anyone across the Penn community 
      </p>
      <a className="term-link" href="mailto:recruiting@mntif.com">
        &rarr; check out past portfolio companies for more
      </a>
    </div>
  </div>
);

const ContactFile = () => (
  <div className="term-output">
    <dl className="term-kv">
      <dt>co presidents</dt>
      <dd>
        <div className="term-kv-presidents">
          <div>
            <span className="term-line">Karthik Kaligotla</span>
            <br />
            <a className="term-link" href="mailto:karthik1@upenn.edu">
              karthik1@upenn.edu
            </a>
          </div>
          <div>
            <span className="term-line">Vivasvat Rastogi</span>
            <br />
            <a className="term-link" href="mailto:vivasvat@upenn.edu">
              vivasvat@upenn.edu
            </a>
          </div>
        </div>
      </dd>
      <dt>where</dt>
      <dd>Jerome Fisher M&amp;T &middot; University of Pennsylvania</dd>
    </dl>
  </div>
);

function MemberCard({ member }: { member: TeamMember }) {
  return (
    <div className="term-output">
      {member.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="term-member-image"
          src={member.image}
          alt={member.name}
        />
      )}
      <dl className="term-kv">
        <dt>name</dt>
        <dd>{member.name}</dd>
        {member.position && (
          <>
            <dt>position</dt>
            <dd>{member.position}</dd>
          </>
        )}
        <dt>class</dt>
        <dd>{member.year}</dd>
        {member.linkedin && (
          <>
            <dt>linkedin</dt>
            <dd>
              <a
                className="term-link"
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
              >
                {member.linkedin}
              </a>
            </dd>
          </>
        )}
        {member.email && (
          <>
            <dt>email</dt>
            <dd>
              <a className="term-link" href={`mailto:${member.email}`}>
                {member.email}
              </a>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}

export type PortfolioCompany = {
  slug: string;
  name: string;
  website: string;
  description: string;
  logo: string;
};

function CompanyCard({
  company,
  year,
}: {
  company: PortfolioCompany;
  year: string;
}) {
  return (
    <div className="term-output">
      {company.logo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          className="term-member-image"
          src={company.logo}
          alt={company.name}
        />
      )}
      <dl className="term-kv">
        <dt>company</dt>
        <dd>{company.name}</dd>
        <dt>year</dt>
        <dd>{year}</dd>
        {company.website && (
          <>
            <dt>website</dt>
            <dd>
              <a
                className="term-link"
                href={company.website}
                target="_blank"
                rel="noreferrer"
              >
                {company.website}
              </a>
            </dd>
          </>
        )}
        {company.description && (
          <>
            <dt>about</dt>
            <dd>{company.description}</dd>
          </>
        )}
      </dl>
    </div>
  );
}

const BlogReadme = () => (
  <div className="term-output">
    <p className="term-para term-para--dim">
      Field notes from the M&amp;T Innovation Fund community.
      <span> </span>
      <span className="term-cmdname">cat</span> any post below for a teaser,
      then follow the link for the full read.
    </p>
  </div>
);

function BlogTeaser({ post }: { post: BlogPost }) {
  return (
    <div className="term-output">
      <div className="term-card">
        <p className="term-line term-line--dim">{post.date}</p>
        <p className="term-para">
          <strong>{post.title}</strong>
        </p>
        <p className="term-para term-para--dim">{post.summary}</p>
        <Link className="term-link" href={`/blog/${post.slug}/`}>
          &rarr; read full post
        </Link>
      </div>
    </div>
  );
}

function buildBlogDir(): FsDir {
  const children: Record<string, FsNode> = {
    "README.md": file(BlogReadme),
  };
  const sorted = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  for (const post of sorted) {
    children[`${post.slug}.md`] = file(() => <BlogTeaser post={post} />);
  }
  return dir(children);
}

const TEAM_MEMBERS: TeamMember[] = teamData as TeamMember[];

function buildTeamDir(): FsDir {
  const children: Record<string, FsNode> = {};
  for (const member of TEAM_MEMBERS) {
    children[`${member.slug}.md`] = file(() => <MemberCard member={member} />);
  }
  return dir(children);
}

const PORTFOLIO: Record<string, PortfolioCompany[]> =
  portfolioData as Record<string, PortfolioCompany[]>;

function buildPortfolioDir(): FsDir {
  const children: Record<string, FsNode> = {};
  for (const [year, companies] of Object.entries(PORTFOLIO)) {
    const yearChildren: Record<string, FsNode> = {};
    for (const company of companies) {
      yearChildren[`${company.slug}.md`] = file(() => (
        <CompanyCard company={company} year={year} />
      ));
    }
    children[year] = dir(yearChildren);
  }
  return dir(children);
}

export const ROOT: FsDir = dir({
  "about.md": file(AboutFile),
  "apply.md": file(ApplyFile),
  "contact.md": file(ContactFile),
  team: buildTeamDir(),
  portfolio: buildPortfolioDir(),
  blog: buildBlogDir(),
});

function splitPath(p: string): string[] {
  return p.split("/").filter((s) => s.length > 0);
}

export function resolvePath(cwd: string, arg: string | undefined): string {
  if (arg === "~") return "/";
  if (!arg || arg === "") return cwd || "/";
  let parts: string[];
  if (arg.startsWith("/")) {
    parts = splitPath(arg);
  } else {
    parts = [...splitPath(cwd), ...splitPath(arg)];
  }
  const stack: string[] = [];
  for (const part of parts) {
    if (part === "." || part === "") continue;
    if (part === "..") {
      stack.pop();
    } else {
      stack.push(part);
    }
  }
  return "/" + stack.join("/");
}

export function getNode(path: string): FsNode | null {
  const parts = splitPath(path);
  let node: FsNode = ROOT;
  for (const part of parts) {
    if (node.kind !== "dir") return null;
    const child: FsNode | undefined = node.children[part];
    if (!child) return null;
    node = child;
  }
  return node;
}

export function listDir(
  path: string,
): { name: string; isDir: boolean }[] | null {
  const node = getNode(path);
  if (!node || node.kind !== "dir") return null;
  return Object.entries(node.children).map(([name, child]) => ({
    name,
    isDir: child.kind === "dir",
  }));
}

export function formatPrompt(cwd: string): string {
  if (cwd === "/" || cwd === "") return "~";
  return "~" + cwd;
}

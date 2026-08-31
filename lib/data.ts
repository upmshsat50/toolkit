export type VerificationStatus = "verified" | "needs-verification" | "unverified";

export type Community = {
  slug: string;
  name: string;
  province: string;
  rhus: string[];
  preceptor: string;
  mho: string;
  dttb: string;
  verification: VerificationStatus;
  currentBatch: string;
  course: string;
  summary: string;
  priorities: string[];
  rhuPriorities: string[];
  activeProjects: number;
  monitoringProjects: number;
  handovers: number;
};

export const communities: Community[] = [
  {
    slug: "palo",
    name: "Palo",
    province: "Leyte",
    rhus: ["Palo Rural Health Unit"],
    preceptor: "To be assigned",
    mho: "Awaiting official verification",
    dttb: "Awaiting official verification",
    verification: "needs-verification",
    currentBatch: "MD24",
    course: "Community Clerkship",
    summary: "Municipal community site for longitudinal community-based learning and health-systems exposure.",
    priorities: ["To be updated after current community assessment"],
    rhuPriorities: ["To be updated with RHU validation"],
    activeProjects: 2,
    monitoringProjects: 1,
    handovers: 1,
  },
  {
    slug: "alangalang",
    name: "Alangalang",
    province: "Leyte",
    rhus: ["Alangalang Rural Health Unit"],
    preceptor: "Dr. Angelita Jaya",
    mho: "Awaiting official verification",
    dttb: "Awaiting official verification",
    verification: "needs-verification",
    currentBatch: "MD24",
    course: "Community Clerkship",
    summary: "Current UPM-SHS community site with emphasis on continuity, community assessment, and local health-system engagement.",
    priorities: ["Hypertension", "Schistosomiasis", "Medicine access"],
    rhuPriorities: ["Maternal care", "Immunization", "NCD program indicators"],
    activeProjects: 3,
    monitoringProjects: 2,
    handovers: 1,
  },
  {
    slug: "dagami",
    name: "Dagami",
    province: "Leyte",
    rhus: ["Dagami Rural Health Unit"],
    preceptor: "To be assigned",
    mho: "Awaiting official verification",
    dttb: "Awaiting official verification",
    verification: "needs-verification",
    currentBatch: "MD24",
    course: "Community Clerkship",
    summary: "Community site for integrated assessment, local partnership, and longitudinal project monitoring.",
    priorities: ["To be updated after current community assessment"],
    rhuPriorities: ["To be updated with RHU validation"],
    activeProjects: 1,
    monitoringProjects: 2,
    handovers: 0,
  },
  {
    slug: "tolosa",
    name: "Tolosa",
    province: "Leyte",
    rhus: ["Tolosa Rural Health Unit"],
    preceptor: "Dr. Maria Sheryl P. Indencia",
    mho: "Awaiting official verification",
    dttb: "Awaiting official verification",
    verification: "needs-verification",
    currentBatch: "MD24",
    course: "Community Clerkship",
    summary: "Current UPM-SHS community site supporting health-systems learning, project continuity, and community partnership.",
    priorities: ["To be updated after current community assessment"],
    rhuPriorities: ["To be updated with RHU validation"],
    activeProjects: 2,
    monitoringProjects: 1,
    handovers: 1,
  },
  {
    slug: "tanauan",
    name: "Tanauan",
    province: "Leyte",
    rhus: ["Tanauan Rural Health Unit"],
    preceptor: "To be assigned",
    mho: "Awaiting official verification",
    dttb: "Awaiting official verification",
    verification: "needs-verification",
    currentBatch: "MD24",
    course: "Community Clerkship",
    summary: "Community-based learning site for primary care, community diagnosis, and health-system engagement.",
    priorities: ["To be updated after current community assessment"],
    rhuPriorities: ["To be updated with RHU validation"],
    activeProjects: 2,
    monitoringProjects: 2,
    handovers: 0,
  },
  {
    slug: "dulag",
    name: "Dulag",
    province: "Leyte",
    rhus: ["Dulag Rural Health Unit"],
    preceptor: "To be assigned",
    mho: "Awaiting official verification",
    dttb: "Awaiting official verification",
    verification: "needs-verification",
    currentBatch: "MD24",
    course: "Community Clerkship",
    summary: "Community site supporting systems-based learning, stakeholder engagement, and structured program handover.",
    priorities: ["To be updated after current community assessment"],
    rhuPriorities: ["To be updated with RHU validation"],
    activeProjects: 1,
    monitoringProjects: 1,
    handovers: 1,
  },
];

export type Project = {
  id: string;
  title: string;
  community: string;
  batch: string;
  status: "Active" | "Monitoring" | "For Turnover" | "Completed";
  healthIssue: string;
  localOwner: string;
  progress: number;
  summary: string;
};

export const projects: Project[] = [
  {
    id: "hypertension-control-alangalang",
    title: "Hypertension Control Initiative",
    community: "Alangalang",
    batch: "MD23 → MD24",
    status: "Active",
    healthIssue: "Noncommunicable disease",
    localOwner: "RHU / community partner",
    progress: 72,
    summary: "Sample longitudinal project record demonstrating project continuity, monitoring, and handover between batches.",
  },
  {
    id: "schisto-iec-alangalang",
    title: "Schistosomiasis IEC and Risk Communication",
    community: "Alangalang",
    batch: "MD22 → MD24",
    status: "Monitoring",
    healthIssue: "Schistosomiasis",
    localOwner: "Community health team",
    progress: 84,
    summary: "Sample monitoring record for a continuing community health intervention.",
  },
  {
    id: "maternal-health-tolosa",
    title: "Maternal Health Tracking Support",
    community: "Tolosa",
    batch: "MD23",
    status: "For Turnover",
    healthIssue: "Maternal health",
    localOwner: "RHU",
    progress: 90,
    summary: "Sample project nearing formal turnover and local ownership validation.",
  },
  {
    id: "health-systems-dagami",
    title: "Barangay Health Systems Mapping",
    community: "Dagami",
    batch: "MD24",
    status: "Active",
    healthIssue: "Health systems",
    localOwner: "UPM-SHS / RHU",
    progress: 45,
    summary: "Sample health-systems mapping project for facilities, stakeholders, referral pathways, and local resources.",
  },
];

export const resources = [
  { title: "Community Entry & Social Preparation Guide", type: "Guide", module: "Orientation", version: "v1.0" },
  { title: "Community Diagnosis Template", type: "Template", module: "Community Diagnosis", version: "v1.0" },
  { title: "Health Systems Assessment Form", type: "Form", module: "Health Systems", version: "v1.0" },
  { title: "MHDP Planning Worksheet", type: "Template", module: "Planning", version: "v1.0" },
  { title: "Project Monitoring & Evaluation Matrix", type: "Template", module: "M&E", version: "v1.0" },
  { title: "Mandatory Project Handover Form", type: "Form", module: "Handover", version: "v1.0" },
];

export const orientationTasks = [
  ["Review assigned community profile", true],
  ["Review previous projects", true],
  ["Review previous handover records", true],
  ["Identify preceptor and RHU focal persons", true],
  ["Review scope of practice", false],
  ["Review referral and emergency pathways", false],
  ["Complete stakeholder mapping orientation", true],
  ["Download required forms", true],
] as const;

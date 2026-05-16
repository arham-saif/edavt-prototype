// Synthetic demo data for EDAVT. All "PII" is fake.
// No real students; names are seeded plausible placeholders.

const DISTRICT = {
  name: "Westbrook Unified School District",
  shortName: "Westbrook USD",
  schools: 47,
  students: 28140,
  teachers: 1842,
  state: "CA",
};

const SCHOOLS = [
  { id: "WHS", name: "Westbrook High School", level: "9-12", students: 1840, atRisk: 12.4 },
  { id: "EMM", name: "Emerson Middle School", level: "6-8", students: 920, atRisk: 9.1 },
  { id: "LIN", name: "Lincoln Elementary", level: "K-5", students: 612, atRisk: 6.3 },
  { id: "RPK", name: "Riverpark Elementary", level: "K-5", students: 488, atRisk: 5.8 },
  { id: "OKR", name: "Oak Ridge Middle", level: "6-8", students: 871, atRisk: 11.0 },
  { id: "MTV", name: "Mountain View HS", level: "9-12", students: 2104, atRisk: 14.2 },
];

const ROLES = [
  { id: "admin", name: "Dr. Mei Tanaka", title: "District Superintendent", scope: "All 47 schools", initials: "MT" },
  { id: "principal", name: "Andre Whitfield", title: "Principal — Westbrook HS", scope: "1,840 students", initials: "AW" },
  { id: "counselor", name: "Sofia Rojas", title: "Guidance Counselor", scope: "Grade 9–10 caseload", initials: "SR" },
  { id: "teacher", name: "James O'Connor", title: "AP Biology Teacher", scope: "5 sections · 142 students", initials: "JO" },
  { id: "researcher", name: "Dr. Priya Iyer", title: "Institutional Researcher", scope: "Anonymized cohort data", initials: "PI" },
];

// Time-series — last 12 weeks
const WEEKS = ["W36","W37","W38","W39","W40","W41","W42","W43","W44","W45","W46","W47"];

const TRENDS = {
  attendance: [94.2, 93.8, 94.0, 93.5, 92.9, 92.4, 91.8, 92.1, 92.6, 93.1, 93.4, 93.6],
  riskCount:  [612, 638, 651, 689, 712, 734, 728, 712, 698, 681, 662, 654],
  gpa:        [3.02, 3.04, 3.03, 3.01, 2.99, 2.97, 2.96, 2.98, 3.00, 3.01, 3.02, 3.03],
  engagement: [78, 80, 82, 81, 79, 77, 76, 78, 80, 82, 83, 84],
};

// 12 months of dropout-risk forecast (last 6 actual, next 6 predicted)
const FORECAST = {
  labels: ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"],
  actual: [2.8, 2.9, 3.1, null, null, 3.4, 3.6, 3.5, 3.7, null, null, null],
  predicted: [null, null, null, 3.2, 3.3, 3.4, 3.6, 3.5, 3.7, 3.9, 4.1, 4.0],
  upper: [null, null, null, 3.5, 3.7, 3.8, 4.0, 3.9, 4.1, 4.4, 4.7, 4.6],
  lower: [null, null, null, 2.9, 3.0, 3.1, 3.2, 3.1, 3.3, 3.4, 3.6, 3.5],
};

// At-risk students (synthetic IDs only)
const STUDENTS = [
  { id: "S-4082", name: "M. Alvarez",   grade: "10", school: "WHS", risk: 0.91, trend: "up",   factors: ["attendance", "gpa-trajectory"], status: "intervention",  flagged: "2d ago",  caseworker: "Rojas" },
  { id: "S-3917", name: "D. Patel",     grade: "11", school: "WHS", risk: 0.87, trend: "up",   factors: ["assessment", "engagement"],     status: "intervention",  flagged: "3d ago",  caseworker: "Rojas" },
  { id: "S-5021", name: "L. Nguyen",    grade: "8",  school: "OKR", risk: 0.82, trend: "flat", factors: ["behavior", "attendance"],       status: "monitoring",    flagged: "1w ago",  caseworker: "Hartman" },
  { id: "S-4444", name: "J. Williams",  grade: "9",  school: "WHS", risk: 0.79, trend: "up",   factors: ["lms-login", "gpa-trajectory"], status: "new",           flagged: "12h ago", caseworker: "—" },
  { id: "S-3612", name: "S. Okafor",    grade: "12", school: "MTV", risk: 0.76, trend: "down", factors: ["financial", "engagement"],      status: "monitoring",    flagged: "2w ago",  caseworker: "Chen" },
  { id: "S-5234", name: "K. Petrov",    grade: "7",  school: "EMM", risk: 0.74, trend: "up",   factors: ["assessment", "behavior"],       status: "new",           flagged: "1d ago",  caseworker: "—" },
  { id: "S-4108", name: "A. Brennan",   grade: "10", school: "MTV", risk: 0.71, trend: "flat", factors: ["attendance"],                   status: "intervention",  flagged: "4d ago",  caseworker: "Chen" },
  { id: "S-3998", name: "T. Mitchell",  grade: "11", school: "WHS", risk: 0.68, trend: "down", factors: ["lms-login", "engagement"],      status: "monitoring",    flagged: "1w ago",  caseworker: "Rojas" },
  { id: "S-4521", name: "R. Vasquez",   grade: "9",  school: "WHS", risk: 0.66, trend: "up",   factors: ["gpa-trajectory"],               status: "new",           flagged: "2d ago",  caseworker: "—" },
  { id: "S-5188", name: "E. Johansson", grade: "8",  school: "OKR", risk: 0.63, trend: "flat", factors: ["behavior"],                     status: "monitoring",    flagged: "5d ago",  caseworker: "Hartman" },
  { id: "S-4877", name: "B. Hassan",    grade: "12", school: "MTV", risk: 0.61, trend: "down", factors: ["attendance", "financial"],      status: "monitoring",    flagged: "1w ago",  caseworker: "Chen" },
  { id: "S-3805", name: "C. Yamamoto",  grade: "11", school: "WHS", risk: 0.58, trend: "down", factors: ["assessment"],                   status: "resolved",      flagged: "3w ago",  caseworker: "Rojas" },
];

// SHAP-style feature importance for a single student
const SHAP_EXAMPLE = {
  studentId: "S-4082",
  studentLabel: "M. Alvarez — Grade 10, Westbrook HS",
  baseRate: 0.18,
  riskScore: 0.91,
  features: [
    { name: "Attendance (last 30d)",     value: "82%",      impact: +0.21, dir: "pos" },
    { name: "GPA trajectory",            value: "−0.4 / sem", impact: +0.17, dir: "pos" },
    { name: "Assignment completion",     value: "61%",      impact: +0.14, dir: "pos" },
    { name: "LMS login frequency",       value: "2.1/wk",   impact: +0.09, dir: "pos" },
    { name: "Discipline incidents",      value: "2",        impact: +0.07, dir: "pos" },
    { name: "Reading benchmark Δ",       value: "+0.3 SD",  impact: -0.05, dir: "neg" },
    { name: "Counselor engagement",      value: "Weekly",   impact: -0.04, dir: "neg" },
    { name: "ELL classification",        value: "No",       impact: -0.02, dir: "neg" },
  ],
};

// Data sources / connectors
const SOURCES = [
  { code: "EdFi",   name: "Ed-Fi ODS / API",           protocol: "Ed-Fi 3.3 REST",   status: "synced",  records: "28,140 students",   lastSync: "12 min ago", freq: "every 15m", piiHandling: "tokenized" },
  { code: "OnRo",   name: "OneRoster — Infinite Campus", protocol: "OneRoster 1.2",   status: "synced",  records: "1,842 rosters",     lastSync: "1 hr ago",   freq: "hourly",    piiHandling: "tokenized" },
  { code: "LTI",    name: "Canvas LMS",                 protocol: "LTI 1.3 Advantage", status: "synced",  records: "118k activities",   lastSync: "8 min ago",  freq: "every 10m", piiHandling: "pseudonymized" },
  { code: "xAPI",   name: "i-Ready Practice",           protocol: "xAPI LRS",          status: "synced",  records: "412k statements",   lastSync: "22 min ago", freq: "stream",    piiHandling: "pseudonymized" },
  { code: "QTI",    name: "Smarter Balanced",           protocol: "QTI 2.2",           status: "synced",  records: "12.4k assessments", lastSync: "Yesterday",  freq: "daily",     piiHandling: "tokenized" },
  { code: "CSV",    name: "Attendance — Aeries",        protocol: "REST / nightly CSV", status: "delayed", records: "—",                 lastSync: "26 hr ago",  freq: "nightly",   piiHandling: "encrypted" },
  { code: "SFTP",   name: "Finance / Resource",         protocol: "SFTP",              status: "synced",  records: "9.2k records",      lastSync: "3 hr ago",   freq: "every 4h",  piiHandling: "aggregated" },
];

// Audit log
const AUDIT = [
  { ts: "14:42:18", user: "JO", action: "view_student",   subject: "Caseload — AP Bio §3", scope: "32 records", ip: "10.4.12.8",  result: "ok" },
  { ts: "14:39:02", user: "SR", action: "export_report",  subject: "Grade 9 Risk Digest",  scope: "PDF, 14p",   ip: "10.4.12.41", result: "ok" },
  { ts: "14:31:55", user: "MT", action: "view_dashboard", subject: "District Overview",    scope: "Aggregate",  ip: "10.4.12.2",  result: "ok" },
  { ts: "14:28:11", user: "AW", action: "case_create",    subject: "S-4521 → R. Vasquez",  scope: "Tier 2",     ip: "10.4.12.19", result: "ok" },
  { ts: "14:22:40", user: "ML", action: "model_retrain",  subject: "at_risk_v3.6",         scope: "auto-MLOps", ip: "system",      result: "ok" },
  { ts: "14:18:09", user: "JO", action: "view_student",   subject: "S-4082 (SHAP)",        scope: "Read-only",  ip: "10.4.12.8",  result: "ok" },
  { ts: "14:11:32", user: "—",  action: "anomaly_detect", subject: "Unusual export volume", scope: "Auto-flag",  ip: "10.4.12.7",  result: "review" },
  { ts: "14:04:01", user: "SR", action: "consent_update", subject: "FERPA opt-out (parent)", scope: "S-3805",     ip: "10.4.12.41", result: "ok" },
  { ts: "13:58:22", user: "PI", action: "query_cohort",   subject: "Anon. cohort 2024-25", scope: "k≥10",       ip: "10.4.12.55", result: "ok" },
  { ts: "13:51:46", user: "AW", action: "view_dashboard", subject: "Westbrook HS",         scope: "Aggregate",  ip: "10.4.12.19", result: "ok" },
];

// Compliance status
const COMPLIANCE = [
  { name: "FERPA",   level: "Federal",  status: "designed",    lastReview: "Prototype", controls: 24, owner: "Privacy Office" },
  { name: "COPPA",   level: "Federal",  status: "designed",    lastReview: "Prototype", controls: 14, owner: "Privacy Office" },
  { name: "SOPIPA",  level: "CA",       status: "designed",    lastReview: "Prototype", controls: 18, owner: "Legal" },
  { name: "AB 1584", level: "CA",       status: "designed",    lastReview: "Prototype", controls:  9, owner: "Legal" },
  { name: "SOC 2",   level: "Type II",  status: "roadmap",     lastReview: "Planned",   controls: 64, owner: "Security" },
  { name: "NIST 800-53", level: "Moderate", status: "in-progress", lastReview: "Draft", controls: 42, owner: "Security" },
];

// Segments / clusters
const SEGMENTS = [
  { id: "A", name: "Thriving",            count: 14210, share: 50.5, color: "#4A7C59", risk: 0.08, traits: ["High GPA", "High engagement", "Strong attendance"] },
  { id: "B", name: "Steady performers",   count:  7820, share: 27.8, color: "#1B3A5F", risk: 0.21, traits: ["Median GPA", "Consistent attendance"] },
  { id: "C", name: "Emerging concern",    count:  3140, share: 11.2, color: "#DEA84B", risk: 0.42, traits: ["GPA trending down", "Engagement dip"] },
  { id: "D", name: "Chronic absentee",    count:  1480, share:  5.3, color: "#C8553D", risk: 0.68, traits: ["<85% attendance", "Multiple flags"] },
  { id: "E", name: "Acute risk",          count:   654, share:  2.3, color: "#8B1F1F", risk: 0.84, traits: ["Multi-factor", "Tier 3"] },
  { id: "F", name: "Outliers (DBSCAN)",   count:   836, share:  3.0, color: "#7C6191", risk: 0.31, traits: ["Atypical profile", "Manual review"] },
];

window.EDAVT = {
  DISTRICT, SCHOOLS, ROLES, WEEKS, TRENDS, FORECAST,
  STUDENTS, SHAP_EXAMPLE, SOURCES, AUDIT, COMPLIANCE, SEGMENTS,
};

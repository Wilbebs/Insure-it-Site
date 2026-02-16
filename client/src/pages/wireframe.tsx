import { useState } from "react";

const checkIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 9 8 13 14 5"/></svg>
);
const xIcon = (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="5" x2="13" y2="13"/><line x1="13" y1="5" x2="5" y2="13"/></svg>
);

type Decision = "keep" | "remove" | "";

interface FieldRow {
  name: string;
  type: string;
  required: boolean;
  options?: string;
  example?: string;
}

interface GroupData {
  title: string;
  fields: FieldRow[];
}

interface PolicySection {
  title: string;
  icon: string;
  color: string;
  groups: GroupData[];
}

const coreFields: GroupData = {
  title: "Your Information",
  fields: [
    { name: "First Name", type: "Text", required: true, example: "John" },
    { name: "Last Name", type: "Text", required: true, example: "Smith" },
    { name: "Email", type: "Text", required: true, example: "john@email.com" },
    { name: "Phone", type: "Text", required: true, example: "305-555-1234" },
    { name: "ZIP Code", type: "Text", required: true, example: "33101" },
  ],
};

const policySections: PolicySection[] = [
  {
    title: "Auto Insurance",
    icon: "🚗",
    color: "#3b82f6",
    groups: [
      {
        title: "Garaging Address",
        fields: [
          { name: "Street Address", type: "Text", required: false, example: "123 Main St" },
          { name: "City", type: "Text", required: false, example: "Jacksonville" },
          { name: "State", type: "Text", required: false, example: "FL" },
          { name: "ZIP Code", type: "Text", required: false, example: "32256" },
        ],
      },
      {
        title: "Vehicle Information",
        fields: [
          { name: "Vehicle Year", type: "Text", required: false, example: "2024" },
          { name: "Vehicle Make", type: "Text", required: false, example: "Toyota" },
          { name: "Vehicle Model", type: "Text", required: false, example: "Camry" },
          { name: "VIN", type: "Text", required: false, example: "Optional" },
        ],
      },
      {
        title: "Vehicle Usage & Status",
        fields: [
          { name: "Primary Use", type: "Dropdown", required: false, options: "Commuting / Pleasure / Business / Rideshare" },
          { name: "Ownership Status", type: "Dropdown", required: false, options: "Owned / Financed / Leased" },
        ],
      },
      {
        title: "Driver Information",
        fields: [
          { name: "Date of Birth", type: "Text", required: false, example: "MM/DD/YYYY" },
          { name: "Marital Status", type: "Dropdown", required: false, options: "Single / Married / Divorced / Widowed" },
          { name: "License State", type: "Text", required: false, example: "FL" },
          { name: "License Number", type: "Text", required: false, example: "Optional" },
        ],
      },
      {
        title: "Insurance History",
        fields: [
          { name: "Accidents/Violations (past 3 yrs)", type: "Dropdown", required: false, options: "Yes / No" },
          { name: "Currently Insured?", type: "Dropdown", required: false, options: "Yes / No" },
          { name: "Current Carrier", type: "Text", required: false, example: "e.g., State Farm" },
          { name: "Current Coverage Limits", type: "Dropdown", required: false, options: "25/50 / 50/100 / 100/300 / 250/500 / Unsure" },
        ],
      },
    ],
  },
  {
    title: "Home Insurance",
    icon: "🏠",
    color: "#10b981",
    groups: [
      {
        title: "Property Address",
        fields: [
          { name: "Street Address", type: "Text", required: false, example: "123 Main St" },
          { name: "City", type: "Text", required: false, example: "Jacksonville" },
          { name: "State", type: "Text", required: false, example: "FL" },
          { name: "Property ZIP", type: "Text", required: false, example: "32256" },
        ],
      },
      {
        title: "Property Details",
        fields: [
          { name: "Property Type", type: "Dropdown", required: false, options: "Single-Family / Condo / Townhome / Multi-Family" },
          { name: "Year Built", type: "Text", required: false, example: "1995" },
          { name: "Square Footage", type: "Text", required: false, example: "1800" },
          { name: "Roof Year", type: "Text", required: false, example: "2020" },
        ],
      },
      {
        title: "Property Features",
        fields: [
          { name: "Systems Updated (Plumbing/Electrical/HVAC)", type: "Dropdown", required: false, options: "Yes / No / Unsure" },
          { name: "Primary Residence?", type: "Dropdown", required: false, options: "Yes / No" },
          { name: "Has Pool?", type: "Dropdown", required: false, options: "No / Yes (Fenced) / Yes (Unfenced)" },
        ],
      },
    ],
  },
  {
    title: "Life Insurance",
    icon: "❤️",
    color: "#f59e0b",
    groups: [
      {
        title: "Personal & Health Info",
        fields: [
          { name: "Date of Birth", type: "Text", required: false, example: "MM/DD/YYYY" },
          { name: "Gender", type: "Dropdown", required: false, options: "Male / Female" },
          { name: "Height", type: "Text", required: false, example: "5'9\"" },
          { name: "Weight (lbs)", type: "Text", required: false, example: "175" },
        ],
      },
      {
        title: "Health & Lifestyle",
        fields: [
          { name: "Uses Tobacco?", type: "Dropdown", required: false, options: "Yes / No" },
          { name: "Pre-existing Medical Conditions?", type: "Dropdown", required: false, options: "Yes / No" },
        ],
      },
      {
        title: "Coverage Preferences",
        fields: [
          { name: "Life Insurance Type", type: "Dropdown", required: false, options: "Term / Permanent / Unsure" },
          { name: "Coverage Amount", type: "Dropdown", required: false, options: "$100K / $250K / $500K / $1M / $2M" },
          { name: "Term Length (years)", type: "Dropdown", required: false, options: "10 / 20 / 30" },
        ],
      },
    ],
  },
  {
    title: "Commercial Insurance",
    icon: "🏢",
    color: "#8b5cf6",
    groups: [
      {
        title: "Business Information",
        fields: [
          { name: "Business Name", type: "Text", required: false, example: "Acme Corp" },
          { name: "Industry / Business Type", type: "Text", required: false, example: "IT Consulting" },
        ],
      },
      {
        title: "Business Size & Revenue",
        fields: [
          { name: "Years in Business", type: "Dropdown", required: false, options: "Startup / 1-3 / 3-5 / 5-10 / 10+" },
          { name: "Annual Revenue", type: "Dropdown", required: false, options: "Under $250K / $250K-$500K / $500K-$1M / $1M-$5M / $5M+" },
          { name: "Full-Time Employees", type: "Text", required: false, example: "10" },
          { name: "Part-Time Employees", type: "Text", required: false, example: "5" },
        ],
      },
      {
        title: "Coverage Needs",
        fields: [
          { name: "General Liability", type: "Dropdown", required: false, options: "Yes / No / Unsure" },
          { name: "Workers' Compensation", type: "Dropdown", required: false, options: "Yes / No / Unsure" },
          { name: "Professional Liability (E&O)", type: "Dropdown", required: false, options: "Yes / No / Unsure" },
          { name: "Cyber Liability", type: "Dropdown", required: false, options: "Yes / No / Unsure" },
        ],
      },
    ],
  },
];

function FieldTable({ group, decisions, onDecision, globalIndex }: { group: GroupData; decisions: Record<string, Decision>; onDecision: (key: string, val: Decision) => void; globalIndex: { current: number } }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h4 style={{ fontSize: 15, fontWeight: 600, color: "#475569", marginBottom: 10, textTransform: "uppercase", letterSpacing: 0.5 }}>{group.title}</h4>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
            <th style={{ padding: "8px 12px", textAlign: "left", width: 30 }}>#</th>
            <th style={{ padding: "8px 12px", textAlign: "left" }}>Field Name</th>
            <th style={{ padding: "8px 12px", textAlign: "left", width: 90 }}>Input Type</th>
            <th style={{ padding: "8px 12px", textAlign: "left", width: 80 }}>Required</th>
            <th style={{ padding: "8px 12px", textAlign: "left" }}>Options / Example</th>
            <th style={{ padding: "8px 12px", textAlign: "center", width: 60 }}>Keep</th>
            <th style={{ padding: "8px 12px", textAlign: "center", width: 70 }}>Remove</th>
            <th style={{ padding: "8px 12px", textAlign: "left" }}>Notes</th>
          </tr>
        </thead>
        <tbody>
          {group.fields.map((field) => {
            globalIndex.current += 1;
            const idx = globalIndex.current;
            const key = `${group.title}-${field.name}`;
            const dec = decisions[key] || "";
            const rowBg = dec === "remove" ? "#fef2f2" : dec === "keep" ? "#f0fdf4" : "#fff";
            return (
              <tr key={field.name} style={{ background: rowBg, borderBottom: "1px solid #e2e8f0", transition: "background 0.2s" }}>
                <td style={{ padding: "10px 12px", color: "#94a3b8", fontWeight: 500 }}>{idx}</td>
                <td style={{ padding: "10px 12px", fontWeight: 500, color: "#1e293b" }}>{field.name}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span style={{ background: field.type === "Dropdown" ? "#dbeafe" : "#f1f5f9", color: field.type === "Dropdown" ? "#2563eb" : "#64748b", padding: "2px 8px", borderRadius: 4, fontSize: 12, fontWeight: 500 }}>
                    {field.type}
                  </span>
                </td>
                <td style={{ padding: "10px 12px" }}>
                  {field.required ? (
                    <span style={{ color: "#dc2626", fontWeight: 600, fontSize: 12 }}>REQUIRED</span>
                  ) : (
                    <span style={{ color: "#94a3b8", fontSize: 12 }}>Optional</span>
                  )}
                </td>
                <td style={{ padding: "10px 12px", color: "#64748b", fontSize: 13 }}>
                  {field.options || field.example || "—"}
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  <button
                    onClick={() => onDecision(key, dec === "keep" ? "" : "keep")}
                    style={{ background: "none", border: "none", cursor: "pointer", opacity: dec === "keep" ? 1 : 0.25, transition: "opacity 0.2s" }}
                    title="Keep this field"
                  >
                    {checkIcon}
                  </button>
                </td>
                <td style={{ padding: "10px 12px", textAlign: "center" }}>
                  {!field.required && (
                    <button
                      onClick={() => onDecision(key, dec === "remove" ? "" : "remove")}
                      style={{ background: "none", border: "none", cursor: "pointer", opacity: dec === "remove" ? 1 : 0.25, transition: "opacity 0.2s" }}
                      title="Remove this field"
                    >
                      {xIcon}
                    </button>
                  )}
                </td>
                <td style={{ padding: "10px 12px" }}>
                  <div style={{ width: 120, borderBottom: "1px dashed #cbd5e1", height: 20 }} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function WireframePage() {
  const [decisions, setDecisions] = useState<Record<string, Decision>>({});

  const onDecision = (key: string, val: Decision) => {
    setDecisions((prev) => ({ ...prev, [key]: val }));
  };

  const totalKeep = Object.values(decisions).filter((d) => d === "keep").length;
  const totalRemove = Object.values(decisions).filter((d) => d === "remove").length;

  const allFieldsCount = 5 + policySections.reduce((sum, s) => sum + s.groups.reduce((gs, g) => gs + g.fields.length, 0), 0);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Inter', -apple-system, sans-serif" }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-block", background: "#1e3a5f", color: "#fff", padding: "6px 16px", borderRadius: 6, fontSize: 12, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 12 }}>
            Internal Review Document
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#0f172a", margin: "8px 0" }}>
            Quote Form Field Wireframe
          </h1>
          <p style={{ color: "#64748b", fontSize: 15, maxWidth: 600, margin: "0 auto", lineHeight: 1.6 }}>
            Review all fields collected in the "Get a Quote Today" forms. Use the checkmarks and X buttons to mark which fields to <strong style={{ color: "#22c55e" }}>keep</strong> or <strong style={{ color: "#ef4444" }}>remove</strong>. Print this page or screenshot it to share with the team.
          </p>
        </div>

        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginBottom: 36, flexWrap: "wrap" }}>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 24px", textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a" }}>{allFieldsCount}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Total Fields</div>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, padding: "14px 24px", textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#22c55e" }}>{totalKeep}</div>
            <div style={{ fontSize: 12, color: "#22c55e", fontWeight: 500 }}>Marked Keep</div>
          </div>
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "14px 24px", textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#ef4444" }}>{totalRemove}</div>
            <div style={{ fontSize: 12, color: "#ef4444", fontWeight: 500 }}>Marked Remove</div>
          </div>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "14px 24px", textAlign: "center", minWidth: 120 }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: "#94a3b8" }}>{allFieldsCount - totalKeep - totalRemove}</div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>Undecided</div>
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 28px 20px", marginBottom: 32, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <span style={{ fontSize: 22 }}>👤</span>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>Step 1: Contact Information</h2>
            <span style={{ background: "#fee2e2", color: "#dc2626", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>ALL REQUIRED</span>
          </div>
          <p style={{ color: "#64748b", fontSize: 13, marginBottom: 16 }}>These 5 fields appear for every policy type. They are all required and cannot be removed.</p>
          <FieldTable group={coreFields} decisions={decisions} onDecision={onDecision} globalIndex={{ current: 0 }} />
        </div>

        <div style={{ textAlign: "center", margin: "28px 0", color: "#94a3b8", fontSize: 13 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, justifyContent: "center" }}>
            <div style={{ height: 1, width: 60, background: "#e2e8f0" }} />
            Then the user selects a policy type...
            <div style={{ height: 1, width: 60, background: "#e2e8f0" }} />
          </div>
        </div>

        {policySections.map((section) => {
          const fieldCount = section.groups.reduce((s, g) => s + g.fields.length, 0);
          const globalIndex = { current: 0 };
          return (
            <div key={section.title} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "28px 28px 20px", marginBottom: 28, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 22 }}>{section.icon}</span>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", margin: 0 }}>{section.title}</h2>
                <span style={{ background: "#f1f5f9", color: "#64748b", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4 }}>{fieldCount} fields</span>
              </div>
              <p style={{ color: "#64748b", fontSize: 13, marginBottom: 20 }}>
                Total with contact info: <strong>{5 + fieldCount} fields</strong> &nbsp;|&nbsp; All {fieldCount} policy-specific fields are currently optional.
              </p>
              {section.groups.map((group) => (
                <FieldTable key={group.title} group={group} decisions={decisions} onDecision={onDecision} globalIndex={globalIndex} />
              ))}
            </div>
          );
        })}

        <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: 12, padding: "20px 24px", marginTop: 32 }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "#92400e", margin: "0 0 8px" }}>Instructions for Reviewers</h3>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#92400e", fontSize: 13, lineHeight: 1.8 }}>
            <li>Click the <strong style={{ color: "#22c55e" }}>green check</strong> to mark a field as <strong>Keep</strong></li>
            <li>Click the <strong style={{ color: "#ef4444" }}>red X</strong> to mark a field as <strong>Remove</strong></li>
            <li>Use the <strong>Notes</strong> column (dashed line) to write suggestions when printing</li>
            <li>Required fields (Contact Info) cannot be removed</li>
            <li>Goal: Remove unnecessary fields to make the form faster for customers</li>
          </ul>
        </div>

        <div style={{ textAlign: "center", marginTop: 32, paddingTop: 20, borderTop: "1px solid #e2e8f0" }}>
          <button
            onClick={() => window.print()}
            style={{ background: "#1e3a5f", color: "#fff", border: "none", padding: "12px 32px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", marginRight: 12 }}
          >
            Print This Page
          </button>
          <button
            onClick={() => window.history.back()}
            style={{ background: "#f1f5f9", color: "#475569", border: "1px solid #e2e8f0", padding: "12px 32px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer" }}
          >
            Back to Site
          </button>
          <p style={{ color: "#94a3b8", fontSize: 12, marginTop: 12 }}>Insure IT Group Corp &mdash; Internal Use Only</p>
        </div>
      </div>

      <style>{`
        @media print {
          button { display: none !important; }
          div[style*="minHeight: 100vh"] { background: #fff !important; }
        }
      `}</style>
    </div>
  );
}

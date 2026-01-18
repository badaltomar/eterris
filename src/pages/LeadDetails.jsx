import { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Briefcase,
  Clock,
  Flag,
  Tag,
  Hash,
  Edit2,
  Save,
  XCircle,
  Zap,
  Phone,
  CheckCircle,
  FileText,
  Inbox,
  Globe,
  ChevronRight,
  Check,
} from "lucide-react";
import "../components/common/LeadDetails.css";

// --- CONSTANTS ---
const PIPELINE_STEPS = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed",
];

export default function LeadDetails() {
  const { leadId } = useParams();

  const fakeLeads = [
    {
      id: 1,
      leadName: "Acme Corp International Holdings",
      leadSource: "Website",
      agent: {
        agentId: "123abc",
        agentName: "Agent A",
      },
      leadStatus: "New",
      timeToClose: 14,
      priority: "High",
      tags: ["High Value", "VIP"],
    },
    {
      id: 2,
      leadName: "John Enterprises",
      leadSource: "Referral",
      agent: {
        agentId: "456abc",
        agentName: "Agent B",
      },
      leadStatus: "Contacted",
      timeToClose: 21,
      priority: "Medium",
      tags: ["Urgent"],
    },
    {
      id: 3,
      leadName: "BlueSky Solutions",
      leadSource: "Cold Call",
      agent: {
        agentId: "789abc",
        agentName: "Agent C",
      },
      leadStatus: "Qualified",
      timeToClose: 30,
      priority: "High",
      tags: ["High Value"],
    },
    {
      id: 4,
      leadName: "Nova Retail Group",
      leadSource: "Website",
      agent: {
        agentId: "101efg",
        agentName: "Agent A",
      },
      leadStatus: "Proposal Sent",
      timeToClose: 10,
      priority: "High",
      tags: ["VIP", "Urgent"],
    },
    {
      id: 5,
      leadName: "GreenField Logistics",
      leadSource: "Referral",
      agent: {
        agentId: "456abc",
        agentName: "Agent B",
      },
      leadStatus: "Closed",
      timeToClose: 5,
      priority: "Low",
      tags: [],
    },
  ];

  const [lead, setLead] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    // API fetch
    const foundLead = fakeLeads.find((l) => l.id === Number(leadId));
    setLead(foundLead);
    setFormData(foundLead);
  }, [leadId]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      agent: { ...prev.agent, agentName: e.target.value },
    }));
  };

  const handleTagsChange = (e) => {
    const tagsArray = e.target.value.split(",").map((t) => t.trim());
    setFormData((prev) => ({ ...prev, tags: tagsArray }));
  };

  const saveChanges = () => {
    setLead(formData);
    setIsEditing(false);
  };

  const cancelChanges = () => {
    setFormData(lead);
    setIsEditing(false);
  };

  // --- PIPELINE HELPER ---
  const getCurrentStepIndex = (status) => {
    return PIPELINE_STEPS.indexOf(status);
  };

  if (!lead) return <div className="loading-state">No lead found</div>;

  const currentStep = getCurrentStepIndex(formData.leadStatus);

  return (
    <div className="lead-details-wrapper">
      <div className="bg-pattern"></div>

      <main className="lead-details-container pageLoadAnimation">
        <header className="page-header">
          <div className="breadcrumbs">
            <NavLink to={"/leads"} className="crumb-text">
              Leads
            </NavLink>
            <ChevronRight size={14} />
            <span className="crumb-active">Lead #{lead.id}</span>
          </div>
          <div className="header-content">
            <NavLink to="/leads" className="back-btn">
              <ArrowLeft size={20} />
            </NavLink>
            <div>
              <h1 className="page-title">Lead Overview</h1>
              <p className="page-subtitle">
                Manage deal progress and contact details
              </p>
            </div>
          </div>
        </header>

        <div className="details-card">
          <div className="card-top-section">
            <div className="identity-wrapper">
              <div className="avatar-large">{lead.leadName.charAt(0)}</div>
              <div className="identity-content">
                {isEditing ? (
                  <input
                    className="edit-input title-input"
                    name="leadName"
                    value={formData.leadName}
                    onChange={handleInputChange}
                  />
                ) : (
                  <h2 className="lead-name">{lead.leadName}</h2>
                )}
                <div className="lead-meta">
                  <span className="meta-item">
                    <Globe size={13} /> {formData.leadSource}
                  </span>
                  <span className="meta-dot">•</span>
                  <span className="meta-item">ID: {lead.id}</span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {isEditing ? (
                <>
                  <button className="btn-ghost" onClick={cancelChanges}>
                    Cancel
                  </button>
                  <button className="btn-solid" onClick={saveChanges}>
                    <Save size={16} /> Save
                  </button>
                </>
              ) : (
                <button
                  className="btn-outline"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 size={16} /> Edit Details
                </button>
              )}
            </div>
          </div>

          {/* PIPELINE PROGRESS */}
          <div className="pipeline-section">
            <h3 className="section-label">Pipeline Progress</h3>
            <div className="pipeline-track">
              {PIPELINE_STEPS.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div
                    key={step}
                    className={`pipeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}
                  >
                    <div className="step-circle">
                      {isCompleted ? <Check size={14} /> : index + 1}
                    </div>
                    <span className="step-label">{step}</span>
                    {index !== PIPELINE_STEPS.length - 1 && (
                      <div className="step-line" />
                    )}
                  </div>
                );
              })}
            </div>

            {isEditing && (
              <div className="status-editor">
                <label>Update Stage manually:</label>
                <select
                  className="edit-select"
                  name="leadStatus"
                  value={formData.leadStatus}
                  onChange={handleInputChange}
                >
                  {PIPELINE_STEPS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <hr className="divider" />

          <div className="card-body">
            <div className="grid-layout">
              <div className="grid-column">
                <h4 className="column-header">
                  <Briefcase size={16} /> Deal Information
                </h4>

                <div className="field-group">
                  <label>Priority</label>
                  {isEditing ? (
                    <select
                      className="edit-select"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  ) : (
                    <span
                      className={`badge-priority ${lead.priority.toLowerCase()}`}
                    >
                      {/* **** FIX ICON **** */}
                      {lead.priority}
                    </span>
                  )}
                </div>

                <div className="field-group">
                  <label>Est. Close Time</label>
                  {isEditing ? (
                    <input
                      type="number"
                      className="edit-input"
                      name="timeToClose"
                      value={formData.timeToClose}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <div className="value-txt">
                      <Clock size={14} className="txt-icon" />{" "}
                      {lead.timeToClose} {lead.timeToClose > 1 ? "Days" : "Day"}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid-column">
                <h4 className="column-header">
                  <User size={16} /> Assignment
                </h4>

                <div className="field-group">
                  <label>Assigned Agent</label>
                  {isEditing ? (
                    <select
                      className="edit-select"
                      value={formData.agent.agentName}
                      onChange={handleAgentChange}
                    >
                      <option>Agent A</option>
                      <option>Agent B</option>
                      <option>Agent C</option>
                    </select>
                  ) : (
                    <div className="agent-display">
                      <div className="agent-avatar-sm">
                        {lead.agent.agentName.charAt(0)}
                      </div>
                      <div className="agent-details-txt">
                        <span className="agent-name-label">
                          {lead.agent.agentName}
                        </span>
                        {/* **** FIX AG ID **** */}
                        <span className="agent-id-label">
                          ID: {lead.agent.agentId}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label>Tags</label>
                  {isEditing ? (
                    <input
                      className="edit-input"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                    />
                  ) : (
                    <div className="tags-list">
                      {lead.tags.length === 0 && (
                        <span>No Tags available, Add by using comma</span>
                      )}
                      {lead.tags.map((t) => (
                        <span key={t} className="tag-pill">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

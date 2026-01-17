import { useState } from "react";
import "../components/common/Forms.css";

const AGENTS = ["Agent A", "Agent B", "Agent C"];
const TAGS = ["High Value", "VIP", "Urgent"];

export default function AddNewLead() {
  const [leadName, setLeadName] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const [agent, setAgent] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [tags, setTags] = useState([]);
  const [timeToClose, setTimeToClose] = useState("");
  const [priority, setPriority] = useState("");

  const [savedLeads, setSavedLeads] = useState([]);

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function submitLeadForm(e) {
    e.preventDefault();

    setSavedLeads((prev) => [
      ...prev,
      {
        leadName,
        leadSource,
        agent,
        leadStatus,
        tags,
        timeToClose,
        priority,
      },
    ]);

    resetForm();
  }

  function resetForm() {
    setLeadName("");
    setLeadSource("");
    setAgent("");
    setLeadStatus("");
    setTags([]);
    setTimeToClose("");
    setPriority("");
  }

  return (
    <main className="add-lead-page pageLoadAnimation">
      {/* FORM */}
      <form className="lead-form" onSubmit={submitLeadForm}>
        <h2 className="form-title">ADD NEW LEAD</h2>

        <div className="form-grid">
          {/* Lead Name */}
          <div className="form-group">
            <label htmlFor="leadName">Lead Name</label>
            <input
              id="leadName"
              type="text"
              placeholder="Enter lead name"
              value={leadName}
              onChange={(e) => setLeadName(e.target.value)}
              required
            />
          </div>

          {/* Lead Source */}
          <div className="form-group">
            <label htmlFor="leadSource">Lead Source</label>
            <select
              id="leadSource"
              value={leadSource}
              onChange={(e) => setLeadSource(e.target.value)}
              required
            >
              <option value="">Select source</option>
              <option>Website</option>
              <option>Referral</option>
              <option>Cold Call</option>
            </select>
          </div>

          {/* Agent */}
          <div className="form-group">
            <label htmlFor="agent">Assigned Sales Agent</label>
            <select
              id="agent"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              required
            >
              <option value="">Select agent</option>
              {AGENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="form-group">
            <label htmlFor="leadStatus">Lead Status</label>
            <select
              id="leadStatus"
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value)}
              required
            >
              <option value="">Select status</option>
              <option>New</option>
              <option>Contacted</option>
              <option>Qualified</option>
              <option>Proposal Sent</option>
              <option>Closed</option>
            </select>
          </div>

          {/* Time */}
          <div className="form-group">
            <label htmlFor="timeToClose">Time to Close (days)</label>
            <input
              id="timeToClose"
              type="number"
              placeholder="e.g. 14"
              value={timeToClose}
              onChange={(e) => setTimeToClose(e.target.value)}
              required
            />
          </div>

          {/* Priority */}
          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
            >
              <option value="">Select priority</option>
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
        </div>

        {/* TAGS */}
        <div className="pill-section">
          <label className="pb-2">Tags</label>
          <div className="pill-group">
            {TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`pill ${tags.includes(tag) ? "active" : ""}`}
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="row g-3 mt-4">
          <div className="col-12 col-md-6">
            <button type="reset" className="btn secondary w-100" onClick={resetForm}>
              Reset
            </button>
          </div>
          <div className="col-12 col-md-6">
            <button type="submit" className="btn primary w-100">
              Save Lead
            </button>
          </div>
        </div>
      </form>

      {/* SAVED LEADS */}
      {savedLeads.length > 0 && (
        <section className="saved-section">
          <h3>Recently Added Leads</h3>

          <div className="saved-grid">
            {savedLeads.map((lead, i) => (
              <div key={i} className="saved-card">
                <h4>{lead.leadName}</h4>
                <p><b>Agent:</b> {lead.agent}</p>
                <p><b>Status:</b> {lead.leadStatus}</p>
                <p><b>Priority:</b> {lead.priority}</p>
                <div className="tag-list">
                  {lead.tags.map((t) => (
                    <span key={t} className={`tag-chip tag-${t.replace(/\s+/g, "").toLowerCase()}`}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

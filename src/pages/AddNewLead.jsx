import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "../components/common/Forms.css";
import { NavLink } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const TAGS = ["High Value", "VIP", "Urgent", "Follow-up"];

export default function AddNewLead() {
  // Form State
  const [leadName, setLeadName] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const [agent, setAgent] = useState("");
  const [leadStatus, setLeadStatus] = useState("");
  const [tags, setTags] = useState([]);
  const [timeToClose, setTimeToClose] = useState("");
  const [priority, setPriority] = useState("");
  const [dealValue, setDealValue] = useState("");
  const [industry, setIndustry] = useState("");

  // App State
  const [agents, setAgents] = useState([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedLeads, setSavedLeads] = useState([]);

  // Fetch real agents on mount
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/agents`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load agents");
        }

        const data = await response.json();
        setAgents(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoadingAgents(false);
      }
    };
    fetchAgents();
  }, []);

  function toggleTag(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  async function submitLeadForm(e) {
    e.preventDefault();
    setIsSubmitting(true);

    // 1. Check if the user selected "Closed" right upon creation
    const isNowClosed = leadStatus === "Closed";

    // 2. Build the payload with dynamic isClosed and closedAt
    const payload = {
      leadName,
      leadSource,
      agent, // Sending the ObjectId to the backend
      leadStatus,
      tags,
      timeToClose: Number(timeToClose),
      priority,
      dealValue: Number(dealValue),
      industry,
      isClosed: isNowClosed,
      closedAt: isNowClosed ? new Date().toISOString() : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add lead");
      }

      const data = await response.json();

      const selectedAgentObj = agents.find(a => a._id === agent);

      setSavedLeads((prev) => [
        ...prev,
        {
          ...data.newLead,
          agentName: selectedAgentObj ? selectedAgentObj.agentName : "Unknown Agent"
        },
      ]);

      toast.success(data.message || "Lead added successfully!");
      resetForm();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setLeadName("");
    setLeadSource("");
    setAgent("");
    setLeadStatus("");
    setTags([]);
    setTimeToClose("");
    setPriority("");
    setDealValue("");
    setIndustry("");
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
              <option value="" disabled>Select source</option>
              <option value="Website">Website</option>
              <option value="Referral">Referral</option>
              <option value="Cold Call">Cold Call</option>
              <option value="Cold Email">Cold Email</option>
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
              disabled={isLoadingAgents}
            >
              <option value="" disabled>
                {isLoadingAgents ? "Loading agents..." : "Select agent"}
              </option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.agentName}
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
              <option value="" disabled>Select status</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Time */}
          <div className="form-group">
            <label htmlFor="timeToClose">Time to Close (days)</label>
            <input
              id="timeToClose"
              type="number"
              min="1"
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
              <option value="" disabled>Select priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Deal */}
          <div className="form-group">
            <label htmlFor="dealValue">Deal Value in (₹)</label>
            <input
              type="number"
              id="dealValue"
              min="1"
              placeholder="e.g. 50000"
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              required
            />
          </div>

          {/* Industry */}
          <div className="form-group">
            <label htmlFor="industry">Industry</label>
            <select
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              required
            >
              <option value="" disabled>Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Logistics">Logistics</option>
              <option value="Retail">Retail</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Manufacturing">Manufacturing</option>
            </select>
          </div>
        </div>

        {/* TAGS */}
        <div className="pill-section">
          <label className="pb-2 fw-medium text-secondary">Tags</label>
          <span className="tag-opt-span"> (optional)</span>
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
            <button
              type="button"
              className="btn secondary w-100"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>
          <div className="col-12 col-md-6">
            <button
              type="submit"
              className="btn primary w-100 d-flex justify-content-center align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader size={16} color="#ffffff" /> Saving...
                </>
              ) : (
                "Save Lead"
              )}
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
                <p><b>Agent:</b> {lead.agentName}</p>
                <p><b>Status:</b> {lead.leadStatus}</p>
                <p><b>Priority:</b> {lead.priority}</p>

                <div className="tag-list">
                  {lead.tags && lead.tags.map((t) => (
                    <span key={t} className={`tag-chip tag-${t.replace(/\s+/g, "").toLowerCase()}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <br />
          <NavLink className={"link-btn"} to={"/leads"}>View all</NavLink>

        </section>
      )}
    </main>
  );
}
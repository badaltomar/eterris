import { useState, useEffect } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2"; // <-- Added SweetAlert2
import {
  User,
  Briefcase,
  Clock,
  Edit2,
  Save,
  Trash2,
  Zap,
  Phone,
  FileText,
  Inbox,
  Globe,
  ChevronRight,
  Check,
  MessageSquare,
  Send,
  History,
  DollarSign,
  Building,
  Calendar
} from "lucide-react";
import "../components/common/LeadDetails.css";
import ActivitySuggestions from "../components/common/ActivitySuggestions";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://crm-backend-api-sigma.vercel.app";

const PIPELINE_STEPS = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
const INDUSTRIES = ["Technology", "Logistics", "Retail", "Finance", "Healthcare", "Manufacturing"];
const AVAILABLE_TAGS = ["High Value", "VIP", "Urgent", "Follow-up"];

export default function LeadDetails() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  // --- STATE ---
  const [lead, setLead] = useState(null);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // --- EFFECT: LOAD DATA (Optimized) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadRes, agentsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/leads/${leadId}`),
          fetch(`${API_BASE_URL}/agents`)
        ]);

        if (!leadRes.ok) throw new Error("Lead not found");
        if (!agentsRes.ok) throw new Error("Failed to load agents");

        const leadData = await leadRes.json();
        const agentsData = await agentsRes.json();

        setAgents(agentsData);
        setLead(leadData);
        setFormData(leadData);
        setComments([...(leadData.comments || [])].reverse());

      } catch (error) {
        toast.error(error.message);
        if (error.message === "Lead not found") navigate("/leads");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [leadId, navigate]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAgentChange = (e) => {
    const agentObj = agents.find(a => a._id === e.target.value);
    if (agentObj) {
      setFormData((prev) => ({ ...prev, agent: agentObj }));
    }
  };

  const toggleTag = (tag) => {
    setFormData((prev) => {
      const currentTags = prev.tags || [];
      return {
        ...prev,
        tags: currentTags.includes(tag)
          ? currentTags.filter((t) => t !== tag)
          : [...currentTags, tag],
      };
    });
  };

  // --- SAVE LEAD ---
  const saveChanges = async () => {
    setIsSaving(true);

    const isNowClosed = formData.leadStatus === "Closed";

    // Build the payload with the manual date overrides
    const payload = {
      ...formData,
      agent: formData.agent._id,
      timeToClose: Number(formData.timeToClose),
      dealValue: Number(formData.dealValue),
      isClosed: isNowClosed,

      // Parse dates from the date pickers, or fallback to existing data
      createdAt: formData.createdAt ? new Date(formData.createdAt).toISOString() : lead.createdAt,
      closedAt: isNowClosed
        ? (formData.closedAt ? new Date(formData.closedAt).toISOString() : (lead.closedAt || new Date().toISOString()))
        : null,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update lead");

      const { updatedLead } = await response.json();
      setLead(updatedLead);
      setFormData(updatedLead);
      setIsEditing(false);
      toast.success("Lead updated successfully!");

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  // --- SWEETALERT FOR DELETE LEAD ---
  const handleDeleteLead = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You are about to permanently delete this lead. This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!'
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete lead");

      toast.success("Lead deleted successfully!");
      navigate("/leads");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cancelChanges = () => {
    setFormData(lead);
    setIsEditing(false);
  };

  // --- COMMENT HANDLERS ---
  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.info("Please enter a comment before posting!");
      return;
    }

    const newEntry = {
      author: lead.agent?.agentName || "Unknown Agent",
      text: newComment,
    };

    const payloadComments = [...(lead.comments || []), newEntry];

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: payloadComments }),
      });

      if (!response.ok) throw new Error("Failed to post comment");

      const { updatedLead } = await response.json();
      setLead(updatedLead);
      setFormData(updatedLead);
      setComments([...updatedLead.comments].reverse());
      setNewComment("");

    } catch (error) {
      toast.error(error.message);
    }
  };

  // --- SWEETALERT FOR DELETE COMMENT ---
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Delete comment?',
      text: "This comment will be removed from the activity timeline.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete'
    });

    if (!result.isConfirmed) return;

    const payloadComments = lead.comments.filter((c) => c._id !== commentId);

    try {
      const response = await fetch(`${API_BASE_URL}/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comments: payloadComments }),
      });

      if (!response.ok) throw new Error("Failed to delete comment");

      const { updatedLead } = await response.json();
      setLead(updatedLead);
      setFormData(updatedLead);
      setComments([...updatedLead.comments].reverse());
      toast.success("Comment deleted");

    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handlePostComment(e);
    }
  };

  // --- UTILS ---
  const getInitials = (author, isSystem) => {
    if (isSystem) return "SYS";
    if (!author) return "?";
    return author.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatTimestamp = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }).format(date);
  };

  const getCurrentStepIndex = (status) => PIPELINE_STEPS.indexOf(status);

  const getStepIcon = (step) => {
    switch (step) {
      case "New": return <Zap size={14} />;
      case "Contacted": return <Phone size={14} />;
      case "Qualified": return <User size={14} />;
      case "Proposal Sent": return <FileText size={14} />;
      case "Closed": return <Inbox size={14} />;
      default: return <Check size={14} />;
    }
  };

  if (isLoading) {
    return (
      <div className="lead-details-container loading-state">
        <ClipLoader color="#4f46e5" size={40} />
      </div>
    );
  }

  if (!lead) return null;

  const currentStep = getCurrentStepIndex(formData.leadStatus || "New");

  return (
    <div className="lead-details-wrapper">
      <div className="bg-pattern"></div>

      <main className="lead-details-container pageLoadAnimation">
        {/* HEADER */}
        <header className="page-header">
          <div className="breadcrumbs">
            <NavLink to={"/leads"} className="crumb-text">Leads</NavLink>
            <ChevronRight size={14} />
            <span className="crumb-active">Details</span>
          </div>
          <div className="header-content">
            <div className="header-text-group">
              <h1 className="page-title">Lead Overview</h1>
              <div className="lead-id-badge">ID: #{lead._id.slice(-6).toUpperCase()}</div>
            </div>

            <div className="header-actions-mobile">
              <button onClick={handleDeleteLead} className="btn-outline delete-lead-btn">
                <Trash2 size={16} /> Delete Lead
              </button>
            </div>
          </div>
        </header>

        {/* DETAILS CARD */}
        <div className="details-card" >
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
                    autoFocus
                  />
                ) : (
                  <h2 className="lead-name">{lead.leadName}</h2>
                )}
                <div className="lead-meta">
                  <span className="meta-item">
                    <Globe size={13} />
                    {isEditing ? (
                      <select name="leadSource" value={formData.leadSource} onChange={handleInputChange} className="edit-select" style={{ padding: '2px', width: 'auto' }}>
                        <option>Website</option>
                        <option>Referral</option>
                        <option>Cold Call</option>
                        <option>Cold Email</option>
                      </select>
                    ) : (
                      formData.leadSource
                    )}
                  </span>
                  <span className="meta-dot">•</span>

                  {/* EDITABLE CREATED DATE */}
                  <span className="meta-item">
                    {isEditing ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        Created:
                        <input
                          type="date"
                          name="createdAt"
                          className="edit-select"
                          style={{ padding: '2px 8px', width: 'auto', fontSize: '13px' }}
                          value={formData.createdAt?.substring(0, 10) || ""}
                          onChange={handleInputChange}
                        />
                      </span>
                    ) : (
                      <span className="created-text-mobile">Created {formatTimestamp(lead.createdAt)}</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              {isEditing ? (
                <>
                  <button className="btn-ghost" onClick={cancelChanges} disabled={isSaving}>Cancel</button>
                  <button className="btn-solid" onClick={saveChanges} disabled={isSaving}>
                    {isSaving ? <ClipLoader size={14} color="#fff" /> : <Save size={16} />}
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </>
              ) : (
                <button className="btn-outline edit-btn-mobile" onClick={() => setIsEditing(true)}>
                  <Edit2 size={15} /> Edit
                </button>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <div className="pipeline-section">
            <div className="section-header">
              <h3 className="section-label">Pipeline Progress</h3>
              <span className="pipeline-percent">
                {Math.round(((currentStep + 1) / PIPELINE_STEPS.length) * 100)}%
              </span>
            </div>

            {/* Added scroll wrapper for mobile */}
            <div className="pipeline-scroll-wrapper">
              <div className="pipeline-track">
                <div className="track-line-bg"></div>
                <div
                  className="track-line-fill"
                  style={{ width: `${(currentStep / (PIPELINE_STEPS.length - 1)) * 100}%` }}
                ></div>

                {PIPELINE_STEPS.map((step, index) => {
                  const isCompleted = index <= currentStep;
                  const isCurrent = index === currentStep;
                  return (
                    <div key={step} className={`pipeline-step ${isCompleted ? "completed" : ""} ${isCurrent ? "current" : ""}`}>
                      <div className="step-circle">
                        {index < currentStep ? <Check size={14} strokeWidth={3} /> : getStepIcon(step)}
                      </div>
                      <span className="step-label">{step}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {isEditing && (
              <div className="status-editor" style={{ marginTop: '24px' }}>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Manual Stage Override:</label>
                <select
                  className="edit-select"
                  name="leadStatus"
                  value={formData.leadStatus}
                  onChange={handleInputChange}
                  style={{ marginTop: '8px' }}
                >
                  {PIPELINE_STEPS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Grid Details */}
          <div className="card-body">
            <div className="grid-layout">
              {/* Column 1 */}
              <div className="grid-column">
                <h4 className="column-header"><Briefcase size={16} /> Deal Info</h4>

                <div className="field-group">
                  <label>Deal Value (₹)</label>
                  {isEditing ? (
                    <input type="number" className="edit-input" name="dealValue" value={formData.dealValue} onChange={handleInputChange} />
                  ) : (
                    <div className="deal-highlight">
                      <DollarSign size={16} />
                      ₹{formData.dealValue?.toLocaleString("en-IN")}
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label>Industry</label>
                  {isEditing ? (
                    <select className="edit-select" name="industry" value={formData.industry} onChange={handleInputChange}>
                      <option value="" disabled>Select Industry</option>
                      {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                    </select>
                  ) : (
                    <div className="value-txt"><Building size={14} className="txt-icon" /> {formData.industry}</div>
                  )}
                </div>

                {/* EDITABLE CLOSED DATE */}
                {formData.leadStatus === "Closed" && (
                  <div className="field-group">
                    <label>Closed Date</label>
                    {isEditing ? (
                      <input
                        type="date"
                        className="edit-input"
                        name="closedAt"
                        value={formData.closedAt ? formData.closedAt.substring(0, 10) : new Date().toISOString().substring(0, 10)}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className="value-txt">
                        <Calendar size={14} className="txt-icon" style={{ color: '#10b981' }} />
                        {formatTimestamp(lead.closedAt)}
                      </div>
                    )}
                  </div>
                )}

                <div className="field-group">
                  <label>Priority Level</label>
                  {isEditing ? (
                    <select className="edit-select" name="priority" value={formData.priority} onChange={handleInputChange}>
                      <option value="" disabled>Select Priority</option><option>High</option><option>Medium</option><option>Low</option>
                    </select>
                  ) : (
                    <span className={`badge-priority ${formData.priority?.toLowerCase()}`}>{formData.priority}</span>
                  )}
                </div>

                <div className="field-group">
                  <label>Est. Days to Close</label>
                  {isEditing ? (
                    <input type="number" className="edit-input" name="timeToClose" value={formData.timeToClose} onChange={handleInputChange} />
                  ) : (
                    <div className="value-txt"><Clock size={14} className="txt-icon" /> {formData.timeToClose} Days</div>
                  )}
                </div>
              </div>

              {/* Column 2 */}
              <div className="grid-column">
                <h4 className="column-header"><User size={16} /> Assignment</h4>

                <div className="field-group">
                  <label>Sales Agent</label>
                  {isEditing ? (
                    <select className="edit-select" value={formData.agent?._id || ""} onChange={handleAgentChange}>
                      <option value="" disabled>Select Agent</option>
                      {agents.map(a => <option key={a._id} value={a._id}>{a.agentName}</option>)}
                    </select>
                  ) : (
                    <div className="agent-display" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div className="agent-avatar-sm">{getInitials(formData.agent?.agentName, false)}</div>
                        <div className="agent-details-txt">
                          <span className="agent-name-label">{formData.agent?.agentName || "Unassigned"}</span>
                          <span className="agent-id-label">{formData.agent?.agentEmail || "No email available"}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="field-group">
                  <label>Tags</label>
                  {isEditing ? (
                    <div className="pill-group">
                      {AVAILABLE_TAGS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`pill ${formData.tags?.includes(tag) ? "active" : ""}`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="tags-list">
                      {formData.tags?.map((t) => (
                        <span key={t} className={`tag-chip tag-${t.replace(/\s+/g, "").toLowerCase()}`}>
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ACTIVITY & COMMENTS */}
        <section className="comments-section">
          <div className="comments-header">
            <h3><History size={18} /> Activity Timeline</h3>
            <span className="comment-count">{comments.length}</span>
          </div>

          <div className="comments-card">
            <div className="comment-input-area">
              <form onSubmit={handlePostComment}>
                <textarea placeholder="Log a call, note, or update..." value={newComment} onChange={(e) => setNewComment(e.target.value)} rows={2} onKeyDown={handleKeyDown} />
                <ActivitySuggestions lead={lead} onSelect={(text) => setNewComment(text)} />
                <div className="comment-actions">
                  <span className="hint-text"><strong>Enter</strong> to post</span>
                  <button type="submit" className="btn-solid btn-sm"><Send size={14} /> Post</button>
                </div>
              </form>
            </div>

            <div className="comments-feed">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment._id || comment.timestamp} className={`comment-item ${comment.isSystem ? "system-log" : ""}`}>
                    <div className="timeline-connector"></div>
                    <div className="comment-avatar">
                      {comment.isSystem ? <Zap size={14} /> : getInitials(comment.author, comment.isSystem)}
                    </div>
                    <div className="comment-content">
                      <div className="comment-header-row">
                        <span className="comment-author">
                          {comment.isSystem ? "System" : comment.author}
                          {!comment.isSystem && comment.author === lead.agent?.agentName && <span className="assignee-badge">Agent</span>}
                        </span>
                        <span className="comment-time">{formatTimestamp(comment.timestamp)}</span>
                      </div>
                      <p className="comment-text">{comment.text}</p>
                      {!comment.isSystem && (
                        <div className="comment-footer-actions">
                          <button onClick={() => handleDeleteComment(comment._id)} className="action-link delete">
                            <Trash2 size={12} /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-feed">
                  <MessageSquare size={32} />
                  <p>No activity recorded yet.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
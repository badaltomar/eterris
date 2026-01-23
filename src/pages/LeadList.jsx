import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Filter,
  ArrowLeft,
  Clock,
  ArrowUp,
  ArrowDown,
  Search,
  X,
  User,
  Zap,
  CheckCircle,
  FileText,
  Phone,
  Inbox,
  RotateCcw,
} from "lucide-react";
import "../components/common/LeadList.css";
import fakeLeads from "/leads.json"

const getStatusIcon = (status) => {
  switch (status) {
    case "New":
      return <Zap size={14} />;
    case "Contacted":
      return <Phone size={14} />;
    case "Qualified":
      return <CheckCircle size={14} />;
    case "Proposal Sent":
      return <FileText size={14} />;
    case "Closed":
      return <Inbox size={14} />;
    default:
      return <User size={14} />;
  }
};

export default function LeadList() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [agentFilter, setAgentFilter] = useState("");

  // MERGED SORT STATE
  const [sortOption, setSortOption] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const priorityOrder = { Low: 1, Medium: 2, High: 3 };

  const isAnyFilterActive = statusFilter || agentFilter || sortOption || search;

  const filteredLeads = fakeLeads
    .filter((lead) => {
      const matchesSearch =
        lead.leadName.toLowerCase().includes(search.toLowerCase()) ||
        lead.leadSource.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = !statusFilter || lead.leadStatus === statusFilter;
      const matchesAgent = !agentFilter || lead.agent.agentName === agentFilter;

      return matchesSearch && matchesStatus && matchesAgent;
    })
    .sort((a, b) => {
      // SINGLE SORT LOGIC
      switch (sortOption) {
        case "priority-desc": // High to Low
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        case "priority-asc": // Low to High
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case "time-asc": // Sooner First
          return a.timeToClose - b.timeToClose;
        case "time-desc": // Later First
          return b.timeToClose - a.timeToClose;
        default:
          return 0; // No sort
      }
    });

  // The Reset Function
  const clearAllFilters = () => {
    setSearch("");
    setStatusFilter("");
    setAgentFilter("");
    setSortOption("");
  };

  return (
    <main className="lead-list-page pageLoadAnimation">
      {/* HEADER */}
      <div className="lead-list-header">
        <div>
          <h2>Leads</h2>
          <span className="lead-count">
            {filteredLeads.length}{" "}
            {filteredLeads.length === 1 ? "lead" : "leads"} found
          </span>
        </div>

        <NavLink to="/leads/new" className="btn primary">
          + Add New Lead
        </NavLink>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="controls-container">
        <div className="search-wrapper">
          <Search className="search-icon" size={16} />
          <input
            type="text"
            placeholder="Search leads, company, or source..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch("")}>
              <X size={14} />
            </button>
          )}
        </div>

        <button
          className={`filter-toggle ${showFilters ? "active" : ""}`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={16} />
          <span>Filters / Sort</span>
        </button>

        {isAnyFilterActive && (
          <button 
            className="btn-reset" 
            onClick={clearAllFilters}
            title="Clear all active filters"
          >
            <RotateCcw size={14} />
            <span>Clear</span>
          </button>
        )}
      </div>

      {/* COLLAPSIBLE FILTERS SECTION */}
      <div className={`filter-drawer ${showFilters ? "open" : ""}`}>
        <div className="filter-grid">
          <div className="select-group">
            <label>Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              <option value={"New"}>New</option>
              <option value={"Contacted"}>Contacted</option>
              <option value={"Qualified"}>Qualified</option>
              <option value={"Proposal Sent"}>Proposal Sent</option>
              <option value={"Closed"}>Closed</option>
            </select>
          </div>

          <div className="select-group">
            <label>Agent</label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="">All Agents</option>
              <option value={"Agent A"}>Agent A</option>
              <option value={"Agent B"}>Agent B</option>
              <option value={"Agent C"}>Agent C</option>
            </select>
          </div>

          {/* MERGED SORT DROPDOWN */}
          <div className="select-group">
            <label>Sort Order</label>
            <div className="select-with-icon">
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Default (No Sort)</option>
                <option value={"priority-desc"}>Priority: High → Low</option>
                <option value={"priority-asc"}>Priority: Low → High</option>
                <option value={"time-asc"}>Time: Sooner First</option>
                <option value={"time-desc"}>Time: Later First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE HEADERS (Desktop Only) */}
      <div className="lead-columns desktop-only">
        <span>Lead Name & Source</span>
        <span>Status</span>
        <span>Priority</span>
        <span>Assigned Agent</span>
        <span>Est. Close Date</span>
        <span>Tags</span>
      </div>

      {/* LIST SECTION */}
      <section className="lead-list">
        {filteredLeads.length > 0 ? (
          filteredLeads.map((lead, i) => (
            <NavLink to={`/leads/${lead._id}`} key={lead._id} className="lead-row">
              {/* MOBILE HEADER: WRAPS NAME & STATUS */}
              <div className="mobile-card-header">
                {/* Column 1: Name */}
                <div className="lead-main">
                  <h4>{lead.leadName}</h4>
                  <span className="source">{lead.leadSource}</span>
                </div>

                {/* Column 2: Status */}
                <div className="col-status">
                  <span
                    className={`status status-${lead.leadStatus.replace(" ", "").toLowerCase()}`}
                  >
                    {getStatusIcon(lead.leadStatus)}
                    {lead.leadStatus}
                  </span>
                </div>
              </div>

              {/* Column 3: Priority */}
              <div className="col-priority">
                <span className={`priority ${lead.priority.toLowerCase()}`}>
                  {lead.priority === "High" ? (
                    <ArrowUp size={14} />
                  ) : lead.priority === "Low" ? (
                    <ArrowDown size={14} />
                  ) : null}
                  {lead.priority}
                </span>
              </div>

              {/* Column 4: Agent */}
              <div className="col-agent">
                <div className="agent-badge">
                  <User size={12} />
                  {lead.agent.agentName}
                </div>
              </div>

              {/* Column 5: Time */}
              <div className="col-time">
                <span className="time">
                  <Clock size={14} />
                  {lead.timeToClose} days
                </span>
              </div>

              {/* Column 6: Tags */}
              <div className="tag-list">
                {lead.tags?.map((t) => (
                  <span
                    key={t}
                    className={`tag-chip tag-${t.replace(/\s+/g, "").toLowerCase()}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </NavLink>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={40} />
            </div>
            <h3>No leads found</h3>
            <p>Try adjusting your search or filters.</p>
            <button
              className="btn secondary"
              onClick={clearAllFilters}
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>

      {/* FOOTER */}
      <div className="back-link">
        <NavLink to="/">
          <ArrowLeft size={16} /> Back to Dashboard
        </NavLink>
      </div>
    </main>
  );
}

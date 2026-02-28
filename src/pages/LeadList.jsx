import { useState, useEffect, useMemo } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getStatusIcon = (status) => {
  switch (status) {
    case "New": return <Zap size={14} />;
    case "Contacted": return <Phone size={14} />;
    case "Qualified": return <CheckCircle size={14} />;
    case "Proposal Sent": return <FileText size={14} />;
    case "Closed": return <Inbox size={14} />;
    default: return <User size={14} />;
  }
};

export default function LeadList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentAgent = searchParams.get("salesAgent") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSearch = searchParams.get("q") || "";
  const currentSort = searchParams.get("sort") || "";

  // Data & Loading States
  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const isAnyFilterActive = currentAgent || currentStatus || currentSearch || currentSort;
  const [showFilters, setShowFilters] = useState(isAnyFilterActive);

  const allStatuses = [
    "New",
    "Contacted",
    "Qualified",
    "Proposal Sent",
    "Closed",
  ];

  // 1. Fetch Agents
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
      }
    };
    fetchAgents();
  }, []);

  // 2. Fetch Leads (Filtering happens on Backend, Sorting happens on Frontend)
  useEffect(() => {
    const fetchLeads = async () => {
      setIsLoading(true);
      try {
        const params = new URLSearchParams();
        if (currentSearch) params.append("q", currentSearch);
        if (currentStatus) params.append("status", currentStatus);
        if (currentAgent) params.append("salesAgent", currentAgent);

        // NOTE: We do NOT send 'sort' to backend because backend sorts Priority alphabetically.
        // We will sort it correctly in the useMemo below.

        const response = await fetch(`${API_BASE_URL}/leads?${params.toString()}`);

        if (!response.ok) throw new Error("Failed to fetch leads");

        const data = await response.json();
        setLeads(data);
      } catch (error) {
        toast.error(error.message || "Something went wrong while fetching leads.");
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchLeads();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentSearch, currentStatus, currentAgent]);

  const sortedLeads = useMemo(() => {
    let sorted = [...leads];

    // Priority Value Map
    const priorityOrder = { High: 3, Medium: 2, Low: 1 };

    if (currentSort) {
      sorted.sort((a, b) => {
        if (currentSort === "priority-desc") {
          // High(3) -> Low(1)
          return priorityOrder[b.priority] - priorityOrder[a.priority];
        }
        if (currentSort === "priority-asc") {
          // Low(1) -> High(3)
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (currentSort === "time-asc") return a.timeToClose - b.timeToClose;
        if (currentSort === "time-desc") return b.timeToClose - a.timeToClose;
        return 0;
      });
    }

    return sorted;
  }, [leads, currentSort]);


  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== "All") {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams({});
  };

  return (
    <main className="lead-list-page pageLoadAnimation">
      {/* HEADER */}
      <div className="lead-list-header">
        <div>
          <h2>Leads</h2>
          <span className="lead-count">
            {sortedLeads.length} {sortedLeads.length === 1 ? "lead" : "leads"} found
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
            value={currentSearch}
            onChange={(e) => updateFilter("q", e.target.value)}
          />
          {currentSearch && (
            <button className="clear-btn" onClick={() => updateFilter("q", "")}>
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

      {/* FILTER DRAWER */}
      <div className={`filter-drawer ${showFilters ? "open" : ""}`}>
        <div className="filter-grid">
          <div className="select-group">
            <label>Status</label>
            <select
              value={currentStatus}
              onChange={(e) => updateFilter("status", e.target.value)}
            >
              <option value="">All Statuses</option>
              {allStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label>Agent</label>
            <select
              value={currentAgent}
              onChange={(e) => updateFilter("salesAgent", e.target.value)}
            >
              <option value="">All Agents</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.agentName}
                </option>
              ))}
            </select>
          </div>

          <div className="select-group">
            <label>Sort Order</label>
            <div className="select-with-icon">
              <select
                value={currentSort}
                onChange={(e) => updateFilter("sort", e.target.value)}
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

      {/* TABLE HEADERS */}
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
        {isLoading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
            <ClipLoader color="#4f46e5" size={40} />
          </div>
        ) : sortedLeads.length > 0 ? (
          sortedLeads.map((lead) => (
            <NavLink
              to={`/leads/${lead._id}`}
              key={lead._id}
              className="lead-row"
            >
              <div className="mobile-card-header">
                <div className="lead-main">
                  <h4>{lead.leadName}</h4>
                  <span className="source">{lead.leadSource}</span>
                </div>

                <div className="col-status">
                  <span
                    className={`status status-${lead.leadStatus.replace(" ", "").toLowerCase()}`}
                  >
                    {getStatusIcon(lead.leadStatus)}
                    {lead.leadStatus}
                  </span>
                </div>
              </div>

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

              <div className="col-agent">
                <div className="agent-badge">
                  <User size={12} />
                  {lead.agent?.agentName || "Unassigned"}
                </div>
              </div>

              <div className="col-time">
                <span className="time">
                  <Clock size={14} />
                  {lead.timeToClose} days
                </span>
              </div>

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
            <button className="btn secondary" onClick={clearAllFilters}>
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
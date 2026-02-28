import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners"; 
import {
  Filter,
  ArrowLeft,
  Search,
  X,
  User,
  Zap,
  CheckCircle,
  FileText,
  Phone,
  Inbox,
  ArrowUpDown,
  Calendar,
  Briefcase
} from "lucide-react";
import "../components/common/LeadsByAgent.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

const getStatusIcon = (status) => {
  switch (status) {
    case "New": return <Zap size={12} />;
    case "Contacted": return <Phone size={12} />;
    case "Qualified": return <CheckCircle size={12} />;
    case "Proposal Sent": return <FileText size={12} />;
    case "Closed": return <Inbox size={12} />;
    default: return <User size={12} />;
  }
};

const getStatusClass = (status) => {
  return `status-badge-${status.replace(" ", "").toLowerCase()}`;
};

// --- SUB-COMPONENT: Individual Agent Column ---
const AgentColumn = ({ agentName, leads, allStatuses }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localStatus, setLocalStatus] = useState("All");
  const [localPriority, setLocalPriority] = useState("All");
  const [localSort, setLocalSort] = useState("default");

  // Filter & Sort Logic Specific to this Agent
  const processedLeads = useMemo(() => {
    let data = [...leads];

    // 1. Filter Status
    if (localStatus !== "All") {
      data = data.filter(l => l.leadStatus === localStatus);
    }
    // 2. Filter Priority
    if (localPriority !== "All") {
      data = data.filter(l => l.priority === localPriority);
    }
    // 3. Sort Time
    if (localSort === "asc") {
      data.sort((a, b) => a.timeToClose - b.timeToClose);
    } else if (localSort === "desc") {
      data.sort((a, b) => b.timeToClose - a.timeToClose);
    }

    return data;
  }, [leads, localStatus, localPriority, localSort]);

  const hasActiveFilters = localStatus !== "All" || localPriority !== "All" || localSort !== "default";
  const displayName = agentName.split(' ')[0] || "Unknown";

  return (
    <div className="lba-column">
      {/* Column Header */}
      <div className="lba-col-header">
        <div className="lba-col-title-row">
          <div className="lba-title-group">
            <div className="lba-avatar">
              {displayName.charAt(0)}
            </div>
            <div className="lba-agent-info">
              <h3>{displayName}</h3>
              <span className="lba-count">{processedLeads.length} leads</span>
            </div>
          </div>

          <button
            className={`lba-filter-toggle ${hasActiveFilters || showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Filter this agent's leads"
          >
            <Filter size={14} />
          </button>
        </div>

        {/* IN-COLUMN FILTERS */}
        <div className={`lba-col-filters ${showFilters ? "open" : ""}`}>
          <select value={localStatus} onChange={(e) => setLocalStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <div className="lba-filter-row-2">
            <select value={localPriority} onChange={(e) => setLocalPriority(e.target.value)}>
              <option value="All">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Med</option>
              <option value="Low">Low</option>
            </select>

            <button
              className="lba-sort-btn"
              onClick={() => setLocalSort(prev => prev === 'asc' ? 'desc' : 'asc')}
              title="Sort by Time to Close"
            >
              <ArrowUpDown size={11} />
              {localSort === 'asc' ? 'Fast' : localSort === 'desc' ? 'Slow' : 'Sort'}
            </button>
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="lba-col-list-container">
        <div className="lba-col-list-scroll">
          {processedLeads.length > 0 ? (
            processedLeads.map((lead) => (
              <NavLink to={`/leads/${lead._id}`} key={lead._id} className="lba-tile">
                <div className={`lba-tile-stripe ${lead.priority?.toLowerCase() || 'medium'}`}></div>

                <div className="lba-tile-content">
                  <div className="lba-tile-top">
                    <span className="lba-lead-name">{lead.leadName}</span>
                    {lead.priority === 'High' && <span className="urgent-dot"></span>}
                  </div>

                  <div className="lba-tile-meta">
                    <span className={`lba-status-badge ${getStatusClass(lead.leadStatus)}`}>
                      {getStatusIcon(lead.leadStatus)}
                      {lead.leadStatus}
                    </span>

                    <span className="lba-meta-item">
                      <Calendar size={10} /> {lead.timeToClose}d
                    </span>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="lba-empty">No leads assigned</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function LeadsByAgent() {
  const [globalSearch, setGlobalSearch] = useState("");
  const [leadsData, setLeadsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- FETCH DATA FROM API ---
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/leads`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load leads");
        }
        const data = await response.json();
        setLeadsData(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // Extract Unique Data
  // Note: Handle cases where lead.agent might be null or undefined if deleted
  const uniqueAgents = useMemo(() => {
    const agents = leadsData
      .map(l => l.agent?.agentName)
      .filter(name => name !== undefined && name !== null);
    return [...new Set(agents)];
  }, [leadsData]);

  const uniqueStatuses = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  const searchResults = useMemo(() => {
    if (!globalSearch) return leadsData;
    return leadsData.filter(l =>
      l.leadName?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      l.agent?.agentName?.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch, leadsData]);

  // Group by Agent Name
  const groupedLeads = useMemo(() => {
    const groups = {};
    uniqueAgents.forEach(a => groups[a] = []);

    // Add an 'Unassigned' group just in case any leads don't have an agent
    groups["Unassigned"] = [];

    searchResults.forEach(lead => {
      const agentName = lead.agent?.agentName || "Unassigned";
      if (groups[agentName]) {
        groups[agentName].push(lead);
      } else {
        // Fallback for leads with agents that weren't caught in uniqueAgents
        groups[agentName] = [lead];
      }
    });

    // Remove empty Unassigned group to keep UI clean if not needed
    if (groups["Unassigned"].length === 0) {
      delete groups["Unassigned"];
    }

    return groups;
  }, [searchResults, uniqueAgents]);

  return (
    <div className="lba-wrapper pageLoadAnimation">
      {/* Header */}
      <header className="lba-header">
        <div className="lba-header-left">
          <NavLink to="/leads/status" className="back-btn">
            <ArrowLeft size={18} />
          </NavLink>
          <div>
            <h2>Agent Workload</h2>
            <p className="lba-subtitle">Performance & Assignment View</p>
          </div>
        </div>

        <div className="lba-header-right">
          <div className="lba-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search leads..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {globalSearch && <X size={14} className="clear-icon" onClick={() => setGlobalSearch("")} />}
          </div>
          <NavLink to="/agents/new" className="btn primary small">
            + New Agent
          </NavLink>
        </div>
      </header>
      {/* Board Area */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", width: "100%" }}>
          <ClipLoader color="#4f46e5" size={40} />
        </div>
      ) : (
        <div className="lba-board-wrapper">
          <div className="lba-board">
            {Object.keys(groupedLeads).map(agent => (
              <AgentColumn
                key={agent}
                agentName={agent}
                leads={groupedLeads[agent]}
                allStatuses={uniqueStatuses}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
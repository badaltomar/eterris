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
  Calendar
} from "lucide-react";
import "../components/common/LeadsByStatus.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getStatusIcon = (status) => {
  switch (status) {
    case "New": return <Zap size={13} />;
    case "Contacted": return <Phone size={13} />;
    case "Qualified": return <CheckCircle size={13} />;
    case "Proposal Sent": return <FileText size={13} />;
    case "Closed": return <Inbox size={13} />;
    default: return <User size={13} />;
  }
};

// --- Individual Status Column ---
const StatusColumn = ({ status, leads, allAgents }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localAgent, setLocalAgent] = useState("All");
  const [localPriority, setLocalPriority] = useState("All");
  const [localSort, setLocalSort] = useState("default");

  const processedLeads = useMemo(() => {
    let data = [...leads];

    if (localAgent !== "All") {
      // access agent name
      data = data.filter(l => (l.agent?.agentName || "Unassigned") === localAgent);
    }
    if (localPriority !== "All") {
      data = data.filter(l => l.priority === localPriority);
    }
    if (localSort === "asc") {
      data.sort((a, b) => (a.timeToClose || 0) - (b.timeToClose || 0));
    } else if (localSort === "desc") {
      data.sort((a, b) => (b.timeToClose || 0) - (a.timeToClose || 0));
    }

    return data;
  }, [leads, localAgent, localPriority, localSort]);

  const hasActiveFilters = localAgent !== "All" || localPriority !== "All" || localSort !== "default";
  const statusClass = `status-${status.replace(" ", "").toLowerCase()}`;

  return (
    <div className="lbs-column">
      <div className={`lbs-col-header ${statusClass}-border`}>
        <div className="lbs-col-title-row">
          <div className="lbs-title-group">
            <span className={`status-icon-bg ${statusClass}-bg`}>
              {getStatusIcon(status)}
            </span>
            <h3>{status}</h3>
            <span className="lbs-count">{processedLeads.length}</span>
          </div>

          <button
            className={`lbs-filter-toggle ${hasActiveFilters || showFilters ? "active" : ""}`}
            onClick={() => setShowFilters(!showFilters)}
            title="Filter this column"
          >
            <Filter size={12} />
          </button>
        </div>

        <div className={`lbs-col-filters ${showFilters ? "open" : ""}`}>
          <select value={localAgent} onChange={(e) => setLocalAgent(e.target.value)}>
            <option value="All">All Agents</option>
            {allAgents.map(a => <option key={a} value={a}>{a.split(' ')[0]}</option>)}
          </select>

          <div className="lbs-filter-row-2">
            <select value={localPriority} onChange={(e) => setLocalPriority(e.target.value)}>
              <option value="All">Priority</option>
              <option value="High">High</option>
              <option value="Medium">Med</option>
              <option value="Low">Low</option>
            </select>

            <button
              className="lbs-sort-btn"
              onClick={() => setLocalSort(prev => prev === 'asc' ? 'desc' : 'asc')}
              title="Sort by Time to Close"
            >
              <ArrowUpDown size={11} />
              {localSort === 'asc' ? 'Fast' : localSort === 'desc' ? 'Slow' : 'Sort'}
            </button>
          </div>
        </div>
      </div>

      <div className="lbs-col-list-container">
        <div className="lbs-col-list-scroll">
          {processedLeads.length > 0 ? (
            processedLeads.map((lead) => (
              <NavLink to={`/leads/${lead._id}`} key={lead._id} className="lbs-tile">
                <div className={`lbs-tile-stripe ${lead.priority?.toLowerCase() || 'medium'}`}></div>
                <div className="lbs-tile-content">
                  <div className="lbs-tile-top">
                    <span className="lbs-lead-name">{lead.leadName}</span>
                    {lead.priority === 'High' && <span className="urgent-dot"></span>}
                  </div>
                  <div className="lbs-tile-meta">
                    <span className="lbs-meta-item">
                      <User size={10} /> {(lead.agent?.agentName || "Unassigned").split(' ')[0]}
                    </span>
                    <span className="lbs-meta-item">
                      <Calendar size={10} /> {lead.timeToClose || 0}d
                    </span>
                  </div>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="lbs-empty">No leads</div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function LeadsByStatus() {
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

  const allAgents = useMemo(() => {
    const agents = leadsData.map(l => l.agent?.agentName || "Unassigned");
    return [...new Set(agents)];
  }, [leadsData]);

  const statusOrder = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

  const searchResults = useMemo(() => {
    if (!globalSearch) return leadsData;
    return leadsData.filter(l =>
      l.leadName?.toLowerCase().includes(globalSearch.toLowerCase()) ||
      l.agent?.agentName?.toLowerCase().includes(globalSearch.toLowerCase())
    );
  }, [globalSearch, leadsData]);

  const groupedLeads = useMemo(() => {
    const groups = {};
    statusOrder.forEach(s => groups[s] = []);

    searchResults.forEach(lead => {
      // Fallback to "New" if leadStatus is somehow missing or invalid
      const status = statusOrder.includes(lead.leadStatus) ? lead.leadStatus : "New";
      groups[status].push(lead);
    });
    return groups;
  }, [searchResults]);

  return (
    <div className="lbs-wrapper pageLoadAnimation">
      <header className="lbs-header">
        <div className="lbs-header-left">
          <NavLink to="/leads" className="back-btn">
            <ArrowLeft size={18} />
          </NavLink>
          <div>
            <h2>Pipeline</h2>
            <p className="lbs-subtitle">Manage leads by status</p>
          </div>
        </div>

        <div className="lbs-header-right">
          <div className="lbs-search-box">
            <Search size={14} className="search-icon" />
            <input
              type="text"
              placeholder="Search leads..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
            {globalSearch && <X size={14} className="clear-icon" onClick={() => setGlobalSearch("")} />}
          </div>
          <NavLink to={"/leads/new"} className="btn primary small">
            + Lead
          </NavLink>
        </div>
      </header>
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", width: "100%" }}>
          <ClipLoader color="#4f46e5" size={40} />
        </div>
      ) : (
        <div className="lbs-board-wrapper">
          <div className="lbs-board">
            {statusOrder.map(status => (
              <StatusColumn
                key={status}
                status={status}
                leads={groupedLeads[status]}
                allAgents={allAgents}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
import React, { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2"; 
import { ArrowLeft, Mail, Trophy, Briefcase, Users, Zap, Target, Trash2 } from "lucide-react";
import "../components/common/AgentList.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AgentList() {
  const [agents, setAgents] = useState([]);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch both Agents and Leads concurrently on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [agentsRes, leadsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/agents`),
          fetch(`${API_BASE_URL}/leads`),
        ]);

        if (!agentsRes.ok) {
          const err = await agentsRes.json();
          throw new Error(err.message || "Failed to fetch agents");
        }
        if (!leadsRes.ok) {
          const err = await leadsRes.json();
          throw new Error(err.message || "Failed to fetch leads");
        }

        const agentsData = await agentsRes.json();
        const leadsData = await leadsRes.json();

        setAgents(agentsData);
        setLeads(leadsData);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Delete Agent Logic
  const handleDeleteAgent = async (agentId) => {
    
    const result = await Swal.fire({
      title: 'Delete Agent?',
      text: "Are you sure you want to permanently delete this agent?",
      // icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Yes, delete it!',
      imageUrl: "https://media1.tenor.com/m/a_n3VGXFbUgAAAAd/you-cant-fire-me-you-cant-remove-me.gif",
      imageWidth: 135,
      imageHeight: 120,
      imageAlt: 'Deleting Animation',
      background: '#fff',
      backdrop: `rgba(15, 23, 42, 0.6)`
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_BASE_URL}/agents/${agentId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to delete agent");
        }

        // 1. Remove the deleted agent from UI state instantly
        setAgents((prev) => prev.filter((a) => a._id !== agentId));

        // 2. SHOW SUCCESS GIF HERE
        Swal.fire({
          title: "Deleted!",
          text: "The agent has been removed from the system.",
          imageUrl: "https://media1.tenor.com/m/CW3dv0a1Hf4AAAAC/mission-complete-spongebob.gif", // Clean checkmark GIF
          imageWidth: 130,
          imageHeight: 110,
          confirmButtonColor: "#4f46e5", 
          timer: 3000, 
          timerProgressBar: true
        });

        // toast.success("Agent deleted successfully!");

      } catch (error) {
        toast.error(error.message);
      }
    }
  }
  const agentsWithStats = useMemo(() => {
    const map = {};

    agents.forEach((agent) => {
      map[agent._id] = {
        agentId: agent._id,
        agentName: agent.agentName,
        email: agent.agentEmail,
        createdAt: agent.createdAt,
        totalLeads: 0,
        closedDeals: 0,
        activeLeads: 0,
      };
    });

    leads.forEach((lead) => {
      const agentId = lead.agent?._id;

      if (agentId && map[agentId]) {
        map[agentId].totalLeads += 1;

        if (lead.leadStatus === "Closed" || lead.isClosed) {
          map[agentId].closedDeals += 1;
        } else {
          map[agentId].activeLeads += 1;
        }
      }
    });

    return Object.values(map);
  }, [agents, leads]);

  return (
    <main className="agent-page pageLoadAnimation">
      {/* HEADER */}
      <header className="agent-header">
        <div>
          <h2>Sales Team</h2>
          <p className="subtitle">Manage agents and performance</p>
        </div>

        <div className="team-stats-pill">
          <div className="pill-item">
            <Users size={14} />
            <span>{agents.length} Agents</span>
          </div>
          <div className="divider"></div>
          <div className="pill-item">
            <Zap size={14} className="text-orange" />
            <span>Active</span>
          </div>
        </div>
      </header>

      {/* AGENT GRID */}
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", width: "100%" }}>
          <ClipLoader color="#4f46e5" size={40} />
        </div>
      ) : (
        <section className="agent-grid">
          {agentsWithStats.map((agent) => (
            <div key={agent.agentId} className="agent-card">
              <div className="agent-profile">
                <div className="agent-avatar">{agent.agentName.charAt(0).toUpperCase()}</div>
                <h3>{agent.agentName}</h3>
                <span className="agent-role">Sales Representative</span>
                {/* Replaced fake ID with actual Date joined */}
                <span className="agent-id">
                  Joined: {new Date(agent.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="agent-stats">
                <div className="stat-item">
                  <Briefcase size={14} className="text-gray" />
                  <span className="stat-val">{agent.activeLeads}</span>
                  <span className="stat-label">Active</span>
                </div>
                <div className="stat-item">
                  <Trophy size={14} className="text-gray" />
                  <span className="stat-val">{agent.closedDeals}</span>
                  <span className="stat-label">Closed</span>
                </div>
                <div className="stat-item">
                  <Target size={14} />
                  <span className="stat-val text-blue">{agent.totalLeads}</span>
                  <span className="stat-label">Total</span>
                </div>
              </div>

              <div className="card-actions">
                <a
                  href={`mailto:${agent.email}`}
                  className="action-btn primary-outline"
                >
                  <Mail size={14} />
                  <span>Email Agent</span>
                </a>

                <button
                  onClick={() => handleDeleteAgent(agent.agentId)}
                  className="action-btn delete-btn"
                  title="Delete Agent"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </div>
          ))}

          {/* Add New Placeholder Card */}
          <NavLink to="/agents/new" className="agent-card add-new">
            <div className="add-icon">+</div>
            <span>Register New Agent</span>
          </NavLink>
        </section>
      )}

      {/* FOOTER */}
      <div className="back-link" style={{ marginTop: "32px" }}>
        <NavLink to="/">
          <ArrowLeft size={16} /> Back to Dashboard
        </NavLink>
      </div>
    </main>
  );
}
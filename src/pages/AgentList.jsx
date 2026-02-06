import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { ArrowLeft, Mail, Trophy, Briefcase, Users, Zap, Target } from "lucide-react";
import fakeLeads from "/reports.json";
import "../components/common/AgentList.css";

export default function AgentList() {
  const agentsWithStats = useMemo(() => {
    const map = {};

    fakeLeads.forEach((lead) => {
      const { agentId, agentName } = lead.agent;

      // Initialize if new
      if (!map[agentId]) {
        map[agentId] = {
          agentId,
          agentName,
          email: `${agentName.toLowerCase().replace(" ", ".")}@company.com`, // Placeholder
          totalLeads: 0,
          closedDeals: 0,
          activeLeads: 0,
        };
      }

      // Calculate Stats
      map[agentId].totalLeads += 1;

      if (lead.leadStatus === "Closed" || lead.isClosed) {
        map[agentId].closedDeals += 1;
      } else {
        map[agentId].activeLeads += 1;
      }
    });

    return Object.values(map);
  }, []);

  return (
    <main className="agent-page pageLoadAnimation">
      {/* HEADER */}
      <header className="agent-header">
        <div>
          <h2>Sales Team</h2>
          <p className="subtitle">Manage agents and performance</p>
        </div>

        {/* REPLACEMENT COMPONENT */}
        <div className="team-stats-pill">
          <div className="pill-item">
            <Users size={14} />
            <span>{agentsWithStats.length} Agents</span>
          </div>
          <div className="divider"></div>
          <div className="pill-item">
            <Zap size={14} className="text-orange" />
            <span>Active</span>
          </div>
        </div>
      </header>

      {/* AGENT GRID */}
      <section className="agent-grid">
        {agentsWithStats.map((agent) => (
          <div key={agent.agentId} className="agent-card">
            <div className="agent-profile">
              <div className="agent-avatar">{agent.agentName.charAt(0)}</div>
              <h3>{agent.agentName}</h3>
              <span className="agent-role">Sales Representative</span>
              <span className="agent-id">{agent.agentId}</span>
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
                <Target size={14}/>
                <span className="stat-val text-blue">{agent.totalLeads}</span>
                <span className="stat-label">Total</span>
              </div>
            </div>

            <div className="card-actions">
              <a
                href={`mailto:${agent.email}`}
                className="action-btn primary-outline"
              >
                <Mail size={14} /> Email Agent
              </a>
            </div>
          </div>
        ))}

        {/* Add New Placeholder Card */}
        <NavLink to="/agents/new" className="agent-card add-new">
          <div className="add-icon">+</div>
          <span>Register New Agent</span>
        </NavLink>
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

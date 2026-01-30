import { NavLink } from "react-router-dom";
import "../components/common/AgentList.css";
import { ArrowLeft } from "lucide-react";
import fakeLeads from "/leads.json"

export default function AgentList() {

 const uniqueAgents = Object.values(
  fakeLeads.reduce((acc, lead) => {
    const agent = lead.agent;
    if (agent && agent.agentId) {
      acc[agent.agentId] = {
        agentId: agent.agentId,
        agentName: agent.agentName
      };
    }
    return acc;
  }, {})
);

  return (
    <main className="agent-page pageLoadAnimation">
      {/* HEADER */}
      <div className="agent-header">
        <h2>Sales Agent Management</h2>

        <NavLink to="/agents/new" className="btn primary">
          + Add New Agent
        </NavLink>
      </div>

      {/* AGENT LIST */}
      <section className="agent-list">
        {uniqueAgents.map((agent) => (
          <div key={agent.agentId} className="agent-card">
            <div className="agent-info">
              <h4>{agent.agentName}</h4>
              <p>{agent.agentId}</p>
              {/* <p>{agent.agentEmail}</p> adding later...*/}
            </div>
          </div>
        ))}
      </section>

      {/* BACK LINK */}
      <div className="back-link">
        <NavLink to="/">
          <ArrowLeft size={16} /> Back to Dashboard
        </NavLink>
      </div>
    </main>
  );
}

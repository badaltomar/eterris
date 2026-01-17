import { NavLink } from "react-router-dom";
import "../components/common/AgentList.css";

export default function AgentList() {
  const AGENTS = [
    { name: "John Doe", email: "john.doe@email.com" },
    { name: "Jane Smith", email: "jane.smith@email.com" },
    { name: "Alex Brown", email: "alex.brown@email.com" },
  ];

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
        {AGENTS.map((agent, i) => (
          <div key={i} className="agent-card">
            <div className="agent-info">
              <h4>{agent.name}</h4>
              <p>{agent.email}</p>
            </div>
          </div>
        ))}
      </section>

      {/* BACK LINK */}
      <div className="back-link">
        <NavLink to="/" className="text-decoration-none">
          ← Back to Dashboard
        </NavLink>
      </div>
    </main>
  );
}

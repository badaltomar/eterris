import { useState } from "react";

export default function AddNewAgent() {
  const [agentEmail, setAgentEmail] = useState("");
  const [agentName, setAgentName] = useState("");

  const [savedAgents, setSavedAgents] = useState([]);

  function submitAgentForm(e) {
    e.preventDefault();

    setSavedAgents((prev) => [
      ...prev,
      {
        agentName,
        agentEmail,
      },
    ]);

    resetForm();
  }

  function resetForm(){
    setAgentName("")
    setAgentEmail("")
  }

  return (
    <main className="add-lead-page pageLoadAnimation">
      <form className="lead-form" onSubmit={submitAgentForm}>
        <h2 className="form-title">ADD NEW SALES AGENT</h2>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="agentName">Agent Name</label>
            <input
              id="agentName"
              type="text"
              placeholder="Enter agent name"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="agentEmail">Agent Email</label>
            <input
              id="agentEmail"
              type="email"
              placeholder="e.g. thomas@gmail.com"
              value={agentEmail}
              onChange={(e) => setAgentEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="row g-3 mt-4">
          <div className="col-12 col-md-6">
            <button type="reset" className="btn secondary w-100" onClick={resetForm}>
              Reset
            </button>
          </div>
          <div className="col-12 col-md-6">
            <button type="submit" className="btn primary w-100">
              Save Agent
            </button>
          </div>
        </div>
      </form>

      {/* SAVED AGENTS */}
      {savedAgents.length > 0 && (
        <section className="saved-section">
          <h3>Recently Added Agents</h3>

          <div className="saved-grid">
            {savedAgents.map((agent, i) => (
              <div key={i} className="saved-card">
                <p><b>Agent:</b> {agent.agentName}</p>
                <p><b>Email:</b> {agent.agentEmail}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

import { useState } from "react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "../components/common/Forms.css";
import { NavLink } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AddNewAgent() {
  const [agentEmail, setAgentEmail] = useState("");
  const [agentName, setAgentName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAgents, setSavedAgents] = useState([]);

  async function submitAgentForm(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/agents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agentName, agentEmail }),
      });

      if (!response.ok) {
        // Catches the duplicate email error sent by your backend
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add agent");
      }

      const data = await response.json();

      // data.agent contains the newly created document (with _id, createdAt, etc.)
      setSavedAgents((prev) => [...prev, data.agent]);

      toast.success(data.message || "Agent created successfully!");
      resetForm();

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetForm() {
    setAgentName("");
    setAgentEmail("");
  }

  // Helper to format the backend timestamp nicely
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <div className="row g-3 mt-4">
          <div className="col-12 col-md-6">
            <button
              type="button"
              className="btn secondary w-100"
              onClick={resetForm}
              disabled={isSubmitting}
            >
              Reset
            </button>
          </div>
          <div className="col-12 col-md-6">
            <button
              type="submit"
              className="btn primary w-100 d-flex justify-content-center align-items-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <ClipLoader size={16} color="#ffffff" /> Saving...
                </>
              ) : (
                "Save Agent"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* SAVED AGENTS */}
      {savedAgents.length > 0 && (
        <section className="saved-section">
          <h3>Recently Added Agents</h3>
          <div className="saved-grid">
            {savedAgents.map((agent) => (
              <div key={agent._id} className="saved-card">
                <p><b>Agent:</b> {agent.agentName}</p>
                <p><b>Email:</b> {agent.agentEmail}</p>
                {agent.createdAt && (
                  <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "8px" }}>
                    <b>Added:</b> {formatDate(agent.createdAt)}
                  </p>
                )}
              </div>
            ))}
          </div>
          <br />
          <NavLink className={"link-btn"} to={"/agents"}>View all</NavLink>
        </section>
      )}
    </main>
  );
}
import { useState } from "react";

function AddLeadMain() {
  const [leadName, setLeadName] = useState("");
  const [leadSource, setLeadSource] = useState("");
  const [assignedSalesAgent, setAssignedSalesAgent] = useState([]);
  const [leadStatus, setLeadStatus] = useState("");
  const [tags, setTags] = useState([]);
  const [timeToClose, setTimeToClose] = useState(0);
  const [priority, setPriority] = useState("");

  const [submittedNewLead, setSubmittedNewLead] = useState(false);

  //---- ---- ----
  // Handle Inputs onChange:
  //---- ---- ----

  function handleAssignedSalesAgent(e) {
    const { value } = e.target;
    const exists = assignedSalesAgent.includes(value);
    if (exists) {
      setAssignedSalesAgent((prevAgnt) =>
        prevAgnt.filter((agnt) => agnt !== value)
      );
    } else {
      setAssignedSalesAgent((prevAgnt) => [...prevAgnt, value]);
    }
  }

  function handleTags(tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }
  //---- ---- ----

  function submitLeadForm(e) {
    e.preventDefault();

    setSubmittedNewLead(true);
  }

  function resetLeadForm() {
    setLeadName("");
    setLeadSource("");
    setAssignedSalesAgent([]);
    setLeadStatus("");
    setTags([]);
    setTimeToClose(0);
    setPriority("");
  }

  return (
    <main>
      <form onSubmit={submitLeadForm} onReset={resetLeadForm}>
        <h2 className="text-center bg-secondary p-2">ADD NEW LEAD</h2>
        <div className="">

          <label htmlFor="leadName">Lead Name </label>
          <input
            type="text"
            id="leadName"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            required
          />
          <br />
          <label htmlFor="leadSource">Lead Source </label>
          <select
            id="leadSource"
            value={leadSource}
            onChange={(e) => setLeadSource(e.target.value)}
            required
          >
            <option value="">Select Source</option>
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="Cold Call">Cold Call</option>
          </select>
          <br />
          <label htmlFor="assignedSalesAgent">Assigned Sales Agent </label>
          <select
            id="assignedSalesAgent"
            className="form-select"
            value={assignedSalesAgent}
            onChange={handleAssignedSalesAgent}
            multiple
            required
          >
            <option value="">Select Agents</option>
            <option value="Agent A">Agent A</option>
            <option value="Agent B">Agent B</option>
            <option value="Agent C">Agent C</option>
          </select>
          {assignedSalesAgent.length > 0 && (
            <span>Selected Sales Agent: {assignedSalesAgent.join(", ")}</span>
          )}
          <br />
          <label htmlFor="leadStatus">Lead Status </label>
          <select
            id="leadStatus"
            value={leadStatus}
            onChange={(e) => setLeadStatus(e.target.value)}
            required
          >
            <option value="">Select Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Closed">Closed</option>
          </select>
          <br />
          <div className="dropdown">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              Select Tags
            </button>

            <ul className="dropdown-menu p-2">
              {["High Value", "VIP", "Urgent"].map((tag) => (
                <li key={tag} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={tags.includes(tag)}
                    onChange={() => handleTags(tag)}
                  />
                  <span className="ms-2">{tag}</span>
                </li>
              ))}
            </ul>
          </div>
          {tags.length > 0 && <span>Selected Tags: {tags.join(", ")}</span>}
          <br />
          <label htmlFor="timeToClose">Time to close (in-days) </label>
          <input
            type="number"
            id="timeToClose"
            value={timeToClose}
            onChange={(e) => setTimeToClose(e.target.value)}
            required
          />
          <br />
          <label htmlFor="priority">Priority </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <br />

          <button type="reset">Reset</button>
          <button type="submit">Submit</button>
          <br />
        </div>

      </form>
      <br />
      {submittedNewLead && (
        <div id="newLeadDetails">
          <b>
            {leadName} <br />
            {leadSource} <br />
            <ol>
              {assignedSalesAgent.map((agnt, i) => (
                <li key={i}>{agnt}</li>
              ))}
            </ol>
            {leadStatus} <br />
            {tags} <br />
            {timeToClose} <br />
            {priority} <br />
          </b>
        </div>
      )}
    </main>
  );
}

export default function AddNewLead() {

  return (
    <div>
      {/* Header */}
      <AddLeadMain />
      {/* Footer */}
    </div>
  )
}
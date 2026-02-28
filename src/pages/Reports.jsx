import { useMemo, useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Calendar } from "lucide-react";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  getClosedLeadsInLastDays,
  getPipeline,
  closedByAgent,
  getStatusDistribution,
  getIndustryDistribution,
} from "../utils/reportHelpers";
import "../components/common/Reports.css";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COLORS = [
  "#10b981",
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#f59e0b",
  "#64748b",
];

const INDUSTRY_COLORS = [
  "#bfdbfe",
  "#fde68a",
  "#bbf7d0",
  "#ddd6fe",
  "#bae6fd",
  "#e5e7eb",
  "#fecdd3",
  "#99f6e4",
  "#c7d2fe",
  "#fde047",
];

// --- CLEAN OPTIONS (No manual overrides causing double animations) ---
const performanceOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
    easing: "easeOutQuart",
  },
  plugins: {
    legend: { display: false },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#f1f5f9" },
      ticks: { stepSize: 1 },
    },
    x: { grid: { display: false } },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
    easing: 'easeOutQuart'
  },
  cutout: "65%",
  plugins: {
    legend: {
      position: "right",
      labels: { usePointStyle: true, boxWidth: 8 },
    },
  },
};

const standardBarOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1500,
    easing: "easeOutQuart",
  },
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "#f1f5f9" },
      ticks: { stepSize: 1 },
    },
    x: { grid: { display: false } },
  },
};

export default function Reports() {
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/leads`);
        if (!response.ok) throw new Error("Failed to fetch report data");
        const data = await response.json();
        setLeads(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false);
        // Trigger the grow animation trick 50ms after loading finishes
        setTimeout(() => setMounted(true), 50);
      }
    };

    fetchLeads();
  }, []);

  const data = useMemo(() => {
    const count7 = getClosedLeadsInLastDays(leads, 7).length;
    const count30 = getClosedLeadsInLastDays(leads, 30).length;
    const count90 = getClosedLeadsInLastDays(leads, 90).length;

    const allClosed = leads.filter((l) => l.isClosed || l.leadStatus === "Closed");
    const countAll = allClosed.length;

    const recent = [...allClosed]
      .sort((a, b) => new Date(b.closedAt || b.updatedAt) - new Date(a.closedAt || a.updatedAt))
      .slice(0, 10);

    return {
      performance: [count7, count30, count90, countAll],
      pipeline: getPipeline(leads),
      byAgent: closedByAgent(leads),
      status: getStatusDistribution(leads),
      industry: getIndustryDistribution(leads),
      recentLeads: recent,
    };
  }, [leads]);

  // --- 2. APPLY THE "MOUNTED" 0-TO-VALUE TRICK TO ALL CHARTS ---

  const performanceData = useMemo(() => ({
    labels: ["Last 7 Days", "Last 30 Days", "Last 90 Days", "All Time"],
    datasets: [
      {
        label: "Deals Closed",
        // Starts at 0, grows to actual value
        data: mounted ? data.performance : data.performance.map(() => 0),
        backgroundColor: ["#ede9fe", "#c4b5fd", "#7c3aed", "#4c1d95"],
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  }), [data.performance, mounted]);

  const statusData = useMemo(() => ({
    labels: Object.keys(data.status),
    datasets: [
      {
        data: mounted ? Object.values(data.status) : Object.values(data.status).map(() => 0),
        backgroundColor: COLORS,
        borderColor: "#ffffff",
        borderWidth: 2,
      },
    ],
  }), [data.status, mounted]);

  const pipelineData = useMemo(() => ({
    labels: Object.keys(data.pipeline),
    datasets: [
      {
        data: mounted ? Object.values(data.pipeline) : Object.values(data.pipeline).map(() => 0),
        backgroundColor: "#6366f1",
        borderRadius: 6,
        barThickness: 35,
      },
    ],
  }), [data.pipeline, mounted]);

  const agentData = useMemo(() => ({
    labels: Object.keys(data.byAgent),
    datasets: [
      {
        data: mounted ? Object.values(data.byAgent) : Object.values(data.byAgent).map(() => 0),
        backgroundColor: "#10b981",
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  }), [data.byAgent, mounted]);

  const industryData = useMemo(() => ({
    labels: Object.keys(data.industry),
    datasets: [
      {
        data: mounted ? Object.values(data.industry) : Object.values(data.industry).map(() => 0),
        backgroundColor: INDUSTRY_COLORS,
        borderRadius: 6,
        barThickness: 50,
      },
    ],
  }), [data.industry, mounted]);

  return (
    <main className="reports-container pageLoadAnimation">
      <header className="reports-header">
        <div>
          <h1 className="page-title">Performance Reports</h1>
          <p className="page-subtitle">
            Overview of sales velocity and lead distribution.
          </p>
        </div>
        <div className="date-badge">
          <Calendar size={14} /> Today: {new Date().toLocaleDateString("en-GB")}
        </div>
      </header>

      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "60px 0", width: "100%" }}>
          <ClipLoader color="#4f46e5" size={40} />
        </div>
      ) : (

        <div>


          <section className="chart-row-single">
            <div className="chart-card">
              <div className="card-header">
                <h3>Leads Closed Overview</h3>
              </div>
              <div className="chart-wrapper wide-chart">
                <Bar data={performanceData} options={performanceOptions} />
              </div>
            </div>
          </section>

          <section className="charts-grid">
            <div className="chart-card">
              <h3>Lead Status Distribution</h3>
              <div className="chart-wrapper doughnut-wrapper">
                <Doughnut data={statusData} options={doughnutOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3>
                Active Pipeline <span className="text-muted">(Open Leads)</span>
              </h3>
              <div className="chart-wrapper">
                <Bar data={pipelineData} options={standardBarOptions} />
              </div>
            </div>

            <div className="chart-card ">
              <h3>Closures by Agent</h3>
              <div className="chart-wrapper">
                <Bar data={agentData} options={standardBarOptions} />
              </div>
            </div>

            <div className="chart-card">
              <h3>Leads by Industry</h3>
              <div className="chart-wrapper">
                <Bar data={industryData} options={standardBarOptions} />
              </div>
            </div>
          </section>

          <section className="recent-section mb-5">
            <div className="chart-card">
              <div className="card-header">
                <h3>Recently Closed Leads</h3>
              </div>

              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Lead Name</th>
                      <th>Agent</th>
                      <th>Industry</th>
                      <th>Value</th>
                      <th>Closed Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentLeads.length > 0 ? (
                      data.recentLeads.map((lead) => (
                        <tr key={lead._id}>
                          <td className="font-medium text-dark">{lead.leadName}</td>
                          <td>
                            <span className="agent-pill">
                              {lead.closedBy || lead.agent?.agentName || "Unknown"}
                            </span>
                          </td>
                          <td>{lead.industry || "-"}</td>
                          <td className="text-emerald">
                            {lead.dealValue
                              ? `₹${lead.dealValue.toLocaleString()}`
                              : "-"}
                          </td>
                          <td className="text-muted">
                            {new Date(lead.closedAt || lead.updatedAt).toLocaleDateString("en-GB")}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center">
                          No closed leads found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
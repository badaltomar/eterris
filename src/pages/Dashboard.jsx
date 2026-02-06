import React, { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { 
  Users, TrendingUp, Plus, ArrowRight, 
  Activity, DollarSign, Calendar, BarChart3, FileText, Clock
} from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import leadsData from "/reports.json";
import "../components/common/Dashboard.css";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function Dashboard() {
  
  const COLORS = ["#10b981", "#8b5cf6", "#ec4899", "#3b82f6", "#f59e0b", "#64748b"];

  // --- Data Processing ---
  const { stats, charts, recentLeads } = useMemo(() => {
    const counts = { New: 0, Contacted: 0, Qualified: 0, "Proposal Sent": 0, Closed: 0 };
    let totalValue = 0;
    let pipelineValue = 0;
    let highPri = 0;
    const sources = {};

    leadsData.forEach(lead => {
      // Status Counts
      if (counts[lead.leadStatus] !== undefined) {
        counts[lead.leadStatus]++;
      }
      
      // Financials (Handle null dealValue)
      const val = lead.dealValue || 0;
      if (lead.leadStatus === "Closed" || lead.isClosed) {
        totalValue += val;
      } else {
        pipelineValue += val; // Potential revenue
      }

      // Priority
      if (lead.priority === "High") highPri++;

      // Sources for Mini-Chart
      const src = lead.leadSource || "Unknown";
      sources[src] = (sources[src] || 0) + 1;
    });

    // Sort Recent
    const sorted = [...leadsData].sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    ).slice(0, 5);

    return {
      stats: {
        total: leadsData.length,
        active: leadsData.length - counts.Closed,
        closedRevenue: totalValue,
        pipelineValue: pipelineValue,
        highPriority: highPri
      },
      charts: {
        status: [counts.New, counts.Contacted, counts.Qualified, counts["Proposal Sent"], counts.Closed],
        sources: Object.entries(sources).sort((a,b) => b[1] - a[1]).slice(0, 4) // Top 4 sources
      },
      recentLeads: sorted
    };
  }, []);

  // --- Chart Configurations ---
  
  // 1. Pipeline Doughnut
  const doughnutData = {
    labels: ['New', 'Contacted', 'Qualified', 'Proposal', 'Closed'],
    datasets: [{
      data: charts.status,
      backgroundColor: [COLORS[3], COLORS[4], COLORS[0], COLORS[1], COLORS[5]], // Mapped specific colors
      borderWidth: 0,
      hoverOffset: 4,
    }],
  };

  const doughnutOptions = {
    cutout: '68%',
    // ADD THIS SECTION
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
      animateRotate: true,
      animateScale: false
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw} Leads`
        }
      }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  // 2. Source Bar Chart (Richness addition)
  const barData = {
    labels: charts.sources.map(s => s[0]),
    datasets: [{
      label: 'Leads',
      data: charts.sources.map(s => s[1]),
      backgroundColor: COLORS[1],
      borderRadius: 4,
      barThickness: 20,
    }]
  };

  const barOptions = {
    indexAxis: 'y',
    animation: {
      duration: 1500,
      easing: 'linear',
    },
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { grid: { display: false } } },
    maintainAspectRatio: false,
  };

  return (
    <main className="dashboard-page pageLoadAnimation">
      
      {/* HEADER */}
      <header className="dash-header">
        <div className="welcome-section">
          <h2>Dashboard</h2>
          <div className="date-pill">
            <Calendar size={14} />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <NavLink to="/leads/new" className="btn primary">
          <Plus size={16} /> New Lead
        </NavLink>
      </header>

      {/* KPI GRID */}
      <section className="kpi-grid">
        <div className="dash-card kpi">
          <div className="kpi-icon bg-indigo"><Users size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Total Leads</span>
            <h3>{stats.total}</h3>
            <span className="kpi-sub">{stats.active} Active</span>
          </div>
        </div>

        <div className="dash-card kpi">
          <div className="kpi-icon bg-emerald"><DollarSign size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Closed Revenue</span>
            <h3>₹{stats.closedRevenue.toLocaleString()}</h3>
            <span className="kpi-trend positive">{stats.closedRevenue === 0 ? "+0% this month" : "+12.5% this month"}</span>
          </div>
        </div>

        <div className="dash-card kpi">
          <div className="kpi-icon bg-blue"><Activity size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">Pipeline Value</span>
            <h3>₹{stats.pipelineValue.toLocaleString()}</h3>
            <span className="kpi-sub">Potential Revenue</span>
          </div>
        </div>

        <div className="dash-card kpi">
          <div className="kpi-icon bg-rose"><TrendingUp size={20} /></div>
          <div className="kpi-data">
            <span className="kpi-label">High Priority</span>
            <h3>{stats.highPriority}</h3>
            <span className="kpi-sub text-rose">Needs Attention</span>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT SPLIT */}
      <section className="dash-layout">
        
        {/* LEFT COLUMN (Wide) */}
        <div className="layout-main">
          
          Recent Leads
          <div className="dash-card">
            <div className="card-header">
              <h4>Recent Leads</h4>
              <NavLink to="/leads" className="link-btn">View All</NavLink>
            </div>
            <div className="table-responsive">
              <table className="dash-table">
                <thead>
                  <tr>
                    <th>Lead Name</th>
                    <th>Status</th>
                    <th>Value</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.map(lead => (
                    <tr key={lead._id}>
                      <td>
                        <NavLink to={`/leads/${lead._id}`} className="lead-name-link">
                          {lead.leadName}
                        </NavLink>
                        <span className="mobile-source">{lead.leadSource}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${lead.leadStatus.toLowerCase().replace(" ", "")}`}>
                          {lead.leadStatus}
                        </span>
                      </td>
                      <td className="fw-500">
                        {lead.dealValue ? `₹${lead.dealValue.toLocaleString()}` : <span className="text-muted">-</span>}
                      </td>
                      <td className="text-muted">
                        {new Date(lead.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <NavLink to={`/leads/${lead._id}`} className="action-icon">
                          <ArrowRight size={16} />
                        </NavLink>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lead Sources Mini-Chart */}
          <div className="dash-card">
             <div className="card-header">
                <h4>Top Lead Sources</h4>
             </div>
             <div style={{height: '160px'}}>
                <Bar data={barData} options={barOptions} />
             </div>
          </div>

        </div>

        {/* RIGHT COLUMN (Narrow) */}
        <div className="layout-side">
          
          {/* PIPELINE COMPOSITION */}
          <div className="dash-card chart-card">
            <div className="card-header">
              <h4>Pipeline Composition</h4>
            </div>
            <div className="doughnut-wrapper">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              
              {/* ABSOLUTE CENTER TEXT */}
              <div className="doughnut-center">
                <span className="center-num">{stats.total}</span>
                <span className="center-lbl">Leads</span>
              </div>
            </div>

            {/* Custom Legend */}
            <div className="chart-legend">
               <div className="legend-item"><span className="dot" style={{background: COLORS[3]}}></span> New</div>
               <div className="legend-item"><span className="dot" style={{background: COLORS[4]}}></span> Contacted</div>
               <div className="legend-item"><span className="dot" style={{background: COLORS[0]}}></span> Qualified</div>
               <div className="legend-item"><span className="dot" style={{background: COLORS[1]}}></span> Proposal</div>
               <div className="legend-item"><span className="dot" style={{background: COLORS[5]}}></span> Closed</div>
            </div>
          </div>

         {/* QUICK FILTERS */}
          <div className="dash-card">
            <div className="card-header">
              <h4>Quick Filters</h4>
            </div>
            <div className="quick-filters-list">
              
              {/* 1. New Leads (Status) */}
              <NavLink to="/leads?status=New" className="filter-row">
                <div className="filter-info">
                   <div className="filter-icon" style={{background: '#eff6ff', color: '#3b82f6'}}>
                     <BarChart3 size={14}/>
                   </div>
                   <span>New Leads</span>
                </div>
                <ArrowRight size={14} className="arrow" />
              </NavLink>
              
              {/* 2. Proposals (Status) */}
              <NavLink to="/leads?status=Proposal Sent" className="filter-row">
                 <div className="filter-info">
                   <div className="filter-icon" style={{background: '#f5f3ff', color: '#8b5cf6'}}>
                     <FileText size={14}/>
                   </div>
                   <span>Proposals Sent</span>
                </div>
                <ArrowRight size={14} className="arrow" />
              </NavLink>

              {/* 3. Closing Soon (Sort Time) */}
              <NavLink to="/leads?sort=time-asc" className="filter-row">
                 <div className="filter-info">
                   <div className="filter-icon" style={{background: '#fff7ed', color: '#f59e0b'}}>
                     <Clock size={14}/>
                   </div>
                   <span>Closing Soon</span>
                </div>
                <ArrowRight size={14} className="arrow" />
              </NavLink>

              {/* 4. Priority High -> Low (Sort Priority) */}
              <NavLink to="/leads?sort=priority-desc" className="filter-row">
                 <div className="filter-info">
                   <div className="filter-icon" style={{background: '#fef2f2', color: '#ef4444'}}>
                     <TrendingUp size={14}/>
                   </div>
                   <span>Priority: High to Low</span>
                </div>
                <ArrowRight size={14} className="arrow" />
              </NavLink>
              
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
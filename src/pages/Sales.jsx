import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { IndianRupee, TrendingUp, Users, Clock, Calendar, ArrowUpRight } from 'lucide-react';
import leadsData from "/reports.json"; 
import "../components/common/Sales.css"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Sales() {

  // ---  DATA PROCESSING ENGINE ---
  const { kpi, chartData, recentSales } = useMemo(() => {
    // A. Filter only CLOSED deals 
    const closedDeals = leadsData.filter(l => 
      l.leadStatus === "Closed" || l.isClosed === true
    );
    
    // B. Calculate KPIs
    const totalRevenue = closedDeals.reduce((sum, deal) => sum + (deal.dealValue || 0), 0);
    const totalDeals = closedDeals.length;
    const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;
    const avgTime = closedDeals.reduce((sum, deal) => sum + (deal.timeToClose || 0), 0) / (totalDeals || 1);

    // Prepare Chart Data: Revenue by Month
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const timelineMap = {};
    
    closedDeals.forEach(deal => {
      // Parse ISO Date "2026-01-24..."
      const date = new Date(deal.closedAt || deal.updatedAt); 
      const monthIndex = date.getMonth(); // 0 = Jan
      const monthName = months[monthIndex];
      timelineMap[monthName] = (timelineMap[monthName] || 0) + (deal.dealValue || 0);
    });

    // Create sorted arrays for Chart.js (filtering out months with 0 revenue if you prefer, or keep all)
    // Here we just take the months that actually have data to keep chart clean
    const activeMonths = Object.keys(timelineMap).sort((a,b) => months.indexOf(a) - months.indexOf(b));
    const revenueByMonth = activeMonths.map(m => timelineMap[m]);

    // Prepare Chart Data: Revenue by Agent
    const agentMap = {};
    closedDeals.forEach(deal => {
      const name = deal.agent?.agentName?.split(' ')[0] || "Unknown";
      agentMap[name] = (agentMap[name] || 0) + (deal.dealValue || 0);
    });

    // Sort agents by revenue (High -> Low) and take Top 5
    const topAgents = Object.keys(agentMap)
      .sort((a, b) => agentMap[b] - agentMap[a])
      .slice(0, 5);
    const agentRevenue = topAgents.map(a => agentMap[a]);

    // Recent Sales Table (Sort by Date Descending)
    const sortedSales = [...closedDeals].sort((a, b) => 
      new Date(b.closedAt || b.updatedAt) - new Date(a.closedAt || a.updatedAt)
    ).slice(0, 5); // Take top 5

    return {
      kpi: { totalRevenue, totalDeals, avgDealSize, avgTime },
      chartData: {
        timeline: { labels: activeMonths, data: revenueByMonth },
        agents: { labels: topAgents, data: agentRevenue }
      },
      recentSales: sortedSales
    };
  }, []);
  
  // Line Chart Config
  const lineChartData = {
    labels: chartData.timeline.labels,
    datasets: [
      {
        label: 'Revenue',
        data: chartData.timeline.data,
        borderColor: '#4f46e5',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(79, 70, 229, 0.4)');
          gradient.addColorStop(1, 'rgba(79, 70, 229, 0.0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#4f46e5',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
    },
    animations: {
      y: {
        from: 0,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "#f3f4f6", drawBorder: false },
        ticks: {
          color: "#9ca3af",
          font: { size: 11 },
          callback: (value) => `₹${value / 1000}k`,
        },
        border: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: { color: "#6b7280", font: { size: 11 } },
        border: { display: false },
      },
    },
  };

  // Bar Chart Config
  const barChartData = {
    labels: chartData.agents.labels,
    datasets: [
      {
        label: 'Sales',
        data: chartData.agents.data,
        backgroundColor: '#10b981',
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500,
    },
    animations: {
      x: {
        from: 0,
      },
    },
    indexAxis: "y", // Horizontal Bar Chart
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1f2937",
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: { display: true },
      y: {
        grid: { display: false },
        ticks: { color: "#374151", font: { weight: "500", size: 12 } },
        border: { display: false },
      },
    },
  };

  return (
    <div className="sales-page pageLoadAnimation">
      <header className="sales-header">
        <div>
          <h2>Sales Overview</h2>
          <p className="subtitle">Performance metrics based on closed deals</p>
        </div>
        <div className="header-actions">
           <span className="date-badge">
             <Calendar size={14} /> Fiscal Year 2026
           </span>
        </div>
      </header>

      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon money"><IndianRupee size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Total Revenue</span>
            <h3>₹{kpi.totalRevenue.toLocaleString()}</h3>
            <span className="kpi-trend positive">+12.5% <ArrowUpRight size={12}/></span>
          </div>
        </div>
        
        <div className="kpi-card">
          <div className="kpi-icon deals"><TrendingUp size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Deals Closed</span>
            <h3>{kpi.totalDeals}</h3>
            <span className="kpi-trend positive">pipeline active</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon avg"><Users size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Avg. Deal Size</span>
            <h3>₹{Math.round(kpi.avgDealSize).toLocaleString()}</h3>
            <span className="kpi-sub">Per closed lead</span>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon time"><Clock size={20} /></div>
          <div className="kpi-content">
            <span className="kpi-label">Avg. Time to Close</span>
            <h3>{Math.round(kpi.avgTime)} days</h3>
            <span className="kpi-sub">Lead velocity</span>
          </div>
        </div>
      </section>

      <section className="charts-grid">
        <div className="chart-card large">
          <div className="chart-header">
            <h4>Revenue Trend</h4>
          </div>
          <div className="chart-area" style={{ height: '300px' }}>
             <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h4>Top Agents</h4>
          </div>
          <div className="chart-area" style={{ height: '300px' }}>
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </section>

      <section className="sales-table-container">
        <div className="table-header">
          <h4>Recent Transactions</h4>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Client</th>
                <th>Industry</th>
                <th>Deal Value</th>
                <th>Agent</th>
                <th>Closed Date</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr key={sale._id}>
                  <td className="fw-600">{sale.leadName}</td>
                  <td><span className="industry-badge">{sale.industry || "General"}</span></td>
                  <td className="fw-600 text-green">₹{(sale.dealValue || 0).toLocaleString()}</td>
                  <td>
                    <div className="mini-agent">
                       <div className="avatar-xs">{sale.agent?.agentName?.charAt(0) || "U"}</div>
                       {sale.agent?.agentName || "Unknown"}
                    </div>
                  </td>
                  <td className="text-gray">
                    {new Date(sale.closedAt || sale.updatedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {recentSales.length === 0 && (
                 <tr>
                   <td colSpan="5" style={{textAlign: 'center', padding: '20px', color: '#9ca3af'}}>
                     No closed deals found in database.
                   </td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
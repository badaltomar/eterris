import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

import leads from "/reports"
import { getClosedLeadsInLastDays, getTotalRevenue, getStatusDistribution, getPipeline, closedByAgent } from "../utils/reportHelpers"

export default function Reports (){

    const closedLastWeek = getClosedLeadsInLastDays(leads, 7)
    const closedLastMonth = getClosedLeadsInLastDays(leads, 30)
    const closedLast3Months = getClosedLeadsInLastDays(leads, 90)
    
    const pipeline = getPipeline(leads)    
    
    const leadsClosedByAgent = closedByAgent(leads)    
        
    const totalRevenue = getTotalRevenue(leads)

    const statusData = getStatusDistribution(leads);

    const pipelineChartData = {
      labels: Object.keys(pipeline),
      datasets: [
        {
          label: "Pipeline Leads",
          data: Object.values(pipeline),
        },
      ],
    };

    const statusChartData = {
      labels: Object.keys(statusData),
      datasets: [
        {
          label: "Leads by Status",
          data: Object.values(statusData),
        },
      ],
    };

    const closedByAgentChartData = {
      labels: Object.keys(leadsClosedByAgent),
      datasets: [
        {
          label: "Leads Closed",
          data: Object.values(leadsClosedByAgent),
        },
      ],
    };



    return (
      <main className="pageLoadAnimation">
        <h3>Reports</h3>

        <section>
          <p>Closed Last 7 Days: {closedLastWeek.length}</p>
          <p>Closed Last 30 Days: {closedLastMonth.length}</p>
          <p>Closed Last 90 Days: {closedLast3Months.length}</p>
        </section>

        <section>
          <h4>Lead Status Distribution</h4>
          <Pie data={statusChartData} />
        </section>

        <section>
          <h4>Leads in Pipeline</h4>
          <Bar data={pipelineChartData} />
        </section>

        <section>
          <h4>Leads Closed by Agent</h4>
          <Bar data={closedByAgentChartData} />
        </section>

        <section>
          <h4>Revenue</h4>
          <p>Total Revenue: ₹{totalRevenue.totalRevenue}</p>
        </section>
      </main>
    );
}
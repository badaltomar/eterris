const lastNDays = (d, days) => {
  const now = Date.now();
  const past = now - days * 24 * 60 * 60 * 1000;
  return new Date(d).getTime() >= past;
};

export const getClosedLeadsInLastDays = (leads, days) =>
  leads.filter((l) => l.isClosed && l.closedAt && lastNDays(l.closedAt, days));

export const getPipeline = (leads = []) => {
  return leads
    .filter((l) => !l.isClosed)
    .reduce((acc, l) => {
      acc[l.leadStatus] = (acc[l.leadStatus] || 0) + 1;
      return acc;
    }, {});
};

export const closedByAgent = (leads = []) => {
  return leads
    .filter((l) => l.isClosed)
    .reduce((acc, l) => {
      const who = l.closedBy || l.agent?.agentName || "Unknown";
      acc[who] = (acc[who] || 0) + 1;
      return acc;
    }, {});
};

export const getStatusDistribution = (leads = []) => {
  return leads.reduce((acc, lead) => {
    const status = lead.leadStatus || "Unknown";
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});
};

export const getTotalRevenue = (leads = []) => {
  const total = leads.reduce((sum, l) => {
    if (l.isClosed && typeof l.dealValue === "number") {
      return sum + l.dealValue;
    }
    return sum;
  }, 0);

  return { totalRevenue: total };
};

export const getIndustryDistribution = (leads = []) => {
  return leads.reduce((acc, lead) => {
    const industry = lead.industry || "Unknown";
    acc[industry] = (acc[industry] || 0) + 1;
    return acc;
  }, {});
};
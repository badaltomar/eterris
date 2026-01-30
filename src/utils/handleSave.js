export const normalizeLeadOnSave = (lead) => {
  const updated = {
    ...lead,
    updatedAt: new Date().toISOString(),
  };

  if (updated.leadStatus === "Closed") {
    updated.isClosed = true;

    if (!updated.closedAt) {
      updated.closedAt = new Date().toISOString();
    }

    if (!updated.closedBy) {
      updated.closedBy =
        updated.agent?.agentName ||
        "Unknown";
    }
  } else {
    updated.isClosed = false;
    updated.closedAt = null;
    updated.closedBy = null;
  }

  return updated;
};

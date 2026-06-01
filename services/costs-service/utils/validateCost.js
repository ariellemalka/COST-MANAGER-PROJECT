const VALID_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

function validateAddCost(body) {
  if (body.userid === undefined || body.userid === null || body.userid === '') {
    return { id: 10, message: 'userid is required' };
  }
  if (Number.isNaN(Number(body.userid))) {
    return { id: 11, message: 'userid must be a number' };
  }
  if (!body.description || String(body.description).trim() === '') {
    return { id: 12, message: 'description is required' };
  }
  if (!body.category || String(body.category).trim() === '') {
    return { id: 13, message: 'category is required' };
  }
  if (!VALID_CATEGORIES.includes(body.category)) {
    return {
      id: 14,
      message: `category must be one of: ${VALID_CATEGORIES.join(', ')}`
    };
  }
  if (body.sum === undefined || body.sum === null || body.sum === '') {
    return { id: 15, message: 'sum is required' };
  }
  if (Number.isNaN(Number(body.sum))) {
    return { id: 16, message: 'sum must be a number' };
  }
  if (Number(body.sum) < 0) {
    return { id: 17, message: 'cost cannot be negative number' };
  }
  if (body.created_at) {
    const created = new Date(body.created_at);
    if (Number.isNaN(created.getTime())) {
      return { id: 18, message: 'created_at is invalid' };
    }
    if (isDateInPast(created)) {
      return { id: 19, message: 'cannot add cost with date in the past' };
    }
  }
  return null;
}

function isDateInPast(date) {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return date < startOfToday;
}

function validateReportQuery(query) {
  if (!query.id || query.id === '') {
    return { id: 20, message: 'id is required' };
  }
  if (!query.year || query.year === '') {
    return { id: 21, message: 'year is required' };
  }
  if (!query.month || query.month === '') {
    return { id: 22, message: 'month is required' };
  }
  if (Number.isNaN(Number(query.id))) {
    return { id: 23, message: 'id must be a number' };
  }
  if (Number.isNaN(Number(query.year))) {
    return { id: 24, message: 'year must be a number' };
  }
  if (Number.isNaN(Number(query.month))) {
    return { id: 25, message: 'month must be a number' };
  }
  return null;
}

module.exports = {
  validateAddCost,
  validateReportQuery,
  VALID_CATEGORIES,
  isDateInPast
};

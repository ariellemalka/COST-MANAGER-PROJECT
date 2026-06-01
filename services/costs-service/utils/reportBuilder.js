const VALID_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

/*
 * Builds the monthly report JSON in the format required by the course document.
 * Report category keys use "Sport" (capital S) for the sports bucket in output.
 */
function buildReport(userid, year, month, costDocuments) {
  const grouped = {
    food: [],
    education: [],
    health: [],
    housing: [],
    Sport: []
  };

  costDocuments.forEach((cost) => {
    const day = new Date(cost.created_at).getDate();
    const entry = {
      sum: cost.sum,
      description: cost.description,
      day
    };
    if (cost.category === 'food') {
      grouped.food.push(entry);
    } else if (cost.category === 'education') {
      grouped.education.push(entry);
    } else if (cost.category === 'health') {
      grouped.health.push(entry);
    } else if (cost.category === 'housing') {
      grouped.housing.push(entry);
    } else if (cost.category === 'sports') {
      grouped.Sport.push(entry);
    }
  });

  return {
    userid: Number(userid),
    year: Number(year),
    month: Number(month),
    costs: [
      { food: grouped.food },
      { education: grouped.education },
      { health: grouped.health },
      { housing: grouped.housing },
      { Sport: grouped.Sport }
    ]
  };
}

function isPastMonth(year, month) {
  const now = new Date();
  const y = Number(year);
  const m = Number(month);
  if (y < now.getFullYear()) {
    return true;
  }
  if (y === now.getFullYear() && m < now.getMonth() + 1) {
    return true;
  }
  return false;
}

module.exports = { buildReport, isPastMonth, VALID_CATEGORIES };

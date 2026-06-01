function getTeamMembers() {
  if (process.env.TEAM_MEMBERS) {
    try {
      const parsed = JSON.parse(process.env.TEAM_MEMBERS);
      if (Array.isArray(parsed)) {
        return parsed.map((m) => ({
          first_name: m.first_name,
          last_name: m.last_name
        }));
      }
    } catch (err) {
      return null;
    }
  }
  return [{ first_name: 'mosh', last_name: 'israeli' }];
}

module.exports = { getTeamMembers };

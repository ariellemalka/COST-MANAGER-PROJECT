const VALID_CATEGORIES = ['food', 'health', 'housing', 'sports', 'education'];

function validateAddUser(body) {
  if (body.id === undefined || body.id === null || body.id === '') {
    return { id: 1, message: 'id is required' };
  }
  if (Number.isNaN(Number(body.id))) {
    return { id: 2, message: 'id must be a number' };
  }
  if (!body.first_name || String(body.first_name).trim() === '') {
    return { id: 3, message: 'first_name is required' };
  }
  if (!body.last_name || String(body.last_name).trim() === '') {
    return { id: 4, message: 'last_name is required' };
  }
  if (body.birthday === undefined || body.birthday === null || body.birthday === '') {
    return { id: 5, message: 'birthday is required' };
  }
  const birthday = new Date(body.birthday);
  if (Number.isNaN(birthday.getTime())) {
    return { id: 6, message: 'birthday is invalid' };
  }
  return null;
}

module.exports = { validateAddUser, VALID_CATEGORIES };

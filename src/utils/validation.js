export function validateProjectName(name) {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name is required' };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: 'Project name must be less than 100 characters' };
  }

  return { valid: true };
}

export function validateSearch(query) {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'Search query is required' };
  }

  if (query.trim().length < 2) {
    return { valid: false, error: 'Search query must be at least 2 characters' };
  }

  if (query.trim().length > 500) {
    return { valid: false, error: 'Search query must be less than 500 characters' };
  }

  return { valid: true };
}

export function validateTags(tags) {
  if (!tags || tags.trim().length === 0) {
    return { valid: true }; // Tags are optional
  }

  const tagList = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
  
  if (tagList.length > 10) {
    return { valid: false, error: 'Maximum 10 tags allowed' };
  }

  for (const tag of tagList) {
    if (tag.length > 50) {
      return { valid: false, error: 'Each tag must be less than 50 characters' };
    }
  }

  return { valid: true };
}

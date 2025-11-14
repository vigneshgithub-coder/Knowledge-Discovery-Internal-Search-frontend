export function validateProjectName(name: string): { valid: boolean; error?: string } {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Project name is required' };
  }

  if (name.trim().length > 100) {
    return { valid: false, error: 'Project name must be less than 100 characters' };
  }

  return { valid: true };
}

export function validateTags(tags: string): { valid: boolean; tagArray?: string[]; error?: string } {
  if (!tags || tags.trim().length === 0) {
    return { valid: true, tagArray: [] };
  }

  const tagArray = tags
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);

  if (tagArray.length > 10) {
    return { valid: false, error: 'Maximum 10 tags allowed' };
  }

  for (const tag of tagArray) {
    if (tag.length > 50) {
      return { valid: false, error: 'Each tag must be less than 50 characters' };
    }
  }

  return { valid: true, tagArray };
}

export function validateSearch(query: string): { valid: boolean; error?: string } {
  if (!query || query.trim().length === 0) {
    return { valid: false, error: 'Search query is required' };
  }

  if (query.trim().length > 500) {
    return { valid: false, error: 'Search query must be less than 500 characters' };
  }

  return { valid: true };
}

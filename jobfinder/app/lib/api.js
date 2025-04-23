export async function fetchFeaturedJobs() {
  const response = await fetch(`/api/jobs/featured`);
  return response.json();
}

export async function fetchCategories() {
  const response = await fetch(`/api/categories`);
  return response.json();
}
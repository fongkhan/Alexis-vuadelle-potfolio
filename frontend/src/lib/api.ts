const API_URL = import.meta.env.PAYLOAD_API_URL || 'http://localhost:3000/api';

export async function fetchProjects() {
  try {
    const res = await fetch(`${API_URL}/projects?depth=1&sort=-createdAt`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.docs;
  } catch (e) {
    console.error('Failed to fetch projects', e);
    return [];
  }
}

export async function fetchProject(slug: string) {
  try {
    const res = await fetch(`${API_URL}/projects?where[slug][equals]=${slug}&depth=1`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.docs[0] || null;
  } catch (e) {
    console.error(`Failed to fetch project ${slug}`, e);
    return null;
  }
}

export async function fetchProfile() {
  try {
    const res = await fetch(`${API_URL}/globals/profile?depth=0`);
    if (!res.ok) return null;
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Failed to fetch profile', e);
    return null;
  }
}

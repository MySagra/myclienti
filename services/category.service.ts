import { redirect } from 'next/navigation';
import { Category } from '@/schemas/category';

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${process.env.MYSAGRA_API_URL}/v1/categories?available=true&include=foods`, {
    next: { tags: ['categories'], revalidate: 60 } 
  });

  if (!res.ok) {
    if (res.status === 401) {
       redirect('/login');
    }
    if (res.status === 404) {
       return [];
    }
    throw new Error(`Failed to fetch categories: ${res.statusText}`);
  }

  return res.json();
}
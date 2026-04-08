import { redirect } from 'next/navigation'
import { z } from 'zod'
import { Banner, BannerSchema } from '@/schemas/banner'

export async function getBanners(): Promise<Banner[]> {
  let res: Response

  try {
    res = await fetch(`${process.env.API_URL}/v1/banners`, {
      next: { tags: ['banners'], revalidate: 300 },
      headers: {
        'X-API-KEY': process.env.CLIENTI_API_KEY ?? '',
      },
    })
  } catch {
    redirect('/500')
  }

  if (!res.ok) {
    if (res.status === 401 || res.status === 403) {
      redirect('/500')
    }
    return []
  }

  const data = await res.json()
  return z.array(BannerSchema).parse(data)
}

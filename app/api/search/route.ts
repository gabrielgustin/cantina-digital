import { NextResponse } from 'next/server'
import { searchProducts } from '@/lib/db'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.trim().length === 0) {
    return NextResponse.json([])
  }

  try {
    const results = await searchProducts(query)
    return NextResponse.json(results)
  } catch (error) {
    console.error('[v0] Search API error:', error)
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 })
  }
}

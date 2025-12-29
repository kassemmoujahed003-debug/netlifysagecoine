import { NextRequest, NextResponse } from 'next/server'
import { getMarketStatus } from '@/services/marketStatusService'

/**
 * Next.js API Route to get market status using static data
 * 
 * Usage: GET /api/market-status?market=NYSE
 */

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const market = searchParams.get('market') || 'NYSE'

    // Get market status from static data service
    const marketStatus = await getMarketStatus(market)

    // If there's an error in the market status, return it
    if (marketStatus.error) {
      return NextResponse.json(
        marketStatus,
        { status: 400 }
      )
    }

    return NextResponse.json(marketStatus, {
      // Cache for 30 seconds to reduce computation
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    })
  } catch (error) {
    console.error('Error fetching market status:', error)
    
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
        isOpen: false,
        market: request.nextUrl.searchParams.get('market') || 'NYSE',
      },
      { status: 500 }
    )
  }
}


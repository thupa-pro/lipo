import { NextRequest, NextResponse } from "next/server";
import { searchService } from "@/lib/search";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const category = searchParams.get('category') || undefined;
    const location = searchParams.get('location') || undefined;
    const priceMin = searchParams.get('priceMin') ? parseFloat(searchParams.get('priceMin')!) : undefined;
    const priceMax = searchParams.get('priceMax') ? parseFloat(searchParams.get('priceMax')!) : undefined;
    const rating = searchParams.get('rating') ? parseFloat(searchParams.get('rating')!) : undefined;
    const verified = searchParams.get('verified') ? searchParams.get('verified') === 'true' : undefined;
    const limit = parseInt(searchParams.get('limit') || '20');

    const filters = {
      category,
      location,
      priceMin,
      priceMax,
      rating,
      verified,
    };

    // Remove undefined values
    Object.keys(filters).forEach(key => 
      filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
    );

    const results = await searchService.searchServices(query, filters, limit);

    return NextResponse.json({ 
      results,
      total: results.length,
      query,
      filters,
    }, { status: 200 });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ...params } = await request.json();

    switch (action) {
      case 'popular':
        const popular = await searchService.getPopularServices(params.limit || 10);
        return NextResponse.json({ results: popular }, { status: 200 });

      case 'suggestions':
        if (!params.userId) {
          return NextResponse.json(
            { message: "User ID required for suggestions" },
            { status: 400 }
          );
        }
        const suggestions = await searchService.getSuggestedServices(params.userId, params.limit || 10);
        return NextResponse.json({ results: suggestions }, { status: 200 });

      case 'categories':
        const categories = await searchService.getCategories();
        return NextResponse.json({ categories }, { status: 200 });

      case 'locations':
        const locations = await searchService.getLocations();
        return NextResponse.json({ locations }, { status: 200 });

      default:
        return NextResponse.json(
          { message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Search POST error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
import { supabase } from '@/contexts/supabase.context';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export const GET = async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') as string;
    const categoryList = JSON.parse(searchParams.get('categoryList') as string) as string[];
    const requestLimit = parseInt(searchParams.get('requestLimit') as string, 10) as number;
    const requestOffset = parseInt(searchParams.get('requestOffset') as string, 10) as number;

    type GetFilteredProductListArgs = Database['public']['Functions']['get_filtered_product_list']['Args'];

    const args: GetFilteredProductListArgs = {
      keyword,
      category_list: categoryList,
      request_limit: requestLimit,
      request_offset: requestOffset
    };

    const { data, error } = await supabase.rpc('get_filtered_product_list', args);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
};

import { supabase } from '@/contexts/supabase.context';
import { NextResponse } from 'next/server';
import { Database } from '@/types/supabase';

export const GET = async (request: Request) => {
  try {

    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword') as string;
    const requestLimit = parseInt(searchParams.get('requestLimit') as string, 10) as number;
    const requestOffset = parseInt(searchParams.get('requestOffset') as string, 10) as number;
    const requestAddress = searchParams.get('requestAddress') as string;

    type GetFilteredProductListArgs = Database['public']['Functions']['FilteredProductListOfAround']['args'];

    const args: GetFilteredProductListArgs = {
      keyword,
      request_limit: requestLimit,
      request_address: requestAddress,
      request_offset: requestOffset
    };

    const { data, error } = await supabase.rpc('get_filtered_product_list_of_around', args);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json([]);
  }
};
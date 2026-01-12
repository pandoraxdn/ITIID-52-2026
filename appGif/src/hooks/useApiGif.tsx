import { useState, useEffect } from "react";
import { pandoraApi } from "../api/pandoraApi";
import type { GIFTrendingResponse } from "../interfaces/gifResponse";
import type { Gif } from "../mock-gif/gif.mock";
import type { FormData } from "./useFormSearch";

interface UseApiGif {
    isLoading:  boolean;
    listGifs:   Gif[];
    loadGifs:   () => void;
    sendQuery:  ( data: FormData ) => void;
}

export const useApiGif = (): UseApiGif => {

    const [ isLoading, setIsLoading ] = useState<boolean>(false);
    const [ listGifs, setListGifs ] = useState<Gif[]>([]);
    const apiUrl: string = "https://api.giphy.com/v1/gifs";

    const loadGifs = async () => {
        setIsLoading(true);
        const response = await pandoraApi.get<GIFTrendingResponse>( `${apiUrl}/trending`,{
            params:{
                api_key: "qGC2Zueq8FIIx9HOOtBVltVo7RHuHETf",
                limit: 10
            }
        });
        convertData( response.data );
        setIsLoading(false);
    }

    const convertData = ( response: GIFTrendingResponse ) => {
        const gifs: Gif[] = response.data.map( ( { id, title, images } ) => {
            return {
                id:     id,
                title:  title,
                url:    images.original.url,
                height: Number(images.original.height),
                width:  Number(images.original.width),
            }
        });
        setListGifs( gifs );
    }
    
    const sendQuery = async ( data: FormData ) => {
        setIsLoading(true);
        const response = await pandoraApi.get<GIFTrendingResponse>( `${apiUrl}/search`,{
            params:{
                api_key:    "qGC2Zueq8FIIx9HOOtBVltVo7RHuHETf",
                q:          data.query,
                limit:      10
            }
        });
        convertData( response.data );
        setIsLoading(false);
    }

    useEffect(() => {
        loadGifs();
    },[]);

    return { isLoading, listGifs, loadGifs, sendQuery };
};

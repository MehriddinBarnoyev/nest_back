export declare class PosterDto {
    width: number;
    height: number;
    posterUrl: string;
}
export declare class VideoStatusResponseDto {
    id: string;
    title: string;
    description: string;
    upload_time: number;
    length: number;
    status: string;
    posters: PosterDto[];
    tags: string[];
}

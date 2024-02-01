export interface PaginationProps {
    onChange: (page: number, perPage?: number) => void;
    isLoading: boolean;
    dependencies?: string[];
}

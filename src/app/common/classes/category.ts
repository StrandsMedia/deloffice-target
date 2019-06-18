interface Category {
    cat_id: number;
    category_name: string;
    abre: string;
    status: number;
}

interface Sector {
    cat_id: number;
    category_name: string;
    abre: string;
    status: number;
}

interface Subsector {
    cat_id: number;
    category_name: string;
    abre: string;
    status: number;
    upcat: number;
}

interface CatBlock {
    category: Category;
    sector: Sector;
    subsector: Subsector;
}

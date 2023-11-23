interface Material {
    id: number;
    name: string;
    state: string;
    details: string;
    [key: string]: any;
}

export default Material;

interface PendingMaterial {
    materialDetails: string;
    materialId: number;
    materialName: string;
    materialState: string;
    returnComment: string;
    returnDate: string;
    material_sub_status: string;
    [key: string]: any;
}

export default PendingMaterial;
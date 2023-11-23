interface BorrowedMaterial {
    borrowAccessories: string[]
    borrowPeriodEnd: string;
    originalBorrowPeriodEnd: Date;
    borrowPeriodStart: string;
    borrowerFirstName: string;
    borrowerGroup: string;
    borrowerLastName: string;
    materialDetails: string;
    materialId: number;
    materialName: string;
    materialState: string;
    [key: string]: any;
}

export default BorrowedMaterial;
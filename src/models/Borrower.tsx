interface Borrower {
    borrowerId: number,
    borrowerFirstName: string,
    borrowerLastName: string,
    borrowerGroup: string,
    borrowerName: string,
    [key: string]: any;
}

export default Borrower;
import BorrowedMaterial from '../models/BorrowedMaterial';
import Borrower from '../models/Borrower';
import Material from '../models/Material';
import PendingMaterial from '../models/PendingMaterial';

export function getAllMaterials(): Promise<Material[]> {
  return fetch('http:///kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/materials')
    .then(response => response.json())
    .then((data: any[]) => {
      return data.map(item => ({
          ...item,
      }));
    })
    .catch(error => {
      console.log('Error fetching materials:', error);
      throw error;
    });
}

export function getAvailableMaterials(): Promise<Material[]> {
  return fetch('https://kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/available_materials')
    .then(response => response.json())
    .then((data: any) => {
      data = data["hydra:member"].map((item: Material) => {
        const { "@id": _, "@type": __, ...rest } = item;
        return rest;
      });
      return data;
    })
    .catch(error => {
      console.log('Error fetching available materials:', error);
      throw error;
    });
}

export function getPendingMaterials(): Promise<PendingMaterial[]> {
  return fetch('https://kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/pending_materials')
    .then(response => response.json())
    .then((data: any) => {
      // Sort the data by the returnDate only if there are elements in the array
      if (data["hydra:member"].length > 0) {
        data["hydra:member"] = data["hydra:member"].sort((a: any, b: any) => {
          const dateA = new Date(a.returnDate).getTime();
          const dateB = new Date(b.returnDate).getTime();
          return dateA - dateB;
        });
      }

      const transformedData = data["hydra:member"].map((item: PendingMaterial) => {
        const { "@id": _, "@type": __, borrowReturnComment, materialDetails, ...rest } = item;
        const returnDate = new Date(item.returnDate).toLocaleDateString("fr-FR");
        const updatedMaterialDetails = materialDetails === "" ? "Néant" : materialDetails;
        const updatedReturnComment = borrowReturnComment === "" ? "Néant" : borrowReturnComment;
        return { ...rest, returnDate, materialDetails: updatedMaterialDetails, borrowReturnComment: updatedReturnComment };
      });

      return transformedData;
    })
    .catch(error => {
      console.log('Error fetching pending materials:', error);
      throw error;
    });
}





export function getBorrowedMaterials(): Promise<BorrowedMaterial[]> {
  return fetch(
    "https://kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/borrowed_materials"
  )
    .then((response) => response.json())
    .then((data: any) => {
      // Sort the data by the borrowPeriodEnd date
      data = data["hydra:member"].sort((a: any, b: any) => {
        const dateA = new Date(a.borrowPeriodEnd).getTime();
        const dateB = new Date(b.borrowPeriodEnd).getTime();
        return dateA - dateB;
      });

      const transformedData = data.map((item: BorrowedMaterial) => {
        const {
          "@id": _,
          "@type": __,
          borrowAccessories,
          borrowPeriodEnd,
          borrowPeriodStart,
          borrowerFirstName,
          borrowerGroup,
          borrowerLastName,
          materialDetails,
          materialId,
          materialName,
          materialState,
        } = item;

        let accessories: string = "Aucun";
        if (borrowAccessories.length > 0) {
          if (borrowAccessories.length === 1 && borrowAccessories[0] === "") {
            accessories = "Aucun";
          } else {
            accessories = borrowAccessories.join(", ");
          }
        }

        const name = `${borrowerLastName.toUpperCase()} ${borrowerFirstName}`;
        const startDate = new Date(borrowPeriodStart).toLocaleDateString(
          "fr-FR"
        );
        const endDate = new Date(borrowPeriodEnd).toLocaleDateString("fr-FR");
        return {
          borrowAccessories: accessories,
          borrowPeriodEnd: endDate,
          borrowPeriodStart: startDate,
          borrowerFirstName,
          borrowerGroup,
          borrowerLastName,
          borrowerName: name,
          materialDetails,
          materialId,
          materialName,
          materialState,
        };
      });
      return transformedData;
    })
    .catch((error) => {
      console.log("Error fetching borrowed materials:", error);
      throw error;
    });
}




export function getAllBorrowers() : Promise<Borrower[]> {
  return fetch("https://kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/borrowers")
  .then((response) => response.json())
  .then((data: any) => {
      data = data["hydra:member"].map((item: Borrower) => {
      const {
        "@id": _,
        "@type": __,
        borrowerId,
        borrowerFirstName,
        borrowerLastName,
        borrowerGroup,
      } = item
      const borrowerName = `${borrowerLastName.toUpperCase()} ${borrowerFirstName}`;
      return {
        borrowerId,
        borrowerFirstName,
        borrowerLastName,
        borrowerGroup,
        borrowerName,
      };
  });
  return data;
  })
}
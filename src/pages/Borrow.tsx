import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MUIDatePicker } from '../components/MUIDatePicker';
import { MUIInput } from '../components/MUIInput';
import { constants } from '../assets/constants';
import { Button } from '@mui/material';
import './Borrow.css'
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { getBorrowedMaterials, getAllBorrowers } from '../api/api';
import { MUISelect } from '../components/MUISelect';
import { MUIBorrower } from '../components/MUIBorrower';




function Borrow() {
  const location = useLocation();
  const navigate = useNavigate();

  const { id, name, state, details } = location.state;
  const [startBorrowDate, setStartBorrowDate] = useState<Date | null>(new Date());
  const [materialState, setMaterialState] = useState<string>(state)
  const [materialDetails, setMaterialDetails] = useState<string>(details)
  const [endBorrowDate, setEndBorrowDate] = useState<Date | null>(null);
  const [borrowerName, setBorrowerName] = useState<string |null>(null);
  const [borrowerId, setBorrowerId] = useState<number |null>(null);
  const [borrowerGroup, setBorrowerGroup] = useState<string |null>(null);
  const [isFormCompleted, setisFormCompleted] = useState<boolean>(false);
  const [nameErrorMessage, setNameErrorMessage] = useState<string | null>(null);
  const [groupErrorMessage, setGroupErrorMessage] = useState<string | null>(null);
  const [dateErrorMessage, setDateErrorMessage] = useState<string | null>(null);
  const [isNameValid, setIsNameValid] = useState<boolean>(false);
  const [isGroupValid, setIsGroupValid] = useState<boolean>(false);
  const [isDateRangeValid, setIsDateRangeValid] = useState<boolean>(false);
  const [isBackdropOpen, setIsBackdropOpen] = useState<boolean>(false);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);
  

  const handleNameChange = (value: string, id: number| null) => {
    setBorrowerName(value);
    setBorrowerId(id);
    setIsNameValid(value.trim().split(" ").length === 2 && value.trim().length > 5);
    if (value.trim().split(" ").length === 2 && value.trim().length > 5) {
      setNameErrorMessage(null);
    }
    validateForm();
    
  };

  const handleGroupChange = (value: string) => {
    setBorrowerGroup(value);
    setIsGroupValid(value.length > 1);
    if (value.length > 1) {
      setGroupErrorMessage(null);
    }
    validateForm()
  };

  const handleDetailsChange = (value: string) => {
    setMaterialDetails(value);
  };

  const handleStateChange = (value: string[]) => {
    const stateValue: string = value[0];
    setMaterialState(stateValue);
  };

  const handleDateStartChange = (value: Date | null) => {
    setStartBorrowDate(value);
    if(endBorrowDate !== null && value !== null) {
      setIsDateRangeValid(endBorrowDate > value);
      if(endBorrowDate > value) {
        setDateErrorMessage(null);
      }
    }
    validateForm();
  };

  const handleAccessoriesChange = (value: string[]) => {
    setSelectedAccessories(value);
  };

  const handleDateEndChange = (value: Date | null) => {
    setEndBorrowDate(value);

    if(startBorrowDate !== null && value !== null) {
      setIsDateRangeValid(value > startBorrowDate);
      if(value > startBorrowDate) {
        setDateErrorMessage(null);
      }
    }
    validateForm();
  };

  const validateForm = () => {
    if(borrowerName !== null && borrowerGroup !== null) {
      setisFormCompleted(true);
    } else {
      setisFormCompleted(false);
    }
  };

  const goBack = () => {
     navigate(-1);
  };

  const validateBorrow = () => {
    if(isNameValid && isGroupValid && isDateRangeValid) {
      setNameErrorMessage(null);
      setGroupErrorMessage(null);
      setDateErrorMessage(null);
      postBorrow();
    } else {
      if(!isNameValid) {
        setNameErrorMessage("Ce champ doit comporter un nom et un prénom. (Minimum 5 caractères.)");
      }
      if(!isGroupValid) {
        setGroupErrorMessage("Le groupe doit comporter au moins 2 caractères.");
      }
      if(!isDateRangeValid) {
        setDateErrorMessage("La date de début d'emprunt doit être antérieure à la date de rendu.");
      }
    }
  };

  const postBorrow = async () => {
    let groupBorrower = null;
    let lastNameBorrower = null;
    let firstNameBorrower = null;

    if(borrowerId === null) {
      groupBorrower = borrowerGroup;
      lastNameBorrower = borrowerName!.split(" ")[0];
      firstNameBorrower = borrowerName!.split(" ")[1];
    }
      if(endBorrowDate !== null) {
        endBorrowDate.setDate(endBorrowDate.getDate() + 1);
      };
       const postData = {
        "borrowPeriodEnd": endBorrowDate?.toISOString(),
        "borrowPeriodStart" : startBorrowDate?.toISOString(),
        "materialId" : id,
        "borrowAccessories" : selectedAccessories,
        "materialState" : materialState,
        "materialDetails" : materialDetails,
        "borrowerId" : borrowerId,
        "borrowerGroup" : groupBorrower,
        "borrowerLastName" : lastNameBorrower,
        "borrowerFirstName" : firstNameBorrower
      };
      const options = {
        method: 'POST',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/json'
        }
      };
  
      fetch('https://kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/new_borrow', options)
  .then(response => {
    if (response.ok) {
      toast.success(`Nous confirmons que le matériel ${name} a bien été emprunté. Vous pouvez le retrouver dans le tableau des matériels empruntés.`)
    } else {
      toast.error(`Erreur lors de l'emprunt du matériel ${name}. Réessayez dans quelques instants. Si le problème persiste, veuillez contacter le support informatique.`);
    }
  })
  .catch(error => {
    console.error(error)
    toast.error(`Erreur lors de l'emprunt du matériel ${name}. Réessayez dans quelques instants. Si le problème persiste, veuillez contacter le support informatique.`);
  })
  .finally(() => {     
      setIsBackdropOpen(false);
     goBack();
  });
  };



  return (
    <div className="borrow-container">
      <h1>{`Emprunter le matériel : ${name}`}</h1>
      <div className="borrower-infos">
        <MUIBorrower labelTextName={constants.borrower_name} labelTextGroup={constants.borrower_group} getDataFunction={getAllBorrowers} onChangeName={handleNameChange} onChangeGroup={handleGroupChange}/>
        <MUIInput label={`${constants.material_attributes.details} :`} onChange={handleDetailsChange} value={materialDetails}/>
        <MUISelect multiple={false} options={Object.values(constants.material_state_possibilities)} label={`${constants.material_attributes.state} :`} placeholder={materialState} onChange={handleStateChange}/>
        <MUISelect multiple options={Object.values(constants.accessories_list)} label={constants.accessories} placeholder={constants.none} onChange={handleAccessoriesChange}/>
        <MUIDatePicker labelText={constants.date.select_start_borrow_date} onChange={handleDateStartChange} todayByDefault/>
        <MUIDatePicker labelText={constants.date.select_end_borrow_date} onChange={handleDateEndChange} disablePast errorMessage={dateErrorMessage}/>
      </div>
      <div className="button-container">
        <Button  className='cancel-button' variant='contained' onClick={goBack}>
          {constants.cancel.toUpperCase()}
        </Button>                        
        <Button  variant='contained' disabled={!isFormCompleted} onClick={validateBorrow}>
          {constants.confirm.toUpperCase()}
        </Button>
        <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackdropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      </div>
    </div>
  );
}

export default Borrow;
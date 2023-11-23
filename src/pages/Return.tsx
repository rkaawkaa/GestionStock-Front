import { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { constants } from '../assets/constants';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
import { MUISelect } from '../components/MUISelect';
import { MUIInput } from '../components/MUIInput';
import { MUIDatePicker } from '../components/MUIDatePicker';
import './Return.css';

function Return() {
    const location = useLocation();
    const navigate = useNavigate();
    const { materialId, materialName, materialState, materialDetails, borrowerName, borrowerGroup, borrowPeriodStart, borrowPeriodEnd, accessories } = location.state;

    const [isBackdropOpen, setIsBackdropOpen] = useState<boolean>(false);
    const [state, setState] = useState<string>(materialState);
    const [details, setDetails] = useState<string>(materialDetails)
    const [followComment, setFollowComment] = useState<string>('');
    const [returnDate, setReturnDate] = useState<Date | null>(new Date());


    const handleStateChange = (value: string[]) => {
        const stateValue: string = value[0];
        setState(stateValue);
      };

      const handleDetailsChange = (value: string) => {
        setDetails(value);
      };

      const handleFollowCommentChange = (value: string) => {
        setFollowComment(value);
      };

    const handleReturnDateChange = (value: Date | null) => {
        setReturnDate(value);
    };

    const goBack = () => {
        navigate(-1);
     };

     const validateReturn = () => {
      if(returnDate === null) {
        toast.error('Veuillez sélectionner une date de retour.');
        return;
      }
      
      const postData = {
        "materialId": materialId,
        "state": state,
        "details": details,
        "returnComment": followComment,
        "returnDate": returnDate.toISOString(),
      };
      
      const options = {
        method: 'PATCH',
        body: JSON.stringify(postData),
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Accept': 'application/json'
        }
      };

      fetch('https://kiosquiut-api-groupe-3.k8s.iut-larochelle.fr/api/return_material', options)
        .then(response => {
          if (response.ok) {
            toast.success(`Nous avons bien pris en compte que le matériel ${materialName} a été rendu. Vous pouvez le retrouver dans le tableau des matériels en attente.`);
          } else {
            toast.error(`Erreur lors du traitement du retour du matériel ${materialName}. Réessayez dans quelques instants. Si le problème persiste, veuillez contacter le support informatique.`);
          }
        })
        .catch(error => {
          console.error(error)
          toast.error(`Erreur lors du traitement du retour du matériel ${materialName}. Réessayez dans quelques instants. Si le problème persiste, veuillez contacter le support informatique.`);
        })
        .finally(() => {     
          setIsBackdropOpen(false);
          goBack();
        });
    };


    return (
        <div className="return-container">
            <h1>{`Retour d'emprunt : ${materialName}`}</h1>
            <div className="state-infos-container">
                <p className="state-infos-text"><b>Nom de l'emprunteur :</b> {borrowerName}</p>
                <p className="state-infos-text"><b>Groupe de l'emprunteur :</b> {borrowerGroup}</p>
                <p className="state-infos-text"><b>Date d'emprunt :</b> {borrowPeriodStart}</p>
                <p className="state-infos-text"><b>Date limite d'emprunt :</b> {borrowPeriodEnd}</p>
                <p className="state-infos-text"><b>Accessoires :</b> {accessories}</p>
                <p className="state-infos-text"><b>Etat avant l'emprunt :</b> {materialState}</p>
                <p className="state-infos-text"><b>Remarque avant l'emprunt :</b> {materialDetails}</p>
            </div>
            <div className="separator"></div>
            <div className="return-field">
            <MUISelect multiple={false} options={Object.values(constants.material_state_possibilities)} label={`${constants.material_attributes.state} :`} placeholder={state} onChange={handleStateChange}/>
            <MUIInput label={`${constants.material_attributes.details} :`} onChange={handleDetailsChange} value={details}/>
            <MUIInput label={constants.follow_comments} onChange={handleFollowCommentChange} placeholder='ex. : Appeler Stephane le 1er juin pour la mise à zéro.'/>
            <MUIDatePicker labelText={constants.date.select_return_date} onChange={handleReturnDateChange} todayByDefault/>
            <p className="info-sige">Le matériel sera mis en attente, à envoyer au SIGE pour une mise à zéro.</p>
            <div className="button-container">
                <Button  className='cancel-button' variant='contained' onClick={goBack}>
                {constants.cancel.toUpperCase()}
                </Button>                        
                <Button  variant='contained' onClick={validateReturn}>
                {constants.confirm.toUpperCase()}
                </Button>
                <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isBackdropOpen} >
                <CircularProgress color="inherit" />
                </Backdrop>
            </div>
         </div>
        </div>
    );
}
export default Return;
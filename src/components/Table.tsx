import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import ReplayIcon from '@mui/icons-material/Replay';
import Material from '../models/Material';
import { constants } from '../assets/constants';
import { capitalizeFirstLetter } from '../utils/functions';
import '../assets/variables.css';
import './Table.css';
import Button from '@mui/material/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Route, Link } from 'react-router-dom';


interface TableProps {
  headerBgColor: string;
  materialState: string;
  getDataFunction: () => Promise<any[]>;
}

function getTheme() {
  return createTheme({
    palette: {
      secondary: {
        main: '#E4BE38'
      }
    },
    typography: {
      fontFamily: 'Bold',
    },
  });
}

function getThemeTH() {
  return createTheme({
    components: {
      MuiTableCell: {
        styleOverrides: {
          root: {
            color: '#EDF2F4',
          },
        },
      },
    },
    typography: {
      fontFamily: 'Bold',
    },
  });
}

export default function BasicTable(props: TableProps) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


useEffect(() => {
    async function fetchData() {
      try {
        let data = await props.getDataFunction();
        setMaterials(data);
      } catch (error) {
        console.log('Error fetching materials:', error);
        toast.error(`Erreur de requète pour récupérer les matériels ${props.materialState}`);
        setError('Error fetching materials');
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const columnNames: {
    [key: string]: string;
  } = {
    materialId: 'ID',
    materialName: 'Nom du matériel',
    materialState: 'État',
    materialDetails: 'Remarque',
    borrowAccessories: 'Accessoires',
    borrowPeriodEnd: 'Retour prévu',
    borrowPeriodStart: "Date d'emprunt",
    borrowerName: "Emprunteur",
    borrowerGroup: "Groupe",
    borrowReturnComment: "Commentaire de suivi",
    returnDate: "Date de rendu",
    materialSubStatus: 'Statut',
  };

  let columnsToDisplay: string[] = [];
  switch (props.materialState) {
    case constants.material_state.available:
      columnsToDisplay = ['materialName','materialState','materialDetails'];
      break;
    case constants.material_state.borrowed:
      columnsToDisplay = ['materialName', 'borrowerName', 'borrowerGroup', 'borrowPeriodEnd', 'borrowAccessories'];
      break;
    case constants.material_state.pending:
      columnsToDisplay = ['materialName', 'materialState', 'materialDetails', 'borrowReturnComment', 'materialSubStatus', 'returnDate'];
      break;
    default:
      columnsToDisplay = ['materialName', 'materialState', 'materialDetails'];
  }

  if (isLoading) {  // Pendant le chargement.
    return (
      <>
        <h2 className='title'>{capitalizeFirstLetter(props.materialState)}</h2>
        <div>Chargement...</div>
      </>
    );
  }
  if (error) {  // Cas où il n'y a pas de matériel ou une erreur.
    return (
      null
    );
  }
  if(materials.length === 0 && !isLoading) {
    return (
      <>
        <h2 className='title'>{capitalizeFirstLetter(props.materialState)}</h2>
        <div className='no-material'>Aucun matériel {props.materialState}</div>
      </>
    );
  }

  return (
    <>
      <h2 className='title'>{capitalizeFirstLetter(props.materialState)}</h2>
      <ThemeProvider theme={getTheme()}>
        <TableContainer component={Paper}>
          <Table aria-label='simple table'>
            <TableHead>
              <TableRow sx={{ backgroundColor: props.headerBgColor }} key={1}>
                <ThemeProvider theme={getThemeTH()}>
                  {columnsToDisplay.map((key: string) => (
                    <TableCell key={key}>{columnNames[key]}</TableCell>
                  ))}
                    {(props.materialState === constants.material_state.available || props.materialState === constants.material_state.borrowed ) && (
                  <TableCell key='button' />)}
                </ThemeProvider>
              </TableRow>
            </TableHead>
            <TableBody>
              {materials.map((material, rowIndex) => (
                <TableRow sx={{
                  backgroundColor:
                    rowIndex % 2 === 0
                      ? 'var(--blue-lighter)'
                      : 'var(--white-darker)',
                }} key={material.materialId}>
                  {columnsToDisplay.map((key: string) => (
                    <TableCell key={key}>{material[key]}</TableCell>
                  ))}
                  {props.materialState === constants.material_state.available && (
                    <TableCell align='center'>
                      <Link style={{textDecoration: 'none',}}
                      to={`/borrow/${material.materialId}`}
                      state={{
                        name: material.materialName, 
                        id: material.materialId, 
                        state: material.materialState, 
                        details: material.materialDetails
                      }} 
                      key={material.materialId}>   
                        <Button variant='contained' endIcon={<ScreenShareIcon />}>
                          {constants.borrow}
                        </Button>
                      </Link>
                    </TableCell>
                  )}
                  {props.materialState === constants.material_state.borrowed && (
                    <TableCell align='center'>
                      <Link style={{textDecoration: 'none',}}
                      to={`/return/${material.materialId}`}
                      state={{
                        materialId: material.materialId, 
                        materialName: material.materialName, 
                        materialState: material.materialState, 
                        materialDetails: material.materialDetails, 
                        borrowerName: material.borrowerName, 
                        borrowerGroup: material.borrowerGroup, 
                        borrowPeriodStart: material.borrowPeriodStart, 
                        borrowPeriodEnd: material.borrowPeriodEnd, 
                        accessories: material.borrowAccessories
                      }} 
                      key={material.materialId}>
                        <Button variant='contained' endIcon={<ReplayIcon />} color='secondary'>
                          {constants.return}
                        </Button>
                      </Link>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ThemeProvider>
    </>
  );
}
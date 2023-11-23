import '../App.css';
import '../assets/variables.css';
import { constants } from '../assets/constants';
import BasicTable from '../components/Table';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAvailableMaterials, getBorrowedMaterials, getPendingMaterials } from '../api/api';


function Home() {

  return (
    <>
    <h1 className="title main-title">{constants.title}</h1>
    <BasicTable headerBgColor={"var(--blue-darker)"} materialState={constants.material_state.available} getDataFunction={getAvailableMaterials}/>
    <BasicTable headerBgColor={"var(--pink)"} materialState={constants.material_state.borrowed} getDataFunction={getBorrowedMaterials}/>
    <BasicTable headerBgColor={"var(--dark-grey)"} materialState={constants.material_state.pending} getDataFunction={getPendingMaterials}/>
    <ToastContainer />
    </>
  );
}

export default Home;
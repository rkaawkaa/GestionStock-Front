import { ChangeEvent, useEffect, useState } from 'react'
import FormControl from '@mui/material/FormControl'
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Borrower from '../models/Borrower';

interface Props {
  onChangeName: (value: string, id: number | null) => void,
  onChangeGroup: (value: string) => void,
  labelTextName: string;
  labelTextGroup: string;
  getDataFunction: () => Promise<any[]>;
}

export const MUIBorrower = (props: Props) => {
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [group, setGroup] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [borrowerKnown, setBorrowerKnown] = useState<Boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let data = await props.getDataFunction();
        setBorrowers(data);
      } catch (error) {
        console.log('Error fetching materials :', error);
      }
    }
    fetchData();
  }, []);

  const handleChangeGroup = (event: ChangeEvent<HTMLInputElement>) => {
    setGroup(event.target.value)
    props.onChangeGroup(event.target.value)
  }
  
  return (
    <div>
      <div className='container'>
        <p className="label-text">{props.labelTextName}<span className='required'> *</span></p>
        <FormControl sx={{ m: 1, width: 220 }}>
          <Autocomplete
          freeSolo
          options={borrowers.map((borrower) => borrower.borrowerName)}
          renderInput={(params) => <TextField {...params} label="Emprunteur" />}
          onInputChange={(event, value) => {
           const id = borrowers.find(borrower => borrower.borrowerName === value)?.borrowerId ?? null;
            setGroup(borrowers.find(borrower => borrower.borrowerName === value)?.borrowerGroup ?? "");
            setBorrowerKnown(borrowers.some(borrower => borrower.borrowerName === value));
            setName(value);
            props.onChangeName(value, id);
            props.onChangeGroup(borrowers.find(borrower => borrower.borrowerName === value)?.borrowerGroup ?? "");
          }}
          />
        </FormControl>
      </div>
      <div className='container'>
        <p className="label-text">{props.labelTextGroup}<span className='required'> *</span></p>
        <FormControl sx={{ m: 1, width: 220}}>
          {
            borrowerKnown
            ?
            group
            :
            <TextField label="Groupe" value={group} onChange={handleChangeGroup}/>
          }
        </FormControl>
      </div>
    </div>
  )
}
import { useState } from 'react'
import 'dayjs/locale/fr';
import { TextField, TextFieldProps } from '@mui/material'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker, LocalizationProvider  } from '@mui/x-date-pickers';
import './MUIDatePicker.css';
import { makeStyles } from '@mui/styles';

interface Props {
  labelText: string;
  todayByDefault?: boolean;
  disablePast?: boolean;
  onChange: (date: Date | null) => void; 
  errorMessage?: string | null;
}

const useHelperTextStyles = makeStyles(() => ({
	root: {
		width: 180
	}
}));

export const MUIDatePicker = (props: Props) => {
  const [selectedDate, setselectedDate] = useState<Date | null>(props.todayByDefault ? new Date() : null);

  const helperTextStyles = useHelperTextStyles();

  const handleDateChange = (newSelectedDate: Object | null) => {
      if(newSelectedDate != null) {
        for (const [key, value] of Object.entries(newSelectedDate)) {
          if (key==="$d") {
            const newDate = value;
            setselectedDate(newDate);
            props.onChange(newDate);
          }
        }
      }
  }
  return (
    <>
      <div className="container">
        <p className="label-text">{props.labelText}<span className='required'> *</span></p>
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'fr'}>
      <MobileDatePicker
          value={selectedDate} 
          label={"DD/MM/YYYY"}
          renderInput={
            (tfProps: TextFieldProps) => 
                <TextField {...tfProps} 
                  error={Boolean(props.errorMessage)} 
                  helperText={props.errorMessage} 
                  FormHelperTextProps={{
                    classes:{
                      root:helperTextStyles.root
                    }
                  }}
                  />
          }
          onChange={(e) => handleDateChange(e)}
          disablePast = {props.disablePast}
          />
    </LocalizationProvider>
    </div>
   </>
  )
}

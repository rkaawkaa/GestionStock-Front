import { useState, useEffect } from 'react'
import { TextField } from '@mui/material';
import './MUIInput.css'

interface Props {
    label: string, 
    onChange: (value: string) => void,
    error?: string | null, 
    placeholder?: string,
    autofocus?: boolean,
    value?: string,
    isNecessary?: boolean
}

export const MUIInput = (props: Props) => {
    const [value, setValue] = useState<string>("");

    useEffect(() => {
        if (props.value !== undefined) {
            setValue(props.value);
        }
    }, [props.value])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.value;
        setValue(newValue);
        props.onChange(newValue);
      };
      
  return (
    <div className='container'>
        <p className="label-text">{props.label}{props.isNecessary && <span className='required'> *</span>}</p>
        <TextField
            autoFocus={props.autofocus}
            placeholder={props.placeholder}
            required
            multiline
            type={"text"}
            id="outlined-required"
            onChange={handleChange}
            error={Boolean(props.error)}
            helperText={props.error}
            value={value} 
        />
    </div>

  )
}

export default MUIInput;
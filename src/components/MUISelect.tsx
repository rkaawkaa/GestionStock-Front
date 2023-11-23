import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { constants } from '../assets/constants';
import './MUISelect.css';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 10,
      width: 250,
    },
  },
};


interface Props {
    onChange: (value: string[]) => void,
    options: string[]
    label: string,
    placeholder?: string,
    multiple?: boolean,
}


export const MUISelect = (props: Props) => {
  const [item, setItem] = React.useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent<typeof item>) => {
    const {
      target: { value },
    } = event;
    const newItem = typeof value === 'string' ? value.split(',') : value;
    setItem(newItem);
    props.onChange(newItem)
  };

  return (
    <div className="container">
    <p className="label-text">{props.label}</p>
      <FormControl sx={{ m: 1, width: 220 }}>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple={props.multiple}
          displayEmpty
          value={item}
          onChange={handleChange}
          renderValue={(selected) => {
            if (selected.length === 0) {
              return <em>{props.placeholder}</em>;
            }

            return selected.join(', ');
          }}
          MenuProps={MenuProps}
        >
            <MenuItem disabled value="">
            <em>{props.placeholder}</em>
          </MenuItem>
          {props.options.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={item.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
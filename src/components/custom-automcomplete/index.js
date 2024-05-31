import { useCallback, useState } from "react";
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { useFormContext } from "react-hook-form";

const filter = createFilterOptions();

// ? WORKING CODE EXCEPT DELAYED VALUE DISPLAY 
export default function CustomAutoComplete({ optionsList, error }) {
    const [inputValue, setInputValue] = useState('');
    // const [selectedValue, setSelectedValue] = useState(value ? value.email : '');
    const [open, setOpen] = useState(false);

    const { getValues, setValue } = useFormContext()
    const { user: value } = getValues()
    console.log("user", value)

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (inputValue.trim() !== '') {

                setValue("user", {
                    email: inputValue.trim(),
                });
                // // setInputValue('');
                setInputValue(inputValue.trim());
            } else if (optionsList.length > 0) {
                setValue("user", {
                    email: optionsList[0].email,
                    id: optionsList[0].id
                });
                setInputValue(optionsList[0].email);
                // setSelectedValue(optionsList[0].email);
            }
        }
    };

    return (
        <Autocomplete
            // value={selectedValue}
            value={value}
            onChange={(event, newValue) => {
                if (newValue) {
                    setValue("user", {
                        email: newValue.email,
                        id: newValue.id,
                    });
                    setInputValue(newValue.email);
                    // setSelectedValue(newValue.email);
                } else {

                    setValue("user", null);
                    setInputValue('');
                    // setSelectedValue('');
                }
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            options={optionsList}
            getOptionLabel={(option) => option.email}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Email"
                    variant="outlined"
                    error={Boolean(error)}
                    helperText={error}
                    onKeyPress={handleKeyPress}
                    onFocus={() => setOpen(true)}
                    onBlur={() => setOpen(false)}
                />
            )}
            open={open}
        />
    );
}


CustomAutoComplete.propTypes = {
    optionsList: PropTypes.array,
    value: PropTypes.object,
    setValue: PropTypes.func,
    error: PropTypes.object
}

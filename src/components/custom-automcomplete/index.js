import * as React from "react";
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";

const filter = createFilterOptions();

export default function CustomAutoComplete({ listOptions, setValue, value, error }) {
 
    return (
            <Autocomplete
                value={value}
                onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                        setValue({
                            email: newValue,
                        });
                    } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setValue({
                            email: newValue.inputValue,
                        });
                    } else {
                        setValue(newValue);
                    }
                }}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(
                        (option) => inputValue === option.email
                    );
                    if (inputValue !== "" && !isExisting) {
                        filtered.push({
                            inputValue,
                            email: `${inputValue}`,
                        });
                    }

                    return filtered;
                }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                id="custom-autocomplete"
                options={listOptions}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === "string") {
                        return option.email;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // console.log("optionLable", option);
                    // Regular option
                    return option.email;
                }}
                renderOption={(props, option) => <li {...props}>{option.email}</li>}
                freeSolo
                renderInput={(params) => (
                    <TextField {...params} label="Email" 
                    error={Boolean(error)}
                    helperText={error} />
                )}
            />
    );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top


CustomAutoComplete.propTypes = {
    listOptions: PropTypes.array,
    value: PropTypes.object,
    setValue: PropTypes.func,
    error: PropTypes.object
}

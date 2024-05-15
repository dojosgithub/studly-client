import { useCallback, useState } from "react";
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { Typography } from "@mui/material";
import { isEmpty } from "lodash";
import { useFormContext } from "react-hook-form";

const filter = createFilterOptions();

// export default function CustomAutoComplete({ listOptions, setValue, value, error }) {

//     return (
//             <Autocomplete
//                 value={value}
//                 onChange={(event, newValue) => {
//                     if (typeof newValue === "string") {
//                         setValue({
//                             email: newValue,
//                         });
//                     } else if (newValue && newValue.inputValue) {
//                         // Create a new value from the user input
//                         setValue({
//                             email: newValue.inputValue,
//                         });
//                     } else {
//                         setValue(newValue);
//                     }
//                 }}
//                 filterOptions={(options, params) => {
//                     const filtered = filter(options, params);

//                     const { inputValue } = params;
//                     // Suggest the creation of a new value
//                     const isExisting = options.some(
//                         (option) => inputValue === option.email
//                     );
//                     if (inputValue !== "" && !isExisting) {
//                         filtered.push({
//                             inputValue,
//                             email: `${inputValue}`,
//                         });
//                     }

//                     return filtered;
//                 }}
//                 selectOnFocus
//                 clearOnBlur
//                 handleHomeEndKeys
//                 id="custom-autocomplete"
//                 options={listOptions}
//                 getOptionLabel={(option) => {
//                     // Value selected with enter, right from the input
//                     if (typeof option === "string") {
//                         return option.email;
//                     }
//                     // Add "xxx" option created dynamically
//                     if (option.inputValue) {
//                         return option.inputValue;
//                     }
//                     // console.log("optionLable", option);
//                     // Regular option
//                     return option.email;
//                 }}
//                 renderOption={(props, option) => <li {...props}>{option.email}</li>}
//                 freeSolo
//                 renderInput={(params) => (
//                     <TextField {...params} label="Email" 
//                     error={Boolean(error)}
//                     helperText={error} />
//                 )}
//             />
//     );
// }

// export default function CustomAutoComplete({ listOptions, setValue, value, error }) {
//     return (
//         <Autocomplete
//             value={value}
//             onChange={(event, newValue) => {
//                 if (newValue) {
//                     setValue(newValue.user);
//                 } else {
//                     setValue('');
//                 }
//             }}
//             filterOptions={(options, params) => {
//                 const filtered = filter(options, params);
//                 const { inputValue } = params;

//                 // Suggest the creation of a new value if it does not exist in the listOptions
//                 if (inputValue && !listOptions.some(option => option.user.email === inputValue)) {
//                     filtered.push({
//                         user: { email: inputValue }
//                     });
//                 }

//                 return filtered;
//             }}
//             selectOnFocus
//             clearOnBlur
//             handleHomeEndKeys
//             id="custom-autocomplete"
//             options={listOptions}
//             // getOptionLabel={(option) => option.user.email}
//             getOptionLabel={(option) => {
//                 // Value selected with enter, right from the input
//                 if (typeof option === "string") {
//                     return option;
//                 }
//                 // Add "xxx" option created dynamically
//                 if (option.inputValue) {
//                     return option.inputValue;
//                 }
//                 // Regular option
//                 return option?.user?.email || '';
//             }}

//             renderOption={(props, option) => <li {...props}>{option.user.email}</li>}
//             freeSolo
//             renderInput={(params) => (
//                 <TextField {...params} label="Email" 
//                     error={Boolean(error)}
//                     helperText={error} 
//                 />
//             )}
//             onKeyDown={(e) => {
//                 if (e.key === 'Enter') {
//                     e.preventDefault();
//                     if (listOptions.some(option => option.user.email === e.target.value)) {
//                         setValue(e.target.value);
//                     } else {
//                         setValue('');
//                     }
//                 }
//             }}
//         />
//     );
// }

// ? WORKING CODE EXCEPT DELAYED VALUE DISPLAY 
export default function CustomAutoComplete({ listOptions, error }) {
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
            } else if (listOptions.length > 0) {
                setValue("user", {
                    email: listOptions[0].email,
                    id: listOptions[0].id
                });
                setInputValue(listOptions[0].email);
                // setSelectedValue(listOptions[0].email);
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
            options={listOptions}
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
    listOptions: PropTypes.array,
    value: PropTypes.object,
    setValue: PropTypes.func,
    error: PropTypes.object
}

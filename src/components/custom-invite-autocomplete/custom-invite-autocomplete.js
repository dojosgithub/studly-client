import * as React from "react";
import PropTypes from 'prop-types';
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

const filter = createFilterOptions();

// const optionsList = [
//     { email: "architect@mailinator.com", id: "664b090a650d20e47b857c7b" },
//     { email: "constman@mailinator.com", id: "664b2d12650d20e47b8583ef" },
//     { email: "arch@mailinator.com", id: "66544966b706e51ef923b90a" },
//     { email: "engr@mailinator.com", id: "66544c5cb706e51ef923b9d1" },
//     { email: "fielduser@mailinator.com", id: "6654900b0cea8787a566f1a5" },
//     { email: "associate@mailinator.com", id: "665490af0cea8787a566f1cc" },
//     { email: "arch1@mailinator.com", id: "6654910a0cea8787a566f215" },
//     { email: "fielduser1@mailinator.com", id: "6654974e7f6a9ce80c74c988" },
//     { email: "cman@mailinator.com", id: "665497d67f6a9ce80c74c9cc" },
//     { email: "con_man@mailinator.com", id: "6654b35095e22d6e5055b1e1" },
//     { email: "engr1@mailinator.com", id: "6654b3dd95e22d6e5055b1f5" },
//     { email: "arch2@mailinator.com", id: "6654b49395e22d6e5055b2e4" },
//     { email: "arch3@mailinator.com", id: "6656dd2df60f23a59d3cda50" },
//     { email: "puser@mailinator.com", id: "6656e4bd0f538b75550ee137" },
// ];

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

export default function CustomInviteAutoComplete({ optionsList }) {
    // const [value, setInputValue] = React.useState(null);
    const [inputError, setInputError] = useState("");
    const { getValues, setValue,formState: { isSubmitSuccessful } } = useFormContext()
    const { user } = getValues()
    // console.log("value", value);
    console.log("user", user);
    const handleEmailValidation = (email) => {
        if (validateEmail(email)) {
            setInputError("");
            return true;
        }
        setInputError("Invalid email address");
        return false;

    };

    const handleUserObject = (inputValue) => {
        const matchedUser = optionsList.find((option) => option.email === inputValue);
        if (matchedUser) {
            setValue("user", matchedUser);
        } else {
            setValue("user", { email: inputValue });
        }
    };
    React.useEffect(() => {
        console.log('inputError', inputError)
        if (isSubmitSuccessful) {
            console.log('isSubmitSuccessful', isSubmitSuccessful)
            setInputError('')
        }

    }, [inputError, isSubmitSuccessful, setInputError])

    return (
        <Autocomplete
            value={user?user.email:''}
            onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                    if (handleEmailValidation(newValue)) {
                        // setInputValue({ email: newValue });
                        setValue("user", { email: newValue });
                    }
                } else if (newValue && newValue.inputValue) {
                    if (handleEmailValidation(newValue.inputValue)) {
                        // Create a new value from the user input
                        // setInputValue({ email: newValue.inputValue });
                        setValue("user", { email: newValue.inputValue });
                    }
                } else {
                    // setInputValue(newValue);
                    setValue("user",newValue);
                    console.log("newValue", newValue)
                }
            }}
            onInputChange={(event, newInputValue) => {
                if (handleEmailValidation(newInputValue)) {
                    handleUserObject(newInputValue);
                } else {
                    setInputError("Invalid email address");
                }
            }}
            filterOptions={(options, params) => {
                const filtered = filter(options, params);
                const { inputValue } = params;

                // Suggest the creation of a new value if it does not exist in the optionsList
                if (
                    inputValue !== "" &&
                    !optionsList.some((option) => option.email === inputValue)
                ) {
                    if (validateEmail(inputValue)) {
                        filtered.push({
                            inputValue,
                            email: inputValue,
                            displayLabel: `Add "${inputValue}"`,
                        });
                    }
                }

                return filtered;
            }}
            selectOnFocus
            handleHomeEndKeys
            id="free-solo-with-text-demo"
            options={optionsList}
            getOptionLabel={(option) => {
                // Value selected with enter, right from the input
                if (typeof option === "string") {
                    return option;
                }
                // Add "xxx" option created dynamically
                if (option.inputValue) {
                    return option.inputValue;
                }
                // Regular option
                return option.email;
            }}
            renderOption={(props, option) => (
                <li {...props}>{option.displayLabel || option.email}</li>
            )}
            sx={{ width: 300 }}
            freeSolo
            // clearOnBlur
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="User"
                    error={Boolean(inputError)}
                    helperText={inputError}
                />
            )}
        />
    );
}

CustomInviteAutoComplete.propTypes = {
    optionsList: PropTypes.array,
}

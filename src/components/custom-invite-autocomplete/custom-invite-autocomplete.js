import * as React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const filter = createFilterOptions();

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export default function CustomInviteAutoComplete({ optionsList }) {
  const [inputError, setInputError] = useState('');
  const {
    getValues,
    setValue,
    formState: { isSubmitSuccessful },
  } = useFormContext();
  const { user } = getValues();
  const handleEmailValidation = (email) => {
    if (validateEmail(email)) {
      setInputError('');
      return true;
    }
    setInputError('Invalid email address');
    return false;
  };

  const handleUserObject = (inputValue) => {
    const matchedUser = optionsList.find((option) => option.email === inputValue);
    if (matchedUser) {
      setValue('user', matchedUser);
    } else {
      setValue('user', { email: inputValue });
    }
  };
  React.useEffect(() => {
    if (isSubmitSuccessful) {
      setInputError('');
    }
  }, [inputError, isSubmitSuccessful, setInputError]);

  return (
    <Autocomplete
      value={user ? user.email : ''}
      onChange={(event, newValue) => {
        if (typeof newValue === 'string') {
          if (handleEmailValidation(newValue)) {
            setValue('user', { email: newValue });
          }
        } else if (newValue && newValue.inputValue) {
          if (handleEmailValidation(newValue.inputValue)) {
            // Create a new value from the user input
            setValue('user', { email: newValue.inputValue });
          }
        } else {
          setValue('user', newValue);
        }
      }}
      onInputChange={(event, newInputValue) => {
        if (handleEmailValidation(newInputValue)) {
          handleUserObject(newInputValue);
        } else {
          setInputError('Invalid email address');
        }
      }}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);
        const { inputValue } = params;

        // Suggest the creation of a new value if it does not exist in the optionsList
        if (inputValue !== '' && !optionsList.some((option) => option.email === inputValue)) {
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
        if (typeof option === 'string') {
          return option;
        }
        // Add "xxx" option created dynamically
        if (option.inputValue) {
          return option.inputValue;
        }
        // Regular option
        return option.email;
      }}
      renderOption={(props, option) => <li {...props}>{option.displayLabel || option.email}</li>}
      sx={{ minWidth: { xs: '100%', md: 300 } }}
      freeSolo
      // clearOnBlur
      renderInput={(params) => (
        <TextField {...params} label="User" error={Boolean(inputError)} helperText={inputError} />
      )}
    />
  );
}

CustomInviteAutoComplete.propTypes = {
  optionsList: PropTypes.array,
};

import { alpha } from '@mui/material/styles';
import { buttonClasses } from '@mui/material/Button';

// ----------------------------------------------------------------------

const COLORS = ['primary', 'secondary', 'info', 'success', 'warning', 'error'];

// ----------------------------------------------------------------------

export function button(theme) {
  const lightMode = theme.palette.mode === 'light';

  const rootStyles = (ownerState) => {
    const inheritColor = ownerState.color === 'inherit';

    const containedVariant = ownerState.variant === 'contained';

    const outlinedVariant = ownerState.variant === 'outlined';

    const textVariant = ownerState.variant === 'text';

    const softVariant = ownerState.variant === 'soft';

    const customVariant = ownerState.variant === 'custom';

    const smallSize = ownerState.size === 'small';

    const mediumSize = ownerState.size === 'medium';

    const largeSize = ownerState.size === 'large';

    const defaultStyle = {
      ...(inheritColor && {
        // CONTAINED
        ...(containedVariant && {
          color: lightMode ? theme.palette.common.white : theme.palette.grey[800],
          backgroundColor: lightMode ? theme.palette.grey[800] : theme.palette.common.white,
          '&:hover': {
            backgroundColor: lightMode ? theme.palette.grey[700] : theme.palette.grey[400],
          },
        }),
        // OUTLINED
        ...(outlinedVariant && {
          borderColor: alpha(theme.palette.grey[500], 0.32),
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        // TEXT
        ...(textVariant && {
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette.text.primary,
          backgroundColor: alpha(theme.palette.grey[500], 0.08),
          '&:hover': {
            backgroundColor: alpha(theme.palette.grey[500], 0.24),
          },
        }),

        ...(outlinedVariant && {
          '&:hover': {
            borderColor: 'currentColor',
            boxShadow: '0 0 0 0.5px currentColor',
          },
        }),
        // CUSTOM
        ...(customVariant && {
          backgroundColor: alpha('#fff', 0.7),
          '&:hover': {
            backgroundColor: alpha('#fff', 0.5),
          },
        }),
      }),
    };

    const colorStyle = COLORS.map((color) => ({
      ...(ownerState.color === color && {
        // CONTAINED
        ...(containedVariant && {
          '&:hover': {
            boxShadow: theme.customShadows[color],
          },
        }),
        // SOFT
        ...(softVariant && {
          color: theme.palette[color][lightMode ? 'dark' : 'light'],
          backgroundColor: alpha(theme.palette[color].main, 0.16),
          '&:hover': {
            backgroundColor: alpha(theme.palette[color].main, 0.32),
          },
        }),
      }),
    }));

    const disabledState = {
      [`&.${buttonClasses.disabled}`]: {
        // SOFT
        ...(softVariant && {
          backgroundColor: theme.palette.action.disabledBackground,
        }),
      },
    };

    const size = {
      ...(smallSize && {
        height: 30,
        fontSize: 13,
        paddingLeft: 8,
        paddingRight: 8,
        ...(textVariant && {
          paddingLeft: 4,
          paddingRight: 4,
        }),
      }),
      ...(mediumSize && {
        paddingLeft: 12,
        paddingRight: 12,
        ...(textVariant && {
          paddingLeft: 8,
          paddingRight: 8,
        }),
      }),
      ...(largeSize && {
        height: 48,
        fontSize: 15,
        paddingLeft: 16,
        paddingRight: 16,
        ...(textVariant && {
          paddingLeft: 10,
          paddingRight: 10,
        }),
      }),
    };

    return [defaultStyle, ...colorStyle, disabledState, size];
  };

  return {
    MuiButton: {
      styleOverrides: {
        root: ({ ownerState }) => rootStyles(ownerState),
      },
    },
  };
}

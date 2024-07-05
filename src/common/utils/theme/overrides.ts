import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

export function overrides(theme: any) {
    return {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    height: '5%',
                    marginBottom: '0.2%',
                },
            },
        },
        MuiCssBaseline: {
            styleOverrides: {
                '*': {
                    boxSizing: 'border-box',
                },
                html: {
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                    WebkitOverflowScrolling: 'touch',
                },
                body: {
                    margin: 0,
                    padding: 0,
                    width: '100%',
                    height: '100%',
                },
                '#root': {
                    width: '100%',
                    height: '100%',
                },
                input: {
                    '&[type=number]': {
                        MozAppearance: 'textfield',
                        '&::-webkit-outer-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none',
                        },
                        '&::-webkit-inner-spin-button': {
                            margin: 0,
                            WebkitAppearance: 'none',
                        },
                    },
                },
                img: {
                    maxWidth: '100%',
                    display: 'inline-block',
                    verticalAlign: 'bottom',
                },
            },
        },
        MuiBackdrop: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(theme.palette.grey[900], 0.8),
                },
                invisible: {
                    background: 'transparent',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained',
            },
            styleOverrides: {
                containedInherit: {
                    color: theme.palette.common.white,
                    backgroundColor: theme.palette.grey[800],
                    '&:hover': {
                        color: theme.palette.common.white,
                        backgroundColor: theme.palette.grey[800],
                    },
                },
                sizeLarge: {
                    minHeight: 48,
                },
                contained: {
                    paddingBlock: '0.5rem',
                    borderRadius: '2rem',
                    boxShadow: 'none',
                    paddingInline: '2rem',
                    textTransform: 'none',
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: theme.customShadows.card,
                    borderRadius: Number(theme.shape.borderRadius) * 2,
                    position: 'relative',
                    zIndex: 0, // Fix Safari overflow: hidden with border radius
                },
            },
        },
        MuiCardHeader: {
            defaultProps: {
                titleTypographyProps: { variant: 'h6' },
                subheaderTypographyProps: { variant: 'body2' },
            },
            styleOverrides: {
                root: {
                    padding: theme.spacing(3, 3, 0),
                },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    [`& .${outlinedInputClasses.notchedOutline}`]: {
                        borderColor: alpha(theme.palette.grey[500], 0.24),
                    },
                },
            },
        },
        MuiPaper: {
            defaultProps: {
                elevation: 0,
            },
        },
        MuiTableCell: {
            styleOverrides: {
                head: {
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.neutral,
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: theme.palette.grey[800],
                },
                arrow: {
                    color: theme.palette.grey[800],
                },
            },
        },
        MuiTypography: {
            styleOverrides: {
                paragraph: {
                    marginBottom: theme.spacing(2),
                },
                gutterBottom: {
                    marginBottom: theme.spacing(1),
                },
            },
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    ...theme.typography.body2,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '.MuiInputBase-root': {
                        padding: 0,
                        textAlign: 'right',
                    },
                    '.MuiInputBase-input': {
                        paddingRight: '3rem',
                        display: 'flex',
                    },
                    '.MuiIconButton-root': {
                        position: 'absolute',
                        right: '0.4rem',
                        background: 'inherit',
                    },
                    'MuiTouchRipple-root': {
                        border: 'none !important',
                        outline: 'none !important',
                    },
                    input: {
                        width: '100%',
                    },
                    textarea: {
                        paddingInline: '5px',
                        paddingBlock: '2px',
                    },
                },
            },
        },
    };
}

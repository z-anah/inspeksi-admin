export const staticPrimaryColor = '#000000' // Black for main text and primary content
export const staticPrimaryDarkenColor = '#000000'
export const themes = {
  light: {
    dark: false,
    colors: {
      'primary': staticPrimaryColor, // Black
      'on-primary': '#FFFFFF', // White text on black
      'primary-darken-1': '#000000',
      'secondary': '#808080', // Gray
      'on-secondary': '#FFFFFF',
      'secondary-darken-1': '#808080',
      'success': '#28C76F',
      'on-success': '#000000',
      'success-darken-1': '#24B364',
      'info': '#808080', // Gray for info
      'on-info': '#FFFFFF',
      'info-darken-1': '#000000',
      'warning': '#FF9F43',
      'on-warning': '#000000',
      'warning-darken-1': '#E68F3C',
      'error': '#FF4C51',
      'on-error': '#000000',
      'error-darken-1': '#E64449',
      'background': '#FFFFFF', // Main background
      'on-background': '#000000', // Main text
      'surface': '#FFFFFF', // Card backgrounds
      'on-surface': '#000000', // Main text on surface
      'grey-50': '#FFFFFF',
      'grey-100': '#F5F5F5',
      'grey-200': '#EEEEEE',
      'grey-300': '#E0E0E0',
      'grey-400': '#BDBDBD',
      'grey-500': '#808080', // Main gray
      'grey-600': '#757575',
      'grey-700': '#616161',
      'grey-800': '#424242',
      'grey-900': '#000000',
      'grey-light': '#FFFFFF',
      'perfect-scrollbar-thumb': '#808080', // Gray
      'skin-bordered-background': '#FFFFFF',
      'skin-bordered-surface': '#FFFFFF',
      'expansion-panel-text-custom-bg': '#FFFFFF',
    },
    variables: {
      'code-color': '#d400ff',
      'overlay-scrim-background': '#2F2B3D',
      'tooltip-background': '#2F2B3D',
      'overlay-scrim-opacity': 0.5,
      'hover-opacity': 0.06,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.4,
      'border-color': '#2F2B3D',
      'border-opacity': 0.12,
      'table-header-color': '#EAEAEC',
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,
      'switch-opacity': 0.2,
      'switch-disabled-track-opacity': 0.3,
      'switch-disabled-thumb-opacity': 0.4,
      'switch-checked-disabled-opacity': 0.3,
      'track-bg': '#F1F0F2',

      // Shadows
      'shadow-key-umbra-color': '#2F2B3D',
      'shadow-xs-opacity': 0.10,
      'shadow-sm-opacity': 0.12,
      'shadow-md-opacity': 0.14,
      'shadow-lg-opacity': 0.16,
      'shadow-xl-opacity': 0.18,
    },
  },
  dark: {
    dark: true,
    colors: {
      'primary': staticPrimaryColor, // Black
      'on-primary': '#FFFFFF',
      'primary-darken-1': '#000000',
      'secondary': '#808080', // Gray
      'on-secondary': '#FFFFFF',
      'secondary-darken-1': '#808080',
      'success': '#28C76F',
      'on-success': '#FFFFFF',
      'success-darken-1': '#24B364',
      'info': '#808080', // Gray for info
      'on-info': '#FFFFFF',
      'info-darken-1': '#000000',
      'warning': '#FF9F43',
      'on-warning': '#FFFFFF',
      'warning-darken-1': '#E68F3C',
      'error': '#FF4C51',
      'on-error': '#FFFFFF',
      'error-darken-1': '#E64449',
      'background': '#000000', // Black background for dark mode
      'on-background': '#FFFFFF', // White text
      'surface': '#232323', // Slightly lighter than black for cards
      'on-surface': '#FFFFFF',
      'grey-50': '#232323',
      'grey-100': '#2C2C2C',
      'grey-200': '#363636',
      'grey-300': '#404040',
      'grey-400': '#4A4A4A',
      'grey-500': '#808080',
      'grey-600': '#A0A0A0',
      'grey-700': '#B0B0B0',
      'grey-800': '#C0C0C0',
      'grey-900': '#FFFFFF',
      'grey-light': '#232323',
      'perfect-scrollbar-thumb': '#808080',
      'skin-bordered-background': '#000000',
      'skin-bordered-surface': '#232323',
      'expansion-panel-text-custom-bg': '#232323',
    },
    variables: {
      'code-color': '#d400ff',
      'overlay-scrim-background': '#171925',
      'tooltip-background': '#F7F4FF',
      'overlay-scrim-opacity': 0.6,
      'hover-opacity': 0.06,
      'focus-opacity': 0.1,
      'selected-opacity': 0.08,
      'activated-opacity': 0.16,
      'pressed-opacity': 0.14,
      'dragged-opacity': 0.1,
      'disabled-opacity': 0.4,
      'border-color': '#E1DEF5',
      'border-opacity': 0.12,
      'table-header-color': '#535876',
      'high-emphasis-opacity': 0.9,
      'medium-emphasis-opacity': 0.7,
      'switch-opacity': 0.4,
      'switch-disabled-track-opacity': 0.4,
      'switch-disabled-thumb-opacity': 0.8,
      'switch-checked-disabled-opacity': 0.3,
      'track-bg': '#3A3F57',

      // Shadows
      'shadow-key-umbra-color': '#131120',
      'shadow-xs-opacity': 0.16,
      'shadow-sm-opacity': 0.18,
      'shadow-md-opacity': 0.2,
      'shadow-lg-opacity': 0.22,
      'shadow-xl-opacity': 0.24,
    },
  },
}
export default themes

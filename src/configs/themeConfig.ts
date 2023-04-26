// ** MUI Imports
import { PaletteMode } from '@mui/material'

// ** Types
// import { ContentWidth } from 'src/@core/layouts/types'

export type ThemeColor = 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success'

type ThemeConfig = {
  mode: PaletteMode
  templateName: string
  appName: string
  routingLoader: boolean
  disableRipple: boolean
  navigationSize: number
  menuTextTruncate: boolean
  responsiveFontSizes: boolean
}

const themeConfig: ThemeConfig = {
  // ** Layout Configs
  templateName: 'Materio' /* Template Name */,
  appName: 'Bookaholic' /* App Name */,
  mode: 'light' /* light | dark */,

  // ** Routing Configs
  routingLoader: true /* true | false */,

  // ** Navigation (Menu) Configs
  menuTextTruncate: true /* true | false */,
  navigationSize: 260 /* Number in PX(Pixels) /*! Note: This is for Vertical navigation menu only */,

  // ** Other Configs
  responsiveFontSizes: true /* true | false */,
  disableRipple: false /* true | false */
}

export default themeConfig

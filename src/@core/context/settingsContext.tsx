// ** React Imports
import { createContext, useState, ReactNode } from 'react'

// ** MUI Imports
import { PaletteMode } from '@mui/material'

// ** ThemeConfig Import
import themeConfig, { ThemeColor } from '@/configs/themeConfig'

// ** Types Import
import { User } from '@/configs/schemas'

export type Settings = {
  loaded: boolean
  mode: PaletteMode
  themeColor: ThemeColor
  user?: User
}

export type SettingsContextValue = {
  settings: Settings
  saveSettings: (updatedSettings: Settings) => void
  reloadSettings: (force: boolean) => Settings | null
}

const initialSettings: Settings = {
  loaded: false,
  themeColor: 'primary',
  mode: themeConfig.mode,
  user: undefined
}

// ** Create Context
export const SettingsContext = createContext<SettingsContextValue>({
  saveSettings: () => null,
  settings: initialSettings,
  reloadSettings: () => null,
})

// export const SettingsProvider = ({ children }: { children: ReactNode }) => {
//   // ** State
//   const [settings, setSettings] = useState<Settings>({ ...initialSettings })

//   const saveSettings = (updatedSettings: Settings) => {
//     localStorage.setItem('settings', JSON.stringify({ ...updatedSettings, loaded: true }))
//     setSettings(updatedSettings)
//   }

//   return <SettingsContext.Provider value={{ settings, saveSettings }}>{children}</SettingsContext.Provider>
// }

// export const SettingsConsumer = SettingsContext.Consumer

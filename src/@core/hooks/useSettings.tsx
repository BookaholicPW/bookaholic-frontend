import { useCallback, useContext, useEffect, useState } from 'react'
import { Settings, SettingsContext, SettingsContextValue } from '@/@core/context/settingsContext'
import { init } from 'next/dist/compiled/@vercel/og/satori';

export const useSettings = (): SettingsContextValue => {
  let initialSettings: Settings = {
    loaded: false,
    themeColor: 'primary',
    mode: 'light',
    user: undefined
  }
  // Read settings from local storage
  //
  const [ settings, updateSettings ] = useState<Settings>({ ...initialSettings });
  const saveSettings = useCallback((updatedSettings: Settings) => {
    localStorage.setItem('settings', JSON.stringify({ ...updatedSettings, loaded: true }))
    updateSettings(updatedSettings)
  }, [updateSettings]);
  if (typeof window === 'undefined') {
    return { settings: initialSettings, saveSettings: () => null }
  }
  const localSettings = localStorage.getItem('settings');
  if (localSettings && settings.loaded === false) {
    initialSettings = JSON.parse(localSettings);
    updateSettings(initialSettings);
  } else if (settings.loaded === false) {
    initialSettings.loaded = true;
    updateSettings(initialSettings);
  }
  
  

  // const { settings, saveSettingsContext } = useContext(SettingsContext)
  // useCallback(() => {
  // const saveSettings = (updatedSettings: Settings) => {
  //   localStorage.setItem('settings', JSON.stringify({ ...updatedSettings, loaded: true }))
  //   saveSettingsContext(updatedSettings)
  // };
  // useEffect(() => {
  //   const localSettings = localStorage.getItem('settings')
  //   if (localSettings) {
  //     saveSettings(JSON.parse(localSettings))
  //   } else {
  //     settings.loaded = true
  //     saveSettings(settings)
  //   }
  // }, [saveSettings, settings])

  return { settings, saveSettings }
}

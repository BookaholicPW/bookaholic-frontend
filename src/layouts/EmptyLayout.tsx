// ** React Imports
import { ReactNode, useEffect, useState } from "react";

// ** MUI Imports
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Hook Import

import router from "next/router";
import { Grid } from "@mui/material";
import { useSettings } from "@/@core/hooks/useSettings";
import useFetch from "@/@core/utils/useFetch";

interface Props {
  children: ReactNode;
}

const EmptyLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings();
  const { request } = useFetch();

  // ** Fetch Account Info
  const [refreshed, setRefreshed] = useState(false);

  useEffect(() => {
    if (settings.user && settings.user.accessToken && !refreshed) {
      setRefreshed(true);
    //   fetchData(AccountInfoEndpoint.method, AccountInfoEndpoint.path).then(
    //     (res) => {
    //       if (res && res.success) {
    //         saveSettings({
    //           ...settings,
    //           user: { ...res.data, access_token: settings?.user?.access_token },
    //         });
    //       } else {
    //         saveSettings({ ...settings, user: undefined });
    //         router.push("/pages/login", undefined, { shallow: true });
    //       }
    //     }
    //   );
    }
  }, [refreshed, settings, saveSettings, request]);

  useEffect(() => {
    console.log("settings", settings);
    if (settings && settings.loaded && !settings.user) {
        console.log("Login");
    //   router.push("/account/login", undefined, { shallow: true });
    } else {
        console.log("Home");
        router.push("/", undefined, { shallow: true });
    }
  }, [settings]);
  return <Grid>{children}</Grid>
};

export default EmptyLayout;

// ** React Imports
import { ReactNode, useEffect, useState } from "react";

// ** MUI Imports
import { Theme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

// ** Hook Import

import router from "next/router";
import { Button, Grid, Typography } from "@mui/material";
import { useSettings } from "@/@core/hooks/useSettings";
import useFetch from "@/@core/utils/useFetch";

interface Props {
  children: ReactNode;
}

const UserLayout = ({ children }: Props) => {
  // ** Hooks
  const { settings, saveSettings } = useSettings();
  const { request } = useFetch();

  // ** Fetch Account Info
  const [refreshed, setRefreshed] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (settings.user && settings.user.token && !refreshed) {
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
    if (settings && settings.loaded && !settings.user) {
      console.log("Login");
      router.push("/account/login", undefined, { shallow: true });
    }
    if (settings && settings.loaded && settings.user) {
      console.log("Authenticated");
      setAuthenticated(true);
    }
  }, [settings]);
  // return <Grid>{children}</Grid>;
  return authenticated ? (
    <Grid>
      <Grid>
        <Typography variant="button">
          Logged in as {settings.user?.email}
        </Typography>
        <Button
          onClick={() => {
            setAuthenticated(false);
            saveSettings({ ...settings, user: undefined });
            router.push("/account/login", undefined, { shallow: true });
          }}
        >
          Logout
        </Button>
      </Grid>
      {children}
    </Grid>
  ) : (
    <Grid></Grid>
  );
};

export default UserLayout;

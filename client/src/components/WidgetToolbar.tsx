import React, { useContext } from "react";
import MaterialAppBar from "@material-ui/core/AppBar";
import { makeStyles, Box, Button, Menu, MenuItem, Toolbar, } from "@material-ui/core";
import { useRouter } from "next/router";

import RenameTabDialog from "./RenameTabDialog";

import { kSize } from "../utils/constants";
import { builderClassIdToBuilderClassMap } from "../utils/widgetUtils";
import { TabManagerContext } from "../utils/contexts/TabManagerContext";
import { useDrawer } from "../utils/hooks/useDrawer";
import ShareTabDialog from "./ShareTabDialog";


const WidgetToolbar: React.FC = () => {

  const router = useRouter();
  const classes = useStyles();

  const { addNewWidgetToCurrentTab, removeCurrentTab } = useContext(TabManagerContext);

  const { open: openRenameTabDialog, onClose: onCloseRenameTabDialog, onOpen: onOpenRenameTabDialog } = useDrawer();
  const { open: openShareTabDialog, onClose: onCloseShareTabDialog, onOpen: onOpenShareTabDialog } = useDrawer();

  const [anchorElAddWidgetMenu, setAnchorElAddWidgetMenu] = React.useState<null | HTMLElement>(null);
  const [anchorElTabSettingsMenu, setAnchorTabSettingsMenu] = React.useState<null | HTMLElement>(null);


  const openAddWidgetMenu = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorElAddWidgetMenu(event.currentTarget);

  const closeAddWidgetMenu = () => setAnchorElAddWidgetMenu(null);

  const openTabSettingsMenu = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorTabSettingsMenu(event.currentTarget);

  const closeTabSettingsMenu = () => setAnchorTabSettingsMenu(null);

  const navigateToChartBrowser = () => {
    router.push("/charts");
  };

  const navigateToDashboard = () => {
    router.push("/dashboard");
  };

  const addNewWidget = (builderClassId: string) => {
    addNewWidgetToCurrentTab(builderClassId);
    closeAddWidgetMenu();
  };

  const renameTab = () => {
    onOpenRenameTabDialog();
    closeTabSettingsMenu();
  };

  const removeTab = () => {
    removeCurrentTab();
    closeTabSettingsMenu();
  };

  const handleOpenShareTabDialog = () => {
    onOpenShareTabDialog();
    closeTabSettingsMenu();
  };


  return (
    <>
      <MaterialAppBar elevation={0} position={"static"} color={"secondary"}>
        <Toolbar className={classes.toolbar}>

          <Box flexGrow={1}>

            <Button onClick={openAddWidgetMenu}>
              Add Widget
            </Button>
            <Menu
              keepMounted
              anchorEl={anchorElAddWidgetMenu}
              open={Boolean(anchorElAddWidgetMenu)}
              onClose={closeAddWidgetMenu}
            >
              {
                Object.keys(builderClassIdToBuilderClassMap).map((builderClassId, index) => (
                    <MenuItem
                      key={`MenuItem-${index}`}
                      onClick={() => addNewWidget(builderClassId)}
                    >
                      {builderClassIdToBuilderClassMap[builderClassId as keyof typeof builderClassIdToBuilderClassMap].name}
                    </MenuItem>
                  )
                )
              }
            </Menu>

            {
              router.pathname !== "/charts" && (
                <Button onClick={navigateToChartBrowser}>Chart Browser</Button>
              )
            }

            {
              router.pathname !== "/dashboard" && (
                <Button onClick={navigateToDashboard}>Dashboard</Button>
              )
            }

          </Box>

          <Button onClick={openTabSettingsMenu}>
            Tab Settings
          </Button>
          <Menu
            keepMounted
            anchorEl={anchorElTabSettingsMenu}
            open={Boolean(anchorElTabSettingsMenu)}
            onClose={closeTabSettingsMenu}
          >
            <MenuItem onClick={renameTab}>Rename Tab</MenuItem>
            <MenuItem onClick={handleOpenShareTabDialog}>Share Tab</MenuItem>
            <MenuItem onClick={removeTab} className={classes.closeTabMenuItem}>Close Tab</MenuItem>
          </Menu>

        </Toolbar>
      </MaterialAppBar>
      <RenameTabDialog open={openRenameTabDialog} onClose={onCloseRenameTabDialog}/>
      <ShareTabDialog open={openShareTabDialog} onClose={onCloseShareTabDialog}/>
    </>
  );

};


const useStyles = makeStyles(
  (theme) => (
    {
      toolbar: {
        minHeight: kSize.WIDGET_TOOLBAR_HEIGHT,
        height: kSize.WIDGET_TOOLBAR_HEIGHT,
      },
      closeTabMenuItem: {
        color: theme.palette.error.dark,
      }
    }
  )
);


export default WidgetToolbar;

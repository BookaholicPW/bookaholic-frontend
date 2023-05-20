import Dialog from "@mui/material/Dialog"
import themeConfig from '@/configs/themeConfig'
import { DialogContent, DialogContentText, DialogTitle } from "@mui/material"


export default function WelcomeDialog(props: {
    open: boolean
    setOpen: (value: boolean) => void
}) {
    
    return (
        <Dialog open={props.open} onClose={() => {
            props.setOpen(false)
        }}>
            <DialogTitle>Welcome to {themeConfig.appName}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Just a few steps before you can start using {themeConfig.appName}:
                </DialogContentText>
                
            </DialogContent>
        </Dialog>
    )
}
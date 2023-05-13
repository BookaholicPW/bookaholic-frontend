import { User } from "@/configs/schemas"
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material"
import Avatar from "./Avatar"


export default function ProfileDialog(props: {
    user: User
    open: boolean
    setOpen: (value: boolean) => void
}) {
    return (
        <Dialog open={props.open} onClose={() => {
            props.setOpen(false)
        }}>
            <DialogTitle>Profile</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    <Avatar
                        alt={props.user.username}
                        src={props.user.avatar || './images/default_profile.png'}
                        width="100px"
                        height="100px"
                    />
                    <Typography variant="h5">{props.user.username}</Typography>
                    <Typography variant="body1">{props.user.username}</Typography>
                    <Typography variant="body1">{props.user.email}</Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    props.setOpen(false)
                }}>Close</Button>
            </DialogActions>
        </Dialog>
    )
}
import { Switch } from "@mui/material";
import { useState } from "react";

export default Switch(){
    return (
    const [darkMode, setDarkMode] = useState(false);
    const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    };
    // Inside the drawerContent(), add this below </list>
    <Divider />
    <List>
    <ListItem>
    <ListItemText primary="Dark Mode" />
    <Switch checked={darkMode} onChange={handleDarkModeToggle} />
    </ListItem>
    </List>
    // Apply dark mode background to the main container, chage the <box element> in
    return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh',
    bgcolor: darkMode ? 'grey.900' : 'background.default', color: darkMode ?
    'common.white' : 'common.black' }}>
    )
)
}
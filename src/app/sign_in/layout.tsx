import { Box } from "@mui/material";

export default function LogginLayout({ children }: { children: React.ReactNode }) {


    return (
        <section style={{ height: '100%' }}>
            <Box sx={{
                height: '100%',
                backgroundImage: 'url("Loggin/Loggin.png")',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
            }}>
                {children}
            </Box>
        </section >
    )
}
'use client'
import { loginUser } from "@/firebase/firebase"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Box, Typography, TextField, Button, FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material"
import Link from "next/link"
import { SnackbarProvider, enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useCookies } from "react-cookie"
import { styleSign_in } from "./style"


const Loggin = () => {
    const [cookies, setCookie] = useCookies(['user']);
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({
        password: '',
        email: ''
    })
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const password = () => {
        return (
            <FormControl fullWidth variant="outlined">
                <OutlinedInput
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                onClick={handleClickShowPassword}
                                onMouseDown={handleMouseDownPassword}
                                edge="end"
                            >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                        </InputAdornment>
                    }
                    fullWidth
                    sx={{ ...styleSign_in.OutlinedInputPassword }}
                    placeholder='xxxxxxxx'
                    onChange={(e) => setData({ ...data, 'password': e.target.value })}
                    value={data.password}
                />
            </FormControl>
        )
    }

    const logginUserr = async () => {
        try {
            const loggin: any = await loginUser(data.email, data.password)
            if (loggin?.uid) {
                const oneDay = 24 * 60 * 60 * 1000;
                const expirationDate = new Date(Date.now() + oneDay);
                const encodedUid = btoa(loggin.uid);
                setCookie('user', encodedUid, { expires: expirationDate });
                enqueueSnackbar('Autenticacion exitosa', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                enqueueSnackbar('Credenciales invalidas', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            }
        } catch (error) {
            enqueueSnackbar('Error en el sistema', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            })
            console.log(error)
        }
    }
    return (
        <Box sx={{ height: '100%' }}>
            <Box id='box-second' width={{ md: '60%' }} sx={{ ...styleSign_in.boxSecond }}>
                <SnackbarProvider />
                <Box>
                    <Typography id='title' sx={{ ...styleSign_in.tile }}>
                        PAPELERIA NUEVO MILENIO
                    </Typography>
                    <Typography id='title2' sx={{ ...styleSign_in.title2 }} >
                        Bienvenido a nuestro portal
                    </Typography>
                    <Box>
                        <Box width={'50%'} component={'img'} src="Loggin/logoInter.png" />
                    </Box>
                </Box>
                <Box id='containerField1' sx={{ ...styleSign_in.containerField1 }}>
                    <Box sx={{ width: { xs: '80%', md: '45%' } }}>
                        <Typography
                            id='label'
                            sx={{ ...styleSign_in.label }}>
                            INICIAR SESION
                        </Typography>
                        <Typography
                            sx={{ ...styleSign_in.labelInputs }}
                        >
                            Usuario
                        </Typography>
                        <Box>
                            <TextField
                                sx={{ width: '100%', background: 'rgba(255, 255, 255, 0.77)' }}
                                id="user"
                                type="email"
                                placeholder='ejemplo@gmail.com'
                                value={data.email}
                                onChange={(e) => setData({ ...data, 'email': e.target.value })}

                            />
                        </Box>
                    </Box>
                    <Box sx={{ width: { xs: '80%', md: '45%' } }}>
                        <Typography
                            sx={{ ...styleSign_in.labelInputs }}
                        >
                            Contraseña
                        </Typography>
                        <Box>
                            {password()}
                        </Box>
                    </Box>

                    <Button
                        onClick={logginUserr}
                        sx={{ ...styleSign_in.button }}>
                        Ingresar
                    </Button>
                </Box>
                <Box>
                    <Typography sx={{ ...styleSign_in.tyographyRegister }}>
                        ¿No tienes una cuenta?<br />
                        <Link href={'/sign_up'}>
                            REGISTRATE
                        </Link>
                    </Typography>
                </Box>
            </Box >
        </Box >
    )
}

export default Loggin
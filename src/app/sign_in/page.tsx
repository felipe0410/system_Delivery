'use client'
import { loginUser } from "@/firebase/firebase"
import { VisibilityOff, Visibility } from "@mui/icons-material"
import { Box, Typography, TextField, Button, FormControl, IconButton, InputAdornment, OutlinedInput } from "@mui/material"
import Link from "next/link"
import { SnackbarProvider, enqueueSnackbar } from "notistack"
import { useState } from "react"
import { useCookies } from "react-cookie"


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
                    sx={{ background: 'rgba(255, 255, 255, 0.77)', }}
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
            <Box width={'60%'} sx={{
                marginLeft: 'auto',
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-evenly',
            }}>
                <SnackbarProvider />
                <Box>
                    <Typography sx={{
                        color: '#FF4A11',
                        textAlign: 'center',
                        fontFamily: 'ClementePDai',
                        fontSize: '48px',
                        fontStyle: 'normal',
                        fontWeight: 400,
                        lineHeight: 'normal'
                    }}>
                        PAPELERIA NUEVO MILENIO
                    </Typography>
                    <Typography sx={{
                        color: '#0A0F37',
                        fontFamily: 'Nunito',
                        fontSize: '32px',
                        fontStyle: 'normal',
                        fontWeight: 700,
                        lineHeight: 'normal',
                    }} >
                        Bienvenido a nuestro portal
                    </Typography>
                    <Box>
                        <Box component={'img'} src="Loggin/logoInter.png" />
                    </Box>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    height: '46%',
                    width: '100%'
                }}>
                    <Box sx={{ width: '45%' }}>
                        <Typography
                            sx={{
                                color: '#0A0F37',
                                textAlign: 'center',
                                fontFamily: 'Nunito',
                                fontSize: '32px',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: 'normal',
                                marginBottom: '20px'
                            }}>
                            INICIAR SESION
                        </Typography>
                        <Typography
                            sx={{
                                textAlign: 'left',
                                color: '#0A0F37',
                                fontFamily: 'Nunito',
                                fontSize: '24px',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: 'normal',
                            }}
                        >
                            Usuario
                        </Typography>
                        <Box>
                            <TextField
                                sx={{ width: '100%' }}
                                id="user"
                                type="email"
                                placeholder='ejemplo@gmail.com'
                                // label="Usuario"
                                value={data.email}
                                onChange={(e) => setData({ ...data, 'email': e.target.value })}

                            />
                        </Box>
                    </Box>
                    <Box sx={{ width: '45%' }}>
                        <Typography
                            sx={{
                                textAlign: 'left',
                                color: '#0A0F37',
                                fontFamily: 'Nunito',
                                fontSize: '24px',
                                fontStyle: 'normal',
                                fontWeight: 700,
                                lineHeight: 'normal',
                            }}
                        >
                            Contraseña
                        </Typography>
                        <Box>
                            {password()}
                        </Box>
                    </Box>

                    <Button
                        onClick={logginUserr}
                        sx={{
                            borderRadius: '40px',
                            background: 'linear-gradient(180deg, #FF4A11 136.16%, rgba(244, 66, 9, 0.00) 136.17%)',
                            boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                            color: '#FFF',
                            fontFamily: 'Nunito',
                            fontSize: '32px',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            lineHeight: 'normal',
                            padding: '5px 50px'

                        }}>
                        Ingresar
                    </Button>
                </Box>
                <Box>
                    <Typography sx={{
                        color: '#0A0F37',
                        fontFamily: 'Nunito',
                        fontSize: '24px',
                        fontStyle: 'normal',
                        fontWeight: 900,
                        lineHeight: 'normal',
                    }}>
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
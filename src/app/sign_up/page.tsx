'use client'
import { VisibilityOff, Visibility } from '@mui/icons-material'
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, OutlinedInput, Paper, Select, TextField, Button } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation'
import { creteUser, saveDataUser } from '@/firebase/firebase';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';



const Sing_up = () => {
    const [data, setData] = useState<any>({
        rol: '',
        name: '',
        email: '',
        password: '',
    })
    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const router = useRouter()
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };
    const inputs = [
        {
            type: 'text',
            label: 'Nombre',
            placeHolder: 'nombre + apellido',
            validation: () => data.name.length > 4 || data.name.length < 2,
            msgErrror: 'Ingresa un nombre valido',
            field: 'name',
            value: data.name
        },
        {
            type: 'email',
            label: 'Usuario (Correo electronico)',
            placeHolder: 'ejemplo@gmail.com',
            validation: () => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/).test(data.email) || data.email.length < 2,
            msgErrror: 'Ingrese un correo valido',
            field: 'email',
            value: data.email
        },
        {
            type: 'password',
            label: 'Contraseña',
            placeHolder: 'xxxxxxxxxx',
            validation: () => ((/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/).test(data.password) || data.password.length < 2),
            msgErrror: 'La contraseña debe contener una letra mayuscula, una minuscula , un simbolo "%$&..." y debe tener una longitud de 8 caracteres',
            field: 'password',
            value: data.password
        }
    ]
    const validarInputs = () => {
        for (const input of inputs) {
            if (!input.validation()) {
                return false;
            }
        }
        // Si todas las validaciones son exitosas, retorna true
        return true;
    };
    const validateLength = () => {
        const arrayValue = Object.values(data)
        const validation = arrayValue.some((valor: any) => valor.length < 2)
        if (validation) {
            return true
        }
        const validation2 = validarInputs()
        if (!validation2) {
            return true
        }
        return false
    }

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
                    sx={{
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.77)',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                    }}
                    onChange={(e) => setData({ ...data, 'password': e.target.value })}
                    placeholder='xxxxxxxx'
                />
            </FormControl>
        )
    }

    const createUser = async () => {
        console.log(!validateLength())
        if (!validateLength()) {
            const creation: any = await creteUser(data.email, data.password)
            saveDataUser(creation.uid, data)
            if (creation?.errorCode === 'auth/email-already-in-use') {
                console.log('entro aqui')
                enqueueSnackbar('El correo ya esta en uso', {
                    variant: 'error',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
            } else {
                enqueueSnackbar('Usuario creado con exito', {
                    variant: 'success',
                    anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'right'
                    }
                })
                setTimeout(() => {
                    router.push('/sign_in')
                }, 3000);
            }
        } else {
            enqueueSnackbar('Completa los campos', {
                variant: 'error',
                anchorOrigin: {
                    vertical: 'bottom',
                    horizontal: 'right'
                }
            })
        }
    }

    return (
        <>
            <SnackbarProvider />
            <Box sx={{ textAlignLast: 'center' }}>
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
                }}>
                    Bienvenido a nuestro portal
                </Typography>
                <Box>
                    <Box component={'img'} src="Loggin/logoInter.png" />
                </Box>
            </Box>
            <Box>
                <Paper
                    sx={{
                        borderRadius: '40px',
                        background: '#9BA2E5',
                        boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                        width: '30%',
                        margin: '0 auto',
                        padding: '2% 4%',
                    }}
                    elevation={0}
                >
                    <Button onClick={() => router.push('/sign_in')} sx={{ background: 'rgba(255, 255, 255, 0.77)', minWidth: 'auto', borderRadius: '20PX' }}>
                        <ArrowBackIcon sx={{ color: '#0A0F37' }} />
                    </Button>
                    <Typography sx={{
                        color: '#FFF',
                        fontFamily: 'Nunito',
                        fontSize: '35px',
                        fontStyle: 'normal',
                        fontWeight: 800,
                        lineHeight: 'normal',
                        textAlignLast: 'center'

                    }}>
                        REGISTRATE
                    </Typography>
                    <Typography sx={{
                        color: '#0A0F37',
                        fontFamily: 'Nunito',
                        fontSize: '25px',
                        fontStyle: 'normal',
                        fontWeight: 800,
                        lineHeight: 'normal',
                        marginBottom: '15px'
                    }}>
                        Tipo de usuario
                    </Typography>
                    <FormControl id='form-control' fullWidth>
                        {/* <InputLabel id="type-user">seleccionar tipo de usuario</InputLabel> */}
                        <Select
                            sx={{
                                background: '#FFFFFFC4',
                                borderRadius: '10px',
                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                color: data.rol.length === 0 ? '#808080b3' : '#000'
                            }}
                            id="demo-simple-select"
                            value={data.rol.length === 0 ? 'seleccionar tipo de usuario' : data.rol}
                            onChange={(e) => setData({ ...data, 'rol': e.target.value })}
                            placeholder="seleccionar tipo de usuario"
                        >
                            <MenuItem sx={{ display: 'none' }} value={'seleccionar tipo de usuario'}>seleccionar tipo de usuario</MenuItem>
                            <MenuItem value={'Administrador'}>Administrador</MenuItem>
                            <MenuItem value={'Mensajero'}>Mensajero</MenuItem>
                        </Select>
                    </FormControl>
                    <Box>
                        {inputs.map((input, index) => {
                            return (
                                <Box key={index}>
                                    <Typography sx={{
                                        color: '#0A0F37',
                                        fontFamily: 'Nunito',
                                        fontSize: '25px',
                                        fontStyle: 'normal',
                                        fontWeight: 800,
                                        lineHeight: 'normal',
                                        marginY: '15px',
                                    }}>
                                        {input.label}
                                    </Typography>
                                    {input.type === 'password' ?
                                        password()
                                        :
                                        <>
                                            <TextField
                                                fullWidth
                                                sx={{
                                                    borderRadius: '10px',
                                                    background: 'rgba(255, 255, 255, 0.77)',
                                                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)'
                                                }}
                                                id={input.label}
                                                type={input.type}
                                                placeholder={input.placeHolder}
                                                value={input.value}
                                                onChange={(e) => setData({ ...data, [input.field]: e.target.value })}
                                            />
                                        </>
                                    }
                                    <Typography
                                        display={input.validation() ? 'none' : 'block'}
                                        color="error"
                                    >
                                        {input.msgErrror}
                                    </Typography>
                                </Box>
                            )
                        })}
                    </Box>
                    <Box sx={{ textAlignLast: 'center' }}>
                        <Button
                            onClick={createUser}
                            disabled={validateLength()}
                            sx={{
                                padding: '5px 20px',
                                borderRadius: '40px',
                                background: validateLength() ? '#b4bac2' : '#5C68D4',
                                boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                color: '#FFF',
                                fontFamily: 'Nunito',
                                fontSize: '28px',
                                fontStyle: 'normal',
                                fontWeight: 800,
                                lineHeight: 'normal',
                                marginTop: '20px',
                                // 
                            }}
                        >
                            CREAR USUARIO
                        </Button>
                    </Box>
                </Paper>
            </Box >
        </>
    )
}

export default Sing_up
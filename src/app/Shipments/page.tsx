import { Box, Button } from "@mui/material"

const Shipments = () => {
    const sectionsShipments = [
        {
            name: 'ENTREGAR',
            icon: '',
        },
        {
            name: 'MODIFICAR ENVIO',
            icon: '',
        },
        {
            name: 'AGREGAR ENVIO',
            icon: '',
        },
        {
            name: 'MENSAJERO',
            icon: '',
        }
    ]
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
        }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', minHeight: '40vh' }}>
                {
                    sectionsShipments.map((button) => {
                        return (
                            <Box sx={{ width: '40%' }} key={button.name}>
                                <Button sx={{
                                    width: '80%',
                                    borderRadius: '40px',
                                    background: '#5C68D4',
                                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
                                    color: '#FFF',
                                    textAlign: 'center',
                                    fontFamily: 'Nunito',
                                    fontSize: '32px',
                                    fontStyle: 'normal',
                                    fontWeight: 700,
                                    lineHeight: 'normal',
                                }} >
                                    {button.name}
                                </Button>
                            </Box>
                        )
                    })
                }
            </Box>
        </Box>
    )
}

export default Shipments
import { styled, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';
import AddPlayerForm from './AddPlayerForm';

const Root = styled('div')({
   height: '100%',
   backgroundColor: '#3498db',
   display: 'flex',
   justifyContent: 'center',
   color: 'white',
   paddingTop: '10vh',
});

export default function Main() {
   const handleAddPlayer = () => {};

   return (
      <Root>
         <Box>
            <Typography variant="h1" fontWeight={400}>
               Drinctet
            </Typography>
            <AddPlayerForm onAddPlayer={handleAddPlayer} />
         </Box>
      </Root>
   );
}

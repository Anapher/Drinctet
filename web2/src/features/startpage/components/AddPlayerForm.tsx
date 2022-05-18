import { Button, TextField } from '@mui/material';
import { Box } from '@mui/system';
import { useForm } from 'react-hook-form';
import { wrapForInputRef } from 'src/utils/react-hook-form-utils';

interface PlayerForm {
   name: string;
}

type Props = {
   onAddPlayer: (name: string) => void;
};

export default function AddPlayerForm({ onAddPlayer }: Props) {
   const { handleSubmit, register } = useForm<PlayerForm>({ mode: 'all' });
   const onSubmit = ({ name }: PlayerForm) => onAddPlayer(name);

   return (
      <form onSubmit={handleSubmit(onSubmit)}>
         <Box>
            <TextField {...wrapForInputRef(register('name'))} />
            <Button type="submit">Add Player</Button>
         </Box>
      </form>
   );
}

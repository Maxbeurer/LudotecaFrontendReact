import { ChangeEvent, useState , useEffect} from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import { Game } from "../../../types/Game";
import { Client } from "../../../types/Client";
import { Loan } from "../../../types/Loan";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from "dayjs";
import {
  useGetAllGamesQuery,
  useGetClientsQuery,
} from "../../../redux/services/ludotecaApi";


interface Props {

  loan: Loan | null;
  closeModal: () => void;
  create: (loan: Loan) => void; 
}

const initialState: {
  id: string;
  gameId: Game | undefined;
  clientId: Client | undefined;
  startDate: Dayjs;
  endDate: Dayjs;
} = {
  id : "",
  gameId: undefined,
  clientId: undefined,
  startDate: dayjs(''),
  endDate: dayjs(''),
};

export default function CreateLoan(props: Props) {
  const [form, setForm] = useState<Loan>(initialState);
  const { data: games } =
  useGetAllGamesQuery(null);
  const { data: clients} =
  useGetClientsQuery(null);

  useEffect(() => {
    setForm({
      id: props.loan?.id || "",
      game: props.loan?.game,
      client: props.loan?.client,
      startDate: props.loan?.startDate || dayjs(''),
      endDate: props.loan?.endDate || dayjs(''),
    });
  }, [props?.loan]);


  const handleChangeSelect = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const values = event.target.name === "game" ? games : clients;
    setForm({
      ...form,
      [event.target.name]: values?.find((val) => val.id === event.target.value),
    });
  };

  const handleDateChange = (key: "startDate" | "endDate", date: Dayjs | null) => {
    setForm({
      ...form,
      [key]: date,
    });
  };

  const isDateRangeValid = form.startDate && form.endDate 
  ? form.endDate.diff(form.startDate, 'day') <= 14 
  : false;

  const isFormValid =
    form.game &&
    form.client &&
    form.startDate &&
    form.endDate &&
    form.endDate > form.startDate &&
    isDateRangeValid;

  return (
    <div>
      <Dialog open={true} onClose={props.closeModal}>
        <DialogTitle>Crear Préstamo</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="id"
            label="Identificador"
            fullWidth
            variant="standard"
            value={form.id}
            InputProps={{
              readOnly: true,
            }}
          />
          <TextField
            margin="dense"
            select
            id="game"
            label="Juego"
            fullWidth
            variant="standard"
            name="game"
            value={form.game ? form.game.id : ""}
            onChange={handleChangeSelect}
          >
            {games && games.map((option: Game) => (
              <MenuItem key={option.id} value={option.id}>
                {option.title}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            select
            id="client"
            label="Cliente"
            fullWidth
            variant="standard"
            name="client"
            value={form.client ? form.client.id : ""}
            onChange={handleChangeSelect}
          >
            {clients && clients.map((option: Client) => (
              <MenuItem key={option.id} value={option.id}>
                {option.name}
              </MenuItem>
            ))}
          </TextField>
          <DatePicker
            label="Fecha de Inicio"
            value={form.startDate}
            onChange={(date) => handleDateChange("startDate", date)}
          />
          <DatePicker
            label="Fecha de Fin"
            value={form.endDate}
            onChange={(date) => handleDateChange("endDate", date)}
          />
          {!isDateRangeValid && (
            <p style={{ color: "red" }}>
              El periodo de préstamo no puede ser mayor a 14 días.
            </p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={props.closeModal}>Cancelar</Button>
          <Button
            onClick={() =>
              props.create({
                id: "",
                game: form.game,
                client: form.client,
                startDate: form.startDate,
                endDate: form.endDate,
              })
            }
            disabled={!isFormValid}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
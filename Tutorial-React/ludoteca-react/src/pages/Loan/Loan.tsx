import { useEffect, useState, useContext } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import TableHead from "@mui/material/TableHead";
import Table from "@mui/material/Table";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import MenuItem from "@mui/material/MenuItem";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import styles from "./Loan.module.css";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import CreateLoan from "./components/CreateLoan";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { useAppDispatch } from "../../redux/hooks";
import { setMessage } from "../../redux/features/messageSlice";
import { BackError } from "../../types/appTypes";
import { Loan as LoanModel} from "../../types/Loan";
import {
  useGetLoansQuery,
  useDeleteLoanMutation,
  useCreateLoanMutation,
  useGetAllGamesQuery,
  useGetClientsQuery,
} from "../../redux/services/ludotecaApi";
import { LoaderContext } from "../../context/LoaderProvider";
import dayjs, { Dayjs } from "dayjs";
import { Game } from "../../types/Game";
import { Client } from "../../types/Client";

export const Loan = () => {
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loans, setLoans] = useState<LoanModel[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [idToDelete, setIdToDelete] = useState("");

  const [loanToUpdate] = useState<LoanModel | null>(null);
  const dispatch = useAppDispatch();
  const loader = useContext(LoaderContext);
  const [filterGame, setFilterGame] = useState("");
  const [filterClient, setFilterClient] = useState("");
  const [filterDate, setFilterDate] = useState<Dayjs|null>(null);

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPageNumber(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageNumber(0);
    setPageSize(parseInt(event.target.value, 10));
  };

  const { data, error, isLoading, isFetching} = useGetLoansQuery({
    pageNumber,
    pageSize,
    idGame: filterGame,
    idClient : filterClient,
    date : filterDate? filterDate.toISOString():undefined,
  });

  const { data: games } = useGetAllGamesQuery(null);
  const { data: clients } = useGetClientsQuery(null);

  const [deleteLoanApi, { isLoading: isLoadingDelete, error: errorDelete }] =
    useDeleteLoanMutation();

  const [createLoanApi, { isLoading: isLoadingCreate }] = useCreateLoanMutation();

  useEffect(() => {
    loader.showLoading(isLoading || isLoadingCreate || isLoadingDelete || isFetching);
  }, [isLoading, isLoadingCreate, isLoadingDelete, isFetching, loader]);

  useEffect(() => {
    if (data) {
      setLoans(data.content);
      setTotal(data.totalElements);
    }
  }, [data]);

  useEffect(() => {
    if (errorDelete) {
      if ("status" in errorDelete) {
        dispatch(
          setMessage({
            text: (errorDelete?.data as BackError).msg,
            type: "error",
          })
        );
      }
    }
  }, [errorDelete, dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(setMessage({ text: "Se ha producido un error", type: "error" }));
    }
  }, [error, dispatch]);

  const createLoan = (loan: LoanModel) => {
    setOpenCreate(false);
    createLoanApi(loan)
      .then(() => {
        dispatch(
          setMessage({ text: "Préstamo creado correctamente", type: "ok" })
        );
      })
      .catch((err) => console.log(err));
  };

  const deleteLoan = () => {
    deleteLoanApi(idToDelete)
      .then(() => {
        setIdToDelete("");
        dispatch(
          setMessage({ text: "Préstamo eliminado correctamente", type: "ok" })
        );
      })
      .catch((err) => console.log(err));
  };

  
  return (
    <div className="container">
      <h1>Listado de Préstamos</h1>
      <div className={styles.filter}>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id="game"
            select
            label="Juego"
            defaultValue="''"
            fullWidth
            variant="standard"
            name="game"
            value={filterGame}
            onChange={(event) => setFilterGame(event.target.value)}
          >
            {games &&
              games.map((option: Game) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.title}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>
        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <TextField
            id="client"
            select
            label="Cliente"
            defaultValue="''"
            fullWidth
            variant="standard"
            name="client"
            value={filterClient}
            onChange={(event) => setFilterClient(event.target.value)}
          >
            {clients &&
              clients.map((option: Client) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.name}
                </MenuItem>
              ))}
          </TextField>
        </FormControl>

        <FormControl variant="standard" sx={{ m: 1, minWidth: 220 }}>
          <DatePicker
            label="Fecha"
            value={filterDate}
            onChange={(date) => setFilterDate(date)}
          />
        </FormControl>

        <Button
          variant="outlined"
          onClick={() => {
            setFilterGame("");
            setFilterClient("");
            setFilterDate(null);
          }}
        >
          Limpiar
        </Button>
      </div>



      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
          <TableHead
            sx={{
              "& th": {
                backgroundColor: "lightgrey",
              },
            }}
          >
            <TableRow>
              <TableCell>Identificador</TableCell>
              <TableCell>Juego</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Fecha Inicio</TableCell>
              <TableCell>Fecha Fin</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loans.map((loan: LoanModel) => (
              <TableRow key={loan.id}>
                <TableCell component="th" scope="row">
                  {loan.id}
                </TableCell>
                <TableCell>{loan.game?.title}</TableCell>
                <TableCell>{loan.client?.name}</TableCell>
                <TableCell>{dayjs(loan.startDate).toLocaleString()}</TableCell>
                <TableCell>{dayjs(loan.endDate).toLocaleString()}</TableCell>
                <TableCell align="right">
                  <IconButton
                    aria-label="delete"
                    color="error"
                    onClick={() => {
                      setIdToDelete(loan.id);
                    }}
                  >
                    <ClearIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={6}
                count={total}
                rowsPerPage={pageSize}
                page={pageNumber}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <div className="newButton">
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Nuevo Préstamo
        </Button>
      </div>
      {openCreate && (
        <CreateLoan
          create={createLoan}
          loan={loanToUpdate}
          closeModal={() => setOpenCreate(false)}
        />
      )}
      {!!idToDelete && (
        <ConfirmDialog
          title="Eliminar Préstamo"
          text="Atención si borra el préstamo se perderán sus datos. ¿Desea eliminar el préstamo?"
          confirm={deleteLoan}
          closeModal={() => setIdToDelete("")}
        />
      )}
    </div>
  );
};

import {
  index,
  store,
  update,
  destroy,
  change,
} from "../../../store/actions/notes.action";
import { changeScreenC } from "../../../store/actions/navigation.action";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CircularProgress,
  TextField,
  Avatar,
} from "@material-ui/core";
import { MdKeyboardBackspace, MdClose, MdSave, MdSend } from "react-icons/md";
import { FcOpenedFolder } from "react-icons/fc";

import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { zonedTimeToUtc } from 'date-fns-tz';

import "./style.modules.css";

export default function Notes(props) {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notesReducer.notes);
  const note = useSelector((state) => state.notesReducer.note);
  const theme = useTheme();

  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [query, setQuery] = useState({
    uid: props.uid ? props.uid : null,
    type: props.type ? props.type : null,
    page: 1,
  });

  const [state, setState] = useState({
    isDeleted: null,
    isEdited: null,
    isLoading: false,
    menuEl: null,
    confirmEl: null,
  });

  useEffect(() => {
    _index(isLoadingMore);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const _index = (loadMore) => {
    dispatch(index(query, loadMore)).then((res) => {
      setLoading(false);
      setIsLoadingMore(false);
    });
  };

  const _store = () => {
    setState({ isLoading: true });
    let data = {
      uid: query.uid,
      type: query.type,
    };

    dispatch(store({ ...data, ...note })).then((res) => {
      if (res) {
        dispatch(change("clear"));
        setState({ isLoading: false });
        document.getElementById("scroll").scroll({
          top: 0,
          behavior: "smooth",
        });
      }
    });
  };

  const _update = () => {
    setState({ isLoading: true });
    dispatch(update(note)).then((res) => {
      if (res) {
        dispatch(change("clear"));
        setState({ isLoading: false, isEdited: null });
      }
    });
  };

  return (
    <>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            onClick={() => dispatch(changeScreenC({ open: false }))}
            edge="start"
            color="inherit"
          >
            <MdKeyboardBackspace />
          </IconButton>

          <Typography variant="h6" color="inherit">
            Notas
          </Typography>
        </Toolbar>
      </AppBar>

      <div id="scroll" className="scroll-form notes">
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            <CircularProgress />
          </div>
        ) : (
          <>
            {notes.data.length > 0 && (
              <div className="card-body">
                <h6 className="m-0">
                  {notes.total}{" "}
                  {notes.total > 1 ? "notas encontradas" : "nota encontrada"}
                </h6>
              </div>
            )}

            {notes.data.length < 1 && (
              <div className="text-center mt-5 mb-5 pt-5 pb-5">
                <span className="mt-4 text-muted">
                  <FcOpenedFolder size="70" />
                  <h6 className="mt-4 text-muted">Nenhuma nota encontrada</h6>
                </span>
              </div>
            )}

            {notes.data.map((item, index) => (
              <Fragment key={index}>
                <div
                  className={
                    state.isEdited === item.id || state.isDeleted === item.id
                      ? "bg-selected"
                      : ""
                  }
                >
                  <div className="card-body d-flex align-items-center">
                    <div className="d-none d-md-block">
                      <Avatar className="bg-primary mr-4">
                        {item.user.name.slice(0, 1)}
                      </Avatar>
                    </div>

                    <div>
                      <div className="alert alert-secondary mr-4 mb-1">
                        {item.content}
                      </div>
                      <small>{format(zonedTimeToUtc(item.updated_at, 'America/Sao_Paulo'), "'Dia' dd 'de' MMMM', às ' HH:mm'h", { locale: pt })} por {item.user.name}</small>
                    </div>
                  </div>
                </div>
              </Fragment>
            ))}

            <div className="form">
              <TextField
                autoFocus
                multiline
                placeholder="Digite uma nota"
                value={note.content || ""}
                onChange={(text) =>
                  dispatch(change({ content: text.target.value }))
                }
              />

              <div className="send">
                {state.isLoading ? (
                  <CircularProgress />
                ) : (
                  <>
                    {state.isEdited ? (
                      <>
                        <IconButton
                          onClick={() => {
                            dispatch(change("clear"));
                            setState({ isEdited: null });
                          }}
                        >
                          <MdClose />
                        </IconButton>

                        <IconButton onClick={() => note.content && _update()}>
                          <MdSave
                            color={note.content && theme.palette.secondary.main}
                          />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton onClick={() => note.content && _store()}>
                        <MdSend
                          color={note.content && theme.palette.secondary.main}
                        />
                      </IconButton>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

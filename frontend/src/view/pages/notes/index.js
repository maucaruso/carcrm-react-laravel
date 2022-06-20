import { forwardRef, Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Menu,
  MenuItem,
  Slide,
  Fade,
} from "@material-ui/core";
import { MdKeyboardBackspace, MdClose, MdSave, MdSend } from "react-icons/md";
import { FaEllipsisV, FaTrash, FaPencilAlt } from "react-icons/fa";
import { FcOpenedFolder } from "react-icons/fc";

import { useTheme } from "@material-ui/core/styles";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { zonedTimeToUtc } from "date-fns-tz";
import { Confirm } from "../../components";
import { SCROOL } from "../../../config/App";

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
    const scrollEl = document.getElementById("scroll");

    scrollEl.addEventListener("scroll", handleScroll);
    
    return () => {
      scrollEl.removeEventListener("scroll", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, isLoadingMore]);

  useEffect(() => {
    _index(isLoadingMore);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    if (isLoadingMore) {
      setQuery({
        ...query,
        page: query.page + 1,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore]);

  const handleScroll = (event) => {
    let scrollTop =
      event.srcElement.scrollHeight -
      (event.srcElement.offsetHeight + event.srcElement.scrollTop);

    if (scrollTop < SCROOL) {
      if (!isLoadingMore && _handleLoadMore());
    }
  };

  const _handleLoadMore = () => {
    if (notes.current_page < notes.last_page) {
      setIsLoadingMore(true);
    }
  };

  const _handleMenu = (event) => {
    setState({ menuEl: event.currentTarget });
  };

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

  const _edit = (item) => {
    setState({ isEdited: item.id, menuEl: null });
    dispatch(change(item));
  };

  const _update = () => {
    setState({ isLoading: true });
    dispatch(update(note)).then(() => {
      dispatch(change("clear"));
      setState({ isLoading: false, isEdited: null });
    });
  };

  const _destroy = (id) => {
    setState({ isDeleted: id, menuEl: null });
    dispatch(destroy(id)).then((res) => res && setState({ isDeleted: null }));
  };

  const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
  });

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
                      <small>
                        {format(
                          zonedTimeToUtc(item.updated_at, "America/Sao_Paulo"),
                          "'Dia' dd 'de' MMMM', às ' HH:mm'h",
                          { locale: pt }
                        )}{" "}
                        por {item.user.name}
                      </small>
                    </div>

                    <div className="ml-auto">
                      {state.isDeleted === item.id ? (
                        <CircularProgress className="mr-2" color="secondary" />
                      ) : (
                        <>
                          <div>
                            <IconButton id={index} onClick={_handleMenu}>
                              <FaEllipsisV />
                            </IconButton>
                          </div>

                          {Boolean(state.menuEl) && (
                            <Menu
                              anchorEl={state.menuEl}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "right",
                              }}
                              TransitionComponent={
                                window.innerWidth < 577 ? Transition : Fade
                              }
                              open={index === parseInt(state.menuEl.id)}
                              onClose={() => setState({ menuEl: null })}
                            >
                              <MenuItem onClick={() => _edit(item)}>
                                <FaPencilAlt size="1.2em" className="mr-4" />{" "}
                                Editar
                              </MenuItem>

                              <MenuItem
                                onClick={() => setState({ confirmEl: item.id })}
                              >
                                <FaTrash size="1.2em" className="mr-4" /> Apagar
                              </MenuItem>
                            </Menu>
                          )}

                          {state.confirmEl && (
                            <Confirm
                              open={item.id === state.confirmEl}
                              onConfirm={() => _destroy(item.id)}
                              onClose={() => setState({ confirmEl: null })}
                            />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <hr className="m-0" />
              </Fragment>
            ))}

            {isLoadingMore && (
              <div className="text-center card-body">
                <CircularProgress />
              </div>
            )}

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

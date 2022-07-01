import {
  AppBar,
  Fab,
  IconButton,
  Slide,
  Fade,
  Toolbar,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Divider,
  Menu,
  MenuItem,
} from "@material-ui/core";
import React, { forwardRef, useEffect, useState } from "react";
import {
  FaCar,
  FaClipboard,
  FaPencilAlt,
  FaPlus,
  FaTrash,
} from "react-icons/fa";
import { MdKeyboardBackspace, MdMoreHoriz } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { index, destroy } from "../../../store/actions/owners.action";
import {
  changeScreenA,
  changeScreenB,
  changeScreenC,
} from "../../../store/actions/navigation.action";
import { SCROOL } from "../../../config/App";

import "./style.modules.css";
import { FcOpenedFolder } from "react-icons/fc";
import { Confirm } from "../../components";

export default function Owners() {
  const dispatch = useDispatch();
  const owners = useSelector((state) => state.ownersReducer.owners);

  const [isLoading, setLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [query, setQuery] = useState({
    page: 1,
  });

  const [state, setState] = useState({
    isDeleted: null,
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
  }, [owners, isLoadingMore]);

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
    if (owners.current_page < owners.last_page) {
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

  const _create = () => {
    dispatch(
      changeScreenB({
        open: true,
        type: "owner-edit",
        props: {},
      })
    );
  };

  const _destroy = (id) => {
    setState({ isDeleted: id, menuEl: null });
    dispatch(destroy(id)).then((res) => res && setState({ isDeleted: null }));
  };

  const _edit = (id) => {
    setState({ menuEl: null });
    dispatch(
      changeScreenB({
        open: true,
        type: "owner-edit",
        props: {
          uid: id,
        },
      })
    );
  };

  const _show = (item) => {
    setState({ menuEl: null });
    dispatch(
      changeScreenB({
        open: true,
        type: "owner-show",
        props: {
          item,
        },
      })
    );
  };

  const _notes = (id) => {
    setState({ menuEl: null });
    dispatch(
      changeScreenC({
        open: true,
        type: "notes",
        props: {
          type: "owners",
          uid: id,
        },
      })
    );
  };

  const Transition = forwardRef((props, ref) => {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  return (
    <>
      <AppBar position="absolute">
        <Toolbar>
          <IconButton
            onClick={() => dispatch(changeScreenA({ open: false }))}
            edge="start"
            color="inherit"
          >
            <MdKeyboardBackspace />
          </IconButton>

          <Typography variant="h6" color="inherit">
            Proprietários
          </Typography>
        </Toolbar>
      </AppBar>

      <div id="scroll" className="scroll">
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            <CircularProgress />
          </div>
        ) : (
          <>
            {owners.data.length > 0 && (
              <div className="card-body">
                <h6 className="m-0">
                  {owners.total}{" "}
                  {owners.total > 1
                    ? "proprietários encontrados"
                    : "proprietário encontrado"}
                </h6>
              </div>
            )}

            {owners.data.length < 1 && (
              <div className="text-center mt-5 mb-5 pt-5 pb-5">
                <span className="mt-4 text-muted">
                  <FcOpenedFolder size="70" />
                  <h6 className="mt-4 text-muted">
                    Nenhum proprietário encontrado
                  </h6>
                </span>
              </div>
            )}

            <List>
              {owners.data.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button selected={state.isDeleted === item.id}>
                    <ListItemAvatar onClick={() => _show(item)}>
                      <Avatar className="bg-primary">
                        {item.name.slice(0, 1)}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText onClick={() => _show(item)} className="pb-3 pt-3" primary={item.name} />

                    {state.isDeleted === item.id && (
                      <CircularProgress color="secondary" className="mr-2" />
                    )}

                    {!state.isDeleted && (
                      <div>
                        <div>
                          <IconButton id={index} onClick={_handleMenu}>
                            <MdMoreHoriz />
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
                            <MenuItem onClick={() => _notes(item.id)}>
                              <FaClipboard size="1.2em" className="mr-4" />{" "}
                              Notas
                            </MenuItem>

                            <MenuItem>
                              <FaCar size="1.2em" className="mr-4" /> Veículos
                            </MenuItem>

                            <Divider />

                            <MenuItem onClick={() => _edit(item.id)}>
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
                      </div>
                    )}
                  </ListItem>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </>
        )}

        <Fab
          onClick={() => _create()}
          className="fab-bottom-right mr-3 mb-3"
          color="primary"
        >
          <FaPlus />
        </Fab>
      </div>
    </>
  );
}

import {
  AppBar,
  Avatar,
  CircularProgress,
  Divider,
  Fab,
  Fade,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Slide,
  Toolbar,
  Typography,
} from "@material-ui/core";
import React, { forwardRef, useEffect, useState } from "react";
import { FaCar, FaClipboard, FaPencilAlt, FaPlus, FaTrash } from "react-icons/fa";
import { FcOpenedFolder } from "react-icons/fc";
import {
  MdKeyboardBackspace,
  MdLocationOn,
  MdMoreHoriz,
  MdPersonAdd,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  changeScreenA,
  changeScreenB,
} from "../../../../store/actions/navigation.action";
import { destroy, index } from "../../../../store/actions/units.action";
import { Confirm } from "../../../components";

export default function Units() {
  const dispatch = useDispatch();
  const units = useSelector((state) => state.unitsReducer.units);

  const [isLoading, setLoading] = useState(true);

  const [state, setState] = useState({
    isDeleted: null,
    menuEl: null,
    confirmEl: null,
  });

  useEffect(() => {
    dispatch(index()).then(res => res && setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _create = () => {
    dispatch(
      changeScreenB({
        open: true,
        type: "unit-edit",
        props: {},
      })
    );
  };

  const _edit = (id) => {
    setState({ menuEl: null });
    dispatch(
      changeScreenB({
        open: true,
        type: "unit-edit",
        props: {
          uid: id,
        },
      })
    );
  };

  const _destroy = (id) => {
    setState({ isDeleted: id, menuEl: null });
    dispatch(destroy(id)).then((res) => res && setState({ isDeleted: null }));
  };

  const _handleMenu = (event) => {
    setState({ menuEl: event.currentTarget });
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
            Unidades e telefones
          </Typography>
        </Toolbar>
      </AppBar>

      <div className="scroll">
        {isLoading ? (
          <div className="d-flex justify-content-center mt-5 pt-5">
            <CircularProgress />
          </div>
        ) : (
          <>
            {units.length > 0 && (
              <div className="card-body">
                <h6 className="m-0">
                  {units.length}{" "}
                  {units.length > 1
                    ? "proprietários encontrados"
                    : "proprietário encontrado"}
                </h6>
              </div>
            )}

            {units.length < 1 && (
              <div className="text-center mt-5 mb-5 pt-5 pb-5">
                <span className="mt-4 text-muted">
                  <FcOpenedFolder size="70" />
                  <h6 className="mt-4 text-muted">
                    Nenhuma unidade encontrada
                  </h6>
                </span>
              </div>
            )}

            <List>
              {units.map((item, index) => (
                <React.Fragment key={index}>
                  <ListItem button selected={state.isDeleted === item.id}>
                    <ListItemAvatar>
                      <Avatar>
                        <MdLocationOn />
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      className="pb-3 pt-3"
                      primary={item.neighborhood}
                    />

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

            <Fab
              onClick={() => _create()}
              className="fab-bottom-right mr-3 mb-3"
              color="primary"
            >
              <FaPlus />
            </Fab>
          </>
        )}
      </div>
    </>
  );
}

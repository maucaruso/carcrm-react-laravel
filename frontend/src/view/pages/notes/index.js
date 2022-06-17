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
} from "@material-ui/core";
import { MdKeyboardBackspace } from "react-icons/md";
import { FcOpenedFolder } from 'react-icons/fc';

import { useTheme } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import './style.modules.css';

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
            {(notes.data.length > 0) &&
              <div className="card-body">
                <h6 className="m-0">
                  {notes.total} {(notes.total > 1) ? 'notas encontradas' : 'nota encontrada'}
                </h6>
              </div>
            }
            
            {(notes.data.length < 1) &&
              <div className="text-center mt-5 mb-5 pt-5 pb-5">
                <h6 className="mt-4 text-muted">
                  <FcOpenedFolder size="70" />
                  <h6 className="mt-4 text-muted">Nenhuma nota encontrada</h6>
                </h6>
              </div>
            }
          </>
        )}
      </div>
    </>
  );
}

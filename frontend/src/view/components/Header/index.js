import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { index } from "../../../store/actions/app.action";

import {
  MenuList,
  MenuItem,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from "@material-ui/core";
import {
  FaCar,
  FaUsers,
  FaLaptop,
  FaCreditCard,
  FaWhatsapp,
  FaSignOutAlt,
  FaAngleUp,
  FaAngleDown,
} from "react-icons/fa";
import { MdMenu } from "react-icons/md";
import { useDispatch } from "react-redux";
import { changeScreenA } from "../../../store/actions/navigation.action";

import "./style.modules.css";

export default function Header(props) {
  const dispatch = useDispatch();

  const [mobile, setMobile] = useState(window.innerWidth < 577 ? true : false);

  const [state, setState] = useState({
    open: false,
  });

  const [collapse, setCollapse] = useState({
    site: false,
    financeiro: false,
  });

  useEffect(() => {
    dispatch(index());
    window.addEventListener("resize", _resize);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _resize = () => {
    setMobile(window.innerWidth < 577 ? true : false);
  };

  const handlePage = (page) => {
    dispatch(
      changeScreenA({
        open: true,
        type: page,
        props: {},
      })
    );
    setState({ open: false });
  };

  return (
    <>
      {mobile ? (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              onClick={() => setState({ open: true })}
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MdMenu />
            </IconButton>
            <Typography variant="h6">{props.title}</Typography>
            {props.button}
          </Toolbar>
        </AppBar>
      ) : (
        <div className="header navbar navbar-expand-lg navbar-light bg-white p-0">
          <div className="container">
            <Link className="navbar-brand" to="/">
              <img src="/logo.png" alt="Car CRM" height="37" />
            </Link>

            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link" to="/vehicles">
                  <FaCar className="icon-lg mr-2" /> Ve??culos
                </Link>
              </li>

              <li className="nav-item">
                <button
                  onClick={() => handlePage("owners")}
                  className="nav-link bg-transparent"
                  to="/vehicles"
                >
                  <FaUsers className="icon-lg mr-2" /> Propriet??rios
                </button>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  data-toggle="dropdown"
                >
                  <FaLaptop className="icon-lg mr-2" /> Site
                </Link>

                <MenuList className="dropdown-menu">
                  <MenuItem
                    className="dropdown-item"
                    onClick={() => handlePage("seo")}
                  >
                    Otimiza????o para o Google
                  </MenuItem>

                  <MenuItem
                    className="dropdown-item"
                    onClick={() => handlePage("units")}
                  >
                    Unidades e Telefones
                  </MenuItem>

                  <MenuItem
                    className="dropdown-item"
                    onClick={() => handlePage("logo")}
                  >
                    Minha Logo
                  </MenuItem>

                  <MenuItem
                    className="dropdown-item"
                    onClick={() => handlePage("domain")}
                  >
                    Dom??nio
                  </MenuItem>

                  <MenuItem className="dropdown-item" onClick={() => handlePage("settings")}>Configura????es</MenuItem>
                </MenuList>
              </li>

              <li className="nav-item dropdown">
                <Link
                  className="nav-link dropdown-toggle"
                  to="#"
                  data-toggle="dropdown"
                >
                  <FaCreditCard className="icon-lg mr-2" /> Financeiro
                </Link>

                <MenuList className="dropdown-menu">
                  <MenuItem 
                    className="dropdown-item"
                    component={Link}
                    to="/pay"
                  >Meu plano</MenuItem>

                  <MenuItem
                    component={Link}
                    to="/transactions"
                    className="dropdown-item"
                  >
                    Minhas transa????es
                  </MenuItem>
                </MenuList>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <FaWhatsapp className="icon-lg mr-2" /> Ajuda
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  <FaSignOutAlt className="icon-lg mr-2" /> Sair
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}

      <Drawer
        anchor="left"
        open={state.open}
        onClose={() => setState({ open: false })}
      >
        <div style={{ width: 320, maxWidth: window.innerWidth - 70 }}>
          <List omponent="nav" className="menu-mobile">
            <ListItem>
              <img
                className="img-fluid logo-mobile"
                src="/logo.png"
                alt="Car CRM"
                height="37"
              />
            </ListItem>

            <ListItem>test@gmail.com</ListItem>

            <Divider className="mt-2 mb-2" />

            <ListItem
              to="/vehicles"
              component={Link}
              onClick={() => setState({ open: false })}
            >
              <ListItemIcon>
                <FaCar />
              </ListItemIcon>
              <ListItemText primary="Ve??culos" />
            </ListItem>

            <Divider className="mt-2 mb-2" />

            <ListItem onClick={() => handlePage("owners")}>
              <ListItemIcon>
                <FaUsers />
              </ListItemIcon>
              <ListItemText primary="Propriet??rios" />
            </ListItem>

            <Divider className="mt-2 mb-2" />

            <ListItem
              button
              onClick={() => setCollapse({ site: !collapse.site })}
            >
              <ListItemIcon>
                <FaLaptop />
              </ListItemIcon>
              <ListItemText primary="Site" />
              {collapse.site ? <FaAngleUp /> : <FaAngleDown />}
            </ListItem>

            <Collapse in={collapse.site} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem onClick={() => handlePage("seo")}>
                  <ListItemText
                    className="pl-3"
                    primary="Otimiza????o para o Google"
                  />
                </ListItem>

                <ListItem onClick={() => handlePage("units")}>
                  <ListItemText
                    className="pl-3"
                    primary="Unidades e Telefones"
                  />
                </ListItem>

                <ListItem onClick={() => handlePage("logo")}>
                  <ListItemText className="pl-3" primary="Minha logo" />
                </ListItem>

                <ListItem onClick={() => handlePage("domain")}>
                  <ListItemText className="pl-3" primary="Dom??nio" />
                </ListItem>

                <ListItem onClick={() => handlePage("settings")}>
                  <ListItemText className="pl-3" primary="Configura????es" />
                </ListItem>
              </List>
            </Collapse>

            <Divider className="mt-2 mb-2" />

            <ListItem
              button
              onClick={() => setCollapse({ financeiro: !collapse.financeiro })}
            >
              <ListItemIcon>
                <FaCreditCard />
              </ListItemIcon>
              <ListItemText primary="Financeiro" />
              {collapse.financeiro ? <FaAngleUp /> : <FaAngleDown />}
            </ListItem>

            <Collapse in={collapse.financeiro} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem
                  component={Link}
                  to="/pay"
                  onClick={() => setState({ open: false })}
                >
                  <ListItemText className="pl-3" primary="Meu plano" />
                </ListItem>

                <ListItem
                  component={Link}
                  to="/transactions"
                  onClick={() => setState({ open: false })}
                >
                  <ListItemText className="pl-3" primary="Minhas transa????es" />
                </ListItem>
              </List>
            </Collapse>

            <Divider className="mt-2 mb-2" />

            <ListItem>
              <ListItemIcon>
                <FaWhatsapp />
              </ListItemIcon>
              <ListItemText primary="Ajuda" />
            </ListItem>

            <Divider className="mt-2 mb-2" />

            <ListItem>
              <ListItemIcon>
                <FaSignOutAlt />
              </ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

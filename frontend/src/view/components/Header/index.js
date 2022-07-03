import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
    window.addEventListener("resize", _resize);
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
                  <FaCar className="icon-lg mr-2" /> Veículos
                </Link>
              </li>

              <li className="nav-item">
                <button
                  onClick={() => handlePage("owners")}
                  className="nav-link bg-transparent"
                  to="/vehicles"
                >
                  <FaUsers className="icon-lg mr-2" /> Proprietários
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
                  <MenuItem className="dropdown-item">
                    Otimização para o Google
                  </MenuItem>

                  <MenuItem className="dropdown-item">
                    Unidades e Telefones
                  </MenuItem>

                  <MenuItem className="dropdown-item">Minha Logo</MenuItem>

                  <MenuItem className="dropdown-item">Domínio</MenuItem>

                  <MenuItem className="dropdown-item">Configurações</MenuItem>
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
                  <MenuItem className="dropdown-item">Meu plano</MenuItem>

                  <MenuItem className="dropdown-item">
                    Minhas transações
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
              <ListItemText primary="Veículos" />
            </ListItem>

            <Divider className="mt-2 mb-2" />

            <ListItem onClick={() => handlePage("owners")}>
              <ListItemIcon>
                <FaUsers />
              </ListItemIcon>
              <ListItemText primary="Proprietários" />
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
                <ListItem>
                  <ListItemText
                    className="pl-3"
                    primary="Otimização para o Google"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText
                    className="pl-3"
                    primary="Unidades e Telefones"
                  />
                </ListItem>

                <ListItem>
                  <ListItemText className="pl-3" primary="Minha logo" />
                </ListItem>

                <ListItem>
                  <ListItemText className="pl-3" primary="Domínio" />
                </ListItem>

                <ListItem>
                  <ListItemText className="pl-3" primary="Configurações" />
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
                <ListItem>
                  <ListItemText className="pl-3" primary="Meu plano" />
                </ListItem>

                <ListItem>
                  <ListItemText className="pl-3" primary="Minhas transações" />
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

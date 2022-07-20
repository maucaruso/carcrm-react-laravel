import { List, ListItem, ListItemIcon, ListItemText } from "@material-ui/core";
import { FaCar, FaCheck, FaGlobe } from "react-icons/fa";
import { MdCloudUpload, MdLocationOn } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { changeScreenA } from "../../../store/actions/navigation.action";
import Header from "../../components/Header";
import './style.modules.css';

export default function Steps() {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.appReducer.app);

  const handlePage = (page) => {
    dispatch(
      changeScreenA({
        open: true,
        type: page,
        props: {},
      })
    );
  };

  return (
    <>
      <Header title="Etapas" />
      
      <div className="container mt-4 pt-3">
        <h3 className="font-weight-normal mb-4">Olá, bem vindo</h3>
        
        <div className="card">
          <div className="card-body pt-5 pb-5">
            <div className="row">
              <div className="col-md-6">
                <h5>Preparamos alguns passos para você deixar seu site do seu jeito</h5>
                
                <List component="nav">
                  <ListItem button>
                    <ListItemIcon>
                      <FaCheck className="text-success" />
                    </ListItemIcon>
                    
                    <ListItemText className="disabled" primary="Criar conta" />
                  </ListItem>
                  
                  <ListItem button onClick={() => handlePage('units')}>
                    <ListItemIcon>
                      {(app.unit) ? <FaCheck className="text-success" /> : <MdLocationOn />}
                    </ListItemIcon>
                    
                    <ListItemText className={(app.unit) && 'disabled'} primary="Unidades e telefones" />
                  </ListItem>
                  
                  <ListItem button onClick={() => handlePage('logo')}>
                    <ListItemIcon>
                      {(app.logo) ? <FaCheck className="text-success" /> : <MdCloudUpload />}
                    </ListItemIcon>
                    
                    <ListItemText className={(app.logo) && 'disabled'} primary="Logo" />
                  </ListItem>
                  
                  <ListItem button onClick={() => handlePage('domain')}>
                    <ListItemIcon>
                      {(app.domain || app.subdomain) ? <FaCheck className="text-success" /> : <FaGlobe />}
                    </ListItemIcon>
                    
                    <ListItemText className={(app.domain || app.subdomain) && 'disabled'} primary="Configurar domínio" />
                  </ListItem>
                  
                  <ListItem button component={Link} to="/vehicles">
                    <ListItemIcon>
                      {(app.vehicle) ? <FaCheck className="text-success" /> : <FaCar />}
                    </ListItemIcon>
                    
                    <ListItemText className={(app.vehicle) && 'disabled'} primary="Cadastre seu primeiro veículo" />
                  </ListItem>
                </List>
              </div>
              
              <div className="col-md-6 text-center">
                <img src="/site.png" alt="" className="img-fluid" />
                <h5 className="mt-5">Complete o passo a passo ao lado</h5>
                <h6>E seu site estará pronto para uso.</h6>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

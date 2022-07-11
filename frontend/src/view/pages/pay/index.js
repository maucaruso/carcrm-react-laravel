import { useDispatch, useSelector } from "react-redux";
import Account from "./account";
import Cart from "./cart";
import Plans from "./plans";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

export default function Pay() {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.appReducer.app);
  const plan = useSelector((state) => state.payReducer.plan);
  const [title, setTitle] = useState();

  useEffect(() => {
    if (app.status === 0 || app.status === 1) {
      setTitle(Object.keys(plan).length === 0 ? 'Planos' : 'Pagamento');
    } 
    
    if (app.status === 2) {
      setTitle('Minha conta');
    }  
  }, [app, plan]);
  
  return (
    <>
      <Header title={title} />

      {(app.status === 0 || app.status === 1) &&
        <>
         {Object.keys(plan).length === 0 ? <Plans /> : <Cart />}
        </>
      }

      {app.status === 2 && <Account />}
    </>
  );
}

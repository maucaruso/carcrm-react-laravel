import { useEffect, useState } from "react";
import { MP_PUBLIC_KEY } from "../../../config/App";
import { useDispatch, useSelector } from "react-redux";
import { InputAdornment, TextField } from "@material-ui/core";
import MaskedInput from "react-text-mask";
import { MdCreditCard } from "react-icons/md";

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;
  let mask = [];

  if (props.id === "cardNumber") {
    mask = [
      /[0-9]/,
      /\d/,
      /\d/,
      /\d/,
      ' ',
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }
  
  if (props.id === "cardExpiration") {
    mask = [/[0-9]/, /\d/, '/', /\d/, /\d/];
  }
  
  if (props.id === "securityCode") {
    mask = [/[0-9]/, /\d/, /\d/];
  }

  if (props.id === "cpf") {
    mask = [
      /[0-9]/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      ".",
      /\d/,
      /\d/,
      /\d/,
      "-",
      /\d/,
      /\d/,
    ];
  }

  return (
    <MaskedInput
      {...other}
      ref={(ref) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={mask}
      guide={false}
    />
  );
};


export default function Payment() {
  const dispatch = useDispatch();
  const plan = useSelector((state) => state.payReducer.plan);
  const pay_type = useSelector((state) => state.payReducer.pay_type);
  const success = useSelector((state) => state.payReducer.success);
  const error = useSelector((state) => state.payReducer.error);
  
  const [cart, setCart] = useState({});

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://secure.mlstatic.com/sdk/javascript/v1/mercadopago.js";

    script.addEventListener("load", () => {
      // eslint-disable-next-line
      window.Mercadopago.setPublishableKey(MP_PUBLIC_KEY);
    });

    document.body.appendChild(script);

    return () => {
      let iframe = document.querySelector("iframe");
      document.body.removeChild(script);
      document.body.removeChild(iframe);
    };
  }, []);
  
  const setPaymentMethod = (status, response) => {
    if (status === 200) {
      document.getElementById("paymentMethodId").value = response[0].id;
      document.getElementById("secure_thumbnail").src = response[0].secure_thumbnail;
    } else {
      alert(`payment method info error: ${response}`);
    }
  }

  return (
    <form id="pay">
      {(pay_type === 'card') &&
        <div className="row">
          <div className="col-md-8">
            <div className="form-group">
              <label className="label-custom">Número do cartão</label>              
              <TextField
                error={(error.cardNumber) && true}
                id="cardNumber"
                type="tel"
                InputProps={{
                  inputComponent: TextMaskCustom,
                  value: cart.cardNumber,
                  placeholder: "____ ____ ____ ____",
                  inputProps: {
                    'data-checkout': 'cardNumber'
                  },
                  autoComplete: 'off',
                  onChange: text => {
                    setCart({
                      ...cart,
                      cardNumber: text.target.value
                    })
                    if (text.target.value.length >= 7) {
                      window.Mercadopago.getPaymentMethod({
                        "bin": text.target.value.substring(0,7)
                      }, setPaymentMethod)
                    }
                  },
                  startAdornment: (
                    <InputAdornment>
                      <MdCreditCard style={{ fontSize: '1.5rem' }} className="mr-2 text-muted" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment>
                      <img src="" alt="" id="secure_thumbnail" />
                    </InputAdornment>
                  )
                }}
              />
            </div>
          </div>
          
          <input type="hidden" id="paymentMethodId" />
        </div>
      }
    </form>
  );
}

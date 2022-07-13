import { useEffect, useState } from "react";
import { MP_PUBLIC_KEY } from "../../../config/App";
import { useDispatch, useSelector } from "react-redux";
import { Button, InputAdornment, TextField } from "@material-ui/core";
import MaskedInput from "react-text-mask";
import { MdArrowBack, MdCreditCard, MdEmail } from "react-icons/md";
import { change, error as setError } from '../../../store/actions/pay.action';

const TextMaskCustom = (props) => {
  const { inputRef, ...other } = props;
  let mask = [];

  if (props.id === "cardNumber") {
    mask = [
      /[0-9]/,
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
      " ",
      /\d/,
      /\d/,
      /\d/,
      /\d/,
    ];
  }

  if (props.id === "cardExpiration") {
    mask = [/[0-9]/, /\d/, "/", /\d/, /\d/];
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
      document.getElementById("secure_thumbnail").src =
        response[0].secure_thumbnail;
    } else {
      alert(`payment method info error: ${response}`);
    }
  };

  const _cardExpiration = (value) => {
    if (value.length === 5) {
      let cardExpiration = value.split("/");
      setCart({
        ...cart,
        cardExpiration: value,
        cardExpirationMonth: cardExpiration[0],
        cardExpirationYear: cardExpiration[1],
      });
    } else {
      setCart({ ...cart, cardExpiration: value });
    }
  };

  return (
    <form id="pay">
      {pay_type === "card" && (
        <div className="row">
          <div className="col-md-8">
            <div className="form-group">
              <label className="label-custom">Número do cartão</label>
              <TextField
                error={error.cardNumber && true}
                id="cardNumber"
                type="tel"
                InputProps={{
                  inputComponent: TextMaskCustom,
                  value: cart.cardNumber,
                  placeholder: "____ ____ ____ ____",
                  inputProps: {
                    "data-checkout": "cardNumber",
                  },
                  autoComplete: "off",
                  onChange: (text) => {
                    setCart({
                      ...cart,
                      cardNumber: text.target.value,
                    });
                    if (text.target.value.length >= 7) {
                      window.Mercadopago.getPaymentMethod(
                        {
                          bin: text.target.value.substring(0, 7),
                        },
                        setPaymentMethod
                      );
                    }
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <MdCreditCard
                        style={{ fontSize: "1.5rem" }}
                        className="mr-2 text-muted"
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <img src="" alt="" id="secure_thumbnail" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="form-group">
              <label className="label-custom">Vencimento</label>
              <TextField
                error={
                  (error.cardExpirationMonth || error.cardExpirationYear) &&
                  true
                }
                id="cardExpiration"
                type="tel"
                InputProps={{
                  inputComponent: TextMaskCustom,
                  value: cart.cardExpiration,
                  autoComplete: "off",
                  onChange: (text) => _cardExpiration(text.target.value),
                }}
              />
            </div>
          </div>

          <div className="col-md-8 order-1 order-md-0">
            <div className="form-group">
              <label className="label-custom">Nome impresso no cartão</label>
              <TextField
                error={error.cardholderName && true}
                id={"cardholderName"}
                value={cart.cardholderName || ""}
                autoComplete="off"
                inputProps={{
                  "data-checkout": "cardholderName",
                }}
                onChange={(text) =>
                  setCart({ ...cart, cardholderName: text.target.value })
                }
              />
            </div>
          </div>

          <div className="col-6 col-md-4">
            <div className="form-group">
              <label className="label-custom">CVV</label>
              <TextField
                error={error.securityCode}
                id="securityCode"
                InputProps={{
                  inputComponent: TextMaskCustom,
                  value: cart.securityCode,
                  autoComplete: "off",
                  type: "tel",
                  inputProps: { "data-checkout": "securityCode" },
                  onChange: (text) =>
                    setCart({ ...cart, securityCode: text.target.value }),
                  endAdornment: (
                    <InputAdornment position="end">
                      <div className="cvv_info" />
                    </InputAdornment>
                  ),
                }}
              />
            </div>
          </div>

          <input
            type="hidden"
            id="cardExpirationMonth"
            data-checkout="cardExpirationMonth"
            value={cart.cardExpirationMonth || ""}
          />
          <input
            type="hidden"
            id="cardExpirationYear"
            data-checkout="cardExpirationYear"
            value={cart.cardExpirationYear || ""}
          />
          <input type="hidden" id="paymentMethodId" />
        </div>
      )}

      {pay_type !== "card" && (
        <>
          <div className="form-group">
            <label className="label-custom">Nome</label>
            <TextField
              error={error.first_name && true}
              value={cart.first_name || ""}
              autoComplete="off"
              onChange={(text) =>
                setCart({ ...cart, first_name: text.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label className="label-custom">Sobrenome</label>
            <TextField
              error={error.last_name && true}
              value={cart.last_name || ""}
              autoComplete="off"
              onChange={(text) =>
                setCart({ ...cart, last_name: text.target.value })
              }
            />
          </div>
        </>
      )}

      <div className="form-group">
        <label className="label-custom">E-mail</label>
        <TextField
          error={error.email && true}
          value={cart.email || ""}
          autoComplete="off"
          id="email"
          type="email"
          onChange={(text) => setCart({ ...cart, email: text.target.value })}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <MdEmail
                  style={{ fontSize: "1.5rem" }}
                  className="mr-2 text-muted"
                />
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="form-group">
        <label className="label-custom">CPF</label>
        <TextField
          error={error.cpf && true}
          autoComplete="off"
          id="cpf"
          InputProps={{
            inputComponent: TextMaskCustom,
            value: cart.cpf,
            type: "tel",
            placeholder: "___.___.___-__",
            onChange: (text) =>
              setCart({
                ...cart,
                cpf: text.target.value,
                docNumber: text.target.value.replace(/[.-]/g, ""),
              }),
          }}
        />

        <input
          type="hidden"
          id="docNumber"
          data-checkout="docNumber"
          value={cart.docNumber || ""}
        />
        <input type="hidden" id="docType" data-checkout="docType" value="CPF" />
      </div>

      <div className="d-flex">
        <Button
          variant="contained"
          size="large"
          className="mt-4 mb-4 mr-3 font-weight-bold"
          startIcon={<MdArrowBack />}
          onClick={() => {
            dispatch(setError({}))
            dispatch(change({ pay_type: null }))
          }}
        >&nbsp;</Button>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          className="mt-4 mb-4 font-weight-bold"
        >
          Realizar pagamento
        </Button>
      </div>
    </form>
  );
}

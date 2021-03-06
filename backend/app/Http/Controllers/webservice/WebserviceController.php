<?php

namespace App\Http\Controllers\webservice;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Curl;

class WebserviceController extends Controller
{
    public function cep(Request $request)
    {
        $cep = str_replace("-", "", $request->cep);
        $response = Curl::to('viacep.com.br/ws/'.$cep.'/json')->get();

        $response = json_decode($response);

        if (!$response || isset($response->erro)) {
            return json_encode([
                "error" => [
                    "zipCode" => "Não foi possível localizar este cep"
                ]
            ]);
        }

        $data = (object) [
            'uf' => $response->uf,
            'zipCode' => $response->cep,
            'city' => $response->localidade,
            'neighborhood' => $response->bairro,
            'street' => $response->logradouro,
        ];

        return json_encode($data);
    }
}

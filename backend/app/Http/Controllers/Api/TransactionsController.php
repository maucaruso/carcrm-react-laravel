<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transactions;
use Illuminate\Http\Request;

class TransactionsController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth()->guard('api')->user();
    }

    public function index()
    {
        $transactions = Transactions::where('user_id', $this->user->id)->orderBy('id', 'DESC')->paginate(env('APP_PAGINATE'));

        $transactions->transform(function ($transaction) {
            $transaction->status_pt = __('mercadopago.' . $transaction->status);
            $transaction->status_detail = __('mercadopago.' . $transaction->status_detail, [
                'statement_descriptor' => $transaction->description,
                'payment_method_id' => $transaction->payment_method_id
            ]);

            return $transaction;
        });

        return compact('transactions');
    }

    public function show($id)
    {
        $transaction = Transactions::where('user_id', $this->user->id)->where('transaction_id', $id)->first();

        $transaction->status_pt = __('mercadopago.' . $transaction->status);
        $transaction->status_detail = __('mercadopago.' . $transaction->status_detail, [
            'statement_descriptor' => $transaction->description,
            'payment_method_id' => $transaction->payment_method_id
        ]);

        return compact('transaction');
    }
}

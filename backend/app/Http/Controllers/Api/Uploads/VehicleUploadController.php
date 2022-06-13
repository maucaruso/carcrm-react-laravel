<?php

namespace App\Http\Controllers\Api\Uploads;

use App\Http\Controllers\Controller;
use App\Models\Vehicle;
use App\Models\Vehicle_photos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManagerStatic as Image;

class VehicleUploadController extends Controller
{
    protected $user;

    public function __construct()
    {
        $this->user = Auth()->guard('api')->user();
    }

    public function create(Request $request)
    {
        $file = $request->file('file');
        $filename = md5(uniqid(time())) . strrchr($file->getClientOriginalName(), '.');
        $vehicle = Vehicle::where('user_id', $this->user->id)->find($request->id);

        if (!$vehicle) {
            return response()->json(['error' => 'Veículo não encontrado']);
        }

        if ($request->hasFile('file') && $file->isValid()) {

            $photo = Vehicle_photos::create([
                'user_id' => $this->user->id,
                'vehicle_id' => $request->id,
                'img' => $filename
            ]);

            if ($photo->id) {
                $img = Image::make($request->file)->orientate();

                $img->resize(1000, null, function ($constraint) {
                    $constraint->aspectRatio();
                    $constraint->upsize();
                });

                Storage::put('vehicles/'.$this->user->id.'/'.$photo->vehicle_id.'/'.$filename, $img->encode(), 'public');

                return $photo;
            }

            return response()->json(['error' => 'Erro ao cadasrar a imagem']);
        }
    }

    public function update(Request $request)
    {
        foreach ($request->order as $order => $id) {
            $position = Vehicle_photos::where('user_id', $this->user->id)->find($id);
            $position->order = $order;
            $position->save();
        }

        return response()->json(['success' => 'Posições atualizadas com sucesso']);
    }

    public function destroy($id)
    {
        $photo = Vehicle_photos::where('user_id', $this->user->id)->find($id);

        if ($photo->id) {
            $path = 'vehicles/'.$this->user->id.'/'.$photo->vehicle_id.'/'.$photo->img;

            if (Storage::exists($path)) {
                Storage::delete($path);
            }

            if ($photo->delete()) {
                return response()->json(['success' => 'Imagem removida com sucesso']);
            }

            return response()->json(['error' => 'Houve um erro ao remover a imagem']);
        }

        return response()->json(['error' => 'Imagem não encontrada']);
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Vehicle, VehiclesIds } from '../../interfaces/vehicle';
import { Dataset } from '../../interfaces/dataset';
@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  constructor(private _httpclient: HttpClient) { }

  getVehiclesIds(dataset: Dataset): Observable<VehiclesIds>{
    let endpoint = `https://api.coxauto-interview.com/api/${dataset.datasetId}/vehicles`;

    return this._httpclient.get<VehiclesIds>(endpoint);

  }

  getVehicleById(dataset: Dataset, vehicleId: number): Observable<Vehicle>{
    let endpoint = `https://api.coxauto-interview.com/api/${dataset.datasetId}/vehicles/${vehicleId}`;

    return this._httpclient.get<Vehicle>(endpoint);
  }
}

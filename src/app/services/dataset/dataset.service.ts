import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dataset } from '../../interfaces/dataset';

@Injectable({
  providedIn: 'root'
})
export class DatasetService {

  constructor(private _httpsClient: HttpClient) { }

  getDatasetId(): Observable<Dataset> {
    let endpoint = 'https://api.coxauto-interview.com/api/datasetId';

    return this._httpsClient.get<Dataset>(endpoint);
  }
}

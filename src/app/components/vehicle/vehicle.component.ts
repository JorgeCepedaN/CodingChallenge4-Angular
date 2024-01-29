import { Component, OnInit } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Vehicle, VehiclesIds } from '../../interfaces/vehicle';
import { VehiclesService } from '../../services/vehicle/vehicle.service';
import { DatasetService } from '../../services/dataset/dataset.service';
import { Dataset } from '../../interfaces/dataset';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { FormBuilder, FormGroup } from '@angular/forms';
import {FormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSortModule, Sort} from '@angular/material/sort';


@Component({
  selector: 'app-vehicle',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, MatButtonModule, MatSortModule],

  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.css'
})
export class VehicleComponent {
  public dataset!: Dataset;
  public vehiclesIds!: VehiclesIds;
  public vehicle!: Vehicle;
  public vehicles: Vehicle [] = [];
  public vehiclesCopy: Vehicle [] = [];
  public isLoading: Boolean = true;
  public searchCriteria!: string;
  public searchCriteriaUpdate = new Subject<string>();



  displayedColumns: string[] = [
    'year',
    'make',
    'model'
  ]
  constructor(
    private _datasetService: DatasetService,
    private _vehiclesService: VehiclesService,
    private _formBuilder: FormBuilder
  ){}
ngOnInit(): void {
    
    this.loadDatasetID();
    this.loadVehiclesIds();
    this.initSearch(); 

  }

  private loadDatasetID(){
    this._datasetService.getDatasetId().subscribe((dataset) => {
      this.dataset = dataset;
    })
  }

  private loadVehiclesIds() {
    this._datasetService.getDatasetId().pipe(
      switchMap(datasetId => this._vehiclesService.getVehiclesIds(datasetId))
    ).subscribe(
      (vehicleIds) => {
        this.vehiclesIds = vehicleIds;
        this.loadVehicleInfo(this.vehiclesIds);
      },
      error => {
        console.error("Error loading vehicle IDs:", error);
        this.isLoading = false;
      }
    );
  }
  
  private loadVehicleInfo(vehiclesIds: VehiclesIds){

    const observables = vehiclesIds.vehicleIds.map(id =>
      this._vehiclesService.getVehicleById(this.dataset, id)
    );

    console.log(observables);

    forkJoin(observables).subscribe(
      (vehicleInfos: Vehicle[]) => {
        this.vehicles = vehicleInfos;
        this.vehiclesCopy = vehicleInfos;
        this.isLoading = false;
        console.log("Vehicles:", this.vehicles);
      },
      error => {
        console.error("Error loading vehicle info:", error);
        this.isLoading = false;
      }
    );
    
  }

  public clearSearchCriteria() {
    this.searchCriteria = '';
    this.vehicles = this.vehiclesCopy;
  }

  private filterVehicles(search: string): Vehicle[] {
    const searchTerm = search.toLowerCase();

    this.vehicles = this.vehiclesCopy;

    return this.vehicles.filter(vehicle =>
      vehicle.year.toString().includes(searchTerm) ||
      vehicle.make.toLowerCase().includes(searchTerm) ||
      vehicle.model.toLowerCase().includes(searchTerm)
    );
  }

  private initSearch() {

    this.searchCriteriaUpdate
    .pipe(debounceTime(400), distinctUntilChanged())
    .subscribe((value) => {
      this.vehicles = this.filterVehicles(value);
    })
  }

  public sortData(sort: Sort) {
      const data = this.vehicles.slice();
      if (!sort.active || sort.direction === '') {
        this.vehicles = data;
        return;
      }

      this.vehicles = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'year':
            return (a.year < b.year ? -1 : 1) * (isAsc ? 1 : -1);
          
          case 'model':
            return (a.model < b.model ? -1 : 1) * (isAsc ? 1 : -1);
            
          default:
            return 0;
        }
      })
  } 

}
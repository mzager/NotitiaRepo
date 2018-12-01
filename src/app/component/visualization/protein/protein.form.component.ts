import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CollectionTypeEnum, DimensionEnum, DirtyEnum } from 'app/model/enum.model';
import { DataField, DataFieldFactory, DataTable } from './../../../model/data-field.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { GraphConfig } from './../../../model/graph-config.model';
import { ProteinConfigModel } from './protein.model';

@Component({
  selector: 'app-protein-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './protein.form.component.html'
})
export class ProteinFormComponent {
  @Input()
  set config(v: ProteinConfigModel) {
    if (v === null) {
      return;
    }
    this.form.patchValue(v, { emitEvent: false });
  }

  @Output() configChange = new EventEmitter<GraphConfig>();

  form: FormGroup;

  chains = [
    { name: 'Hide', value: 'hide' },
    { name: 'Thick Ribbon', value: 'ribbon' },
    { name: 'Thin Ribbon', value: 'ribbon-faster' },
    { name: 'Cylinder + Plate', value: 'cylinder & plate' },
    { name: 'C Alpha Trace', value: 'c alpha trace' },
    { name: 'B Factor Tube', value: 'b factor tube' }
  ];
  acidBases = [
    { name: 'sticks', value: 'sticks' },
    { name: 'lines', value: 'lines' },
    { name: 'polygons', value: 'polygons' }
  ];
  nonBondedAdams: [{ name: 'stars'; value: 'stars' }, { name: 'spheres'; value: 'spheres' }];
  smallMolecules: [
    { name: 'spheres'; value: 'spheres' },
    { name: 'ball + stick'; value: 'ball and stick' },
    { name: 'ball + stick (multiple bond)'; value: 'ball and stick (multiple bond' },
    { name: 'icosahedrons'; value: 'icosahedrons' },
    { name: 'lines'; value: 'lines' }
  ];

  constructor(private fb: FormBuilder) {
    // Init Form
    this.form = this.fb.group({
      dirtyFlag: [DirtyEnum.NO_COMPUTE],
      visualization: [],
      graph: [],
      database: [],
      entity: [],
      table: [],
      pointColor: [],
      pointShape: [],
      pointSize: [],

      molecule: [],
      chain: [],
      acidBase: [],
      nonBondedAdam: [],
      smallMolecule: []

      // dimension: [],
      // alignment: [],
      // chromosomeOption: [],
      // allowRotation: [],
      // layoutOption: [],
      // spacingOption: [],
      // showTads: []
    });

    // Update When Form Changes
    this.form.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged()
      )
      .subscribe(data => {
        const form = this.form;
        form.markAsPristine();
        data.dirtyFlag = DirtyEnum.NO_COMPUTE;
        this.configChange.emit(data);
      });
  }
}

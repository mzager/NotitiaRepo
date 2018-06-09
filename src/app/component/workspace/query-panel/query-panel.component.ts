import { AfterViewInit, ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QueryBuilderConfig } from 'app/component/workspace/query-panel/query-builder/query-builder.interfaces';
import { GraphConfig } from 'app/model/graph-config.model';
import { DataService } from './../../../service/data.service';
import { ModalService } from './../../../service/modal-service';


@Component({
  selector: 'app-workspace-query-panel',
  templateUrl: './query-panel.component.html',
  styleUrls: ['./query-panel.component.scss']
})
export class QueryPanelComponent implements AfterViewInit, OnDestroy {

  form: FormGroup;
  showForm = false;

  @Input() set configA(config: GraphConfig) {
    // this._configA = config;
    this.dataService.getQueryBuilderConfig(config.database).then(result => {
      this.cfg = result;
      const fieldKey = Object.keys(this.cfg.fields)[0];
      const field = result[fieldKey];
      this.query = {
        condition: 'and',
        rules: [{ field: fieldKey, operator: '<=' }]
      };
      this.showForm = true;
      this.cd.detectChanges();
    });
  }


  // private _configB: GraphConfig;
  cfg: QueryBuilderConfig;
  query: any;

  // Life Cycle
  ngOnDestroy(): void { }
  ngAfterViewInit(): void { }
  constructor(private dataService: DataService, public ms: ModalService, private cd: ChangeDetectorRef, private fb: FormBuilder) {
    this.form = this.fb.group({
      cohortName: []
    });
  }
}

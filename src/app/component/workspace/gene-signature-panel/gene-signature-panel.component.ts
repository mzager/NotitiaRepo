
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {
  AfterViewInit, ChangeDetectionStrategy,
  ChangeDetectorRef, Component, ElementRef,
  EventEmitter, Input, Output, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GraphConfig } from './../../../model/graph-config.model';
import { DataService } from './../../../service/data.service';
declare var $: any;

@Component({
  selector: 'app-workspace-gene-signature-panel',
  template: `<div class="card" style="width:225px;margin-top:60px;margin-left:20px;">
  <div class="card-tabs">
      <ul class="tabs tabs-fixed-width" #tabs>
          <li class="tab">
              <a class="active" href="#cohort-panel" style="padding:0px;">Gene Signature</a>
          </li>
      </ul>
  </div>
  <div class="card-content">
      <div id="cohort-panel">
      </div>
  </div>
</div>`,
  changeDetection: ChangeDetectionStrategy.Default
})
export class GeneSignaturePanelComponent implements AfterViewInit {

  form: FormGroup;


  @ViewChild('tabs') tabs: ElementRef;


  @Input() configA: GraphConfig;
  @Input() configB: GraphConfig;
  @Output() configChange = new EventEmitter<GraphConfig>();

  ngAfterViewInit(): void {
    $(this.tabs.nativeElement).tabs();
  }


  byName(p1: any, p2: any) {
    if (p2 === null) { return false; }
    return p1.name === p2.name;
  }

  constructor(private cd: ChangeDetectorRef, private fb: FormBuilder, private dataService: DataService) {

    this.dataService.getGeneSetCategories().toPromise().then(v => {
    });

    this.form = this.fb.group({
    });

    this.form.valueChanges.pipe(
      debounceTime(200),
      distinctUntilChanged(),)
      .subscribe(data => {
        const form = this.form;
        // this.configChange.emit(this.configB);
      });
  }

}

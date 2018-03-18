import { WorkspaceConfigModel } from './../../../model/workspace.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { getGraphAConfig, getEdgesData } from './../../../reducer/index.reducer';
import { FontFactory } from './../../../service/font.factory';
import * as e from 'app/model/enum.model';
import * as fromRoot from 'app/reducer/index.reducer';
import * as select from 'app/action/select.action';
import { Action, Store } from '@ngrx/store';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from '@angular/core';
import { ChartScene } from './chart.scene';
import { GraphConfig } from './../../../model/graph-config.model';
import { Observable } from 'rxjs/Observable';
import { GraphEnum } from 'app/model/enum.model';

@Component({
  selector: 'app-workspace-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ChartScene]
})
export class ChartComponent implements AfterViewInit {

  labelA = '';
  labelB = '';

  @Output()
  public onSelect: EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }> =
    new EventEmitter<{ type: EntityTypeEnum, ids: Array<string> }>();
  @Output()
  public configChange: EventEmitter<GraphConfig> =
    new EventEmitter<GraphConfig>();

  // Components
  @ViewChild('container')
  private container: ElementRef;

  @ViewChild('labelsA')
  private labelsA: ElementRef;

  @ViewChild('labelsB')
  private labelsB: ElementRef;

  @ViewChild('labelsE')
  private labelsE: ElementRef;

  @ViewChild('labelAContainer')
  private labelsAContainer: ElementRef;

  @ViewChild('labelBContainer')
  private labelsBContainer: ElementRef;

  /* LIFECYCLE */
  ngAfterViewInit() {
    this.ngZone.runOutsideAngular(() => {

      const chartScene: ChartScene = new ChartScene();
      chartScene.init(this.container.nativeElement, this.labelsA.nativeElement,
        this.labelsB.nativeElement, this.labelsE.nativeElement);

      chartScene.onSelect.subscribe((e) => {
        this.onSelect.next(e);
      });
      chartScene.onConfigEmit.subscribe((e) => {
        this.configChange.next(e.type);
      });

      const workspaceConfig: Observable<WorkspaceConfigModel> = this.store.select(fromRoot.getWorkspaceConfig);
      workspaceConfig.subscribe(v => chartScene.workspaceConfig = v);

      const selectedGraphAConfig: Observable<GraphConfig> = this.store.select(fromRoot.getGraphAConfig);
      const updateDataGraphA: Observable<any> = this.store
        .select(fromRoot.getGraphAData)
        .withLatestFrom(selectedGraphAConfig)
        .filter(v => v[0] !== null);
      updateDataGraphA.subscribe(v => {
        this.labelA = v[1].label;
        this.cdr.markForCheck();
        return chartScene.updateData(GraphEnum.GRAPH_A, v[1], v[0]);
      });

      const updateDecoratorGraphA: Observable<any> = this.store
        .select(fromRoot.getGraphADecorators)
        .withLatestFrom(selectedGraphAConfig)
        .filter(v => v[0] !== null);
      updateDecoratorGraphA.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.GRAPH_A, v[1], v[0]);
      });


      const selectedGraphBConfig: Observable<GraphConfig> = this.store.select(fromRoot.getGraphBConfig);
      const updateDataGraphB: Observable<any> = this.store
        .select(fromRoot.getGraphBData)
        .withLatestFrom(selectedGraphBConfig)
        .filter(v => v[0] !== null);
      updateDataGraphB.subscribe(v => {
        this.labelB = v[1].label;
        this.cdr.markForCheck();
        return chartScene.updateData(GraphEnum.GRAPH_B, v[1], v[0]);
      });

      const updateDecoratorGraphB: Observable<any> = this.store
        .select(fromRoot.getGraphBDecorators)
        .withLatestFrom(selectedGraphBConfig)
        .filter(v => v[0] !== null);
      updateDecoratorGraphB.subscribe(v => {
        return chartScene.updateDecorators(GraphEnum.GRAPH_B, v[1], v[0]);
      });


      const selectedEdgesConfig: Observable<GraphConfig> = this.store.select(fromRoot.getEdgesConfig);
      const updateEdges: Observable<any> = this.store
        .select(fromRoot.getEdgesData)
        .withLatestFrom(selectedEdgesConfig)
        .filter(v => (v[0] !== null) && (v[0] !== null));
      updateEdges.subscribe(v => {
        chartScene.updateData(GraphEnum.EDGES, v[1], v[0]);
      });
    });
  }

  constructor(private ngZone: NgZone, private store: Store<any>, private cdr: ChangeDetectorRef) {
  }
}

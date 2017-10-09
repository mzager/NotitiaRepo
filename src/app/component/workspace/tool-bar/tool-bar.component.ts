import { ChangeDetectionStrategy, OnInit, EventEmitter, Input, Output, Component } from '@angular/core';
import { GraphEnum, GraphActionEnum, ToolEnum } from 'app/model/enum.model';
// import * as dat from 'dat.gui';
declare var dat: any;

@Component({
  selector: 'app-workspace-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToolBarComponent implements OnInit {

  @Input() selectedTool: ToolEnum;
  @Input() selectedGraph: GraphEnum;
  @Output() selectTool = new EventEmitter();
  @Output() selectGraph = new EventEmitter();
  @Output() graphAction = new EventEmitter();

  datParams: any;
  datGui: any;

  ngOnInit(): void {


  }

  // @HostListener('document:keypress', ['$event'])
  // handleKeyboardEvent(event: KeyboardEvent) {
  //   switch (event.key.toLowerCase()) {
  //     case '1': this.selectGraph.emit( GraphEnum.GRAPH_A ); break;
  //     case '2': this.selectGraph.emit( GraphEnum.GRAPH_B ); break;
  //     case 'd': this.selectTool.emit( ToolEnum.MOVE ); break;
  //     case 'r': this.selectTool.emit( ToolEnum.ROTATE ); break;
  //     case 'z': this.selectTool.emit( ToolEnum.ZOOM ); break;
  //     case 's': this.selectTool.emit( ToolEnum.SELECT); break;
  //     case 'v': this.graphAction.emit( GraphActionEnum.VISIBILITY_TOGGLE); break;
  //     case 'b': this.graphAction.emit( GraphActionEnum.DEPTH_TOGGLE); break;
  //     // case "s": this.selectTool.emit( ToolEnum.SAVE_COHORT); break;
  //     // case "s": this.selectTool.emit( ToolEnum.INSERT_ANNOTATION); break;
  //   }
  //}

  constructor() { }
}

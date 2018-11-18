import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import { ModalService } from 'app/service/modal-service';
import { DataService } from './../../../service/data.service';
declare var $: any;

@Component({
  selector: 'app-workspace-citations-panel',
  templateUrl: './citations-panel.component.html',
  styleUrls: ['./citations-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class CitationsPanelComponent implements AfterViewInit, OnInit, OnDestroy {
  // @ViewChild('filterInput') filterInput: ElementRef;
  // filterInputChangeStream: Observable<any>;
  // filterInputSubscription: Subscription;
  results = [];

  // Attributes
  @Output() hide = new EventEmitter<any>();
  closeClick(): void {
    this.hide.emit();
  }

  filterChange(e: any): void {
    // const needle = e.target.value.toLowerCase();
    // this.results.forEach(result => {
    //     if (result.methods.find(method => {
    //         return (method.method.toLowerCase().indexOf(needle) > -1);
    //     })
    //         !== undefined) {
    //         result.visible = true;
    //     } else if (result.citations
    //         .find(citation => {
    //             return (citation.name.toLowerCase().indexOf(needle) > -1
    //                 || citation.desc.toLowerCase().indexOf(needle)) > -1;
    //         }) !== undefined) {
    //         result.visible = true;
    //     } else {
    //         result.visible = false;
    //     }
    // });
    // this.cd.detectChanges();
  }

  ngOnInit(): void {
    // this.filterInputChangeStream = Observable
    //     .fromEvent(this.filterInput.nativeElement, 'keyup')
    //     .debounceTime(300)
    //     .distinctUntilChanged();
    // this.filterInputSubscription = this.filterInputChangeStream.subscribe(this.filterChange.bind(this));
  }

  ngOnDestroy(): void {
    // this.filterInputSubscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataService.getCitations().then(results => {
      this.results = results.map(result => Object.assign(result, { visible: true }));
      debugger;
      this.cd.detectChanges();
    });
  }

  constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {}
}

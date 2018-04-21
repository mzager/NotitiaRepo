import { ModalService } from 'app/service/modal-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DataService } from './../../../service/data.service';
import { GraphConfig } from './../../../model/graph-config.model';
import { EntityTypeEnum } from './../../../model/enum.model';
import { DataField } from 'app/model/data-field.model';
import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';
import { VisualizationEnum, DirtyEnum } from 'app/model/enum.model';
import { Legend } from 'app/model/legend.model';
import { Subscription } from 'rxjs/Subscription';
import * as _ from 'lodash';

declare var $: any;

@Component({
    selector: 'app-workspace-feedback-panel',
    styleUrls: ['./feedback-panel.component.scss'],
    template:
        `
        <div class="feedback-modal-panel">
        <div class='row'>
            <a href='#' class='modalClose' (click)='closeClick()'></a>
            <div class='col s12 m9'>
                <h1 class='feedback-h1'>Feedback</h1>
                <h2 style="text-align:center;" class='feedback-h2'>Contact the Oncoscape Team</h2>
                <div class="row">
                    <form class="col s12">
                        <div class="row">
                            <div class="input-field col s6">
                                <i class="material-icons prefix">account_circle</i>
                                <input id="icon_prefix" type="text" class="validate">
                                <label for="icon_prefix">Name</label>
                            </div>
                            <div class="input-field col s6">
                                <i class="material-icons prefix">work</i>
                                <input id="icon_prefix" type="text" class="validate">
                                <label for="icon_work">Institution</label>
                            </div>
                            <div class="input-field col s6">
                                <i class="material-icons prefix">email</i>
                                <input id="icon_prefix" type="text" class="validate">
                                <label for="icon_email">Email</label>
                            </div>
                            <div class="input-field col s6">
                                <select>
                                    <option value="" disabled selected>Subject</option>
                                    <option value="1">General Inquiry</option>
                                    <option value="2">Developer Collaboration</option>
                                    <option value="3">Research Collaboration</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedbackPanelComponent implements AfterViewInit, OnDestroy {


    // Attributes
    @Output() hide = new EventEmitter<any>();
    closeClick(): void {
        this.hide.emit();
    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void { }
    constructor(private cd: ChangeDetectorRef, private dataService: DataService, public ms: ModalService) {
    }
}



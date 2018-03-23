import {
    Component, Input, Output, EventEmitter, AfterViewInit, OnDestroy,
    OnInit, ViewChild, ElementRef, ChangeDetectionStrategy, ChangeDetectorRef
} from '@angular/core';

@Component({
    selector: 'app-workspace-loader',
    styleUrls: ['./loader.component.scss'],
    template:
        `<div class='loader'>
    <div class='loader-background'></div>
    <!--
    <div class='loader-animation'></div>
-->
    <div class='loader-copy-container'>
        <div class='loader-copy'>
            <div class='loader-quote'>&#39;{{quote.q}}&#39;</div>
            <div class='loader-author'>{{quote.a}}</div>
        </div>
        <div class="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
    </div>

</div>`,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent implements AfterViewInit, OnDestroy {

    public quote: any;

    public quotes: any;
    @Input() set visbibility(value: boolean) {

    }

    ngOnDestroy(): void { }
    ngAfterViewInit(): void {

    }
    constructor() {
        this.quotes = [
            { q: 'Science is beautiful when it makes simple explanations.', a: 'Stephen Hawking' },
            { q: 'Nothing cannot exist forever.', a: 'Stephen Hawking' },
            { q: 'I think computer viruses should count as life.', a: 'Stephen Hawking' },
            { q: 'There could be shadow galaxies, shadow stars, and even shadow people.', a: 'Stephen Hawking' },
            { q: 'I was not a good student. I was too busy enjoying myself.', a: 'Stephen Hawking' },
            { q: 'If you torture the data long enough, it will confess t o anything', a: 'Ronald Coase' },
            { q: 'Nothing cannot exist forever.', a: 'Stephen Hawking' }
        ];
        this.quote = this.quotes[Math.floor(Math.random() * this.quotes.length) + 1];
    }
}

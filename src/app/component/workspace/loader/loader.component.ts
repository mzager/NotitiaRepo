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
            { q: 'If you torture the data long enough, it will confess to anything', a: 'Ronald Coase' },
            { q: 'Nothing cannot exist forever.', a: 'Stephen Hawking' },
            { q: 'Imagination is more important than knowledge.', a: 'Albert Einstein' },
            { q: 'Not everything that can be counted counts.', a: 'Albert Einstein' },
            { q: 'Curiosity has its own reason for existing.', a: 'Albert Einstein' },
            { q: 'Once you stop learning, you start dying.', a: 'Albert Einstein' },
            { q: 'Our technology has exceeded our humanity.', a: 'Albert Einstein' },
            { q: 'I have no special talent. I am only passionately curious', a: 'Albert Einstein' },
        ];
        const i = Math.floor(Math.random() * ((this.quotes.length)));
        this.quote = this.quotes[i];
    }
}

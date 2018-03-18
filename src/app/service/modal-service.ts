import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
    $focus: Subject<string> = new Subject();
}

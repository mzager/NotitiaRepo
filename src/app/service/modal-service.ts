import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
    $focus: Subject<string> = new Subject();
}

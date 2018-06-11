import { ErrorHandler, Injectable } from '@angular/core';
import * as StackTrace from 'stacktrace-js';

@Injectable()
export class ErrorService implements ErrorHandler {
    handleError(error): void {
        StackTrace.fromError(error).then(stackframes => {
            const stackString = stackframes
                .splice(0, 20)
                .map(function (sf) {
                    return sf.toString();
                }).join('\n');

            // console.log(error + '\n\n' + stackString, 'background: #000; color: red;');
            // alert(error + '\n:' + stackString);
            throw (error);
        });
    }
    contructor() { }
}

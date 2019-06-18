import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidator, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { WorkflowService } from '../services/workflow.service';
import { debounceTime, take, map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { DebtorsService } from '../services/debtors.service';

export function doubleChecker(wf?: WorkflowService, id?: number): AsyncValidatorFn {
    return (ctrl: AbstractControl): Observable<{exists: boolean} | null> => {
        const invNum = ((ctrl.value) as string).toLowerCase();

        if (id) {
            return wf.duplicateCheck(invNum, id).pipe(
                debounceTime(500),
                map((res) => {
                    // tslint:disable-next-line:triple-equals
                    if (invNum == 'cancel') {
                        return { result: null };
                    } else {
                        return res;
                    }
                }),
                map((res: any) => (res.result ? { exists: true } : null))
            );
        }
        return wf.duplicateCheck(invNum).pipe(
            debounceTime(500),
            map((res) => {
                // tslint:disable-next-line:triple-equals
                if (invNum == 'cancel') {
                    return { result: null };
                } else {
                    return res;
                }
            }),
            map((res: any) => (res.result ? { exists: true } : null))
        );
    };
}

export function doubleControlChecker(dbt: DebtorsService, data: any): AsyncValidatorFn {
    return (ctrl: AbstractControl): Observable<{exists: boolean} | null> => {
        const cust_id = ctrl.value as string;
        return dbt.duplicateCheck(cust_id, data).pipe(
            debounceTime(1000),
            map((res) => (res.result ? { exists: true } : null))
        );
    };
}

export function presenceChecker(dbt: DebtorsService, data: any): AsyncValidatorFn {
    return (ctrl: AbstractControl): Observable<{exists: boolean} | null> => {
        const cust_id = ctrl.value as string;
        return dbt.presenceCheck(cust_id, data).pipe(
            debounceTime(1000),
            map((res) => (res.result ? { exists: true } : null))
        );
    };
}

export function rempresenceChecker(dbt: DebtorsService, data: any): AsyncValidatorFn {
    return (ctrl: AbstractControl): Observable<{duplicate: boolean} | null> => {
        const cust_id = ctrl.value as string;
        return dbt.rempresenceCheck(cust_id, data).pipe(
            debounceTime(1000),
            map((res) => (res.result ? { duplicate: true } : null))
        );
    };
}




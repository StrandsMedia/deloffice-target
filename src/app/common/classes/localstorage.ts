import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

export interface User {
    status: string;
    user_id: string;
    username: string;
    usertype: string;
    token: string;
}

export interface ILocalStorage<T> {
    select(key: string, defaultValue?: any): Observable<T>;
    set(key: string, value: any): void;
    remove(key: string): void;
}

export class LocalStorage<T> implements ILocalStorage<T> {
    protected subjects: {[key: string]: BehaviorSubject<any>} = {};
    private _key: string;

    constructor(key?: string) {
        this._key = key;
    }

    select(key: string = this._key, defaultValue: any = null): Observable<T> {
        if (this.subjects.hasOwnProperty(key)) {
            return this.subjects[key];
        }

        if (!window.localStorage.getItem(key) && defaultValue) {
            window.localStorage.setItem(key, JSON.stringify(defaultValue));
        }

        const value = window.localStorage.getItem(key)
            ? JSON.parse(window.localStorage.getItem(key))
            : defaultValue;

        return this.subjects[key] = new BehaviorSubject(value);
    }

    set(key: string = this._key, value: any): void {
        window.localStorage.setItem(key, JSON.stringify(value));

        if (this.subjects.hasOwnProperty(key)) {
            this.subjects[key].next(value);
        }
    }

    remove(key: string = this._key): void {
        window.localStorage.removeItem(key);

        if (this.subjects.hasOwnProperty(key)) {
            this.subjects[key].next(null);
        }
    }
}

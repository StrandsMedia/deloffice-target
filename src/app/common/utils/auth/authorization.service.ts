import { Injectable } from '@angular/core';
import { AuthGroup } from './authorization.types';

@Injectable({
    providedIn: 'root'
})
export class AuthorizationService {
    public permissions: Object = {};

    constructor() {}

    public hasPermission(authGroup: AuthGroup): boolean {
        if (this.permissions && this.permissions[authGroup]) {
            return true;
        } else {
            return false;
        }
    }

    public initPermissions() {
        return new Promise((resolve, reject) => {
            const operations = ['create', 'read', 'update', 'delete'];
            const perms = {};
            const currentUser = JSON.parse(localStorage.getItem('currentUser'));
            const permission = JSON.parse(localStorage.getItem('currentUserPermission'));

            if (currentUser && permission) {
                for (const op of operations) {
                    if (permission[op] && typeof permission[op] === 'object') {
                        if ((permission[op] as Array<any>).includes(currentUser.user_id)) {
                            perms[op] = true;
                        } else {
                            perms[op] = false;
                        }
                    }
                }
                this.permissions = perms;
                resolve(perms);
            } else {
                reject(new Error('No permissions found.'));
            }
        });
    }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

import { Observable, of, timer } from 'rxjs';
import { debounceTime, delay, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DebtorsService {
  private url = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Debtors Control

  insertControl(info) {
    return this.http.post(this.url + 'debtors/insertControl.php', info);
  }

  getControl(id, user): Observable<any> {
    return timer(0, 10000).pipe(
      switchMap(t => {
        return this.http.get(this.url + `debtors/readControl.php?s=${id}&u=${user}`);
      })
    );
  }

  getControlById(id, data): Observable<any> {
    return this.http.get(this.url + `debtors/readControlById.php?id=${id}&d=${data}`);
  }

  searchControl(term): Observable<any> {
    return this.http.get(this.url + `debtors/searchControl.php?s=${term}`);
  }

  duplicateCheck(id, data): Observable<any> {
    return this.http.get(this.url + `debtors/duplicateCheck.php?c=${id}&d=${data}`);
  }

  presenceCheck(id, data): Observable<any> {
    return this.http.get(this.url + `debtors/presenceCheck.php?c=${id}&d=${data}`);
  }

  updateControl(info) {
    return this.http.post(this.url + 'debtors/updateControl.php', info);
  }

  insertCmtCtrl(info) {
    return this.http.post(this.url + 'debtors/insertCmtCtrl.php', info);
  }

  changeStatus(info) {
    return this.http.post(this.url + 'debtors/changeStatus.php', info);
  }

  archiveCtrl(info) {
    return this.http.post(this.url + 'debtors/archiveControl.php', info);
  }

  // Debtors Review

  readReview(info): Observable<any> {
    return this.http.post(this.url + 'debtors/readReview.php', info);
  }

  sendForReview(info): Observable<any> {
    return this.http.post(this.url + 'debtors/sendForReview.php', info);
  }

  releaseReview(info): Observable<any> {
    return this.http.post(this.url + 'debtors/releaseReview.php', info);
  }

  // Debt Collection

  insertEntry(info): Observable<any> {
    return this.http.post(this.url + 'debtors/addCollect.php', info);
  }

  chainEntry(info): Observable<any> {
    return this.http.post(this.url + 'debtors/updateCollect.php', info);
  }

  readEntries(collect, type): Observable<any> {
    return this.http.get(this.url + `debtors/readCollect.php?c=${collect}&t=${type}`);
  }

  markCollected(info): Observable<any> {
    return this.http.post(this.url + 'debtors/markCollect.php', info);
  }

  // Reminder Events

  insertReminder(info): Observable<any> {
    return this.http.post(this.url + 'debtors/createReminder.php', info);
  }

  getReminders(status): Observable<any> {
    return this.http.get(this.url + `debtors/readReminder.php?s=${status}`);
  }

  getArchiveReminders(): Observable<any> {
    return this.http.get(this.url + 'debtors/readArchReminder.php?s=8');
  }

  rempresenceCheck(id, data): Observable<any> {
    return this.http.get(this.url + `debtors/rempresenceCheck.php?c=${id}&d=${data}`);
  }

  updateReminder(info): Observable<any> {
    return this.http.post(this.url + 'debtors/updateReminder.php', info);
  }

  archiveReminder(info): Observable<any> {
    return this.http.post(this.url + 'debtors/archiveReminder.php', info);
  }

  authReminder(info): Observable<any> {
    return this.http.post(this.url + 'debtors/authReminder.php', info);
  }

  updateAmtDue(info): Observable<any> {
    return this.http.post(this.url + 'debtors/updateAmtDue.php', info);
  }

  updateAmtPaid(info): Observable<any> {
    return this.http.post(this.url + 'debtors/updateAmtPaid.php', info);
  }

  updateCourtDate(info): Observable<any> {
    return this.http.post(this.url + 'debtors/updateCourtDate.php', info);
  }

  sendToCourt(info): Observable<any> {
    return this.http.post(this.url + 'debtors/sendToCourt.php', info);
  }

  insertComment(info): Observable<any> {
    return this.http.post(this.url + 'debtors/insertComment.php', info);
  }

  getRemComments(id): Observable<any> {
    return this.http.get(this.url + `debtors/readRemComments.php?id=${id}`);
  }


  // Credit Control

  getCreditControl(): Observable<any> {
    return this.http.get(this.url + 'debtors/creditControl.php');
  }

  handleCreditCtrl(info): Observable<any> {
    return this.http.post(this.url + 'debtors/creditApproval.php', info);
  }
}

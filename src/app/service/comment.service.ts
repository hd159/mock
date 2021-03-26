import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataStoreService, DataStoreType, Query } from 'kinvey-angular-sdk';
import { combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { CollectionService } from './collection.service';

export interface CommentState {
  commentsHot: CommentGroup;
  commentsNew: CommentGroup;
}

export interface CommentGroup {
  [key: string]: Comment[];
}
const initalCommentState: CommentState = {
  commentsHot: {},
  commentsNew: {},
};

@Injectable({ providedIn: 'root' })
export class CommentService extends CollectionService<CommentState> {
  constructor(http: HttpClient) {
    super(initalCommentState, 'comments', http);
  }

  updateState<T>(prop: string, payload: { key: string; value: Comment[] }) {
    const currentValue: CommentGroup = this.valueState[prop];

    const fieldUpdate: Comment[] = currentValue[payload.key] || [];

    const newValue = { [payload.key]: [...payload.value, ...fieldUpdate] };

    return this.setState({ [prop]: { ...currentValue, ...newValue } });
  }

  getComments(id: string, sort?: string, limit = 5, skip = 0) {
    const query = new Query();
    query.equalTo('id_post', id);
    query.limit = limit;
    query.skip = skip * limit;
    if (sort === 'commentsHot') query.descending('reply');
    if (sort === 'commentsNew') query.descending('_kmd.ect');
    return this.find<Comment>(query);
  }

  getCommentsFromStore(
    id: string,
    sort: string,
    limit?: number,
    skip?: number
  ): Observable<any> {
    return combineLatest([of(id), this.selectData<any>(sort)]).pipe(
      switchMap(([id, commentGroup]) => {
        if (!commentGroup[id]) {
          return this.getComments(id, sort, limit, skip).pipe(
            tap((val) => {
              const obj = { [id]: val };
              this.setState({ [sort]: { ...obj, ...commentGroup } });
            })
          );
        } else {
          return of(commentGroup[id]);
        }
      }),
      distinctUntilChanged()
    );
  }
}

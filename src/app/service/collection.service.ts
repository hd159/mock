import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Aggregation } from 'kinvey-angular-sdk';
import { BehaviorSubject, of, zip } from 'rxjs';
import { from, Observable, throwError } from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  shareReplay,
  tap,
  toArray,
} from 'rxjs/operators';

export interface Query {
  skip: number;
  fields: string[];
  limit: number;
  key: string;
  descending: string;
  equalTo: { field: string; value: string };
}

export class CollectionService<T> {
  url: string;
  collection: any;

  headers = new HttpHeaders().set(
    'Authorization',
    'Basic a2lkX3JKdkRGbTg0dTozOTUyOGRkNDVkNGQ0OTFlYjdiZDFmOTVlYjJlZWI1Ng=='
  );

  private subject: BehaviorSubject<T>;
  state$: Observable<T>;

  constructor(
    intialState: T,
    collectionName: string,
    private http: HttpClient
  ) {
    this.subject = new BehaviorSubject(intialState);
    this.state$ = this.subject.asObservable();
    this.url = `https://baas.kinvey.com/appdata/kid_rJvDFm84u/${collectionName}`;
  }

  get valueState() {
    return this.subject.getValue();
  }

  setState(val: Partial<T>) {
    this.subject.next({ ...this.valueState, ...val });
  }

  selectData<T>(prop: string): Observable<T> {
    return this.state$.pipe(map((val) => val[prop]));
  }

  // Pull data from the backend and save it locally on the device.
  // pull(query?: Query): Observable<any> {
  //   return from(this.collection.pull(query)).pipe(
  //     catchError((err) => {
  //       console.log({ ...err }, 'pull');
  //       return throwError(err);
  //     })
  //   );
  // }

  // get data

  // createQuery(query: Query) {
  //   const {fields, limit, skip, descending} = query
  //   if(fields) {

  //   }
  // }

  find<T>(params?): Observable<any> {
    return this.http.get(this.url, { headers: this.headers, params }).pipe(
      catchError((err) => {
        console.log({ ...err }, 'find');
        return throwError(err);
      })
    );
  }

  findById<T>(id: string): Observable<any> {
    return this.http.get(`${this.url}/${id}`, { headers: this.headers }).pipe(
      tap((val) => console.log(val)),
      catchError((err) => {
        console.log({ ...err }, 'findById');

        return throwError(err);
      })
    );
  }

  // delete data
  removeById(id: string) {
    return this.http
      .delete(`${this.url}/${id}`, { headers: this.headers })
      .pipe(
        catchError((err) => {
          console.log({ ...err }, 'removeById');

          return throwError(err);
        })
      );
  }

  removeMultipleValue(query: any) {
    return this.http
      .delete(this.url, { headers: this.headers, params: query })
      .pipe(
        catchError((err) => {
          console.log({ ...err }, 'removeMultipleValue');
          return throwError(err);
        })
      );
  }

  // _id ? update data : create data
  create(entity: any): Observable<any> {
    return this.http.post(this.url, entity, { headers: this.headers }).pipe(
      catchError((err) => {
        console.log({ ...err }, 'insave');
        return throwError(err);
      })
    );
  }

  update(entity, id): Observable<any> {
    return this.http
      .put(`${this.url}/${id}`, entity, { headers: this.headers })
      .pipe(
        catchError((err) => {
          console.log({ ...err }, 'insave');
          return throwError(err);
        })
      );
  }

  // use with category
  // push() {
  //   return from(this.collection.push()).pipe(
  //     tap((val) => console.log(val, 'push')),
  //     catchError((err) => {
  //       console.log({ ...err }, 'inpush');
  //       return throwError(err);
  //     })
  //   );
  // }

  count(params): Observable<any> {
    const url = `${this.url}/_count`;
    return this.http
      .get(url, { headers: this.headers, params })
      .pipe(map((val: any) => val.count));
  }

  // connect backend
  async sync() {
    try {
      const result = await this.collection.sync();
      console.log(result, 1);
    } catch (error) {
      console.log(error);
    }
  }

  // collect column
  group(columnName: string, query?: any): Observable<string[]> {
    const body = {
      key: {
        [columnName]: true,
      },
      initial: {
        count: 0,
      },
      reduce: 'function(doc,out){ out.count++;}',
      condition: { ...query },
    };

    const url = `${this.url}/_group`;
    return this.http.post(url, body, { headers: this.headers }).pipe(
      tap((val) => console.log(val)),
      filter((val) => val['count'] !== 0),
      mergeMap((val: []) => from(val)),
      map((val) => val[columnName]),
      toArray()
    );
  }

  groupDefault(columnName: string, query?: any): Observable<any> {
    const url = `${this.url}/_group`;

    const body = {
      key: {
        [columnName]: true,
      },
      initial: {
        count: 0,
      },
      reduce: 'function(doc,out){ out.count++;}',
      condition: { ...query },
    };

    return this.http.post(url, body, { headers: this.headers });
  }

  getTotalItem(name?: string, key?: string) {
    let params = new HttpParams();
    if (name) {
      params.append('query', JSON.stringify({ content: name }));
    }
    // if (key) {
    //   const re = new RegExp(`^${key}`, 'g');
    //   query.matches('title', re);
    // }
    return this.count(params).pipe(
      filter((val) => !!val),
      map((val) => Math.ceil(val / 10))
    );
  }

  createHostCategory(
    columnName: string,
    query: any,
    id: string,
    fields?: string
  ): Observable<any> {
    return this.group(columnName, query).pipe(
      mergeMap((val) => from(val)),
      mergeMap((val) => {
        const params = new HttpParams().set(
          'query',
          JSON.stringify({ $and: [{ [columnName]: val }, { idcha: id }] })
        );
        if (fields) {
          params.append('fields', fields);
        }

        const temp = this.find(params);

        return zip(of(val), temp);
      }),
      map(([val, temp]) => ({ [val]: temp })),
      toArray()
    );
  }
}

export interface Accumulator {
  count: number;
  month: (string | number)[];
}

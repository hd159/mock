import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Query } from 'kinvey-angular-sdk';
import { Observable, of, Subscription } from 'rxjs';
import { finalize, mergeMap } from 'rxjs/operators';
import { Post } from 'src/app/model/model';
import { CommentService } from 'src/app/service/comment.service';
import { LessonService } from 'src/app/service/lesson.service';
import { LoadingService } from 'src/app/service/loading.service';
import { SwalAlertComponent } from 'src/app/shared/swal-alert/swal-alert.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.scss'],
  providers: [SwalAlertComponent],
})
export class EditPostComponent implements OnInit, OnDestroy {
  posts$: Observable<Partial<Post>[]>;
  numPage$: Observable<number>;
  skipPage = 1;
  postDelete: Post;
  currentSearch: string;
  sub: Subscription;
  constructor(
    private lessonService: LessonService,
    private commentService: CommentService,
    private swal: SwalAlertComponent,
    private loading: LoadingService
  ) {
    this.getPosts();
    this.getPaginationPage();
  }

  ngOnInit(): void {}

  onDelete(post: Post) {
    this.postDelete = post;
    this.swal.swalConfirm(post.title + ' post').then((result) => {
      if (result.value) {
        this.loading.loadingOn();
        this.sub = this.resolveDelete()
          .pipe(finalize(() => this.loading.loadingOff()))
          .subscribe(
            (val) => {
              this.lessonService.deletePost(post);
              const numpage = Math.ceil(
                this.lessonService.valueState.postsEdit.length / 10
              );
              this.numPage$ = of(numpage);
              this.swal.swalSuccess();
            },
            (err) => {
              console.log({ ...err });
              if (err.request.status === 0) {
                this.swal.swalError500();
              }
            }
          );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        this.postDelete = null;
        this.swal.swalCancel('Post');
      }
    });
  }

  resolveDelete() {
    return this.lessonService
      .removeById(this.postDelete._id)
      .pipe(mergeMap(() => this.deleteMultiple(this.postDelete._id)));
  }

  deleteMultiple(idparent: string) {
    const params = new HttpParams().set(
      'query',
      JSON.stringify({ id_comment: idparent })
    );
    return this.commentService.removeMultipleValue(params);
  }

  getPosts(key?: string) {
    const query = {
      limit: 10,
      skip: 10 * (this.skipPage - 1),
      fields: 'title',
      sort: '{"_kmd.lmt":-1}',
    };

    if (key) {
      const re = new RegExp(`^${key}`, 'g');
      // query.matches('title', re);
      // params = params.set('query', JSON.stringify({ content: content }));
      this.posts$ = this.lessonService.find(query);
    } else {
      this.posts$ = this.lessonService.getPostsEdit(query);
    }
  }

  getPaginationPage(key?: string) {
    this.numPage$ = this.lessonService.getTotalItem(null, key);
  }

  onSearch(key: string) {
    this.getPosts(key);
    this.getPaginationPage(key);
    this.currentSearch = key;
  }

  changePosts(pageClick: number) {
    this.skipPage = pageClick;
    this.getPosts(this.currentSearch);
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }
}

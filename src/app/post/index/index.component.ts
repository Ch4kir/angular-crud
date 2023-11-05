import { Component,OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post';


@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  posts: Post[] = [];
  searchValue: string = ''; // Initialize it with an empty string
  private apiURL = "https://jsonplaceholder.typicode.com";
  currentPage = 1;
  postsPerPage = 10;
  

  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor( public postService: PostService) { }

  ngOnInit(): void {
    this.postService.getAll().subscribe((data: Post[])=>{
      this.posts = data;
      console.log(this.posts);
    })  

    
  }

  deletePost(id:number){
    this.postService.delete(id).subscribe(res => {
         this.posts = this.posts.filter(item => item.id !== id);
         console.log('Post deleted successfully!');
    })
  }

 
  resetPosts(): void{
    this.postService.resetAll().subscribe((data: Post[])=>{
      this.posts = data;
      console.log(this.posts);
    }) 
  }

  deleteAll(){
    const postIdsToDelete = this.posts.map(post => post.id);

    for (const id of postIdsToDelete) {
        this.postService.delete(id).subscribe(
            () => {
                this.posts = this.posts.filter(item => item.id !== id);
                console.log(`Post with ID ${id} deleted successfully!`);
            },
            error => {
                console.error(`Error deleting post with ID ${id}: ${error}`);
            }
        );
    }
  }
  errorHandler(error:any) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return errorMessage;
 }

 getPostsForPage() {
  const startIndex = (this.currentPage - 1) * this.postsPerPage;
  const endIndex = Math.min(startIndex + this.postsPerPage, this.posts.length);

  return this.posts.slice(startIndex, endIndex);
}
isLastPage(): boolean {
  return this.currentPage >= Math.ceil(this.posts.length / this.postsPerPage);
}
get totalPages(): number {
  return Math.ceil(this.posts.length / this.postsPerPage);
}
 

}

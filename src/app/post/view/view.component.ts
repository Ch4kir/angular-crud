import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../post';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  id!: number;
  post:any={} ;
    
  /*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router
   ) { }

   ngOnInit(): void {
    this.id = +this.route.snapshot.params['postId'];

    // Fetch the post data from local storage
    const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
    const foundItem = cachedData.find((item: Post) => item.id === this.id);

    // If post data is found in local storage, set it
    if (foundItem) {
      this.post = foundItem;
    } else {
      // Handle the case when the post data is not found in local storage, e.g., navigate to an error page
      this.router.navigateByUrl('error-page'); // Replace 'error-page' with the appropriate route
    }
  
  }
}

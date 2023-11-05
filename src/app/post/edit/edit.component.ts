import { Component, OnInit } from '@angular/core';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Post } from '../post';
import { FormGroup, FormControl, Validators} from '@angular/forms';
import { Location } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
id!: number;
post!: Post;
form!: FormGroup;
currentPage = 1;

/*------------------------------------------
  --------------------------------------------
  Created constructor
  --------------------------------------------
  --------------------------------------------*/
  constructor(
    public postService: PostService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.id = +this.route.snapshot.params['postId'];
    
    // Fetch the post data from local storage
    const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
    this.post = cachedData.find((item: Post) => item.id === this.id) //|| new Post(); // Initialize with an empty Post if not found
    
    this.form = new FormGroup({
      title: new FormControl(this.post.title, [Validators.required]),
      body: new FormControl(this.post.body, Validators.required)
    });
    console.log(this.id)
    this.route.queryParams.subscribe((params) => {
      this.currentPage = params['currentPage'] || 1; // Use 1 as the default value
      // Fetch and display the post data for editing
    });
  }

  get f(){
    return this.form.controls;
  }


  submit() {
    console.log(this.form.value);
    
    // Update the post data in the local storage
    const cachedData = JSON.parse(localStorage.getItem('cachedData') || '[]');
    const updatedData = cachedData.map((item: Post) => {
      if (item.id === this.id) {
        return { ...item, ...this.form.value };
      }
      return item;
    });
    
    // Save the updated data in local storage
    localStorage.setItem('cachedData', JSON.stringify(updatedData));
    
    console.log('Post updated successfully!');
  
    this.router.navigateByUrl('post/index');
  
  }
  
}

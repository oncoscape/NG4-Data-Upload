import { Component,  OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { File } from '../models/file';
import { FileService } from '../service/file.service';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Pipe, PipeTransform } from '@angular/core';
import { StateService } from '../service/state.service';
import { environment } from '../../environments/environment';
import * as _ from 'underscore';
@Pipe({
  name: 'Overlapping'
})
export class Overlapping implements PipeTransform {
  constructor() {}
  transform(arr1, arr2): any {
      const overlapped = _.intersection(arr1, arr2);
      return overlapped.length / arr1.length * 100;
  }
}
@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss'],
  providers: [FileService]
})
export class FilesComponent implements OnInit {
  public uploader: FileUploader;
  headerValue: string;
  files$: Observable<any>;
  hasFiles = false;
  id: string;
  errorMsg = '';
  uploadedstring = 'Not Uploaded';
  uploadStatus = {
    'uploadSummaryClinical': [],
    'uploadSummaryMolecular': []
  };
  @Input() project: any;
  @Input() user: any;
  @Input() permission: any;
  @Input() statusMsg: boolean;
  @Output()
    uploaded: EventEmitter<string> = new EventEmitter();

  uploadComplete(message: string) {
    this.uploaded.emit(message);
  }
  constructor(private fb: FormBuilder,
              private stateService: StateService,
              private fileService: FileService) {
                console.log('IN FILE COMPONENT, project is: ', this.project);
                this.stateService.jwtToken
                .subscribe(res => {
                  if (res !== null) {
                    // this.headerValue = 'Bearer ' + res.token;
                    this.headerValue = res.token;
                  }
                });
   }

  ngOnInit(): void {
    this.id = this.project._id;
    // this.uploader = new FileUploader({url: 'http://localhost:3000/upload/' + this.id  + '/' + this.user.email});
    console.log(environment.apiBaseUrl + 'upload/' + this.id  + '/' + this.user.email);
    this.uploader = new FileUploader({url: environment.apiBaseUrl + 'upload/' + this.id  + '/' + this.user.email,
                                      // headers: [{name: 'authorization', value: this.headerValue },
                                      headers: [{name: 'Authorization', value: this.headerValue }]
                                    });
    console.log('test1');
    this.filerefresh();
  }
  filerefresh() {
    console.log('in File component refresh()');
    this.fileService.uploadingValidation(this.id + '_uploadingSummary')
        .catch(this.handleError)
        .subscribe(res => {
          if (res[0].length  > 0 ) {
            this.hasFiles = true;
          }
          this.uploadStatus.uploadSummaryClinical = res[0].filter(function(m){return 'sheet' in m  && 'patients' in m; });
          this.uploadStatus.uploadSummaryMolecular = res[0].filter(function(m){return 'sheet' in m  && 'markers' in m; });
        });
  }
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
  updateStatus(fileitem: any) {
    if (!this.statusMsg) {
      alert('Please fill all the required fields before proceeding with data uploading.');
    } else {
      fileitem.upload();
      this.uploadedstring = 'Uploaded';
      console.log(fileitem.file);
      this.project.File = {
        'filename': fileitem.file.name,
        'size' : fileitem.file.size,
        'timestamp' : Date()
      };
      this.uploadComplete('Being uploaded');
      this.filerefresh();
      // if (fileitem.file.size >= 10000000) {
        alert('An email will be sent shortly after the operation is complete.');
      // }
    }
  }
  cancelUpdate(fileitem: any) {
    const len = this.uploader.queue.length;
    this.uploader.queue.pop();
    this.uploadComplete('Being canceled');
  }
  removeAllFiles() {
    const confirmDeletion = confirm('Are you sure you want to delete all the files related to this dataset? ');
    if (confirmDeletion) {
      this.fileService.removeFilesByProjectID(this.id);
      this.project.File = null;
      console.log('test...');
      this.uploadComplete('Being removed');
      this.hasFiles = false;
      this.uploader.queue = [];
    } else {
      console.log('file deletion is canceled.');
    }
  }
  projectValidChecking(): boolean {
    this.errorMsg = 'Still working on this feature';
    return false;
  }
}

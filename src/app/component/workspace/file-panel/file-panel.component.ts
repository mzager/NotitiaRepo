import { DataService } from 'app/service/data.service';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewEncapsulation,
  ChangeDetectorRef
} from '@angular/core';
import { PanelEnum } from '../../../model/enum.model';
import { DataHubService } from './../../../service/datahub.service';
import { Pipe, PipeTransform } from '@angular/core';



@Component({
  selector: 'app-workspace-file-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  templateUrl: './file-panel.component.html',
  styleUrls: ['./file-panel.component.scss']
})


export class FilePanelComponent {
  // todo: This needs to be revisited post launch.  Should be doing this in redux state.

  myDatasets: Array<any> = [];
  @Output()
  uploadExcel = new EventEmitter<any>();
  @Output()
  loadPublic = new EventEmitter<any>();
  @Output()
  loadPrivate = new EventEmitter<{ bucket: string; token: string }>();
  @Output()
  hide = new EventEmitter<any>();
  @Output()
  showPanel = new EventEmitter<PanelEnum>();


  datasets = [];
  filter = '';



  uploadExcelClick(): void {
    this.uploadExcel.emit();
  }

  addDataset(): void {
    this.showPanel.emit(PanelEnum.UPLOAD);
  }

  closeClick(): void {
    this.hide.emit();
  }

  constructor(public dataService: DataService, cd: ChangeDetectorRef) {

      this.datasets = [
          {
              'content': {
                  'name': 'CBIO_',
                  'img': 'DSadrenal',
                  'institute': 'CBIO',
                  'description': 'desc',
                  'studyDate': 'Mon Oct 08 2018 14:28:59 GMT-0700 (PDT)',
                  'importDate': 'Mon Oct 08 2018 10:08:59 GMT-0700 (PDT)',
                  'publink': 'https://www.ncbi.nlm.nih.gov/pubmed/30158685',
                  'sampleFields': [
                      'tumor size',
                      'metastatic site',
                      'tumor stage',
                      'myb nfib fish',
                      'myb nfib nonsynonymous count',
                      'myb nfib cna',
                      'type of surgery',
                      'metastatic tumor indicator',
                      'genomic alterations'
                  ],
                  'subjectFields': [
                      'myb nfib rearrangement',
                      'overall patient histology',
                      'neoadjuvant chemo',
                      'adjuvant chemo',
                      'radiation therapy',
                      'followup years',
                      'os status',
                      'vital status',
                      'local regional recurrence'
                  ],
                  'molecular': [
                      {
                          'name': 'mutations',
                          'description': 'Mutation',
                          'type': 'Mutation',
                          'samples': 100,
                          'markers': 22000
                      }
                  ],
                  'event': {
                      'treatment': [
                          'Drug',
                          'Radiation'
                      ],
                      'status': [
                          'Birth',
                          'Diagnosis'
                      ]
                  },
                  'isHuman': true,
                  'isPhi': false,
                  'isPublic': false,
                  'reviewNumber': 'NA',
                  'reviewType': 'Exempt',
                  'site': 'site'
              },
              'email': 'jzhang23@fredhutch.org',
              'project': '75c9ea00-c5cb-11e8-b9af-53d7b3b99427|ADMIN',
              'status': 'UPLOAD'
          },
          {
              'content': {
                  'name': 'Columbia (FHCRC)',
                  'img': 'DSadrenal',
                  'institute': 'FHCRC',
                  'description': 'NA',
                  'studyDate': 'Mon Oct 08 2018 14:28:59 GMT-0700 (PDT)',
                  'importDate': 'Mon Oct 08 2018 10:08:59 GMT-0700 (PDT)',
                  'publink': 'https://www.ncbi.nlm.nih.gov/pubmed/30215627',
                  'sampleFields': [
                      'tumor size',
                      'metastatic site',
                      'tumor stage',
                      'myb nfib fish',
                      'myb nfib nonsynonymous count',
                      'myb nfib cna',
                      'type of surgery',
                      'metastatic tumor indicator',
                      'genomic alterations'
                  ],
                  'subjectFields': [
                      'myb nfib rearrangement',
                      'overall patient histology',
                      'neoadjuvant chemo',
                      'adjuvant chemo',
                      'radiation therapy',
                      'followup years',
                      'os status',
                      'vital status',
                      'local regional recurrence'
                  ],
                  'molecular': [
                      {
                          'name': 'mutations',
                          'description': 'Mutation',
                          'type': 'Mutation',
                          'samples': 100,
                          'markers': 22000
                      }
                  ],
                  'event': {
                      'treatment': [
                          'Drug',
                          'Radiation'
                      ],
                      'status': [
                          'Birth',
                          'Diagnosis'
                      ]
                  },
                  'isHuman': true,
                  'isPhi': false,
                  'isPublic': true,
                  'reviewNumber': 'NA',
                  'reviewType': 'Exempt',
                  'site': 'DSbrain'
              },
              'email': 'michael@zager.co',
              'project': 'DSbrain-26842f20-bb8d-11e8-b495-1fcc84e28c31|ADMIN',
              'status': 'UPLOAD'
          },
          {
              'content': {
                  'name': '3rd',
                  'img': 'DSadrenal',
                  'institute': '3rd',
                  'description': 'description',
                  'studyDate': 'Mon Oct 08 2018 14:28:59 GMT-0700 (PDT)',
                  'importDate': 'Mon Oct 08 2018 10:28:00 GMT-0700 (PDT)',
                  'publink': 'http://',
                  'sampleFields': [],
                  'subjectFields': [
                      'age at diagnosis',
                      'status vital',
                      'days to last follow up',
                      'days to death'
                  ],
                  'molecular': [
                      {
                          'name': 'mutations',
                          'description': 'Mutation',
                          'type': 'Mutation',
                          'samples': 100,
                          'markers': 22000
                      },
                      {
                          'name': 'cnv',
                          'description': 'CNV',
                          'type': 'CNV',
                          'samples': 70,
                          'markers': 24000
                      },
                      {
                          'name': 'cnv thresholded',
                          'description': 'CNV',
                          'type': 'CNV',
                          'samples': 70,
                          'markers': 24000
                      }
                  ],
                  'event': {
                      'status': [
                          'Diagnosis'
                      ]
                  },
                  'isHuman': true,
                  'isPhi': false,
                  'isPublic': false,
                  'reviewNumber': 'NA',
                  'reviewType': 'Exempt',
                  'site': 'site'
              },
              'email': 'gheinric@fredhutch.org',
              'project': '75c9ea00-c5cb-11e8-b9af-53d7b3b99427|ADMIN',
              'status': 'UPLOAD'
          },
          {
            'content': {
                'name': 'Dog',
                'img': 'DSadrenal',
                'institute': 'CBIO',
                'description': 'desc',
                'studyDate': 'Mon Oct 08 2018 14:28:59 GMT-0700 (PDT)',
                'importDate': 'Mon Oct 08 2018 10:08:59 GMT-0700 (PDT)',
                'publink': 'https://www.ncbi.nlm.nih.gov/pubmed/30158685',
                'sampleFields': [
                    'tumor size',
                    'metastatic site',
                    'tumor stage',
                    'myb nfib fish',
                    'myb nfib nonsynonymous count',
                    'myb nfib cna',
                    'type of surgery',
                    'metastatic tumor indicator',
                    'genomic alterations'
                ],
                'subjectFields': [
                    'myb nfib rearrangement',
                    'overall patient histology',
                    'neoadjuvant chemo',
                    'adjuvant chemo',
                    'radiation therapy',
                    'followup years',
                    'os status',
                    'vital status',
                    'local regional recurrence'
                ],
                'molecular': [
                    {
                        'name': 'mutations',
                        'description': 'Mutation',
                        'type': 'Mutation',
                        'samples': 100,
                        'markers': 22000
                    }
                ],
                'event': {
                    'treatment': [
                        'Drug',
                        'Radiation'
                    ],
                    'status': [
                        'Birth',
                        'Diagnosis'
                    ]
                },
                'isHuman': true,
                'isPhi': false,
                'isPublic': false,
                'reviewNumber': 'NA',
                'reviewType': 'Exempt',
                'site': 'site'
            },
            'email': 'jzhang23@fredhutch.org',
            'project': '75c9ea00-c5cb-11e8-b9af-53d7b3b99427|ADMIN',
            'status': 'UPLOAD'
        },
        {
          'content': {
              'name': 'Cat',
              'img': 'DSadrenal',
              'institute': 'CBIO',
              'description': 'desc',
              'studyDate': 'Mon Oct 08 2018 14:28:59 GMT-0700 (PDT)',
              'importDate': 'Mon Oct 08 2018 10:08:59 GMT-0700 (PDT)',
              'publink': 'https://www.ncbi.nlm.nih.gov/pubmed/30158685',
              'sampleFields': [
                  'tumor size',
                  'metastatic site',
                  'tumor stage',
                  'myb nfib fish',
                  'myb nfib nonsynonymous count',
                  'myb nfib cna',
                  'type of surgery',
                  'metastatic tumor indicator',
                  'genomic alterations'
              ],
              'subjectFields': [
                  'myb nfib rearrangement',
                  'overall patient histology',
                  'neoadjuvant chemo',
                  'adjuvant chemo',
                  'radiation therapy',
                  'followup years',
                  'os status',
                  'vital status',
                  'local regional recurrence'
              ],
              'molecular': [
                  {
                      'name': 'mutations',
                      'description': 'Mutation',
                      'type': 'Mutation',
                      'samples': 100,
                      'markers': 22000
                  }
              ],
              'event': {
                  'treatment': [
                      'Drug',
                      'Radiation'
                  ],
                  'status': [
                      'Birth',
                      'Diagnosis'
                  ]
              },
              'isHuman': true,
              'isPhi': false,
              'isPublic': false,
              'reviewNumber': 'NA',
              'reviewType': 'Exempt',
              'site': 'site'
          },
          'email': 'jzhang23@fredhutch.org',
          'project': '75c9ea00-c5cb-11e8-b9af-53d7b3b99427|ADMIN',
          'status': 'UPLOAD'
      },
      ];
      cd.markForCheck();
  }
}

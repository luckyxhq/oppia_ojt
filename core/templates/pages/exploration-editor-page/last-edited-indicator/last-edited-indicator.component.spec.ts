// Copyright 2024 The Oppia Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Unit tests for LastEditedIndicatorComponent.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LastEditedIndicatorComponent } from './last-edited-indicator.component';
import { TimeAgoService } from 'services/time-ago.service';
import { ExplorationDataService } from '../services/exploration-data.service';

describe('LastEditedIndicatorComponent', () => {
    let component: LastEditedIndicatorComponent;
    let fixture: ComponentFixture<LastEditedIndicatorComponent>;
    let timeAgoService: jasmine.SpyObj<TimeAgoService>;
    let explorationDataService: jasmine.SpyObj<ExplorationDataService>;

    beforeEach(async () => {
        const timeAgoServiceSpy = jasmine.createSpyObj('TimeAgoService', ['getTimeAgo']);
        const explorationDataServiceSpy = jasmine.createSpyObj('ExplorationDataService', ['getData']);

        await TestBed.configureTestingModule({
            declarations: [LastEditedIndicatorComponent],
            providers: [
                { provide: TimeAgoService, useValue: timeAgoServiceSpy },
                { provide: ExplorationDataService, useValue: explorationDataServiceSpy }
            ]
        })
            .compileComponents();

        timeAgoService = TestBed.inject(TimeAgoService) as jasmine.SpyObj<TimeAgoService>;
        explorationDataService = TestBed.inject(ExplorationDataService) as jasmine.SpyObj<ExplorationDataService>;
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LastEditedIndicatorComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display last edited text', () => {
        const mockData = { last_updated: new Date().toISOString() };
        explorationDataService.getData.and.returnValue(mockData);
        timeAgoService.getTimeAgo.and.returnValue('4 hours ago');

        fixture.detectChanges();

        expect(component.lastEditedText).toBe('Last edited 4 hours ago');
    });

    it('should not display text if no data', () => {
        explorationDataService.getData.and.returnValue(null);
        fixture.detectChanges();

        expect(component.lastEditedText).toBe('');
    });
});

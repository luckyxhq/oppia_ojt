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
 * @fileoverview Unit tests for TimeAgoService.
 */

import { TestBed } from '@angular/core/testing';
import { TimeAgoService } from './time-ago.service';

describe('TimeAgoService', () => {
    let service: TimeAgoService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimeAgoService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return "Just now" for recent timestamps', () => {
        const now = new Date();
        expect(service.getTimeAgo(now)).toBe('Just now');
    });

    it('should return minutes ago', () => {
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        expect(service.getTimeAgo(fiveMinutesAgo)).toBe('5 minutes ago');
    });

    it('should return hours ago', () => {
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
        expect(service.getTimeAgo(fourHoursAgo)).toBe('4 hours ago');
    });

    it('should return days ago', () => {
        const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);
        expect(service.getTimeAgo(twoDaysAgo)).toBe('2 days ago');
    });

    it('should return short format correctly', () => {
        const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);
        expect(service.getShortTimeAgo(fourHoursAgo)).toBe('4h ago');
    });
});

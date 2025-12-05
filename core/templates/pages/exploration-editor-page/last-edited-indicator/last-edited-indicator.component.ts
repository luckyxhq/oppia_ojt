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
 * @fileoverview Component to display last edited timestamp.
 */

import { Component, OnInit, OnDestroy } from '@angular/core';
import { TimeAgoService } from 'services/time-ago.service';
import { ExplorationDataService } from '../services/exploration-data.service';
import { Subscription, interval } from 'rxjs';

@Component({
    selector: 'oppia-last-edited-indicator',
    templateUrl: './last-edited-indicator.component.html',
    styleUrls: ['./last-edited-indicator.component.css']
})
export class LastEditedIndicatorComponent implements OnInit, OnDestroy {
    lastEditedText: string = '';
    private updateSubscription?: Subscription;

    constructor(
        private timeAgoService: TimeAgoService,
        private explorationDataService: ExplorationDataService
    ) { }

    ngOnInit(): void {
        this.updateLastEditedText();

        // Update the text every minute
        this.updateSubscription = interval(60000).subscribe(() => {
            this.updateLastEditedText();
        });
    }

    ngOnDestroy(): void {
        if (this.updateSubscription) {
            this.updateSubscription.unsubscribe();
        }
    }

    private updateLastEditedText(): void {
        const explorationData = this.explorationDataService.getData();

        if (explorationData && explorationData.last_updated) {
            this.lastEditedText = `Last edited ${this.timeAgoService.getTimeAgo(explorationData.last_updated)}`;
        } else {
            this.lastEditedText = '';
        }
    }
}

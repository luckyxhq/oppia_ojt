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
 * @fileoverview Service to convert timestamps to human-readable relative time.
 */

import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TimeAgoService {
    /**
     * Convert a timestamp to a human-readable "time ago" format
     * @param timestamp - The timestamp to convert (Date object or ISO string)
     * @returns A string like "4 hours ago", "2 days ago", etc.
     */
    getTimeAgo(timestamp: Date | string): string {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const now = new Date();
        const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (secondsAgo < 60) {
            return 'Just now';
        }

        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) {
            return minutesAgo === 1 ? '1 minute ago' : `${minutesAgo} minutes ago`;
        }

        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) {
            return hoursAgo === 1 ? '1 hour ago' : `${hoursAgo} hours ago`;
        }

        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 7) {
            return daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
        }

        const weeksAgo = Math.floor(daysAgo / 7);
        if (weeksAgo < 4) {
            return weeksAgo === 1 ? '1 week ago' : `${weeksAgo} weeks ago`;
        }

        const monthsAgo = Math.floor(daysAgo / 30);
        if (monthsAgo < 12) {
            return monthsAgo === 1 ? '1 month ago' : `${monthsAgo} months ago`;
        }

        const yearsAgo = Math.floor(daysAgo / 365);
        return yearsAgo === 1 ? '1 year ago' : `${yearsAgo} years ago`;
    }

    /**
     * Get a short version of time ago (e.g., "4h ago", "2d ago")
     * @param timestamp - The timestamp to convert
     * @returns A short string like "4h ago", "2d ago"
     */
    getShortTimeAgo(timestamp: Date | string): string {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
        const now = new Date();
        const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (secondsAgo < 60) {
            return 'now';
        }

        const minutesAgo = Math.floor(secondsAgo / 60);
        if (minutesAgo < 60) {
            return `${minutesAgo}m ago`;
        }

        const hoursAgo = Math.floor(minutesAgo / 60);
        if (hoursAgo < 24) {
            return `${hoursAgo}h ago`;
        }

        const daysAgo = Math.floor(hoursAgo / 24);
        if (daysAgo < 30) {
            return `${daysAgo}d ago`;
        }

        const monthsAgo = Math.floor(daysAgo / 30);
        return `${monthsAgo}mo ago`;
    }
}

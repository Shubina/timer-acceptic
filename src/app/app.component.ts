import {Component, HostListener, Inject, OnDestroy, OnInit} from '@angular/core';
import {interval, Observable, Subscription} from 'rxjs';
import {StorageBrowser} from './services/storage';

import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit, OnDestroy {

    private counter$: Observable<number>;
    private subscription: Subscription;
    tick: number;
    message: string;

    timepointsList: Array<any> = [];
    private date: number;
    private lsData: any;
    private STORAGE_KEY = 'stoppedTime';
    pauseOn: boolean;

    faPlay = faPlay;
    faPause = faPause;
    faClock = faClock;
    faTrash = faTrash;

    @HostListener('window:beforeunload', ['$event'])
    public beforeunloadHandler() {
        this.subscription.unsubscribe();
        if (!this.lsData) {
            this.setDate();
        }
    }

    constructor(
        @Inject(StorageBrowser) protected storage: StorageBrowser
    ) {}

    dhms(t) {
        let hours, minutes, seconds;
        hours = Math.floor(t / 3600) % 24;
        t += hours * 3600;
        if (hours < 10) {
            hours = '0' + hours;
        }
        minutes = Math.floor(t / 60) % 60;
        t += minutes * 60;
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        seconds = t % 60;
        if (seconds < 10) {
            seconds = '0' + seconds;
        }

        return [
            hours + ' ',
            minutes + '.',
            seconds
        ].join(' ');
    }


    ngOnInit() {
        this.lsData = this.storage.get(this.STORAGE_KEY);
        if (this.lsData) {
            let tempTick;
            tempTick = (new Date().getTime() - this.lsData);
            if (tempTick <= 900000)  {
                this.tick = Math.round(tempTick / 600);
                this.play();
            } else {
                this.tick = 0;
                localStorage.clear();
            }
        } else {
            this.tick = 0;
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }


    play() {
        this.pauseOn = true;
        this.counter$ = interval(1000);
        this.subscription = this.counter$
            .subscribe(() => {
                ++this.tick;
                this.message = this.dhms(this.tick);
            });
    }

    pause() {
        this.pauseOn = false;
        this.setDate();
        this.subscription.unsubscribe();
    }

    clear() {
        this.subscription.unsubscribe();
        this.timepointsList = [];
        this.tick = 0;
        this.message = this.dhms(0);
        this.pauseOn = false;
        localStorage.clear();
    }

    write() {
        this.timepointsList.push(this.message);
    }

    setDate() {
        this.date = new Date().getTime();
        this.storage.set(this.STORAGE_KEY, this.date);
    }

}

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { RaceService } from 'src/app/services/race.service';
import { RaceParticipant } from 'src/app/models/race_participant';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Heat } from 'src/app/race/heat';
import { OverallRanking } from 'src/app/models/overall_scoring';
import { RaceConnectionService } from 'src/app/services/race-connection.service';


@Component({
  selector: 'app-leader-board',
  templateUrl: './leader_board.component.html',
  styleUrls: ['./leader_board.component.css'],
  standalone: false
})
export class LeaderBoardComponent implements OnInit, OnDestroy {

  participants$: Observable<RaceParticipant[]>;
  currentHeat$: Observable<Heat | undefined>;
  leader$: Observable<RaceParticipant | undefined>;
  others$: Observable<RaceParticipant[]>;
  isTimeBased$: Observable<boolean>;

  constructor(public raceService: RaceService, private raceConnectionService: RaceConnectionService) {
    this.participants$ = this.raceService.participants$;
    this.currentHeat$ = this.raceService.currentHeat$;

    this.isTimeBased$ = this.raceService.selectedRace$.pipe(
      map(race => {
        if (!race || !race.overall_scoring) return false;
        const method = race.overall_scoring.rankingMethod;
        return method === OverallRanking.OR_FASTEST_LAP ||
          method === OverallRanking.OR_TOTAL_TIME ||
          method === OverallRanking.OR_AVERAGE_LAP;
      })
    );

    this.leader$ = this.participants$.pipe(
      map(participants => participants.length > 0 ? participants[0] : undefined)
    );

    this.others$ = this.participants$.pipe(
      map(participants => participants.length > 1 ? participants.slice(1) : [])
    );
  }

  ngOnInit(): void {
    this.raceConnectionService.connect();
  }

  @HostListener('window:beforeunload')
  ngOnDestroy(): void {
    this.raceConnectionService.disconnect();
  }
}

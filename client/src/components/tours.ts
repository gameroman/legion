import Shepherd from 'shepherd.js';

export function startTour(page, todoTours) {
    if (!todoTours.includes(page))
        return;
    switch (page) {
        case 'rank':
            startRankTour();
            break;
        default:
            break;
    }
}

function getTour() {
    return new Shepherd.Tour({
        useModalOverlay: true,
        defaultStepOptions: {
          classes: 'tour-step',
          scrollTo: true
        }
      });
}

function step(tour, text, attachTo, isLast = false) {
    const buttons = [];
    if (tour.steps.length > 0) {
        buttons.push({
            text: 'Back',
            action: tour.back
        });
    }
    if (isLast) {
        buttons.push({
            text: 'Complete',
            action: tour.complete
        });
    } else {
        buttons.push({
            text: 'Next',
            action: tour.next
        });
    }
    return {
        text,
        attachTo,
        buttons,
        cancelIcon: {
            enabled: true,
        },
      }
}

function startRankTour() {
    const tour = getTour();

    tour.addStep(step(tour, 'This is the Rank Page. Here you can check your ranking in your league\'s leaderboard or the all-time leaderboard and check out the top players of each league!', null))
    tour.addStep(step(
        tour,
        'Here you can see your current rank and ELO rating and see when the current season ends.',
        {
            element: '.recap-single-container',
            on: 'bottom'
        })
    );
    tour.addStep(step(
        tour,
        'These are some highlights of players who stand out in your league. Try to see if you can feature there!',
        {
            element: '.highlights-container',
            on: 'left'
        })
    );
    tour.addStep(step(
        tour,
        'This menu allows you to display the leaderboards of each league, from top to bottom: Bronze, Silver, Gold, Zenith, Apex, and All-time.',
        {
            element: '.rank-tab-container',
            on: 'right'
        })
    );
    tour.addStep(step(
        tour,
        'This is the leaderboard of the current league. You can sort is as you like and see which players might be promoted or demoted at the end of the season, and who will earn rewards.',
        {
            element: '.rank-table-container',
            on: 'top'
        },
        true)
    );
    
    tour.start();
}